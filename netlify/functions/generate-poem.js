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