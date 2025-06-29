// Client-side API functions that call Netlify Functions

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

const API_BASE = '/.netlify/functions';

export async function transformHeadlineToPoetry(headline: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/transform-headline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ headline })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error transforming headline:', error);
    // Fallback logic
    return createPoetricFallback(headline);
  }
}

function createPoetricFallback(headline: string): string {
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

export async function generateAnchorWords(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/generate-anchors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
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
  
  const shuffled = [...baseWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/generate-poem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ whisper, anchor, feeling })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    return createFallbackSkinnyPoem(whisper, anchor, feeling);
  }
}

function createFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
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

export async function validateSkinnyPoem(poem: string, anchor: string): Promise<{ isValid: boolean; issues: string[] }> {
  try {
    const response = await fetch(`${API_BASE}/validate-poem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ poem, anchor })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      isValid: data.isValid,
      issues: data.issues || []
    };
  } catch (error) {
    console.error('Error validating poem:', error);
    // Fallback to basic client-side validation
    return clientSideValidation(poem, anchor);
  }
}

function clientSideValidation(poem: string, anchor: string): { isValid: boolean; issues: string[] } {
  const lines = poem.split('\n').filter(line => line.trim() !== '');
  const issues: string[] = [];

  if (lines.length !== 11) {
    issues.push(`Must have exactly 11 lines (found ${lines.length})`);
  }

  if (lines.length >= 11) {
    for (let i = 1; i <= 9; i++) {
      if (lines[i] && lines[i].trim().split(/\s+/).length > 1) {
        issues.push(`Line ${i + 1} must be a single word`);
      }
    }

    const anchorPositions = [1, 5, 9];
    for (const pos of anchorPositions) {
      if (lines[pos] && lines[pos].trim().toLowerCase() !== anchor.toLowerCase()) {
        issues.push(`Line ${pos + 1} must be the anchor word "${anchor}"`);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

// Keep backward compatibility
export async function generatePoem(whisper: string, anchor: string, feeling: string): Promise<string> {
  return generateSkinnyPoem(whisper, anchor, feeling);
}