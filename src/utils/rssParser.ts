import { transformHeadlineToPoetry } from './openai';

interface RSSEntry {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface ParsedFeed {
  entries: RSSEntry[];
}

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
}

export async function fetchGuardianHeadlines(): Promise<string[]> {
  try {
    // Try direct fetch first (works in some environments)
    let response: Response;
    
    try {
      response = await fetch('https://www.theguardian.com/world/rss', {
        mode: 'cors',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
        }
      });
    } catch (corsError) {
      // If direct fetch fails due to CORS, try with a proxy
      response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.theguardian.com/world/rss'));
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    let xmlText: string;
    
    // Handle allorigins.win response format
    if (response.url.includes('allorigins.win')) {
      const jsonResponse = await response.json();
      xmlText = jsonResponse.contents;
    } else {
      xmlText = await response.text();
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing failed');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const headlines: string[] = [];
    
    // Get all available headlines
    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].querySelector('title');
      if (titleElement && titleElement.textContent) {
        headlines.push(titleElement.textContent.trim());
      }
    }
    
    if (headlines.length === 0) {
      throw new Error('No headlines found in RSS feed');
    }
    
    return headlines;
  } catch (error) {
    console.warn('RSS fetch failed, using fallback headlines:', error.message);
    // Fallback to static topics if RSS fetch fails
    return [
      'Global climate summit reaches historic agreement on emissions',
      'Technology companies announce breakthrough in renewable energy',
      'International cooperation strengthens amid global challenges',
      'Cultural preservation efforts gain momentum worldwide',
      'Economic recovery shows promising signs across regions',
      'Healthcare innovations improve access to treatment',
      'Educational initiatives bridge digital divide',
      'Environmental conservation projects expand globally',
      'Scientific research reveals new insights into sustainability',
      'Community movements foster social change'
    ];
  }
}

export async function fetchPoeticWhispersWithSources(): Promise<WhisperWithSource[]> {
  // Define high-quality fallback options
  const fallbackOptions = [
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
    },
    {
      poetic: "Echoes of tomorrow's promise",
      headline: "Innovation continues to reshape our daily lives",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "The silence between heartbeats",
      headline: "Personal stories emerge from global events",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "Fragments of a changing world",
      headline: "Social movements adapt to modern challenges",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "Whispers of distant thunder",
      headline: "Environmental changes reshape communities",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "The edge of unremembered heat",
      headline: "Climate scientists warn of tipping points",
      link: "https://www.theguardian.com"
    },
    {
      poetic: "Inheritance of the burning sky",
      headline: "Future generations face environmental challenges",
      link: "https://www.theguardian.com"
    }
  ];

  try {
    // Try to fetch real headlines first
    const headlines = await fetchGuardianHeadlines();
    
    // If we got real headlines, try to transform them
    if (headlines.length > 0) {
      console.log(`Fetched ${headlines.length} real headlines, transforming to poetry...`);
      
      // Randomly select 3 headlines
      const shuffled = [...headlines];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const selectedHeadlines = shuffled.slice(0, 3);
      const whispers: WhisperWithSource[] = [];
      
      // Transform each headline to poetry
      for (const headline of selectedHeadlines) {
        try {
          console.log(`Transforming: "${headline}"`);
          const poeticPhrase = await transformHeadlineToPoetry(headline);
          console.log(`Result: "${poeticPhrase}"`);
          
          whispers.push({
            poetic: poeticPhrase,
            headline: headline,
            link: "https://www.theguardian.com"
          });
        } catch (transformError) {
          console.warn('Failed to transform headline, using fallback:', transformError.message);
          // If transformation fails, use a fallback whisper
          const fallback = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
          whispers.push(fallback);
        }
      }
      
      // If we successfully created whispers, return them
      if (whispers.length >= 3) {
        console.log(`Successfully created ${whispers.length} whispers from real headlines`);
        return whispers;
      }
    }
    
    // If we reach here, something went wrong, use fallbacks
    console.info('Using curated poetic whispers');
    return getRandomFallbackWhispers(fallbackOptions);
    
  } catch (error) {
    console.info('RSS processing failed, using curated whispers:', error.message);
    return getRandomFallbackWhispers(fallbackOptions);
  }
}

function getRandomFallbackWhispers(fallbackOptions: WhisperWithSource[]): WhisperWithSource[] {
  // Randomly select 3 from fallback options using proper shuffling
  const shuffled = [...fallbackOptions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

export async function fetchPoeticWhispers(): Promise<string[]> {
  try {
    const whispersWithSources = await fetchPoeticWhispersWithSources();
    return whispersWithSources.map(w => w.poetic);
  } catch (error) {
    console.error('Error creating poetic whispers:', error);
    // Fallback to static poetic phrases
    return [
      "The weight of unspoken words",
      "A memory that refuses to fade", 
      "The space between what was and what could be"
    ];
  }
}