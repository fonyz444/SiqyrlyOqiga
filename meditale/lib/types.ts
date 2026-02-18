export interface Chapter {
    title: string
    text: string
    dialog: string
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
    childPhoto?: string
    condition: string
    language: 'kz' | 'ru' | 'en'
    characters: string[]
    favoriteCartoon: string
    hobbies: string[]
    goal: string
    family: string
    special: string
    customScenario: string
}

export const CONDITIONS = [
    "Asthma",
    "Diabetes Type 1",
    "Eczema",
    "Food Allergy",
    "Generic Fear of Doctors",
    "Broken Bone",
    "Flu/Cold",
    "Dental Visit",
    "Glasses/Vision",
    "Hearing Aid",
    "Wheelchair User",
    "ADHD",
    "Autism Spectrum",
    "Epilepsy",
    "Celiac Disease"
] as const

export const CHARACTERS = [
    "Brave Lion", "Wise Owl", "Fast Rabbit", "Gentle Bear",
    "Magic Dragon", "Space Explorer", "Deep Sea Diver", "Forest Elf",
    "Friendly Robot", "Super Hero", "Fairy Princess", "Little Wizard"
]

export const CARTOONS = [
    { name: 'Маша и Медведь', emoji: '🐻' },
    { name: 'Щенячий патруль', emoji: '🐾' },
    { name: 'Фиксики', emoji: '🔧' },
    { name: 'Свинка Пеппа', emoji: '🐷' },
    { name: 'Лунтик', emoji: '🌙' },
    { name: 'Смешарики', emoji: '⚽' },
    { name: 'Три кота', emoji: '🐱' },
    { name: 'Холодное сердце', emoji: '❄️' },
    { name: 'Человек-паук', emoji: '🕷️' },
    { name: 'Minecraft', emoji: '🟩' },
]

export const LANGUAGES = [
    { value: 'kz', label: 'Kazakh 🇰🇿' },
    { value: 'ru', label: 'Russian 🇷🇺' },
    { value: 'en', label: 'English 🇬🇧' },
] as const
