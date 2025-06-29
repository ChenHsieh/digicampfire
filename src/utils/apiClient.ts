// Client-side API functions that call Netlify Functions

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
  source: 'openai' | 'fallback';
}

interface ApiResponse<T> {
  result: T;
  source: 'openai' | 'fallback';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  source: 'openai' | 'fallback';
}

const API_BASE = '/.netlify/functions';

// Cache configuration
const CACHE_DURATION = {
  WHISPERS: 2 * 60 * 60 * 1000, // 2 hours for whispers (news changes throughout day)
  ANCHORS: 24 * 60 * 60 * 1000,  // 24 hours for anchor words (less time-sensitive)
  POEMS: 0 // No caching for poems (always unique to user input)
};

// Cache management utilities
function getCacheKey(type: string, input?: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  switch (type) {
    case 'whispers':
      return `digitalCampfire_whispers_${today}`;
    case 'anchors':
      return `digitalCampfire_anchors_${today}`;
    case 'headlines':
      return `digitalCampfire_headline_${btoa(input || '').slice(0, 20)}`;
    default:
      return `digitalCampfire_${type}`;
  }
}

function getCachedData<T>(cacheKey: string, maxAge: number): T | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const isExpired = Date.now() - entry.timestamp > maxAge;
    
    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    console.log(`📦 Using cached data for ${cacheKey} (source: ${entry.source})`);
    return entry.data;
  } catch (error) {
    console.warn('Error reading cache:', error);
    return null;
  }
}

function setCachedData<T>(cacheKey: string, data: T, source: 'openai' | 'fallback'): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      source
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
    console.log(`💾 Cached data for ${cacheKey} (source: ${source})`);
  } catch (error) {
    console.warn('Error writing to cache:', error);
  }
}

export async function transformHeadlineToPoetry(headline: string): Promise<ApiResponse<string>> {
  // Check cache first
  const cacheKey = getCacheKey('headlines', headline);
  const cached = getCachedData<ApiResponse<string>>(cacheKey, CACHE_DURATION.WHISPERS);
  
  if (cached) {
    return cached;
  }

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
    const result: ApiResponse<string> = {
      result: data.result,
      source: 'openai'
    };

    // Cache the successful result
    setCachedData(cacheKey, result, 'openai');
    return result;
  } catch (error) {
    console.error('Error transforming headline:', error);
    // Fallback logic
    const result: ApiResponse<string> = {
      result: createPoetricFallback(headline),
      source: 'fallback'
    };

    // Cache fallback result with shorter duration
    setCachedData(cacheKey, result, 'fallback');
    return result;
  }
}

