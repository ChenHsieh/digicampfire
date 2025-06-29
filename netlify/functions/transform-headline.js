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
  
  // Climate and Environment
  if (lowerHeadline.includes('climate') || lowerHeadline.includes('environment') || 
      lowerHeadline.includes('warming') || lowerHeadline.includes('carbon') ||
      lowerHeadline.includes('pollution') || lowerHeadline.includes('green') ||
      lowerHeadline.includes('renewable') || lowerHeadline.includes('fossil')) {
    const options = [
      "the weight of tomorrow's sky",
      "echoes of melting time",
      "the breath of ancient storms",
      "fragments of a burning world",
      "the silence after rain",
      "whispers from the deep ice"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // War, Conflict, Violence
  if (lowerHeadline.includes('war') || lowerHeadline.includes('conflict') || 
      lowerHeadline.includes('attack') || lowerHeadline.includes('violence') ||
      lowerHeadline.includes('military') || lowerHeadline.includes('battle') ||
      lowerHeadline.includes('terror') || lowerHeadline.includes('bomb')) {
    const options = [
      "echoes of distant thunder",
      "the weight of broken promises",
      "shadows dancing on steel",
      "the silence between gunshots",
      "fragments of shattered peace",
      "the color of forgotten names"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Economy, Finance, Markets
  if (lowerHeadline.includes('economy') || lowerHeadline.includes('market') || 
      lowerHeadline.includes('financial') || lowerHeadline.includes('bank') ||
      lowerHeadline.includes('inflation') || lowerHeadline.includes('recession') ||
      lowerHeadline.includes('trade') || lowerHeadline.includes('stock')) {
    const options = [
      "the pulse of uncertain tides",
      "numbers that breathe and sigh",
      "the weight of empty pockets",
      "echoes from counting houses",
      "the rhythm of rising prices",
      "dreams measured in coins"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Technology, Digital, AI
  if (lowerHeadline.includes('technology') || lowerHeadline.includes('digital') || 
      lowerHeadline.includes('internet') || lowerHeadline.includes('cyber') ||
      lowerHeadline.includes('artificial') || lowerHeadline.includes('robot') ||
      lowerHeadline.includes('data') || lowerHeadline.includes('algorithm')) {
    const options = [
      "fragments of electric dreams",
      "the hum of silicon thoughts",
      "echoes in the digital void",
      "the weight of invisible threads",
      "whispers from glowing screens",
      "the pulse of binary hearts"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Health, Medical, Disease
  if (lowerHeadline.includes('health') || lowerHeadline.includes('medical') || 
      lowerHeadline.includes('disease') || lowerHeadline.includes('virus') ||
      lowerHeadline.includes('hospital') || lowerHeadline.includes('treatment') ||
      lowerHeadline.includes('vaccine') || lowerHeadline.includes('pandemic')) {
    const options = [
      "whispers of healing light",
      "the weight of borrowed time",
      "echoes from sterile halls",
      "fragments of mended bone",
      "the pulse of quiet recovery",
      "shadows in white corridors"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Politics, Government, Elections
  if (lowerHeadline.includes('politic') || lowerHeadline.includes('government') || 
      lowerHeadline.includes('election') || lowerHeadline.includes('vote') ||
      lowerHeadline.includes('parliament') || lowerHeadline.includes('congress') ||
      lowerHeadline.includes('minister') || lowerHeadline.includes('president')) {
    const options = [
      "the weight of spoken promises",
      "echoes from marble halls",
      "fragments of public trust",
      "the silence between speeches",
      "whispers behind closed doors",
      "the color of campaign dreams"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Education, Schools, Learning
  if (lowerHeadline.includes('education') || lowerHeadline.includes('school') || 
      lowerHeadline.includes('student') || lowerHeadline.includes('university') ||
      lowerHeadline.includes('teacher') || lowerHeadline.includes('learning') ||
      lowerHeadline.includes('academic') || lowerHeadline.includes('college')) {
    const options = [
      "the weight of unlearned lessons",
      "echoes from empty classrooms",
      "fragments of forgotten wisdom",
      "the silence of turning pages",
      "whispers from dusty chalkboards",
      "dreams written in pencil"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Sports, Competition, Games
  if (lowerHeadline.includes('sport') || lowerHeadline.includes('game') || 
      lowerHeadline.includes('match') || lowerHeadline.includes('team') ||
      lowerHeadline.includes('player') || lowerHeadline.includes('champion') ||
      lowerHeadline.includes('olympic') || lowerHeadline.includes('football')) {
    const options = [
      "the weight of final scores",
      "echoes from empty stadiums",
      "fragments of victory songs",
      "the silence after the whistle",
      "dreams measured in seconds",
      "the pulse of competing hearts"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Culture, Arts, Entertainment
  if (lowerHeadline.includes('culture') || lowerHeadline.includes('art') || 
      lowerHeadline.includes('music') || lowerHeadline.includes('film') ||
      lowerHeadline.includes('book') || lowerHeadline.includes('museum') ||
      lowerHeadline.includes('festival') || lowerHeadline.includes('celebrity')) {
    const options = [
      "the weight of unsung melodies",
      "echoes from darkened theaters",
      "fragments of painted light",
      "the silence between notes",
      "whispers from gallery walls",
      "dreams captured in frames"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Travel, Tourism, Transportation
  if (lowerHeadline.includes('travel') || lowerHeadline.includes('tourism') || 
      lowerHeadline.includes('flight') || lowerHeadline.includes('airport') ||
      lowerHeadline.includes('train') || lowerHeadline.includes('transport') ||
      lowerHeadline.includes('border') || lowerHeadline.includes('journey')) {
    const options = [
      "the weight of distant shores",
      "echoes from departure gates",
      "fragments of foreign skies",
      "the silence between destinations",
      "whispers from empty roads",
      "dreams packed in suitcases"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Generic fallbacks for unmatched headlines
  const genericOptions = [
    "the space between what was and what could be",
    "echoes of unspoken truths",
    "the weight of morning shadows",
    "fragments of yesterday's light",
    "whispers from the edge of time",
    "the silence that holds everything",
    "dreams written in disappearing ink",
    "the pulse of hidden currents",
    "echoes from the space between",
    "the weight of untold stories",
    "fragments of borrowed time",
    "whispers from the deep quiet",
    "the color of fading memories",
    "echoes in the space we leave",
    "the weight of what remains unsaid"
  ];
  
  return genericOptions[Math.floor(Math.random() * genericOptions.length)];
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