import OpenAI from 'openai'

// Lazy initialization — client is created only at runtime, not at build time.
// This prevents "Missing credentials" errors during `next build`.
let _client: OpenAI | null = null

export function getOpenRouterClient(): OpenAI {
    if (!_client) {
        _client = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': 'https://meditale.vercel.app',
                'X-Title': 'MediTale',
            }
        })
    }
    return _client
}

// Backward-compatible export (use getOpenRouterClient() in new code)
export const openrouter = new Proxy({} as OpenAI, {
    get(_, prop) {
        return (getOpenRouterClient() as any)[prop]
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
