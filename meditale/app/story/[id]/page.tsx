import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StoryBook } from '@/components/StoryBook'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function StoryPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth')

    // Fetch story (RLS ensures only owner can see it)
    const { data: story, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !story) {
        redirect('/create')
    }

    return (
        <div className="min-h-screen bg-magic-gradient-subtle">
            <StoryBook story={story} />
        </div>
    )
}
