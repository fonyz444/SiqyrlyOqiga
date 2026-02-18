'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, BookOpen } from 'lucide-react'

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>, type: 'login' | 'signup') => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            if (type === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setError('Check your email for the confirmation link.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/create')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-magic-gradient p-4">
            {/* Floating decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <span className="absolute top-[12%] left-[10%] text-4xl animate-float opacity-50">📖</span>
                <span className="absolute top-[20%] right-[15%] text-3xl animate-float-delayed opacity-40">✨</span>
                <span className="absolute bottom-[25%] left-[8%] text-4xl animate-float-delayed opacity-35">🌟</span>
                <span className="absolute bottom-[15%] right-[10%] text-3xl animate-float opacity-40">💫</span>
            </div>

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                <div className="glass rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm mb-4 shadow-lg">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gradient-magic">MediTale</h1>
                        <p className="text-sm text-gray-600 mt-1">Create healing stories for your child</p>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-full bg-purple-100/60 p-1 mb-6">
                            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md font-semibold transition-all">
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md font-semibold transition-all">
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={(e) => handleEmailAuth(e, 'login')} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-gray-700 font-semibold text-sm">Email</Label>
                                    <Input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        className="rounded-xl border-purple-200 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password" className="text-gray-700 font-semibold text-sm">Password</Label>
                                    <Input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        required
                                        className="rounded-xl border-purple-200 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500 font-medium bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                                <Button
                                    type="submit"
                                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In ✨
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={(e) => handleEmailAuth(e, 'signup')} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-gray-700 font-semibold text-sm">Email</Label>
                                    <Input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        className="rounded-xl border-purple-200 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-gray-700 font-semibold text-sm">Password</Label>
                                    <Input
                                        id="signup-password"
                                        name="password"
                                        type="password"
                                        required
                                        className="rounded-xl border-purple-200 bg-white/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                    />
                                </div>
                                {error && <p className="text-sm text-green-600 font-medium bg-green-50 rounded-lg px-3 py-2">{error}</p>}
                                <Button
                                    type="submit"
                                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account 🎉
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-purple-200/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-gray-500 font-semibold">
                                or
                            </span>
                        </div>
                    </div>

                    {/* Google button */}
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full rounded-xl border-2 border-purple-200/60 bg-white/50 hover:bg-white/80 font-semibold py-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.56-2.77.01-.53z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Footer */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        By continuing, you agree to our Terms & Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}
