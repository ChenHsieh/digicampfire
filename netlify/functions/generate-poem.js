const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SKINNY_POEM_PROMPT = (whisper, anchor, feeling) => `You are a master of Skinny poetry. Create a Skinny poem following this EXACT structure:

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

function createFallbackSkinnyPoem(whisper, anchor, feeling) {
  // Enhanced fallback poem generation with better word extraction
  const extractMeaningfulWords = (text) => {
    const stopWords = new Set([
      'the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'from', 
      'they', 'have', 'been', 'will', 'would', 'could', 'should', 'can',
      'may', 'might', 'must', 'shall', 'was', 'were', 'is', 'am', 'be',
      'do', 'does', 'did', 'has', 'had', 'get', 'got', 'go', 'went',
      'come', 'came', 'see', 'saw', 'know', 'knew', 'think', 'thought',
      'say', 'said', 'tell', 'told', 'give', 'gave', 'take', 'took',
      'make', 'made', 'find', 'found', 'want', 'need', 'feel', 'felt',
      'look', 'looked', 'seem', 'seemed', 'turn', 'turned', 'put', 'set'
    ]);

    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        word.length < 12 && 
        !stopWords.has(word) &&
        /^[a-z]+$/.test(word)
      );
  };

  // Extract words from whisper and feeling
  const whisperWords = extractMeaningfulWords(whisper);
  const feelingWords = feeling ? extractMeaningfulWords(feeling) : [];
  
  // Combine and prioritize words
  const allWords = [...feelingWords, ...whisperWords];
  
  // Select words for the poem structure
  const getWordForPosition = (position) => {
    const emotionalWords = ['silence', 'shadow', 'light', 'breath', 'heart', 'soul', 'dream', 'hope', 'fear', 'love', 'pain', 'joy', 'peace', 'storm', 'calm'];
    const actionWords = ['holds', 'carries', 'whispers', 'echoes', 'flows', 'breaks', 'mends', 'grows', 'fades', 'shines', 'trembles', 'settles'];
    const descriptiveWords = ['gentle', 'fierce', 'quiet', 'deep', 'soft', 'sharp', 'warm', 'cool', 'bright', 'dark', 'heavy', 'light'];
    
    // Use extracted words when available, fall back to curated lists
    if (allWords.length > position && allWords[position]) {
      return allWords[position];
    }
    
    // Select appropriate word type based on position in poem
    switch (position % 3) {
      case 0: return emotionalWords[Math.floor(Math.random() * emotionalWords.length)];
      case 1: return actionWords[Math.floor(Math.random() * actionWords.length)];
      case 2: return descriptiveWords[Math.floor(Math.random() * descriptiveWords.length)];
      default: return emotionalWords[Math.floor(Math.random() * emotionalWords.length)];
    }
  };

  // Build the poem with more sophisticated word selection
  const line3 = getWordForPosition(0);
  const line4 = getWordForPosition(1);
  const line5 = getWordForPosition(2);
  const line7 = getWordForPosition(3);
  const line8 = getWordForPosition(4);
  const line9 = getWordForPosition(5);

  // Create slight variation for the final line
  const finalLine = whisper.includes('the ') ? 
    whisper.replace('the ', 'this ') : 
    whisper;

  return `${whisper}
${anchor}
${line3}
${line4}
${line5}
${anchor}
${line7}
${line8}
${line9}
${anchor}
${finalLine}`;
}

async function validateSkinnyPoem(poem, anchor) {
  const lines = poem.split('\n').filter(line => line.trim() !== '');
  const issues = [];

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

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { whisper, anchor, feeling } = JSON.parse(event.body);

    if (!whisper || !anchor) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Whisper and anchor are required' })
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SKINNY_POEM_PROMPT(whisper, anchor, feeling)
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
      throw new Error('No content returned from OpenAI');
    }

    // Validate the generated poem
    const validation = await validateSkinnyPoem(content, anchor);
    
    if (!validation.isValid) {
      console.warn('Generated poem failed validation:', validation.issues);
      const fallback = createFallbackSkinnyPoem(whisper, anchor, feeling);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ result: fallback })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: content })
    };

  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    
    const { whisper, anchor, feeling } = JSON.parse(event.body);
    const fallback = createFallbackSkinnyPoem(whisper, anchor, feeling);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: fallback })
    };
  }
};