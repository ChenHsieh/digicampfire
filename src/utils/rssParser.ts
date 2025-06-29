import { transformHeadlineToPoetry, createPoetricFallback } from './apiClient';

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
  source: 'openai' | 'fallback';
}

// Multiple CORS proxy options for better reliability
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/get?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://cors-anywhere.herokuapp.com/'
];

async function fetchWithFallback(url: string): Promise<string> {
  const targetUrl = encodeURIComponent('https://www.theguardian.com/world/rss');
  
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      console.log(`Attempting to fetch with proxy ${i + 1}/${CORS_PROXIES.length}: ${proxy}`);
      
      const response = await fetch(`${proxy}${targetUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get response as text first
      const responseText = await response.text();
      
      if (!responseText || responseText.length < 100) {
        throw new Error('Response appears to be empty or too short');
      }
      
      // Try to parse as JSON first (for proxies that wrap the response)
      let xmlContent = '';
      try {
        const data = JSON.parse(responseText);
        
        // Handle different response formats from different proxies
        if (typeof data === 'string') {
          xmlContent = data;
        } else if (data.contents) {
          xmlContent = data.contents;
        } else if (data.body) {
          xmlContent = data.body;
        } else {
          throw new Error('Unexpected JSON response format');
        }
      } catch (jsonError) {
        // If JSON parsing fails, assume the response is raw XML
        console.log(`Response is not JSON, treating as raw XML`);
        xmlContent = responseText;
      }
      
      if (!xmlContent || xmlContent.length < 100) {
        throw new Error('XML content appears to be empty or too short');
      }
      
      console.log(`Successfully fetched RSS feed using proxy ${i + 1}`);
      return xmlContent;
      
    } catch (error) {
      console.warn(`Proxy ${i + 1} failed:`, error);
      
      // If this is the last proxy, throw the error
      if (i === CORS_PROXIES.length - 1) {
        throw new Error(`All CORS proxies failed. Last error: ${error}`);
      }
      
      // Continue to next proxy
      continue;
    }
  }
  
  throw new Error('All CORS proxies failed');
}

export async function fetchGuardianHeadlines(): Promise<string[]> {
  try {
    const xmlText = await fetchWithFallback('https://www.theguardian.com/world/rss');
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for XML parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse XML response');
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
    console.error('Error fetching Guardian headlines:', error);
    // Fallback to static topics if RSS fetch fails
    return [
      'Political tensions rise as new policies spark debate',
      'Technology breakthrough promises to reshape industry',
      'Climate scientists warn of accelerating environmental changes',
      'Cultural movements gain momentum across communities',
      'Economic indicators show mixed signals for global markets',
      'Healthcare innovations offer new treatment possibilities',
      'Educational reforms aim to address learning gaps',
      'Environmental conservation efforts expand worldwide'
    ];
  }
}

export async function fetchPoeticWhispersWithSources(): Promise<WhisperWithSource[]> {
  try {
    console.log('Fetching RSS feed...');
    const xmlText = await fetchWithFallback('https://www.theguardian.com/world/rss');
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for XML parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse XML response');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const allItems: { headline: string; link: string; pubDate: string }[] = [];
    
    // Collect all available items with their publication dates
    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].querySelector('title');
      const linkElement = items[i].querySelector('link');
      const pubDateElement = items[i].querySelector('pubDate');
      
      if (titleElement && titleElement.textContent && linkElement && linkElement.textContent) {
        allItems.push({
          headline: titleElement.textContent.trim(),
          link: linkElement.textContent.trim(),
          pubDate: pubDateElement?.textContent?.trim() || ''
        });
      }
    }
    
    console.log(`Found ${allItems.length} RSS items from The Guardian`);
    
    if (allItems.length === 0) {
      throw new Error('No valid RSS items found');
    }
    
    // Filter for today's articles (within last 24 hours) or use all if none from today
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const todaysItems = allItems.filter(item => {
      if (!item.pubDate) return true; // Include items without dates
      const itemDate = new Date(item.pubDate);
      return itemDate >= yesterday;
    });
    
    // Use today's items if available, otherwise use all items
    const itemsToUse = todaysItems.length >= 3 ? todaysItems : allItems;
    console.log(`Using ${itemsToUse.length} items (${todaysItems.length} from today)`);
    
    // Randomly shuffle all available items using Fisher-Yates algorithm
    const shuffled = [...itemsToUse];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Select 3 random items
    const selectedItems = shuffled.slice(0, 3);
    
    const whispers: WhisperWithSource[] = [];
    
    for (const item of selectedItems) {
      try {
        console.log(`Transforming headline: ${item.headline}`);
        const poeticResponse = await transformHeadlineToPoetry(item.headline);
        console.log(`Transformed to: ${poeticResponse.result} (source: ${poeticResponse.source})`);
        whispers.push({
          poetic: poeticResponse.result,
          headline: item.headline,
          link: item.link,
          source: poeticResponse.source
        });
      } catch (error) {
        console.error('Error transforming headline:', item.headline, error);
        // Use poetic fallback instead of original headline
        whispers.push({
          poetic: createPoetricFallback(item.headline),
          headline: item.headline,
          link: item.link,
          source: 'fallback'
        });
      }
    }
    
    console.log(`Generated ${whispers.length} whispers`);
    return whispers;
  } catch (error) {
    console.error('Error creating poetic whispers:', error);
    // Fallback to static poetic phrases with random selection
    const fallbackOptions = [
      {
        poetic: "The weight of unspoken words",
        headline: "Global tensions continue to shape international discourse",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      },
      {
        poetic: "A memory that refuses to fade", 
        headline: "Historical events continue to influence modern society",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      },
      {
        poetic: "The space between what was and what could be",
        headline: "Future possibilities emerge from current challenges",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      },
      {
        poetic: "Echoes of tomorrow's promise",
        headline: "Innovation continues to reshape our daily lives",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      },
      {
        poetic: "The silence between heartbeats",
        headline: "Personal stories emerge from global events",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      },
      {
        poetic: "Fragments of a changing world",
        headline: "Social movements adapt to modern challenges",
        link: "https://www.theguardian.com",
        source: 'fallback' as const
      }
    ];
    
    // Randomly select 3 from fallback options using proper shuffling
    const shuffled = [...fallbackOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }
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