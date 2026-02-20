'use client'

import { useState, useEffect } from 'react'
import { Story, Chapter } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
    ArrowLeft, ArrowRight, BookOpen, Download,
    Home, Stethoscope, ImageIcon, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { exportStoryAsPdf } from '@/lib/exportPdf'

interface StoryBookProps {
    story: Story
}

export function StoryBook({ story: initialStory }: StoryBookProps) {
    const router = useRouter()
    const [story, setStory] = useState<Story>(initialStory)
    const [currentPage, setCurrentPage] = useState(-1) // -1 = cover page
    const [isFlipping, setIsFlipping] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExportPdf = async () => {
        setIsExporting(true)
        try {
            await exportStoryAsPdf(story)
        } catch (err) {
            console.error('PDF export failed:', err)
            alert('PDF export failed. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    const totalPages = story.chapters.length // + medical note as last
    const isOnCover = currentPage === -1
    const isOnMedicalNote = currentPage === totalPages
    const currentChapter = (!isOnCover && !isOnMedicalNote) ? story.chapters[currentPage] : null

    let parsedMedicalNote: any = null
    if (story.medical_note) {
        try {
            parsedMedicalNote = JSON.parse(story.medical_note)
        } catch (e) {
            // Not a JSON string, leave null to fall back to raw string
        }
    }

    // Poll for illustration updates
    useEffect(() => {
        const hasAllIllustrations = story.chapters.every(ch => ch.illustration_url)
        if (hasAllIllustrations) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/story/${story.id}`)
                if (res.ok) {
                    const updated = await res.json()
                    setStory(updated)
                    if (updated.chapters.every((ch: Chapter) => ch.illustration_url)) {
                        clearInterval(interval)
                    }
                }
            } catch { /* ignore polling errors */ }
        }, 5000)

        return () => clearInterval(interval)
    }, [story.id, story.chapters])

    const goToPage = (page: number) => {
        setIsFlipping(true)
        setTimeout(() => {
            setCurrentPage(page)
            setIsFlipping(false)
        }, 300)
    }

    const nextPage = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage > -1) goToPage(currentPage - 1)
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-8 px-4">
            {/* Top navigation */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-6">
                <Button
                    variant="outline"
                    onClick={() => router.push('/create')}
                    className="rounded-xl border-purple-200 hover:bg-purple-50 font-semibold"
                >
                    <Home className="h-4 w-4 mr-2" />
                    New Story
                </Button>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        {isOnCover ? 'Cover' : isOnMedicalNote ? "Doctor's Note" : `Scene ${currentPage + 1} of ${totalPages}`}
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleExportPdf}
                        disabled={isExporting}
                        className="rounded-xl border-purple-200 hover:bg-purple-50 font-semibold text-sm"
                    >
                        {isExporting ? (
                            <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Exporting...</>
                        ) : (
                            <><Download className="h-4 w-4 mr-1.5" /> PDF</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Book container */}
            <div className={cn(
                "w-full max-w-4xl glass rounded-3xl shadow-2xl shadow-purple-200/40 border border-purple-200/40 overflow-hidden transition-all duration-500",
                isFlipping && "opacity-0 scale-95"
            )}>
                {/* Cover Page */}
                {isOnCover && (
                    <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-purple-600 via-pink-500 to-amber-500">
                        {/* Decorations */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <span className="absolute top-[10%] left-[8%] text-5xl opacity-20 animate-float">✨</span>
                            <span className="absolute top-[20%] right-[12%] text-4xl opacity-15 animate-float-delayed">🌟</span>
                            <span className="absolute bottom-[15%] left-[15%] text-5xl opacity-20 animate-float">💫</span>
                            <span className="absolute bottom-[25%] right-[10%] text-4xl opacity-15 animate-float-delayed">📖</span>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6">
                                <BookOpen className="h-4 w-4" />
                                MediTale
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                                {story.title}
                            </h1>
                            <p className="text-white/80 text-lg mb-2">
                                A personalized story for
                            </p>
                            <p className="text-3xl font-bold text-white mb-8">
                                {story.child_name} ✨
                            </p>
                            <Button
                                onClick={nextPage}
                                className="rounded-xl bg-white text-purple-700 hover:bg-white/90 font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                            >
                                Start Reading
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Scene Page */}
                {currentChapter && (
                    <div className="min-h-[70vh] flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-purple-50 via-pink-50/30 to-amber-50/20">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Illustration */}
                            <div className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 flex items-center justify-center min-h-[280px]">
                                {currentChapter.illustration_url ? (
                                    <img
                                        src={currentChapter.illustration_url}
                                        alt={currentChapter.title}
                                        className="w-full h-full object-cover max-h-[360px]"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                                        <div className="relative">
                                            <div className="text-7xl animate-float">
                                                {['🏰', '🌈', '🦁', '⭐', '🌟'][currentPage % 5]}
                                            </div>
                                            <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-purple-500" />
                                        </div>
                                        <p className="text-purple-400 text-sm font-medium">
                                            ✨ Creating illustration...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Scene Content */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">
                                    {currentChapter.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-[15px]">
                                    {currentChapter.text}
                                </p>

                                {/* Dialog section */}
                                {currentChapter.dialog && (
                                    <>
                                        <hr className="my-4 border-gray-200" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Dialog:</p>
                                            {currentChapter.dialog.split('\n').map((line, i) => (
                                                <p key={i} className="text-gray-500 italic text-sm leading-relaxed">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Medical Note Page */}
                {isOnMedicalNote && (
                    <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
                                <Stethoscope className="h-10 w-10 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Doctor&apos;s Note 🩺
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">For parents and caregivers</p>
                            <div className="glass rounded-2xl p-8 text-left border border-blue-200/40 space-y-6">
                                {parsedMedicalNote ? (
                                    <>
                                        {parsedMedicalNote.what_the_story_teaches && (
                                            <div>
                                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">What this story teaches</h3>
                                                <p className="text-gray-700 leading-relaxed text-[15px]">{parsedMedicalNote.what_the_story_teaches}</p>
                                            </div>
                                        )}
                                        {parsedMedicalNote.coping_technique_used && (
                                            <div>
                                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Coping Technique Used</h3>
                                                <p className="text-gray-700 leading-relaxed text-[15px] bg-blue-50 inline-block px-3 py-1 rounded-full text-blue-700 border border-blue-100">{parsedMedicalNote.coping_technique_used}</p>
                                            </div>
                                        )}
                                        {parsedMedicalNote.discussion_questions && parsedMedicalNote.discussion_questions.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Discussion Questions</h3>
                                                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-[15px] space-y-1">
                                                    {parsedMedicalNote.discussion_questions.map((q: string, i: number) => (
                                                        <li key={i}>{q}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {parsedMedicalNote.best_time_to_read && (
                                            <div>
                                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Best time to read</h3>
                                                <p className="text-gray-700 leading-relaxed text-[15px]">{parsedMedicalNote.best_time_to_read}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed text-[15px]">
                                        {story.medical_note}
                                    </p>
                                )}
                            </div>
                            <div className="mt-8 flex gap-3 justify-center flex-wrap">
                                <Button
                                    onClick={handleExportPdf}
                                    disabled={isExporting}
                                    variant="outline"
                                    className="rounded-xl border-blue-300 hover:bg-blue-50 font-bold px-8 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isExporting ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...</>
                                    ) : (
                                        <><Download className="h-4 w-4 mr-2" /> Download PDF 📄</>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => router.push('/create')}
                                    className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all"
                                >
                                    Create Another Story ✨
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom navigation */}
            <div className="w-full max-w-4xl flex items-center justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={isOnCover || isFlipping}
                    className="rounded-xl border-purple-200 hover:bg-purple-50 font-semibold px-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Page dots */}
                <div className="flex items-center gap-1.5">
                    {/* Cover dot */}
                    <button
                        onClick={() => goToPage(-1)}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                            isOnCover ? "bg-purple-500 scale-125" : "bg-purple-200 hover:bg-purple-300"
                        )}
                    />
                    {/* Chapter dots */}
                    {story.chapters.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                currentPage === i ? "bg-purple-500 scale-125" : "bg-purple-200 hover:bg-purple-300"
                            )}
                        />
                    ))}
                    {/* Medical note dot */}
                    <button
                        onClick={() => goToPage(totalPages)}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                            isOnMedicalNote ? "bg-blue-500 scale-125" : "bg-blue-200 hover:bg-blue-300"
                        )}
                    />
                </div>

                <Button
                    onClick={nextPage}
                    disabled={isOnMedicalNote || isFlipping}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-6 shadow-lg hover:shadow-xl transition-all"
                >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}
