# MediTale — MVP Development Plan
> **Stack:** Next.js · React · TypeScript · TailwindCSS · shadcn/ui · Supabase · OpenRouter AI · Vercel  
> **Sprint:** 7 дней · 17–23 февраля 2026  
> **Track:** AI for Everyday Life · Local Impact Hackathon 2026

---

## 1. Технологический стек

| Слой | Технология | Версия | Зачем | Цена |
|---|---|---|---|---|
| Framework | Next.js (App Router) | 14.x | SSR + API Routes. API ключ на сервере — безопасно | Free |
| UI Library | React | 18.x | Компоненты, хуки, state management | Free |
| Язык | TypeScript | 5.x | Типы для JSON от Claude, автодополнение, меньше багов | Free |
| Стили | TailwindCSS | 3.x | Utility-first — UI в 3x быстрее чем чистый CSS | Free |
| Компоненты | shadcn/ui | latest | Готовые Dialog, Card, Progress, Select | Free |
| База данных | Supabase PostgreSQL | latest | Auth + DB + RLS в одной панели, 500MB free | Free tier |
| Авторизация | Supabase Auth | latest | Email + Google OAuth без JWT вручную | Free tier |
| AI (текст) | OpenRouter (claude-sonnet-3.5) | latest | Единый API для 200+ моделей, pay-as-you-go |
| AI (картинки) | OpenRouter (ByteDance Seed: Seedream 4.5) | latest | Генерация изображений через OpenRouter | Pay-per-image |
| PDF | html2canvas + jsPDF | latest | Client-side, нет серверных затрат | Free |
| Деплой | Vercel | latest | git push = деплой, CDN, zero-config Next.js | Free tier |

---

## 2. Установка

```bash
# 1. Создать проект (без --typescript — чистый JavaScript)
npx create-next-app@latest meditale --typescript --tailwind --app

# 2. Зависимости
cd meditale
npm install openai @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install html2canvas jspdf

# 3. shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card progress select dialog sheet tabs badge

# 4. Запуск
npm run dev  # → http://localhost:3000
```

### .env.local
```bash
OPENROUTER_API_KEY=sk-or-...            # Только сервер — никогда в клиент!
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # Только сервер
# OpenRouter ключ: https://openrouter.ai/keys
```

---

### lib/openrouter.ts — единый клиент

```ts
// lib/openrouter.ts
import OpenAI from 'openai'

export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://meditale.vercel.app',
    'X-Title': 'MediTale',
  }
})

// Модели которые можно менять в одном месте
export const MODELS = {
  story:        'anthropic/claude-sonnet-4',
  illustration: 'bytedance/seed-seedream-4.5',
  // Дешевле для тестов:
  // story:     'openai/gpt-4o-mini',
} as const
```

---

## 3. Структура проекта

```
meditale/
├── app/
│   ├── page.tsx                        ← Лендинг
│   ├── create/
│   │   └── page.tsx                    ← Форма создания сказки
│   ├── story/
│   │   └── [id]/page.tsx               ← Готовая книга
│   ├── library/
│   │   └── page.tsx                    ← Все сказки пользователя
│   ├── auth/
│   │   └── page.tsx                    ← Login / Register
│   └── api/
│       ├── generate-story/
│       │   └── route.ts                ← POST: Claude → JSON сказка
│       └── generate-illustration/
│           └── route.ts                ← POST: Seedream → Image URL
│
├── components/
│   ├── ui/                             ← shadcn компоненты (auto-generated)
│   ├── StoryForm/
│   │   ├── index.tsx                   ← Wrapper с state
│   │   ├── StepOne.tsx                 ← Имя, возраст, диагноз, язык
│   │   ├── StepTwo.tsx                 ← Персонажи, хобби
│   │   └── StepThree.tsx              ← Цель, семья, пожелания
│   ├── StoryBook/
│   │   ├── index.tsx                   ← Книга целиком
│   │   ├── Chapter.tsx                 ← Глава + иллюстрация
│   │   ├── IllustrationLoader.tsx      ← Skeleton → Image
│   ├── Library/
│   │   └── StoryCard.tsx              ← Карточка в библиотеке
│   └── LoadingScreen.tsx              ← Анимация генерации
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ← Browser client
│   │   └── server.ts                   ← Server client (cookies)
│   ├── openrouter.ts                   ← OpenRouter client instance
│   ├── prompts.ts                      ← Все промпты
│   └── types.ts                        ← JSDoc структуры данных
│
└── middleware.ts                       ← Защита роутов → /auth
```

---

## 4. База данных Supabase

