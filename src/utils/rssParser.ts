import { transformHeadlineToPoetry } from './openai';

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

// Static fallback data that always works
const FALLBACK_HEADLINES = [
  'Political tensions rise as new policies spark debate',
  'Technology breakthrough promises to reshape industry', 
  'Climate scientists warn of accelerating environmental changes',
  'Cultural movements gain momentum across communities'
];

const FALLBACK_WHISPERS: WhisperWithSource[] = [
  {
    poetic: "The weight of unspoken words",
    headline: "Global tensions continue to shape international discourse",
    link: "https://www.theguardian.com"
  },
  {
    poetic: "A memory that refuses to fade", 
    headline: "Historical events continue to influence modern society",
    link: "https://www.theguardian.com"
  },
  {
    poetic: "The space between what was and what could be",
    headline: "Future possibilities emerge from current challenges",
    link: "https://www.theguardian.com"
  }
];

export async function fetchGuardianHeadlines(): Promise<string[]> {
  // For now, always return fallback data to ensure reliability
  // RSS fetching can be re-enabled later when we have a working solution
  return FALLBACK_HEADLINES;
}

export async function fetchPoeticWhispersWithSources(): Promise<WhisperWithSource[]> {
  // Try to enhance the fallback whispers with AI if possible
  try {
    const enhancedWhispers: WhisperWithSource[] = [];
    
    for (const fallback of FALLBACK_WHISPERS) {
      try {
        const poeticPhrase = await transformHeadlineToPoetry(fallback.headline);
        enhancedWhispers.push({
          poetic: poeticPhrase,
          headline: fallback.headline,
          link: fallback.link
        });
      } catch (error) {
        // If AI enhancement fails, use the original fallback
        enhancedWhispers.push(fallback);
      }
    }
    
    return enhancedWhispers;
  } catch (error) {
    console.log('Using static fallback whispers');
    return FALLBACK_WHISPERS;
  }
}

export async function fetchPoeticWhispers(): Promise<string[]> {
  try {
    const whispersWithSources = await fetchPoeticWhispersWithSources();
    return whispersWithSources.map(w => w.poetic);
  } catch (error) {
    console.log('Using static fallback whisper phrases');
    return FALLBACK_WHISPERS.map(w => w.poetic);
  }
}