const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const HEADLINE_TO_POETRY_PROMPT = `You are a poetic summarizer. Transform the given news headline into a short, emotionally ambiguous noun phrase (max 7 words). This phrase should be poetic, symbolic, and open-ended—suitable to serve as both the first and last line of a Skinny poem.

Guidelines:
• Do NOT summarize literally
• Avoid full sentences. Use abstract, metaphor-rich noun phrases instead
• Steer clear of specific names, places, or temporal references
• Prioritize symbolic weight, emotional texture, and interpretive openness
• Imagine the phrase as the title of a surreal painting
• avoid "whispers"
• don't include any quotation marks

Example:
Headline: "UN warns of irreversible climate tipping points"
Poetic phrase: "the edge of unremembered heat"`;

function createPoetricFallback(headline) {
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
    const { headline } = JSON.parse(event.body);

    if (!headline) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Headline is required' })
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: HEADLINE_TO_POETRY_PROMPT
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };

  } catch (error) {
    console.error('Error transforming headline:', error);
    
    // Use fallback if OpenAI fails
    const { headline } = JSON.parse(event.body);
    const fallback = createPoetricFallback(headline);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: fallback })
    };
  }
};