import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function transformHeadlineToPoetry(headline: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a poetic summarizer. I will give you a news headline. Your task is to turn this into a short, poetic, emotionally ambiguous phrase (max 7 words) that could work as the first and last line of a Skinny poem.

Rules:
- Do NOT summarize literally.
- Focus on metaphor, emotional tone, or symbolic abstraction.
- Avoid names, locations, or time markers.
- Be open-ended enough to spark multiple meanings.

Example:
Headline: "UN warns of irreversible climate tipping points"
Poetic phrase: "The edge won't wait for us"`
        },
        {
          role: "user",
          content: headline
        }
      ],
      max_tokens: 20,
      temperature: 0.8
    });

    return response.choices[0]?.message?.content?.trim() || headline;
  } catch (error) {
    console.error('Error transforming headline:', error);
    // Fallback to original headline if API fails
    return headline;
  }
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are writing a Skinny poem (11 lines). The structure is:

Line 1 = A selected poetic phrase from step 1 (start line)
Lines 2–10 = One word per line
Lines 2, 6, 10 = Must repeat the selected keyword in step 2
Line 11 = A repeat (or reordering if needed) of the first line's words

Goal:
- Build around a single vivid image or emotional situation based on user input if possible, or randomly find a cause to compose.
- Be honest, grounded, and evocative.
- Use concrete words. Avoid abstraction or cliché.
- Echo the tone of the user input if they are meaningful.
- Make the repetition meaningful or ironic.

Input:
- First/last line: ${whisper}
- Repeated word: ${anchor}
- User feeling/input: ${feeling}

Output:
<11-line Skinny poem>`
        },
        {
          role: "user",
          content: `Create a Skinny poem with:
- First/last line: "${whisper}"
- Repeated word: "${anchor}"
- User feeling/input: "${feeling}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content?.trim() || createFallbackSkinnyPoem(whisper, anchor, feeling);
  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    // Fallback poem if API fails
    return createFallbackSkinnyPoem(whisper, anchor, feeling);
  }
}

function createFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
  return `${whisper}
${anchor}
silence
holds
what
${anchor}
cannot
say
in
${anchor}
${whisper}`;
}

// Keep the old function for backward compatibility, but redirect to new one
export async function generatePoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  return generateSkinnyPoem(whisper, anchor, feeling);
}