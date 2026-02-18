'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormData, CONDITIONS, CHARACTERS, LANGUAGES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepThree } from './StepThree'
import { Loader2, ArrowLeft, ArrowRight, Sparkles, User, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const INITIAL_DATA: FormData = {
    childName: '',
    childAge: 5,
    childPhoto: undefined,
    condition: '',
    language: 'ru',
    characters: [],
    favoriteCartoon: '',
    hobbies: [],
    goal: '',
    family: '',
    special: '',
    customScenario: ''
}

const STEPS = [
    { icon: '🧒', label: 'About the Child', emoji: '🧒' },
    { icon: '🦁', label: 'Companions', emoji: '🦁' },
    { icon: '⭐', label: 'Story Goal', emoji: '⭐' },
]

const LOADING_MESSAGES = [
    { emoji: '✨', text: 'Gathering stardust...' },
    { emoji: '📖', text: 'Opening the book of tales...' },
    { emoji: '🧙', text: 'Summoning the story wizard...' },
    { emoji: '🎨', text: 'Painting the world of adventure...' },
    { emoji: '🦁', text: 'Waking up the characters...' },
    { emoji: '✍️', text: 'Writing the chapters...' },
    { emoji: '🌟', text: 'Adding a sprinkle of magic...' },
    { emoji: '💫', text: 'Almost there...' },
]

export function StoryForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<FormData>(INITIAL_DATA)
    const [loading, setLoading] = useState(false)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

    // Cycle through loading messages
    useEffect(() => {
        if (!loading) return
        const interval = setInterval(() => {
            setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [loading])

    const updateFields = (fields: Partial<FormData>) => {
        setData(prev => ({ ...prev, ...fields }))
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 3))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const isStepValid = () => {
        if (step === 1) return data.childName && data.childAge && data.condition && data.language
        if (step === 2) return data.characters.length > 0
        return true
    }

    const handleSubmit = async () => {
        setLoading(true)
        setLoadingMessageIndex(0)
        try {
            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('Server error:', errorData)
                throw new Error(errorData.error || 'Failed to generate story')
            }

            const { storyId } = await response.json()
            router.push(`/story/${storyId}`)
        } catch (error) {
            console.error(error)
            alert('Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    // Full-screen loading overlay
    if (loading) {
        const msg = LOADING_MESSAGES[loadingMessageIndex]
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-amber-500">
                {/* Floating decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute top-[8%] left-[10%] text-5xl opacity-20 animate-float">✨</span>
                    <span className="absolute top-[15%] right-[15%] text-4xl opacity-15 animate-float-delayed">🌟</span>
                    <span className="absolute bottom-[20%] left-[20%] text-5xl opacity-20 animate-float">💫</span>
                    <span className="absolute bottom-[12%] right-[12%] text-4xl opacity-15 animate-float-delayed">📖</span>
                    <span className="absolute top-[40%] left-[5%] text-3xl opacity-10 animate-float">🧚</span>
                    <span className="absolute top-[50%] right-[8%] text-3xl opacity-10 animate-float-delayed">🦄</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Animated book */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
                            <span className="text-5xl transition-all duration-500">{msg.emoji}</span>
                        </div>
                        <Loader2 className="absolute -bottom-2 -right-2 h-8 w-8 text-white/80 animate-spin" />
                    </div>

                    {/* Message */}
                    <p className="text-2xl md:text-3xl font-bold text-white mb-3 animate-fade-in-up">
                        {msg.text}
                    </p>
                    <p className="text-white/70 text-sm">
                        Creating a personalized tale for {data.childName}...
                    </p>

                    {/* Progress dots */}
                    <div className="flex gap-2 mt-8">
                        {LOADING_MESSAGES.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-500",
                                    i <= loadingMessageIndex ? "bg-white" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up stagger-2">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
                {STEPS.map((s, i) => {
                    const stepNum = i + 1
                    const isActive = stepNum === step
                    const isCompleted = stepNum < step
                    return (
                        <div key={i} className="flex items-center">
                            <div
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                                    isActive
                                        ? "bg-white shadow-lg shadow-purple-200/50 text-purple-700 scale-105"
                                        : isCompleted
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-white/50 text-gray-400"
                                )}
                            >
                                <span className="text-lg">{s.emoji}</span>
                                <span className="hidden sm:inline">{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={cn(
                                    "w-8 h-0.5 mx-1 rounded-full transition-all duration-300",
                                    stepNum < step ? "bg-purple-400" : "bg-gray-200"
                                )} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <Progress value={(step / 3) * 100} className="h-1.5 bg-purple-100/60" />
            </div>

            {/* Glass card */}
            <div className="glass rounded-2xl shadow-2xl shadow-purple-200/40 p-8 border border-purple-200/40 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
                {/* Step title */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {step === 1 && "🧒 Start the Adventure"}
                        {step === 2 && "🦁 Choose Companions"}
                        {step === 3 && "⭐ Add Meaning"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {step === 1 && "Tell us about the little hero of our story"}
                        {step === 2 && "Pick sidekicks and share the child's interests"}
                        {step === 3 && "What should the story teach and who supports the hero?"}
                    </p>
                </div>

                {/* Step content */}
                <div className="min-h-[320px]">
                    {step === 1 && <StepOne data={data} update={updateFields} />}
                    {step === 2 && <StepTwo data={data} update={updateFields} />}
                    {step === 3 && <StepThree data={data} update={updateFields} />}
                </div>

                {/* Footer navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-purple-100/50">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || loading}
                        className="rounded-xl border-purple-200 hover:bg-purple-50 font-semibold px-6 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !data.goal}
                            className="rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:via-pink-600 hover:to-amber-600 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-pulse-glow"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Story
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
