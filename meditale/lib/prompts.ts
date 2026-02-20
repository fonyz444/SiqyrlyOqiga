import { FormData } from './types'

const LANG_INSTRUCTIONS: Record<string, string> = {
  kz: 'Write the entire story strictly in natural, conversational Kazakh language. Use warm, child-friendly words.',
  ru: 'Write the entire story strictly in natural, conversational Russian language. Use warm, child-friendly words.',
  en: 'Write the entire story strictly in natural, conversational English language. Use warm, child-friendly words.',
}

function getAgeInstruction(age: number): string {
  if (age <= 5) return 'Max 10 words per sentence. Use soft rhymes. Very simple vocabulary.'
  if (age <= 8) return 'Max 15 words per sentence. Simple cause-and-effect logic.'
  return 'Up to 20 words per sentence. Light metaphors are okay.'
}

function buildContextBlock(data: FormData): string {
  const lines: string[] = [
    `- Hero: "${data.childName}", age ${data.childAge}. THIS IS THE MAIN CHARACTER.`,
    `- Medical Challenge: "${data.condition}". (CRITICAL: Be truthful but highly comforting. The doctor is a kind doctor, the medicine is medicine, and the clinic is a modern, friendly clinic. Do NOT hide them behind metaphors like wizards or castles, because the child needs to recognize reality. However, frame the process positively—like forming a brave team with the doctors to get better. AVOID scary medical jargon, needles, or pain).`,
    data.favoriteCartoon && `- Beloved Cartoon Universe: "${data.favoriteCartoon}". ABSOLUTE CRITICAL REQUIREMENT: You MUST base the entire magical world on this cartoon. The hero MUST meet the main famous characters from "${data.favoriteCartoon}". These characters MUST be the hero's loyal friends, talk to the hero directly, use their signature catchphrases, and actively teach the hero the "magic trick" to overcome their fears. If you do not include these characters, the story is a failure.`,
    data.characters.length > 0 && `- Specific Cartoon Companions to include: ${data.characters.join(', ')}.`,
    data.hobbies.length > 0 && `- Hero's Hobbies: ${data.hobbies.join(', ')}. Use these as magical skills or tools the hero uses!`,
    data.family && `- Family: "${data.family}". Include them as loving, supportive figures.`,
    data.goal && `- Therapeutic Goal: "${data.goal}".`,
    data.special && `- Parent's Special Note: "${data.special}".`,
    data.customScenario && `- Parent's Custom Scenario: "${data.customScenario}". (Follow this narrative closely!).`,
  ].filter(Boolean) as string[]

  return lines.join('\n')
}

/**
 * Builds the system prompt for story generation.
 */
export function buildSystemPrompt(data: FormData): string {
  const langInstruction = LANG_INSTRUCTIONS[data.language] ?? LANG_INSTRUCTIONS['en']

  return `You are Siqyrly Oqiga, an award-winning children's author and therapeutic storyteller. Your goal is to create a deeply engaging, magical, and comforting personalized fairy tale for a child facing a medical situation.

STORY CONTEXT:
${buildContextBlock(data)}

NARRATIVE RULES (CRITICAL):
1. PACING & STRUCTURE: Create exactly 6 to 8 short scenes following a therapeutic hero's journey. 
   - Scene 1: Introduction of the hero and their normal, happy world.
   - Scene 2-3: The call to adventure (the medical challenge appears, framed magically).
   - Scene 4-5: Meeting the companions and learning the "magic trick" (the coping mechanism: deep breathing, a magic word, a shield).
   - Scene 6-7: The climax where the hero bravely faces the challenge using their new trick.
   - Scene 8: The joyful resolution, celebration, and receiving a "bravery badge" or magical reward.
2. TONE: Magical, whimsical, empowering, and deeply comforting. Use sensory details (colors, soft sounds, sparkles, smells of cookies).
3. AGE-APPROPRIACY: ${getAgeInstruction(data.childAge)} High rhythm.
4. DIALOGUE: Every scene MUST have 2-3 lines of engaging, in-character dialogue. The companions should talk to the hero and encourage them.
5. APPEARANCE: ${data.childPhoto ? "A photo of the child is attached. Carefully observe their appearance (hair color, eye color, skin tone, distinctive features) and use these details to describe the hero consistently throughout the story AND in every illustration_prompt." : "Create a generic but warm description of the hero (e.g., bright eyes, messy hair)."}
${langInstruction}

OUTPUT FORMAT:
You MUST respond with purely valid JSON.
{
  "title": "A catchy, magical title for the story",
  "character_description": "VERY detailed, fixed visual description of the main hero to ensure consistent appearance across all illustrations. Example: 'A 6-year-old boy with curly blond hair, bright blue eyes, fair skin, wearing a blue superhero cape and red sneakers'. MUST BE BASED ON PHOTO if provided.",
  "chapters": [
    {
      "title": "Scene 1: [Short Title]",
      "text": "The narrative text for this scene. Vivid, enchanting, but concise (3-5 sentences max).",
      "dialog": "Engaging character dialog for this scene. Short lines. Each line separated by \\n.",
      "illustration_prompt": "CRUCIAL: Describe ONLY the visual scene for the AI image generator. Mention setting, lighting, action, mood, and cartoon companions. DO NOT repeat the hero's appearance here. Style: modern children's book illustration, soft digital painting, warm lighting, expressive cute characters."
    }
  ],
  "medical_note": {
    "what_the_story_teaches": "One sentence for the parent.",
    "discussion_questions": ["Question 1 for parent to ask child", "Question 2"],
    "best_time_to_read": "Before procedure / After diagnosis / As daily routine",
    "coping_technique_used": "Name of the technique (e.g., deep breathing, positive self-talk)"
  }
}`
}

export function buildUserText(data: FormData): string {
  const base = `Generate a personalized fairy tale for ${data.childName}, age ${data.childAge}. The child's medical condition is "${data.condition}". Make ${data.childName} the brave main hero.`
  const scenario = data.customScenario
    ? ` Follow this scenario as the story foundation: "${data.customScenario}".`
    : ''
  return base + scenario + ' Respond ONLY with valid JSON.'
}

export function buildUserContent(data: FormData) {
  const text = buildUserText(data)
  if (!data.childPhoto) return text

  return [
    {
      type: 'text' as const,
      text: text + `\n\nAnalyze the child's photo: note hair color, eye color, skin tone, and distinctive features. Use these details consistently in every illustration_prompt.`,
    },
    { type: 'image_url' as const, image_url: { url: data.childPhoto } },
  ]
}

/**
 * Builds the messages array for the OpenRouter API call.
 */
export function buildMessages(data: FormData): Array<{ role: string; content: any }> {
  return [
    { role: 'system', content: buildSystemPrompt(data) },
    { role: 'user', content: buildUserContent(data) }
  ]
}
