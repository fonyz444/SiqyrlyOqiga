import { FormData } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface StepProps {
    data: FormData
    update: (fields: Partial<FormData>) => void
}

const GOALS = [
    { text: "Overcoming fear of treatment", emoji: "💪" },
    { text: "Understanding why medicine helps", emoji: "🧠" },
    { text: "Feeling brave and strong", emoji: "🦸" },
    { text: "Accepting being different", emoji: "🌈" },
    { text: "Patience during recovery", emoji: "⏳" },
]

export function StepThree({ data, update }: StepProps) {
    const [showScenario, setShowScenario] = useState(!!data.customScenario)

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Custom Scenario */}
            <div className="space-y-3">
                <div
                    onClick={() => setShowScenario(!showScenario)}
                    className={cn(
                        "cursor-pointer rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border-2",
                        showScenario || data.customScenario
                            ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400 shadow-lg shadow-amber-100/50"
                            : "bg-white border-amber-300/50 hover:border-amber-300 hover:shadow-md"
                    )}
                >
                    <span className="text-2xl">📝</span>
                    <div className="flex-1">
                        <span className={cn(
                            "text-sm font-semibold transition-all",
                            showScenario ? "text-amber-700" : "text-gray-600"
                        )}>
                            Write Your Own Scenario
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Describe the plot or key scenes you'd like in the story
                        </p>
                    </div>
                    <span className="text-gray-400 text-lg transition-transform duration-300" style={{ transform: showScenario ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>

                {showScenario && (
                    <div className="animate-fade-in-up pl-2">
                        <Textarea
                            value={data.customScenario}
                            onChange={e => update({ customScenario: e.target.value })}
                            placeholder={"e.g. The hero goes to a magical forest where they meet a friendly doctor-dragon who explains why medicine is important. Together they brew a healing potion..."}
                            className="h-32 resize-none rounded-xl border-amber-200/60 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm"
                        />
                        <div className="flex justify-between mt-1 px-1">
                            <p className="text-xs text-gray-400">AI will use your scenario as the story foundation</p>
                            <p className={cn(
                                "text-xs",
                                data.customScenario.length > 500 ? "text-amber-500" : "text-gray-400"
                            )}>
                                {data.customScenario.length}/500
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🎯</span> Main Goal of the Story
                </Label>
                <div className="grid grid-cols-1 gap-2">
                    {GOALS.map(goal => {
                        const isSelected = data.goal === goal.text
                        return (
                            <div
                                key={goal.text}
                                onClick={() => update({ goal: goal.text })}
                                className={cn(
                                    "cursor-pointer rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border-2",
                                    isSelected
                                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-lg shadow-purple-100/50"
                                        : "bg-white border-purple-100/50 hover:border-purple-300 hover:shadow-md"
                                )}
                            >
                                <span className="text-2xl">{goal.emoji}</span>
                                <span className={cn(
                                    "text-sm transition-all",
                                    isSelected ? "font-semibold text-purple-700" : "text-gray-600"
                                )}>
                                    {goal.text}
                                </span>
                                {isSelected && (
                                    <span className="ml-auto text-purple-500 text-lg">✓</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>👨‍👩‍👧</span> Family Members
                    <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                </Label>
                <Input
                    value={data.family}
                    onChange={e => update({ family: e.target.value })}
                    placeholder="e.g. Mom, Older brother Max"
                    className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                />
                <p className="text-xs text-gray-400 pl-1">Who supports the hero in this adventure?</p>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>✍️</span> Special Wishes
                    <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                </Label>
                <Textarea
                    value={data.special}
                    onChange={e => update({ special: e.target.value })}
                    placeholder="Any special toys, favorite colors, or situations to avoid?"
                    className="h-24 resize-none rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                />
            </div>
        </div>
    )
}
