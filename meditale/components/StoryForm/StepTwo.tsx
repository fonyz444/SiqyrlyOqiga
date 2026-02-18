import { FormData, CHARACTERS, CARTOONS } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface StepProps {
    data: FormData
    update: (fields: Partial<FormData>) => void
}

const CHARACTER_EMOJIS: Record<string, string> = {
    "Brave Lion": "🦁",
    "Wise Owl": "🦉",
    "Fast Rabbit": "🐇",
    "Gentle Bear": "🐻",
    "Magic Dragon": "🐉",
    "Space Explorer": "🚀",
    "Deep Sea Diver": "🤿",
    "Forest Elf": "🧝",
    "Friendly Robot": "🤖",
    "Super Hero": "🦸",
    "Fairy Princess": "👸",
    "Little Wizard": "🧙",
}

export function StepTwo({ data, update }: StepProps) {
    const [hobbyInput, setHobbyInput] = useState('')

    const toggleCharacter = (char: string) => {
        const current = data.characters
        if (current.includes(char)) {
            update({ characters: current.filter(c => c !== char) })
        } else {
            if (current.length < 3) {
                update({ characters: [...current, char] })
            }
        }
    }

    const addHobby = () => {
        if (hobbyInput.trim() && !data.hobbies.includes(hobbyInput.trim())) {
            update({ hobbies: [...data.hobbies, hobbyInput.trim()] })
            setHobbyInput('')
        }
    }

    const removeHobby = (hobby: string) => {
        update({ hobbies: data.hobbies.filter(h => h !== hobby) })
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-3">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🤝</span> Sidekicks & Companions
                    <span className="text-xs text-gray-400 font-normal ml-1">(Pick up to 3)</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CHARACTERS.map(char => {
                        const isSelected = data.characters.includes(char)
                        return (
                            <div
                                key={char}
                                className={cn(
                                    "cursor-pointer rounded-xl p-3 text-center text-sm transition-all duration-300 hover:scale-105",
                                    "border-2",
                                    isSelected
                                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-lg shadow-purple-100/50 font-semibold text-purple-700"
                                        : "bg-white border-purple-100/50 hover:border-purple-300 hover:shadow-md text-gray-600"
                                )}
                                onClick={() => toggleCharacter(char)}
                            >
                                <span className="text-2xl block mb-1">
                                    {CHARACTER_EMOJIS[char] || "✨"}
                                </span>
                                <span className="text-xs leading-tight">{char}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Favorite Cartoon */}
            <div className="space-y-3">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🎬</span> Favorite Cartoon
                    <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                </Label>
                <Select
                    value={data.favoriteCartoon || undefined}
                    onValueChange={(val) => update({ favoriteCartoon: val })}
                >
                    <SelectTrigger className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400">
                        <SelectValue placeholder="Select a cartoon" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {CARTOONS.map(cartoon => (
                            <SelectItem key={cartoon.name} value={cartoon.name} className="rounded-lg">
                                {cartoon.emoji} {cartoon.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🎨</span> Hobbies & Interests
                </Label>
                <div className="flex gap-2">
                    <Input
                        value={hobbyInput}
                        onChange={e => setHobbyInput(e.target.value)}
                        placeholder="e.g. Lego, Drawing, Cats"
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHobby())}
                        className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    />
                    <Button
                        onClick={addHobby}
                        size="icon"
                        className="rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {data.hobbies.map(hobby => (
                        <span
                            key={hobby}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50"
                        >
                            {hobby}
                            <button
                                onClick={() => removeHobby(hobby)}
                                className="ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-purple-200 transition-all text-purple-400 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
