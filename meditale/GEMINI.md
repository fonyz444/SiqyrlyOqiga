# MediTale

**MediTale** is an AI-powered storytelling application designed to help children understand and cope with medical treatments through personalized narratives.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Primitives) + Custom Components
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend / Auth:** [Supabase](https://supabase.com/)
- **AI Integration:** [OpenRouter](https://openrouter.ai/) (accessing models like Claude Sonnet)

## Key Features

- **Personalized Story Generation:** Creates stories tailored to the child's medical situation using AI.
- **Interactive Form Steps:** Guided process to input details for the story (Name, Diagnosis, Interests, etc.).
- **PDF Export:** Ability to generate and download stories as PDF documents (using `jspdf` and `html2canvas`).
- **Authentication:** Secure protected routes using Supabase Auth (`middleware.ts`).

## Project Structure

- `app/`: Next.js App Router pages and layouts.
  - `auth/`: Authentication routes (login, callback).
  - `create/`: Story creation workflow.
- `components/`: Reusable React components.
  - `ui/`: Core UI components (buttons, inputs, etc.).
  - `StoryForm/`: Components specific to the story creation flow.
- `lib/`: Utility functions and configuration.
  - `supabase/`: Supabase client and server initialization.
  - `openrouter.ts`: AI client configuration.
- `public/`: Static assets.
- `supabase_schema.sql`: Database schema definition.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env.local` file with the following variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```
