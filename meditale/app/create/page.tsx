import { StoryForm } from '@/components/StoryForm'
import { Sparkles } from 'lucide-react'

export default function CreatePage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-magic-gradient-subtle py-12">
            {/* Floating decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <span className="absolute top-[5%] left-[6%] text-3xl animate-float opacity-30">✨</span>
                <span className="absolute top-[10%] right-[10%] text-2xl animate-float-delayed opacity-25">🌟</span>
                <span className="absolute bottom-[15%] left-[12%] text-3xl animate-float opacity-20">💫</span>
                <span className="absolute bottom-[10%] right-[8%] text-2xl animate-float-delayed opacity-25">📖</span>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-purple-700 text-sm font-semibold mb-4">
                        <Sparkles className="h-4 w-4" />
                        Story Creator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gradient-magic mb-3">
                        Create a New Story
                    </h1>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                        Tell us about the child and we&apos;ll craft a personalized healing fairytale ✨
                    </p>
                </div>

                <StoryForm />
            </div>
        </div>
    )
}
