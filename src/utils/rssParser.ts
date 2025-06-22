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
    // Use corsproxy.io which works in both development and production
    const response = await fetch('https://corsproxy.io/?https://www.theguardian.com/world/rss');
    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const headlines: string[] = [];
    
    // Get all available headlines
    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].querySelector('title');
      if (titleElement && titleElement.textContent) {
        headlines.push(titleElement.textContent.trim());
      }
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
    // Use corsproxy.io which works in both development and production
    const response = await fetch('https://corsproxy.io/?https://www.theguardian.com/world/rss');
    
    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const allItems: { headline: string; link: string }[] = [];
    
    // Collect all available items
    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].querySelector('title');
      const linkElement = items[i].querySelector('link');
      
      if (titleElement && titleElement.textContent && linkElement && linkElement.textContent) {
        allItems.push({
          headline: titleElement.textContent.trim(),
          link: linkElement.textContent.trim()
        });
      }
    }
    
    console.log(`Found ${allItems.length} RSS items`); // Debug log
    
    // Randomly select 3 items from all available
    const shuffled = allItems.sort(() => Math.random - 0.5);
    const selectedItems = shuffled.slice(0, 3);
    
    const whispers: WhisperWithSource[] = [];
    
    for (const item of selectedItems) {
      try {
        console.log(`Transforming headline: ${item.headline}`); // Debug log
        const poeticPhrase = await transformHeadlineToPoetry(item.headline);
        console.log(`Transformed to: ${poeticPhrase}`); // Debug log
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
    
    console.log(`Generated ${whispers.length} whispers`); // Debug log
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
    
    // Randomly select 3 from fallback options
    const shuffled = fallbackOptions.sort(() => Math.random() - 0.5);
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