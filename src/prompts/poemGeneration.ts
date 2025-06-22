export const POEM_GENERATION_PROMPT = (whisper: string, anchor: string, feeling: string) => `You are a master of Skinny poetry. Create a Skinny poem following this EXACT structure:

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