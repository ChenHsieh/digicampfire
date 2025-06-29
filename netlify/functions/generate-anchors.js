const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ANCHOR_WORDS_PROMPT = `Generate 6 powerful, single-word verbs that could serve as anchor words in poetry. These should be:
- Action words that can be repeated meaningfully
- Emotionally resonant
- Simple but profound
- Suitable for contemplative poetry
- One word each, lowercase

Examples: breathe, release, become, hold, listen, remember

Return only the 6 words, one per line.`;

function getRandomBaseAnchors() {
  const baseWords = [
    "breathe", "release", "become", "hold", "listen", "remember",
    "forgive", "trust", "surrender", "witness", "embrace", "flow",
    "gather", "whisper", "dance", "rest", "bloom", "heal"
  ];
  
  // Shuffle and return 6 words
  const shuffled = [...baseWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: ANCHOR_WORDS_PROMPT
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
    const result = words.length >= 6 ? words.slice(0, 6) : getRandomBaseAnchors();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };

  } catch (error) {
    console.error('Error generating anchor words:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: getRandomBaseAnchors() })
    };
  }
};