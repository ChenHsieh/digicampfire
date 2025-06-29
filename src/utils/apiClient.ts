const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function transformHeadlineToPoetry(headline: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using fallback transformation');
    return transformHeadlineFallback(headline);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a poetic transformer. Transform news headlines into beautiful, evocative phrases that capture the essence while being more poetic and mysterious. Keep it concise (1-2 lines max). Focus on emotion and imagery rather than facts.'
          },
          {
            role: 'user',
            content: `Transform this headline into a poetic phrase: "${headline}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || transformHeadlineFallback(headline);
  } catch (error) {
    console.error('Error transforming headline:', error);
    return transformHeadlineFallback(headline);
  }
}

function transformHeadlineFallback(headline: string): string {
  // Simple fallback transformation when API is not available
  const poeticTransformations = [
    { from: /breaking news?:?\s*/i, to: 'whispers emerge: ' },
    { from: /reports?\s+/i, to: 'tales speak of ' },
    { from: /announces?\s+/i, to: 'declares to the winds ' },
    { from: /says?\s+/i, to: 'murmurs ' },
    { from: /according to\s+/i, to: 'as told by ' },
    { from: /officials?\s+/i, to: 'guardians ' },
    { from: /government\s+/i, to: 'the realm ' },
    { from: /company\s+/i, to: 'the guild ' },
    { from: /market\s+/i, to: 'the bazaar ' },
    { from: /economy\s+/i, to: 'the great exchange ' },
    { from: /technology\s+/i, to: 'the digital realm ' },
    { from: /climate\s+/i, to: 'nature\'s breath ' },
    { from: /war\s+/i, to: 'the shadow of conflict ' },
    { from: /peace\s+/i, to: 'the dove\'s song ' }
  ];

  let transformed = headline;
  
  poeticTransformations.forEach(({ from, to }) => {
    transformed = transformed.replace(from, to);
  });

  // Capitalize first letter and ensure it ends with appropriate punctuation
  transformed = transformed.charAt(0).toUpperCase() + transformed.slice(1);
  if (!/[.!?]$/.test(transformed)) {
    transformed += '...';
  }

  return transformed;
}

export async function generateAnchors(feeling: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using fallback anchors');
    return generateAnchorsFallback(feeling);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a poetry anchor generator. Generate 6 evocative, single-word anchors that relate to the given feeling. These should be concrete nouns that can serve as focal points for poetry. Return only the words, separated by commas.'
          },
          {
            role: 'user',
            content: `Generate 6 poetic anchors for the feeling: "${feeling}"`
          }
        ],
        max_tokens: 50,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const anchorsText = data.choices[0]?.message?.content?.trim();
    
    if (anchorsText) {
      return anchorsText.split(',').map(anchor => anchor.trim()).filter(anchor => anchor.length > 0);
    }
    
    return generateAnchorsFallback(feeling);
  } catch (error) {
    console.error('Error generating anchors:', error);
    return generateAnchorsFallback(feeling);
  }
}

function generateAnchorsFallback(feeling: string): string[] {
  const anchorSets = {
    joy: ['sunlight', 'laughter', 'wings', 'dance', 'bloom', 'spark'],
    sadness: ['rain', 'shadow', 'tears', 'mist', 'echo', 'drift'],
    anger: ['fire', 'storm', 'thunder', 'blade', 'volcano', 'lightning'],
    fear: ['darkness', 'whisper', 'maze', 'fog', 'abyss', 'tremor'],
    love: ['heart', 'embrace', 'rose', 'moon', 'kiss', 'warmth'],
    hope: ['dawn', 'star', 'bridge', 'seed', 'light', 'horizon'],
    peace: ['river', 'dove', 'silence', 'meadow', 'breath', 'calm'],
    wonder: ['cosmos', 'mystery', 'dream', 'magic', 'infinite', 'discovery'],
    nostalgia: ['memory', 'photograph', 'autumn', 'music', 'childhood', 'sunset'],
    excitement: ['adventure', 'journey', 'leap', 'celebration', 'energy', 'freedom']
  };

  // Find the closest matching feeling or use a default set
  const feelingLower = feeling.toLowerCase();
  for (const [key, anchors] of Object.entries(anchorSets)) {
    if (feelingLower.includes(key) || key.includes(feelingLower)) {
      return anchors;
    }
  }

  // Default anchors if no match found
  return ['mystery', 'journey', 'dream', 'whisper', 'light', 'shadow'];
}

export async function generatePoem(whisper: string, anchor: string, feeling?: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using fallback poem generation');
    return generatePoemFallback(whisper, anchor, feeling);
  }

  try {
    const feelingContext = feeling ? ` The overall feeling should be: ${feeling}.` : '';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a master poet. Create a beautiful, evocative poem based on the given whisper (inspiration) and anchor (focal point). The poem should be 8-12 lines long, with rich imagery and emotional depth. Use varied line lengths and avoid forced rhymes - focus on natural flow and powerful imagery.${feelingContext}`
          },
          {
            role: 'user',
            content: `Create a poem inspired by: "${whisper}" with the anchor word: "${anchor}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || generatePoemFallback(whisper, anchor, feeling);
  } catch (error) {
    console.error('Error generating poem:', error);
    return generatePoemFallback(whisper, anchor, feeling);
  }
}

function generatePoemFallback(whisper: string, anchor: string, feeling?: string): string {
  // Simple template-based poem generation as fallback
  const templates = [
    `In the quiet moments when ${whisper.toLowerCase()},
I find myself drawn to ${anchor},
Like a moth to flame,
Like a river to the sea.

The world whispers secrets
Through ${anchor}'s gentle presence,
And I listen,
Heart open to the mystery.`,

    `${anchor} stands before me,
A testament to ${whisper.toLowerCase()}.
In its shadow, I discover
What words cannot capture.

Time moves differently here,
Where ${anchor} meets the soul,
And every breath becomes
A prayer, a promise, a poem.`,

    `They say ${whisper.toLowerCase()},
But I see only ${anchor}—
Constant, beautiful, true.

In this moment,
Between heartbeats,
Between thoughts,
${anchor} teaches me
The language of being.`
  ];

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate;
}

export async function validatePoem(poem: string): Promise<{ isValid: boolean; feedback?: string }> {
  // Simple validation logic since we can't use the Netlify function
  const lines = poem.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 4) {
    return {
      isValid: false,
      feedback: 'Poem should have at least 4 lines for better expression.'
    };
  }

  if (poem.length < 50) {
    return {
      isValid: false,
      feedback: 'Poem seems too short. Consider adding more imagery and emotion.'
    };
  }

  if (poem.length > 1000) {
    return {
      isValid: false,
      feedback: 'Poem is quite long. Consider condensing for more impact.'
    };
  }

  return { isValid: true };
}