```sql
-- Запустить в Supabase SQL Editor

create table stories (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  child_name   text not null,
  child_age    int  not null,
  condition    text not null,
  language     text not null check (language in ('kz', 'ru', 'en')),
  title        text,
  chapters     jsonb default '[]',
  -- chapters: [{ title, text, illustration_prompt, illustration_url }]
  medical_note text,
  created_at   timestamp default now()
);

-- Row Level Security — каждый видит только свои сказки
alter table stories enable row level security;

create policy "Users see own stories" on stories
  for all using (auth.uid() = user_id);

-- Аналитика для питча
create view analytics as
  select condition, language,
         count(*) as total,
         date_trunc('day', created_at) as day
  from stories
  group by condition, language, day;
```

---

## 5. API Routes

### POST /api/generate-story

```js
// app/api/generate-story/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { FormData } from '@/lib/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const formData = await req.json()

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: buildSystemPrompt(formData.language),
    messages: [{ role: 'user', content: buildUserPrompt(formData) }]
  })

  const result = JSON.parse(response.content[0].text)

  const supabase = createServerClient()
  const { data: story } = await supabase
    .from('stories')
    .insert({
      child_name:   formData.childName,
      child_age:    formData.childAge,
      condition:    formData.condition,
      language:     formData.language,
      title:        result.title,
      chapters:     result.chapters,
      medical_note: result.medical_note
    })
    .select()
    .single()

  return Response.json({ storyId: story.id, ...result })
}
```

### POST /api/generate-illustration

```js
// app/api/generate-illustration/route.ts
import { openrouter, MODELS } from '@/lib/openrouter'

export async function POST(req: Request) {
  const { prompt, chapterIndex } = await req.json()

  const response = await openrouter.images.generate({
    model: MODELS.illustration,
    prompt: `Soft watercolor style, warm pastels, child-friendly. ${prompt}`,
    n: 1,
    size: "1024x1024"
  })

  const imageUrl = response.data[0].url

  return Response.json({ imageUrl, chapterIndex })
}
```

---

## 6. TypeScript типы

```ts
// lib/types.ts

export interface Chapter {
  title: string
  text: string
  illustration_prompt: string
  illustration_url?: string
}

export interface Story {
  id: string
  user_id: string
  child_name: string
  child_age: number
  condition: string
  language: 'kz' | 'ru' | 'en'
  title: string
  chapters: Chapter[]
  medical_note: string
  created_at: string
}

export interface FormData {
  childName: string
  childAge: number
  condition: string
  language: 'kz' | 'ru' | 'en'
  characters: string[]
  hobbies: string[]
  goal: string
  family: string
  special: string
}
```

---

## 7. Промпты

### System Prompt — генерация сказки

```
You are MediTale, a compassionate children's story writer.
Create warm fairy tales helping children understand medical conditions through magic.

Return ONLY a valid JSON object. No markdown, no backticks, no text outside JSON.

{
  "title": "Story title (4-7 words)",
  "chapters": [
    {
      "title": "Chapter title (3-5 words)",
      "text": "Chapter text, 80-110 words, 2-3 paragraphs",
      "illustration_prompt": "Scene in 15 words, child-friendly, soft watercolor"
    }
  ],
  "medical_note": "1-2 sentences for parents about the medical concept."
}

Rules:
- Exactly 4 chapters
- Child is brave hero by name
- Condition = magical challenge (dragon, storm — never clinical)
- Doctors = friendly wizards or wise guides
- Medicine = magic potion or special tool
- End with hope and "you are not alone"
- Language: ${language} (kz = Kazakh, ru = Russian, en = English)
- Kazakhstan culturally relevant
- NEVER mention syringes, needles, pain, hospitals explicitly
```

### Style Prompt — для генерации изображений

(Добавляется к каждому промпту главы)

```
... soft watercolor aesthetic, warm pastel colors, cheerful, child-friendly (ages 5-11).
Round shapes, expressive characters. Rich background (sky, nature, magic).
Colors: warm yellows, soft teals, gentle pinks, sky blues.
High quality, detailed, masterpiece.
```

---

## 8. План по дням

### День 1 — 17 фев · Настройка + авторизация
- [ ] Создать Next.js проект: `npx create-next-app@latest meditale --typescript --tailwind --app`
- [ ] Создать проект в Supabase, запустить SQL schema
- [ ] Настроить Supabase Auth (email + Google), добавить `.env.local`
- [ ] Создать `middleware.ts` для защиты роутов `/create` и `/library`
- [ ] Страница `/auth` с формой логина через shadcn
- [ ] ✅ Пользователь логинится → редирект на `/create`

