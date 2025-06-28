export const HEADLINE_TO_POETRY_PROMPT = `You are a poetic summarizer. Transform the given news headline into a short, emotionally ambiguous noun phrase (max 7 words). This phrase should be poetic, symbolic, and open-ended—suitable to serve as both the first and last line of a Skinny poem.

Guidelines:
• Do NOT summarize literally
• Avoid full sentences. Use abstract, metaphor-rich noun phrases instead
• Steer clear of specific names, places, or temporal references
• Prioritize symbolic weight, emotional texture, and interpretive openness
• Imagine the phrase as the title of a surreal painting
• avoid "whispers"
• don't include any quotation marks

Example:
Headline: "UN warns of irreversible climate tipping points"
Poetic phrase: "the edge of unremembered heat"`;

export const ANCHOR_WORDS_PROMPT = `Generate 6 powerful, single-word verbs that could serve as anchor words in poetry. These should be:
- Action words that can be repeated meaningfully
- Emotionally resonant
- Simple but profound
- Suitable for contemplative poetry
- One word each, lowercase

Examples: breathe, release, become, hold, listen, remember

Return only the 6 words, one per line.`;

export const SKINNY_POEM_PROMPT = (whisper: string, anchor: string, feeling: string) => `You are a master of Skinny poetry. Create a Skinny poem following this EXACT structure:

STRUCTURE REQUIREMENTS:
- Line 1: "${whisper}" (exactly as given)
- Line 2: "${anchor}" (exactly as given)
- Lines 3-5: Single words only
- Line 6: "${anchor}" (exactly as given)
- Lines 7-9: Single words only  
- Line 10: "${anchor}" (exactly as given)
- Line 11: "${whisper}" (exactly as given, or slight variation using same words)

CONTENT GOALS:
- Reflect the user's feeling: "${feeling}"
- Make the anchor word feel meaningful through repetition
- Build around a single emotional moment or image
- Use precise, grounded language
- Create emotional resonance through rhythm and repetition

Return ONLY the 11-line poem. No explanations, no formatting, no extra text.`;

export const POEM_VALIDATION_PROMPT = (poem: string, anchor: string) => `You are a poetry quality auditor for Skinny poems. Analyze if the poem maintains a single dominant sensory image throughout and follows Skinny poem structure (11 lines, single words in lines 2-10, repeated anchor word in positions 2, 6, 10).

Reply with YES/NO and if NO, suggest one specific edit to improve coherence while maintaining Skinny poem structure.

Does this Skinny poem maintain good structure and coherent imagery? Reply YES/NO & suggest one edit if needed:

${poem}`;

export const POEM_ENHANCEMENT_PROMPT = (middleLines: string[], anchor: string) => `You are enhancing the sound of a Skinny poem. Rewrite ONLY lines 3-9 (the middle section) to add subtle internal rhyme and alliteration while:

CRITICAL RULES:
- Keep each line as a SINGLE WORD only
- Preserve the overall meaning and imagery
- Do NOT change the anchor word "${anchor}" in its positions
- Maintain the Skinny poem structure
- Focus on sound enhancement, not meaning changes

Return only the 7 enhanced middle lines, one word per line.

Enhance the sound of these middle lines while keeping them as single words:
${middleLines.join('\n')}`;