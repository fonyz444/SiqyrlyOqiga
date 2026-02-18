import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openrouter, MODELS } from '@/lib/openrouter'
import { buildMessages } from '@/lib/prompts'
import { FormData } from '@/lib/types'

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Parse form data
        const formData: FormData = await request.json()

        if (!formData.childName || !formData.condition || !formData.language) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 3. Build messages and call AI
        const messages = buildMessages(formData)

        console.log('Calling OpenRouter with model:', MODELS.story)
        console.log('Number of messages:', messages.length)

        // Add timeout to prevent infinite hanging
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 120000) // 120 sec

        let completion
        try {
            completion = await openrouter.chat.completions.create({
                model: MODELS.story,
                messages: messages as any,
                max_tokens: 2500,
                temperature: 0.8,
            }, { signal: controller.signal })
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('abort')) {
                throw new Error('Story generation timed out after 120 seconds. The model may be overloaded — please try again.')
            }
            throw err
        } finally {
            clearTimeout(timeout)
        }

        const content = completion.choices[0]?.message?.content
        if (!content) {
            throw new Error('No content in AI response')
        }

        // 4. Parse the AI response
        let storyData: { title: string; chapters: any[]; medical_note: string; character_description?: string }
        try {
            storyData = JSON.parse(content)
        } catch {
            // Sometimes the model wraps JSON in markdown, try to extract
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
            if (jsonMatch) {
                storyData = JSON.parse(jsonMatch[1])
            } else {
                throw new Error('Failed to parse AI response as JSON')
            }
        }

        // Validate structure
        if (!storyData.title || !Array.isArray(storyData.chapters) || storyData.chapters.length === 0) {
            throw new Error('Invalid story structure from AI')
        }

        console.log('Character description:', storyData.character_description?.substring(0, 100) || 'NOT PROVIDED')

        // 5. Save to Supabase
        const { data: story, error: dbError } = await supabase
            .from('stories')
            .insert({
                user_id: user.id,
                child_name: formData.childName,
                child_age: formData.childAge,
                condition: formData.condition,
                language: formData.language,
                title: storyData.title,
                chapters: storyData.chapters,
                medical_note: storyData.medical_note || '',
            })
            .select('id')
            .single()

        if (dbError) {
            console.error('DB Error:', dbError)
            throw new Error('Failed to save story')
        }

        // 6. Kick off illustration generation asynchronously (fire-and-forget)
        // Pass character_description so every illustration has consistent hero appearance
        generateIllustrations(story.id, storyData.chapters, supabase, storyData.character_description).catch(err =>
            console.error('Illustration generation error:', err)
        )

        return NextResponse.json({ storyId: story.id })

    } catch (error: any) {
        console.error('Story generation error:', error?.message || error)
        console.error('Full error:', JSON.stringify(error, null, 2))
        return NextResponse.json(
            { error: error?.message || 'Failed to generate story', details: String(error) },
            { status: 500 }
        )
    }
}

/**
 * Asynchronously generates illustrations for each chapter using OpenRouter's
 * chat completions API with image modality (not images.generate).
 * Updates the story record in Supabase with illustration URLs.
 */
async function generateIllustrations(
    storyId: string,
    chapters: any[],
    supabase: any,
    characterDescription?: string
) {
    try {
        const updatedChapters = [...chapters]

        // Build a consistent character prefix for all illustration prompts
        const characterPrefix = characterDescription
            ? `MAIN CHARACTER (must appear exactly like this in every image): ${characterDescription}. `
            : ''

        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i]
            if (!chapter.illustration_prompt) continue

            try {
                console.log(`Generating illustration ${i + 1}/${chapters.length}...`)

                const response = await openrouter.chat.completions.create({
                    model: MODELS.illustration,
                    messages: [
                        {
                            role: 'user',
                            content: `Create a beautiful, child-friendly cartoon illustration for a children's storybook. ${characterPrefix}Scene: ${chapter.illustration_prompt}. Style: warm, colorful, consistent character design, suitable for a children's picture book.`
                        }
                    ],
                    // @ts-ignore — OpenRouter-specific parameter for image generation
                    modalities: ['image'],
                })

                // OpenRouter returns images in message.images array
                const message = response.choices?.[0]?.message as any
                const imageUrl = message?.images?.[0]?.image_url?.url

                if (imageUrl) {
                    console.log(`Illustration ${i + 1} generated successfully`)
                    updatedChapters[i] = {
                        ...updatedChapters[i],
                        illustration_url: imageUrl,
                    }

                    // Update DB after each illustration to show progress
                    await supabase
                        .from('stories')
                        .update({ chapters: updatedChapters })
                        .eq('id', storyId)
                } else {
                    console.warn(`Illustration ${i + 1}: no image in response`, JSON.stringify(message).substring(0, 200))
                }
            } catch (err) {
                console.error(`Illustration ${i + 1} generation failed:`, err)
                // Continue with other illustrations
            }
        }
    } catch (error) {
        console.error('Illustration batch error:', error)
    }
}