### День 2 — 18 фев · Форма создания сказки
- [ ] Компонент `StoryForm` с тремя шагами и React state
- [ ] Step 1: Input (имя), NumberInput (возраст), Select (диагноз), Select (язык)
- [ ] Step 2: Grid кнопок персонажей (12 вариантов), Chips хобби (multi-select)
- [ ] Step 3: Chips целей, Input семья, Textarea пожелания
- [ ] Валидация каждого шага, кнопка Next disabled если пусто
- [ ] ✅ Сабмит → вызов `/api/generate-story` → redirect на `/story/[id]`

### День 3 — 19 фев · AI генерация + иллюстрации
- [ ] Написать `buildSystemPrompt()` и `buildUserPrompt()` в `lib/prompts.ts`
- [ ] API route `/api/generate-story`: Claude → парсинг JSON → сохранение в Supabase
- [ ] Страница `/story/[id]`: загружает из Supabase, рендерит книгу
- [ ] Компонент `Chapter`: заголовок + Skeleton → SVG + текст главы
- [ ] API route `/api/generate-illustration`: Seedream генерация изображения
- [ ] ✅ Параллельный вызов 4 иллюстраций через `Promise.all`, прогрессивная загрузка

### День 4 — 20 фев · Библиотека + UX
- [ ] Страница `/library`: список карточек из Supabase для текущего юзера
- [ ] `StoryCard`: имя ребёнка, диагноз, дата, кнопки Открыть / Удалить
- [ ] Анимации переходов (CSS transitions или Framer Motion)
- [ ] Мобильная адаптация — протестировать на телефоне
- [ ] Дисклеймер на каждой странице сказки
- [ ] ✅ Loading screen с анимированными шагами пока генерируется сказка

### День 5 — 21 фев · PDF + валидация
- [ ] Кнопка «Сохранить PDF» — html2canvas рендерит `.book-container` → jsPDF
- [ ] Проверить что иллюстрации попадают в PDF (CORS для canvas)
- [ ] Провести **5 интервью** с родителями или знакомыми с детьми
- [ ] Записать дословные цитаты для Written Concept Narrative и питча
- [ ] ✅ Доработать промпт по результатам интервью

### День 6 — 22 фев · Деплой + питч-дек
- [ ] Создать GitHub репозиторий, `git push`
- [ ] Подключить Vercel к репозиторию, добавить env переменные в Vercel Dashboard
- [ ] `vercel deploy` → получить ссылку `meditale.vercel.app`
- [ ] Протестировать live ссылку на телефоне и чужом компьютере
- [ ] Написать Pitch Deck (10 слайдов по структуре хакатона)
- [ ] ✅ Написать Written Concept Narrative (3–5 страниц)

### День 7 — 23 фев · Сдача
- [ ] 09:00 — финальное тестирование всех флоу
- [ ] 10:00 — исправить критические баги
- [ ] 12:00 — финальная проверка документов
- [ ] 14:00 — загрузить все материалы на платформу
- [ ] 16:00 — попросить кого-то протестировать с нуля
- [ ] ⚠️ **22:00 — СДАЧА. Не в 23:58!**

---

## 9. Чеклист MVP

### Авторизация
- [ ] Регистрация через email работает
- [ ] Вход через Google работает
- [ ] Незалогиненный юзер → редирект на `/auth`
- [ ] Выход из аккаунта работает

### Форма
- [ ] Все 3 шага заполняются
- [ ] Валидация — нельзя пропустить обязательные поля
- [ ] Языки: казахский, русский, английский — все генерируют
- [ ] Все 15 диагнозов в dropdown

### Генерация
- [ ] JSON от Claude парсится без ошибок
- [ ] 4 главы появляются корректно
- [ ] Иллюстрации загружаются (пусть медленно)
- [ ] Fallback Image если иллюстрация не загрузилась
- [ ] Дисклеймер виден на странице сказки

### Библиотека
- [ ] Сохранённые сказки отображаются
- [ ] Можно открыть сохранённую сказку без регенерации
- [ ] Юзер видит только **свои** сказки

### PDF
- [ ] Кнопка PDF генерирует файл
- [ ] Иллюстрации попадают в PDF
- [ ] Файл открывается на телефоне

### Деплой
- [ ] `meditale.vercel.app` открывается
- [ ] Открывается на iPhone / Android
- [ ] API ключ **НЕ виден** в browser DevTools → Network

---

> **Главное правило:** Рабочий MVP с живой ссылкой лучше идеального кода который не деплоится.  
> Жюри запомнят одно: открыли сайт → заполнили форму → получили сказку про своего ребёнка. ✨
