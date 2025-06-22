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
          content: `You are a poetic summarizer. Transform the given news headline into a short, emotionally ambiguous noun phrase (max 7 words). This phrase should be poetic, symbolic, and open-ended—suitable to serve as both the first and last line of a Skinny poem.

Guidelines:
• Do NOT summarize literally
• Avoid full sentences. Use abstract, metaphor-rich noun phrases instead
• Steer clear of specific names, places, or temporal references
• Prioritize symbolic weight, emotional texture, and interpretive openness
• Imagine the phrase as the title of a surreal painting

Example:
Headline: "UN warns of irreversible climate tipping points"
Poetic phrase: "the edge of unremembered heat"`
        },
        {
          role: "user",
          content: headline
        }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    const result = response.choices[0]?.message?.content?.trim();
    if (!result) {
      throw new Error('No content returned from OpenAI');
    }
    
    return result;
  } catch (error) {
    console.error('Error transforming headline:', error);
    // More sophisticated fallback based on headline content
    return createPoetricFallback(headline);
  }
}

function createPoetricFallback(headline: string): string {
  // Simple poetic transformations as fallback
  const lowerHeadline = headline.toLowerCase();
  
  if (lowerHeadline.includes('climate') || lowerHeadline.includes('environment')) {
    return "the weight of tomorrow's sky";
  } else if (lowerHeadline.includes('war') || lowerHeadline.includes('conflict')) {
    return "echoes of distant thunder";
  } else if (lowerHeadline.includes('economy') || lowerHeadline.includes('market')) {
    return "the pulse of uncertain tides";
  } else if (lowerHeadline.includes('technology') || lowerHeadline.includes('digital')) {
    return "fragments of electric dreams";
  } else if (lowerHeadline.includes('health') || lowerHeadline.includes('medical')) {
    return "whispers of healing light";
  } else {
    return "the space between what was and what could be";
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

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const words = content.split('\n').filter(word => word.trim()).map(word => word.trim().toLowerCase());
    return words.length >= 6 ? words.slice(0, 6) : getRandomBaseAnchors();
  } catch (error) {
    console.error('Error generating anchor words:', error);
    return getRandomBaseAnchors();
  }
}

function getRandomBaseAnchors(): string[] {
  const baseWords = [
    "breathe", "release", "become", "hold", "listen", "remember",
    "forgive", "trust", "surrender", "witness", "embrace", "flow",
    "gather", "whisper", "dance", "rest", "bloom", "heal"
  ];
  
  // Shuffle and return 6 words
  const shuffled = [...baseWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
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
  console.log('Starting poem generation with:', { whisper, anchor, feeling });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a master of Skinny poetry. Create a Skinny poem following this EXACT structure:

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

Return ONLY the 11-line poem. No explanations, no formatting, no extra text.`
        },
        {
          role: "user",
          content: `Create a Skinny poem using:
Whisper: "${whisper}"
Anchor: "${anchor}"
Feeling: "${feeling}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      console.error('No content returned from OpenAI');
      return createFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Generated poem:', content);

    // Validate the generated poem
    const validation = await validateSkinnyPoem(content, anchor);
    if (!validation.isValid) {
      console.warn('Generated poem failed validation:', validation.issues);
      console.log('Using fallback poem instead');
      return createFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Poem validation passed');
    return content;

  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    console.log('Using fallback poem due to error');
    return createFallbackSkinnyPoem(whisper, anchor, feeling);
  }
}

function createFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
  console.log('Creating fallback poem');
  
  // Create a more sophisticated fallback based on the feeling
  const feelingWords = feeling.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && !['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'from', 'they', 'have', 'been'].includes(word)
  );
  
  const middleWord = feelingWords.length > 0 ? feelingWords[0] : 'silence';
  
  return `${whisper}
${anchor}
silence
holds
${middleWord}
${anchor}
cannot
speak
yet
${anchor}
${whisper}`;
}

// Keep the old function for backward compatibility, but redirect to new one
export async function generatePoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  return generateSkinnyPoem(whisper, anchor, feeling);
}