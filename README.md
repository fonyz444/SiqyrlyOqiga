# Siqyrly Oqiga 🧚‍♀️✨

**Siqyrly Oqiga** is an AI-powered storytelling application designed to help children understand and cope with medical treatments through personalized, magical narratives.

By transforming clinical situations into familiar, comforting adventures that incorporate the child's own imaginative world, Siqyrly Oqiga bridges the gap between clinical care and emotional well-being. Built with modern web technologies and advanced Artificial Intelligence, the platform provides immediate, customized relief in high-stress clinical or home environments.

## 🌟 Key Features

- **Personalized Story Generation:** Instantly creates unique and engaging stories tailored to the child's specific medical situation (diagnosis, upcoming procedure) using AI.
- **Interactive Form Wizard:** A guided, child-friendly process to input details for the story, such as their name, diagnosis, personal interests (favorite cartoons, hobbies, superheroes), and chosen narrative themes.
- **Whimsical AI Illustrations:** Stories are paired with AI-generated, whimsical illustrations (e.g., 3D Pixar-style animations) that accurately reflect the child's context in a positive light without generating realistic likenesses.
- **PDF Export:** Ability to effortlessly generate and download the customized stories as beautiful PDF documents for offline reading and sharing.
- **Secure Authentication:** Protected user accounts and routes using Supabase Auth.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Primitives) + Custom Components
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend / Auth / Database:** [Supabase](https://supabase.com/)
- **AI Integration:** [OpenRouter](https://openrouter.ai/) (accessing advanced LLMs like Claude 3.5 Sonnet for text and specialized models for image generation)

## 📂 Project Structure

- `meditale/app/`: Next.js App Router pages and layouts.
  - `auth/`: Authentication routes (login, callback).
  - `create/`: Story creation workflow and wizard.
  - `api/`: Backend API routes for AI generation (`generate-story`, `story/[id]`).
- `meditale/components/`: Reusable React components.
  - `ui/`: Core UI components (buttons, inputs, cards, etc.).
  - `StoryForm/`: Components specific to the story creation flow.
- `meditale/lib/`: Utility functions and configuration.
  - `supabase/`: Supabase client and server initialization.
  - `openrouter.ts`: AI client configuration.
  - `prompts.ts`: Advanced system prompts for LLMs and Image generation.
- `meditale/public/`: Static assets (fonts, images).
- `meditale/supabase_schema.sql`: Database schema definitions for rows and tables.

## 🚀 Getting Started

The main application code is located in the `meditale/` directory.

1.  **Navigate to the project directory:**
    ```bash
    cd meditale
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the `meditale` directory with your API keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

5.  **Build for production:**
    ```bash
    npm run build
    npm start
    ```

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
