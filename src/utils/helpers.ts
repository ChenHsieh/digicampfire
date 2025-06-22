// Helper functions for the Digital Campfire app

export interface OrbColor {
  primary: string;
  secondary: string;
  dark: string;
}

export function generateRandomOrbColor(): OrbColor {
  const colorPalettes = [
    {
      primary: 'rgba(139, 125, 161, 0.6)',
      secondary: 'rgba(244, 194, 194, 0.5)',
      dark: 'rgba(45, 45, 55, 0.8)'
    },
    {
      primary: 'rgba(255, 183, 77, 0.6)',
      secondary: 'rgba(255, 138, 101, 0.5)',
      dark: 'rgba(139, 69, 19, 0.8)'
    },
    {
      primary: 'rgba(72, 187, 120, 0.6)',
      secondary: 'rgba(129, 230, 217, 0.5)',
      dark: 'rgba(26, 54, 93, 0.8)'
    },
    {
      primary: 'rgba(99, 102, 241, 0.6)',
      secondary: 'rgba(196, 181, 253, 0.5)',
      dark: 'rgba(55, 48, 163, 0.8)'
    },
    {
      primary: 'rgba(236, 72, 153, 0.6)',
      secondary: 'rgba(251, 207, 232, 0.5)',
      dark: 'rgba(157, 23, 77, 0.8)'
    },
    {
      primary: 'rgba(245, 101, 101, 0.6)',
      secondary: 'rgba(254, 202, 202, 0.5)',
      dark: 'rgba(153, 27, 27, 0.8)'
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