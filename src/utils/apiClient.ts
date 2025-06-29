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