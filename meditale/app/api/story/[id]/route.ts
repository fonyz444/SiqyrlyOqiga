import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: story, error } = await supabase
            .from('stories')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !story) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(story)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
