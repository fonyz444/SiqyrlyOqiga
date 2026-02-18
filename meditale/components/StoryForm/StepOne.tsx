'use client'

import { useRef } from 'react'
import { FormData, CONDITIONS, LANGUAGES } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, X } from 'lucide-react'

interface StepProps {
    data: FormData
    update: (fields: Partial<FormData>) => void
}

export function StepOne({ data, update }: StepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert('Photo must be under 5MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            update({ childPhoto: reader.result as string })
        }
        reader.readAsDataURL(file)
    }

    const removePhoto = () => {
        update({ childPhoto: undefined })
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-3">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>📸</span> Child&apos;s Photo
                    <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                </Label>
                <div className="relative group">
                    {data.childPhoto ? (
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-300 shadow-lg shadow-purple-200/40 ring-4 ring-purple-100/50 transition-all duration-300 group-hover:shadow-xl">
                                <img
                                    src={data.childPhoto}
                                    alt="Child photo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={removePhoto}
                                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center shadow-md hover:bg-red-500 hover:scale-110 transition-all duration-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-28 h-28 rounded-full border-3 border-dashed border-purple-300/70 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100/50 hover:scale-105 transition-all duration-300"
                        >
                            <Camera className="h-7 w-7 text-purple-400 mb-1" />
                            <span className="text-[10px] text-purple-400 font-medium">Upload</span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="childName" className="text-gray-700 font-semibold flex items-center gap-1.5">
                        <span>👦</span> Child&apos;s Name
                    </Label>
                    <Input
                        id="childName"
                        value={data.childName}
                        onChange={e => update({ childName: e.target.value })}
                        placeholder="e.g. Alikhan"
                        className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="childAge" className="text-gray-700 font-semibold flex items-center gap-1.5">
                        <span>🎂</span> Age
                    </Label>
                    <Input
                        id="childAge"
                        type="number"
                        min={2}
                        max={12}
                        value={data.childAge}
                        onChange={e => update({ childAge: parseInt(e.target.value) || 5 })}
                        className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🏥</span> Medical Condition / Challenge
                </Label>
                <Select value={data.condition} onValueChange={(val) => update({ condition: val })}>
                    <SelectTrigger className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400">
                        <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {CONDITIONS.map(c => (
                            <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700 font-semibold flex items-center gap-1.5">
                    <span>🌍</span> Language
                </Label>
                <Select value={data.language} onValueChange={(val: any) => update({ language: val })}>
                    <SelectTrigger className="rounded-xl border-purple-200/60 bg-white focus:ring-2 focus:ring-purple-400">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {LANGUAGES.map(l => (
                            <SelectItem key={l.value} value={l.value} className="rounded-lg">{l.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
