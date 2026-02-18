import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOpenRouterClient, MODELS } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
    try {
        // Authenticate
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { storyId, chapterIndex, prompt } = await request.json()

        if (!storyId || chapterIndex === undefined || !prompt) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Generate illustration
        const response = await getOpenRouterClient().images.generate({
            model: MODELS.illustration,
            prompt: prompt,
            n: 1,
            size: '1024x1024',
        })

        const imageUrl = response.data?.[0]?.url
        if (!imageUrl) {
            throw new Error('No image URL in response')
        }

        // Update the story's chapter with the illustration URL
        const { data: story, error: fetchError } = await supabase
            .from('stories')
            .select('chapters')
            .eq('id', storyId)
            .single()

        if (fetchError || !story) {
            throw new Error('Story not found')
        }

        const chapters = [...story.chapters]
        if (chapters[chapterIndex]) {
            chapters[chapterIndex].illustration_url = imageUrl

            await supabase
                .from('stories')
                .update({ chapters })
                .eq('id', storyId)
        }

        return NextResponse.json({ imageUrl })
    } catch (error: any) {
        console.error('Illustration generation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate illustration' },
            { status: 500 }
        )
    }
}
