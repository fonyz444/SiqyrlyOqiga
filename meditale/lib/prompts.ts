import { FormData } from './types'

/**
 * Builds the system prompt for story generation.
 */
export function buildSystemPrompt(data: FormData): string {
  const langInstruction = {
    kz: 'Write the entire story in Kazakh language.',
    ru: 'Write the entire story in Russian language.',
    en: 'Write the entire story in English language.',
  }[data.language]

  return `You are MediTale — an expert children's storytelling AI that creates personalized therapeutic fairy tales to help children understand and cope with medical conditions.

RULES:
1. The MAIN HERO of the story is the CHILD THEMSELVES. Their name is "${data.childName}", age ${data.childAge}.
2. ${data.childPhoto ? 'A photo of the child is attached. Carefully observe their appearance (hair color, eye color, skin tone, distinctive features) and use it to describe the hero consistently throughout the story AND in every illustration_prompt.' : 'No photo was provided. Create a generic but warm description of the hero.'}
3. The child's medical condition is "${data.condition}". Weave it naturally into the narrative as a challenge the hero overcomes with courage, knowledge, and support. NEVER make the condition scary — frame it positively and educationally.
4. ${data.characters.length > 0 ? `The hero's companions/sidekicks are: ${data.characters.join(', ')}. They help the hero on their journey.` : 'The hero has animal or magical friends who help along the way.'}
5. ${data.favoriteCartoon ? `The child loves "${data.favoriteCartoon}" — subtly reference its style, themes, or characters as inspiration (without copyright issues).` : ''}
6. ${data.hobbies.length > 0 ? `The child's hobbies include: ${data.hobbies.join(', ')}. Incorporate them into the story.` : ''}
7. ${data.goal ? `The story's therapeutic goal: "${data.goal}".` : 'The story should help the child feel brave and understood.'}
8. ${data.family ? `Family context: "${data.family}". Include family figures as supportive characters.` : ''}
9. ${data.special ? `Special note from the parent: "${data.special}".` : ''}
10. ${data.customScenario ? `IMPORTANT — The parent has written a CUSTOM SCENARIO for the story. You MUST follow this scenario as the foundation of your story, adapting it to fit the therapeutic context and the child's condition. Scenario: "${data.customScenario}"` : ''}
11. ${langInstruction}

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown:
{
  "title": "Story title",
  "character_description": "VERY detailed, fixed visual description of the main hero (the child) to ensure consistent appearance across all illustrations. Include: exact hair color and style, eye color, skin tone, approximate height/build, clothing they wear throughout the story. Example: 'A 6-year-old girl with long curly brown hair, big hazel eyes, light brown skin, wearing a bright red dress with white polka dots and small red shoes'. This MUST be based on the child's photo if provided.",
  "chapters": [
    {
      "title": "Scene 1",
      "text": "Short scene description (2-3 sentences max). Describe what happens in the scene visually, like a picture book.",
      "dialog": "Character dialog for this scene. Short lines the child says or hears. Each line on a new line.",
      "illustration_prompt": "Describe ONLY the scene, setting, action, mood, and other characters. Do NOT repeat the hero's appearance here — it will be added automatically. Style: warm, colorful, cartoon children's book illustration."
    }
  ],
  "medical_note": "A brief, parent-friendly note explaining how the story addresses the medical condition and tips for discussion with the child."
}

IMPORTANT STYLE RULES:
- Generate 6-8 SHORT scenes (not long chapters!)
- Each scene "text" must be only 2-3 sentences — like a picture book caption
- Each scene MUST have a "dialog" field with 1-3 short lines of character speech
- Keep language simple and age-appropriate for a ${data.childAge}-year-old
- Scene titles should be "Scene 1", "Scene 2", etc.
- The "character_description" field is CRITICAL — it must be very specific and detailed so the hero looks the same in every illustration
- The story arc: Introduction → Challenge → Learning → Overcoming → Celebration.`
}

/**
 * Builds the messages array for the OpenRouter API call.
 * When a child photo is provided, creates a multimodal message so
 * vision-capable models can analyze the child's appearance.
 */
export function buildMessages(data: FormData): Array<{ role: string; content: any }> {
  const systemPrompt = buildSystemPrompt(data)

  const userText = data.customScenario
    ? `Generate a personalized fairy tale for ${data.childName}, age ${data.childAge}. The child's medical condition is "${data.condition}". Make ${data.childName} the brave main hero. Follow this scenario as the story foundation: "${data.customScenario}". Respond ONLY with valid JSON.`
    : `Generate a personalized fairy tale for ${data.childName}, age ${data.childAge}. The child's medical condition is "${data.condition}". Make ${data.childName} the brave main hero of the story. Respond ONLY with valid JSON.`

  // If photo is provided, send multimodal message (text + image)
  const userContent = data.childPhoto
    ? [
      { type: 'text' as const, text: userText + '\n\nHere is the photo of the child. Carefully observe their appearance (hair color, eye color, skin tone, clothing style, distinctive features) and use these details to describe the hero consistently in EVERY illustration_prompt.' },
      { type: 'image_url' as const, image_url: { url: data.childPhoto } }
    ]
    : userText

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ]

  return messages
}
