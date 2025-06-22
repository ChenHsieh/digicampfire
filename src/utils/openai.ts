import OpenAI from 'openai';

// Check if API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

// Only initialize OpenAI if we have an API key
if (apiKey && apiKey.trim() !== '') {
  try {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      timeout: 30000, // 30 second timeout
      maxRetries: 2
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    openai = null;
  }
} else {
  console.warn('OpenAI API key not found - using fallback responses');
}

export async function transformHeadlineToPoetry(headline: string): Promise<string> {
  // If no OpenAI client, use a simple transformation
  if (!openai) {
    console.log('No OpenAI client available, using simple transformation for:', headline);
    return createSimplePoetryTransformation(headline);
  }

  try {
    console.log('Transforming headline with OpenAI:', headline);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a poetic summarizer. I will give you a news headline. Your task is to transform it into a short, emotionally ambiguous noun phrase (max 7 words). This phrase should be poetic, symbolic, and open-ended—suitable to serve as both the first and last line of a Skinny poem.

Guidelines:
	•	Do NOT summarize literally.
	•	Avoid full sentences. Use abstract, metaphor-rich noun phrases instead (e.g., "glass edge of tomorrow", "inheritance of the burning sky").
	•	Steer clear of specific names, places, or temporal references.
	•	Prioritize symbolic weight, emotional texture, and interpretive openness.
	•	Imagine the phrase as the title of a surreal painting, or a whispered line from a dream.

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

    const result = response.choices[0]?.message?.content?.trim() || createSimplePoetryTransformation(headline);
    console.log('Transformed headline result:', result);
    return result;
  } catch (error) {
    console.warn('OpenAI transformation failed, using simple transformation:', error.message);
    return createSimplePoetryTransformation(headline);
  }
}

function createSimplePoetryTransformation(headline: string): string {
  // Simple rule-based transformation when OpenAI is not available
  const poeticPhrases = [
    "The weight of unspoken words",
    "A memory that refuses to fade",
    "The space between what was and what could be",
    "Echoes of tomorrow's promise",
    "The silence between heartbeats",
    "Fragments of a changing world",
    "Whispers of distant thunder",
    "The edge of unremembered heat",
    "Inheritance of the burning sky",
    "Shadows of what we carry",
    "The pulse of hidden currents",
    "Reflections in broken glass"
  ];
  
  // Use headline content to influence selection
  const lowerHeadline = headline.toLowerCase();
  
  if (lowerHeadline.includes('climate') || lowerHeadline.includes('environment')) {
    return "The edge of unremembered heat";
  } else if (lowerHeadline.includes('war') || lowerHeadline.includes('conflict')) {
    return "The weight of unspoken words";
  } else if (lowerHeadline.includes('future') || lowerHeadline.includes('tomorrow')) {
    return "Echoes of tomorrow's promise";
  } else if (lowerHeadline.includes('memory') || lowerHeadline.includes('history')) {
    return "A memory that refuses to fade";
  } else {
    // Random selection for other headlines
    return poeticPhrases[Math.floor(Math.random() * poeticPhrases.length)];
  }
}

