const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const POEM_VALIDATION_PROMPT = (poem, anchor) => `You are a poetry quality auditor for Skinny poems. Analyze if the poem maintains a single dominant sensory image throughout and follows Skinny poem structure (11 lines, single words in lines 2-10, repeated anchor word in positions 2, 6, 10).

Reply with YES/NO and if NO, suggest one specific edit to improve coherence while maintaining Skinny poem structure.

Does this Skinny poem maintain good structure and coherent imagery? Reply YES/NO & suggest one edit if needed:

${poem}`;

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
    const { poem, anchor } = JSON.parse(event.body);

    if (!poem || !anchor) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Poem and anchor are required' })
      };
    }

    // First do structural validation
    const structuralValidation = await validateSkinnyPoem(poem, anchor);
    
    if (!structuralValidation.isValid) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isValid: false,
          issues: structuralValidation.issues
        })
      };
    }

    // Then do AI quality validation
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: POEM_VALIDATION_PROMPT(poem, anchor)
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isValid: isGood,
          issues: isGood ? [] : [suggestion || 'Consider revising for better coherence']
        })
      };

    } catch (aiError) {
      console.error('AI validation failed, using structural validation only:', aiError);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isValid: true,
          issues: []
        })
      };
    }

  } catch (error) {
    console.error('Error validating poem:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};