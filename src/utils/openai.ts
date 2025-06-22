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

export async function generateAnchorWords(): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 6 powerful, single-word verbs that could serve as anchor words in poetry. These should be:
- Action words that can be repeated meaningfully
- Emotionally resonant
- Simple but profound
- Suitable for contemplative poetry
- One word each, lowercase

Examples: breathe, release, become, hold, listen, remember

Return only the 6 words, one per line.`
        },
        {
          role: "user",
          content: "Generate 6 new anchor words for poetry"
        }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    const words = response.choices[0]?.message?.content?.trim().split('\n').filter(word => word.trim()) || [];
    return words.length >= 6 ? words.slice(0, 6) : [
      "breathe", "release", "become", "hold", "listen", "remember"
    ];
  } catch (error) {
    console.error('Error generating anchor words:', error);
    // Fallback to base words
    return ["breathe", "release", "become", "hold", "listen", "remember"];
  }
}

export async function validateSkinnyPoem(poem: string, anchor: string): Promise<{ isValid: boolean; issues: string[] }> {
  const lines = poem.split('\n').filter(line => line.trim() !== '');
  const issues: string[] = [];
  
  // Check line count
  if (lines.length !== 11) {
    issues.push(`Must have exactly 11 lines (found ${lines.length})`);
  }
  
  if (lines.length >= 11) {
    // Check that lines 2-10 are single words
    for (let i = 1; i <= 9; i++) {
      if (lines[i] && lines[i].trim().split(/\s+/).length > 1) {
        issues.push(`Line ${i + 1} must be a single word`);
      }
    }
    
    // Check anchor word appears in positions 2, 6, 10 (indices 1, 5, 9)
    const anchorPositions = [1, 5, 9];
    for (const pos of anchorPositions) {
      if (lines[pos] && lines[pos].trim().toLowerCase() !== anchor.toLowerCase()) {
        issues.push(`Line ${pos + 1} must be the anchor word "${anchor}"`);
      }
    }
    
    // Check first and last lines are related (contain similar words)
    if (lines[0] && lines[10]) {
      const firstWords = lines[0].toLowerCase().split(/\s+/);
      const lastWords = lines[10].toLowerCase().split(/\s+/);
      const commonWords = firstWords.filter(word => lastWords.includes(word));
      
      if (commonWords.length === 0) {
        issues.push('First and last lines should share some words or be variations of each other');
      }
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

export async function auditPoemQuality(poem: string): Promise<{ isGood: boolean; suggestion?: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a poetry quality auditor for Skinny poems. Analyze if the poem maintains a single dominant sensory image throughout and follows Skinny poem structure (11 lines, single words in lines 2-10, repeated anchor word in positions 2, 6, 10).

Reply with YES/NO and if NO, suggest one specific edit to improve coherence while maintaining Skinny poem structure.`
        },
        {
          role: "user",
          content: `Does this Skinny poem maintain good structure and coherent imagery? Reply YES/NO & suggest one edit if needed:\n\n${poem}`
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
    const lines = poem.split('\n').filter(line => line.trim() !== '');
    if (lines.length !== 11) return poem;
    
    const middleLines = lines.slice(2, 9); // Lines 3-9 (index 2-8)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are enhancing the sound of a Skinny poem. Rewrite ONLY lines 3-9 (the middle section) to add subtle internal rhyme and alliteration while:

CRITICAL RULES:
- Keep each line as a SINGLE WORD only
- Preserve the overall meaning and imagery
- Do NOT change the anchor word "${anchor}" in its positions
- Maintain the Skinny poem structure
- Focus on sound enhancement, not meaning changes

Return only the 7 enhanced middle lines, one word per line.`
        },
        {
          role: "user",
          content: `Enhance the sound of these middle lines while keeping them as single words:\n${middleLines.join('\n')}`
        }
      ],
      max_tokens: 50,
      temperature: 0.6
    });

    const enhancedMiddle = response.choices[0]?.message?.content?.trim();
    if (!enhancedMiddle) return poem;
    
    const enhancedLines = enhancedMiddle.split('\n').filter(line => line.trim());
    if (enhancedLines.length !== 7) return poem;
    
    // Validate each enhanced line is a single word
    for (const line of enhancedLines) {
      if (line.trim().split(/\s+/).length > 1) {
        return poem; // Return original if any line has multiple words
      }
    }
    
    // Reconstruct the full poem
    return [
      lines[0], // First line
      lines[1], // Line 2 (anchor)
      ...enhancedLines, // Enhanced lines 3-9
      lines[9], // Line 10 (anchor)
      lines[10] // Last line
    ].join('\n');
    
  } catch (error) {
    console.error('Error enhancing poem sound:', error);
    return poem;
  }
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: `Create a Skinny poem with:
- Whisper (first/last line): "${whisper}"
- Anchor word (lines 2, 6, 10): "${anchor}"
- User feeling: "${feeling}"

✍️ FORM:
Write exactly 11 lines.

1. Line 1: The “whisper” phrase (poetic, metaphorical, or emotionally suggestive)
2. Lines 2–10: Single word per line only — no phrases
   - Line 2 = "${anchor}"
   - Line 6 = "${anchor}"
   - Line 10 = "${anchor}"
3. Line 11: Repeat or re-order the exact same words from the whisper (Line 1)

🧠 GOALS:
- Reflect or contrast the user’s feeling (“${feeling}”) through imagery and word choice
- Make the anchor word feel meaningful — as echo, emphasis, or irony
- Build around a single emotional moment, image, or metaphor
- Use precise, grounded language (not vague or abstract)
- The poem should feel raw, rhythmic, and emotionally resonant

Return only the 11-line poem. No title, no explanation, no formatting.`
    });

    let poem = response.choices[0]?.message?.content?.trim() || createFallbackSkinnyPoem(whisper, anchor, feeling);
    
    // Validate the generated poem
    const validation = await validateSkinnyPoem(poem, anchor);
    if (!validation.isValid) {
      console.warn('Generated poem failed validation:', validation.issues);
      return createFallbackSkinnyPoem(whisper, anchor, feeling);
    }
    
    return poem;
    
  } catch (error) {
    console.error('Error generating Skinny poem:', error);
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