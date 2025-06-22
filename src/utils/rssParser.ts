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
    // Use a more reliable CORS proxy for production
    const corsProxies = [
      'https://api.allorigins.win/get?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Try different CORS proxies
    for (const proxy of corsProxies) {
      try {
        const url = `${proxy}${encodeURIComponent('https://www.theguardian.com/world/rss')}`;
        response = await fetch(url, {
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml',
          }
        });
        
        if (response.ok) {
          break;
        }
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to fetch with proxy ${proxy}:`, error);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('All CORS proxies failed');
    }
    
    let xmlText: string;
    
    // Handle different proxy response formats
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
    // Use a more reliable CORS proxy for production
    const corsProxies = [
      'https://api.allorigins.win/get?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Try different CORS proxies
    for (const proxy of corsProxies) {
      try {
        const url = `${proxy}${encodeURIComponent('https://www.theguardian.com/world/rss')}`;
        response = await fetch(url, {
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml',
          }
        });
        
        if (response.ok) {
          break;
        }
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to fetch with proxy ${proxy}:`, error);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('All CORS proxies failed');
    }
    
    let xmlText: string;
    
    // Handle different proxy response formats
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
      throw new Error('No items found in RSS feed');
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
        const poeticPhrase = await transformHeadlineToPoetry(item.headline);
        console.log(`Transformed to: ${poeticPhrase}`);
        whispers.push({
          poetic: poeticPhrase,
          headline: item.headline,
          link: item.link
        });
      } catch (error) {
        console.error('Error transforming headline:', item.headline, error);
        // Use original headline if transformation fails
        whispers.push({
          poetic: item.headline,
          headline: item.headline,
          link: item.link
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