function createPoetricFallback(headline: string): string {
  const lowerHeadline = headline.toLowerCase();
  
  // Enhanced fallback with more nuanced categorization
  const categories = [
    {
      keywords: ['climate', 'environment', 'warming', 'carbon', 'pollution', 'green', 'renewable', 'fossil', 'weather', 'temperature'],
      phrases: [
        "the weight of tomorrow's sky",
        "echoes of melting time",
        "the breath of ancient storms",
        "fragments of a burning world",
        "the silence after rain",
        "whispers from the deep ice",
        "the color of changing seasons",
        "echoes from the warming earth"
      ]
    },
    {
      keywords: ['war', 'conflict', 'attack', 'violence', 'military', 'battle', 'terror', 'bomb', 'peace', 'security'],
      phrases: [
        "echoes of distant thunder",
        "the weight of broken promises",
        "shadows dancing on steel",
        "the silence between gunshots",
        "fragments of shattered peace",
        "the color of forgotten names",
        "whispers from the battlefield",
        "the weight of unspoken grief"
      ]
    },
    {
      keywords: ['economy', 'market', 'financial', 'bank', 'inflation', 'recession', 'trade', 'stock', 'money', 'cost'],
      phrases: [
        "the pulse of uncertain tides",
        "numbers that breathe and sigh",
        "the weight of empty pockets",
        "echoes from counting houses",
        "the rhythm of rising prices",
        "dreams measured in coins",
        "the silence of closed doors",
        "fragments of borrowed time"
      ]
    },
    {
      keywords: ['technology', 'digital', 'internet', 'cyber', 'artificial', 'robot', 'data', 'algorithm', 'ai', 'computer'],
      phrases: [
        "fragments of electric dreams",
        "the hum of silicon thoughts",
        "echoes in the digital void",
        "the weight of invisible threads",
        "whispers from glowing screens",
        "the pulse of binary hearts",
        "shadows in the cloud",
        "the silence between clicks"
      ]
    },
    {
      keywords: ['health', 'medical', 'disease', 'virus', 'hospital', 'treatment', 'vaccine', 'pandemic', 'doctor', 'medicine'],
      phrases: [
        "whispers of healing light",
        "the weight of borrowed time",
        "echoes from sterile halls",
        "fragments of mended bone",
        "the pulse of quiet recovery",
        "shadows in white corridors",
        "the silence of waiting rooms",
        "echoes of gentle hands"
      ]
    },
    {
      keywords: ['politic', 'government', 'election', 'vote', 'parliament', 'congress', 'minister', 'president', 'democracy', 'policy'],
      phrases: [
        "the weight of spoken promises",
        "echoes from marble halls",
        "fragments of public trust",
        "the silence between speeches",
        "whispers behind closed doors",
        "the color of campaign dreams",
        "shadows on ballot papers",
        "the pulse of collective will"
      ]
    }
  ];

  // Find matching category
  for (const category of categories) {
    if (category.keywords.some(keyword => lowerHeadline.includes(keyword))) {
      const randomPhrase = category.phrases[Math.floor(Math.random() * category.phrases.length)];
      return randomPhrase;
    }
  }
  
  // Enhanced generic fallbacks
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
    "the weight of what remains unsaid",
    "shadows dancing on water",
    "the silence between heartbeats",
    "fragments of distant music",
    "whispers from the threshold",
    "the weight of gentle hands"
  ];
  
  return genericOptions[Math.floor(Math.random() * genericOptions.length)];
}

export async function generateAnchorWords(): Promise<ApiResponse<string[]>> {
  // Check cache first
  const cacheKey = getCacheKey('anchors');
  const cached = getCachedData<ApiResponse<string[]>>(cacheKey, CACHE_DURATION.ANCHORS);
  
  if (cached) {
    return cached;
  }

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
    const result: ApiResponse<string[]> = {
      result: data.result,
      source: 'openai'
    };

    // Cache the successful result
    setCachedData(cacheKey, result, 'openai');
    return result;
  } catch (error) {
    console.error('Error generating anchor words:', error);
    const result: ApiResponse<string[]> = {
      result: getRandomBaseAnchors(),
      source: 'fallback'
    };

    // Cache fallback result
    setCachedData(cacheKey, result, 'fallback');
    return result;
  }
}

function getRandomBaseAnchors(): string[] {
  const baseWords = [
    "breathe", "release", "become", "hold", "listen", "remember",
    "forgive", "trust", "surrender", "witness", "embrace", "flow",
    "gather", "whisper", "dance", "rest", "bloom", "heal",
    "wander", "settle", "reach", "return", "carry", "release",
    "kindle", "shelter", "nurture", "discover", "cherish", "honor"
  ];
  
  const shuffled = [...baseWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

export async function generateSkinnyPoem(whisper: string, anchor: string, feeling: string): Promise<ApiResponse<string>> {
  // No caching for poems as they should be unique to user input
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
    return {
      result: data.result,
      source: 'openai'
    };
  } catch (error) {
    console.error('Error generating Skinny poem:', error);
    return {
      result: createFallbackSkinnyPoem(whisper, anchor, feeling),
      source: 'fallback'
    };
  }
}

function createFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
  // Enhanced fallback poem generation with better word extraction
  const extractMeaningfulWords = (text: string): string[] => {
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
  const getWordForPosition = (position: number): string => {
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
  const response = await generateSkinnyPoem(whisper, anchor, feeling);
  return response.result;
}