export async function generateAnchorWords(): Promise<string[]> {
  if (!openai) {
    console.log('No OpenAI client available, using curated anchor words');
    const baseWords = ["breathe", "release", "become", "hold", "listen", "remember", "trust", "surrender", "witness", "forgive", "carry", "embrace"];
    return baseWords.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  try {
    console.log('Generating anchor words with OpenAI...');
    
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
    console.log('Generated anchor words:', words);
    
    if (words.length >= 6) {
      return words.slice(0, 6);
    } else {
      // Fallback if generation didn't work properly
      const baseWords = ["breathe", "release", "become", "hold", "listen", "remember"];
      return baseWords;
    }
  } catch (error) {
    console.warn('OpenAI anchor generation failed, using curated words:', error.message);
    const baseWords = ["breathe", "release", "become", "hold", "listen", "remember", "trust", "surrender", "witness", "forgive"];
    return baseWords.sort(() => Math.random() - 0.5).slice(0, 6);
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

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  if (!openai) {
    console.log('No OpenAI client available, creating enhanced fallback poem');
    return createEnhancedFallbackSkinnyPoem(whisper, anchor, feeling);
  }

  try {
    console.log('Generating Skinny poem with OpenAI...');
    console.log('Whisper:', whisper);
    console.log('Anchor:', anchor);
    console.log('Feeling:', feeling);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Create a Skinny poem with:
- Whisper (first/last line): "${whisper}"
- Anchor word (lines 2, 6, 10): "${anchor}"
- User feeling: "${feeling}"

✍️ FORM:
Write exactly 11 lines.

1. Line 1: The "whisper" phrase (poetic, metaphorical, or emotionally suggestive)
2. Lines 2–10: Single word per line only — no phrases
   - Line 2 = "${anchor}"
   - Line 6 = "${anchor}"
   - Line 10 = "${anchor}"
3. Line 11: Repeat or re-order the exact same words from the whisper (Line 1)

🧠 GOALS:
- Reflect or contrast the user's feeling ("${feeling}") through imagery and word choice
- Make the anchor word feel meaningful — as echo, emphasis, or irony
- Build around a single emotional moment, image, or metaphor
- Use precise, grounded language (not vague or abstract)
- The poem should feel raw, rhythmic, and emotionally resonant

Return only the 11-line poem. No title, no explanation, no formatting.`
        },
        {
          role: "user",
          content: `Create a Skinny poem using whisper: "${whisper}", anchor: "${anchor}", feeling: "${feeling}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    let poem = response.choices[0]?.message?.content?.trim();
    
    if (!poem) {
      console.warn('OpenAI returned empty response, using enhanced fallback');
      return createEnhancedFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Generated poem from OpenAI:', poem);

    // Clean up the poem - remove any extra formatting
    poem = poem.replace(/```/g, '').replace(/^\d+\.\s*/gm, '').trim();

    // Validate the generated poem
    const validation = await validateSkinnyPoem(poem, anchor);
    if (!validation.isValid) {
      console.warn('Generated poem failed validation:', validation.issues);
      console.warn('Poem that failed:', poem);
      
      // Try to fix common issues
      const lines = poem.split('\n').filter(line => line.trim() !== '');
      
      // If we have the right number of lines but anchor positions are wrong, try to fix
      if (lines.length === 11) {
        lines[1] = anchor; // Line 2
        lines[5] = anchor; // Line 6  
        lines[9] = anchor; // Line 10
        
        const fixedPoem = lines.join('\n');
        const revalidation = await validateSkinnyPoem(fixedPoem, anchor);
        
        if (revalidation.isValid) {
          console.log('Fixed poem validation issues, using corrected version');
          return fixedPoem;
        }
      }
      
      console.warn('Could not fix validation issues, using enhanced fallback poem');
      return createEnhancedFallbackSkinnyPoem(whisper, anchor, feeling);
    }

    console.log('Poem validation passed, returning generated poem');
    return poem;

  } catch (error) {
    console.warn('OpenAI poem generation failed, using enhanced fallback:', error.message);
    return createEnhancedFallbackSkinnyPoem(whisper, anchor, feeling);
  }
}

function createEnhancedFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
  console.log('Creating enhanced fallback Skinny poem');
  
  // Create a more sophisticated fallback based on the feeling and whisper
  const feelingWords = feeling ? feeling.toLowerCase().split(/\s+/).filter(word => word.length > 2) : [];
  const whisperWords = whisper.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Emotional word pools based on common themes
  const emotionalWordPools = {
    melancholy: ['shadow', 'silence', 'echo', 'fade', 'drift'],
    hope: ['light', 'bloom', 'rise', 'shine', 'grow'],
    anxiety: ['tremble', 'rush', 'spiral', 'shake', 'flutter'],
    peace: ['still', 'calm', 'rest', 'settle', 'breathe'],
    longing: ['reach', 'yearn', 'stretch', 'call', 'seek'],
    default: ['whisper', 'memory', 'dream', 'pulse', 'flow']
  };
  
  // Determine emotional tone from feeling
  let wordPool = emotionalWordPools.default;
  if (feeling) {
    const feelingLower = feeling.toLowerCase();
    if (feelingLower.includes('sad') || feelingLower.includes('lost') || feelingLower.includes('empty')) {
      wordPool = emotionalWordPools.melancholy;
    } else if (feelingLower.includes('hope') || feelingLower.includes('joy') || feelingLower.includes('happy')) {
      wordPool = emotionalWordPools.hope;
    } else if (feelingLower.includes('anxious') || feelingLower.includes('worry') || feelingLower.includes('fear')) {
      wordPool = emotionalWordPools.anxiety;
    } else if (feelingLower.includes('calm') || feelingLower.includes('peace') || feelingLower.includes('still')) {
      wordPool = emotionalWordPools.peace;
    } else if (feelingLower.includes('miss') || feelingLower.includes('want') || feelingLower.includes('need')) {
      wordPool = emotionalWordPools.longing;
    }
  }
  
  // Select words that relate to the feeling or use emotional defaults
  const word1 = feelingWords[0] || wordPool[0];
  const word2 = feelingWords[1] || wordPool[1];
  const word3 = feelingWords[2] || wordPool[2];
  const word4 = whisperWords[0] || wordPool[3];
  const word5 = whisperWords[1] || wordPool[4];
  
  return `${whisper}
${anchor}
${word1}
holds
what
${anchor}
cannot
${word2}
in
${anchor}
${whisper}`;
}