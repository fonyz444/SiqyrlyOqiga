import OpenAI from 'openai'

export const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'https://meditale.vercel.app',
        'X-Title': 'MediTale',
    }
})

// Models available for generation
export const MODELS = {
    story: 'openai/gpt-4o-mini',
    illustration: 'bytedance-seed/seedream-4.5',
    // Paid alternatives:   
    // story: 'openai/gpt-4o-mini',
    // story: 'anthropic/claude-sonnet-4',
    // illustration: 'black-forest-labs/flux.2-flex',
} as const
