// Helper functions for the Digital Campfire app

export interface OrbColor {
  primary: string;
  secondary: string;
  dark: string;
}

export function generateRandomOrbColor(): OrbColor {
  const colorPalettes = [
    // Orange/Amber tones
    {
      primary: 'rgba(194, 65, 12, 0.6)',
      secondary: 'rgba(251, 146, 60, 0.5)',
      dark: 'rgba(124, 45, 18, 0.8)'
    },
    {
      primary: 'rgba(217, 119, 6, 0.6)',
      secondary: 'rgba(252, 176, 64, 0.5)',
      dark: 'rgba(146, 64, 14, 0.8)'
    },
    // Dark green tones
    {
      primary: 'rgba(34, 197, 94, 0.6)',
      secondary: 'rgba(74, 222, 128, 0.5)',
      dark: 'rgba(20, 83, 45, 0.8)'
    },
    {
      primary: 'rgba(22, 163, 74, 0.6)',
      secondary: 'rgba(134, 239, 172, 0.5)',
      dark: 'rgba(21, 128, 61, 0.8)'
    },
    // Mixed orange-green
    {
      primary: 'rgba(194, 65, 12, 0.6)',
      secondary: 'rgba(34, 197, 94, 0.5)',
      dark: 'rgba(45, 45, 55, 0.8)'
    },
    {
      primary: 'rgba(34, 197, 94, 0.6)',
      secondary: 'rgba(217, 119, 6, 0.5)',
      dark: 'rgba(55, 65, 81, 0.8)'
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