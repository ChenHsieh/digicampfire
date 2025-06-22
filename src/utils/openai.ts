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

export async function auditPoemQuality(poem: string): Promise<{ isGood: boolean; suggestion?: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a poetry quality auditor. Analyze if the poem maintains a single dominant sensory image throughout. Reply with YES/NO and if NO, suggest one specific edit to improve coherence."
        },
        {
          role: "user",
          content: `Does this poem keep a single dominant sensory image? Reply YES/NO & suggest one edit if needed:\n\n${poem}`
        }
      ],
      max_tokens: 100,
      temperature: 0.3
    });

    const result = response.choices[0]?.message?.content?.trim() || '';
    const isGood = result.toLowerCase().startsWith('yes');
    const suggestion = isGood ? undefined : result.split('\n').slice(1).join('\n').trim();
    
    return { isGood, suggestion };
  } catch (error) {
    console.error('Error auditing poem quality:', error);
    return { isGood: true }; // Default to accepting if audit fails
  }
}

export async function enhancePoemSound(poem: string, anchor: string): Promise<string> {
  try {
    const lines = poem.split('\n');
    if (lines.length !== 11) return poem;
    
    const middleLines = lines.slice(2, 9); // Lines 3-9 (index 2-8)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a sound poet. Rewrite only the middle lines (lines 3-9) of this Skinny poem to add internal rhyme and alliteration while preserving the exact words and meaning. Keep the anchor word "${anchor}" unchanged in its positions.`
        },
        {
          role: "user",
          content: `Enhance the sound of these middle lines while keeping all words:\n${middleLines.join('\n')}`
        }
      ],
      max_tokens: 100,
      temperature: 0.6
    });

    const enhancedMiddle = response.choices[0]?.message?.content?.trim();
    if (!enhancedMiddle) return poem;
    
    const enhancedLines = enhancedMiddle.split('\n');
    if (enhancedLines.length !== 7) return poem;
    
    // Reconstruct the full poem
    return [
      lines[0], // First line
      lines[1], // Line 2
      ...enhancedLines, // Enhanced lines 3-9
      lines[9], // Line 10
      lines[10] // Last line
    ].join('\n');
    
  } catch (error) {
    console.error('Error enhancing poem sound:', error);
    return poem;
  }
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
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

      let poem = response.choices[0]?.message?.content?.trim() || createFallbackSkinnyPoem(whisper, anchor, feeling);
      
      // Quality audit
      const audit = await auditPoemQuality(poem);
      if (!audit.isGood && attempts < maxAttempts - 1) {
        attempts++;
        continue; // Try again
      }
      
      // Sound enhancement
      poem = await enhancePoemSound(poem, anchor);
      
      return poem;
      
    } catch (error) {
      console.error('Error generating Skinny poem:', error);
      attempts++;
      
      if (attempts >= maxAttempts) {
        return createFallbackSkinnyPoem(whisper, anchor, feeling);
      }
    }
  }
  
  return createFallbackSkinnyPoem(whisper, anchor, feeling);
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