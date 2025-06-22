// Helper functions for the Digital Campfire app

export interface OrbColor {
  primary: string;
  secondary: string;
  dark: string;
}

export function generateRandomOrbColor(): OrbColor {
  const colorPalettes = [
    // Bright orange tones
    {
      primary: 'rgba(234, 88, 12, 0.6)',
      secondary: 'rgba(251, 146, 60, 0.5)',
      dark: 'rgba(124, 45, 18, 0.8)'
    },
    {
      primary: 'rgba(249, 115, 22, 0.6)',
      secondary: 'rgba(253, 186, 116, 0.5)',
      dark: 'rgba(154, 52, 18, 0.8)'
    },
    // Vibrant green tones
    {
      primary: 'rgba(34, 197, 94, 0.6)',
      secondary: 'rgba(74, 222, 128, 0.5)',
      dark: 'rgba(20, 83, 45, 0.8)'
    },
    {
      primary: 'rgba(16, 185, 129, 0.6)',
      secondary: 'rgba(110, 231, 183, 0.5)',
      dark: 'rgba(6, 78, 59, 0.8)'
    },
    // Warm amber-orange
    {
      primary: 'rgba(245, 158, 11, 0.6)',
      secondary: 'rgba(252, 211, 77, 0.5)',
      dark: 'rgba(146, 64, 14, 0.8)'
    },
    // Forest green
    {
      primary: 'rgba(5, 150, 105, 0.6)',
      secondary: 'rgba(52, 211, 153, 0.5)',
      dark: 'rgba(4, 120, 87, 0.8)'
    }
  ];

  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
}

export function getRandomBaseAnchors(): string[] {
  const baseWords = [
    "breathe", "release", "become", "hold", "listen", "remember",
    "forgive", "trust", "surrender", "witness", "embrace", "flow",
    "gather", "whisper", "dance", "rest", "bloom", "heal"
  ];
  
  // Shuffle and return 6 words using Fisher-Yates algorithm
  const shuffled = [...baseWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 6);
}

export function createFallbackSkinnyPoem(whisper: string, anchor: string, feeling: string): string {
  // Create a more sophisticated fallback based on the feeling
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