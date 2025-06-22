import { transformHeadlineToPoetry } from './openai';

interface WhisperWithSource {
  poetic: string;
  headline: string;
  link: string;
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
    console.log('📰 Fetching poetic whispers with sources...');
    
    // Use the reliable CORS proxy that works in production
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://www.theguardian.com/world/rss';
    
    console.log('🌐 Attempting to fetch from:', proxyUrl + encodeURIComponent(targetUrl));
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Digital Campfire RSS Reader'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log('📄 Received XML response, length:', xmlText.length);
    
    if (!xmlText || xmlText.length < 100) {
      throw new Error('Received empty or invalid XML response');
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      throw new Error('XML parsing failed');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const allItems: { headline: string; link: string; pubDate: string }[] = [];
    
    console.log(`📋 Found ${items.length} RSS items from The Guardian`);
    
    if (items.length === 0) {
      throw new Error('No RSS items found in feed');
    }
    
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
    
    console.log(`✅ Collected ${allItems.length} valid items`);
    
    if (allItems.length === 0) {
      throw new Error('No valid items found in RSS feed');
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
    console.log(`📅 Using ${itemsToUse.length} items (${todaysItems.length} from today)`);
    
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
        console.log(`🎭 Transforming headline: "${item.headline}"`);
        const poeticPhrase = await transformHeadlineToPoetry(item.headline);
        console.log(`✨ Transformed to: "${poeticPhrase}"`);
        whispers.push({
          poetic: poeticPhrase,
          headline: item.headline,
          link: item.link
        });
      } catch (error) {
        console.warn('⚠️ Error transforming headline:', item.headline, error.message);
        // Use original headline if transformation fails
        whispers.push({
          poetic: item.headline,
          headline: item.headline,
          link: item.link
        });
      }
    }
    
    console.log(`🎉 Generated ${whispers.length} whispers from real headlines`);
    
    // If we successfully created whispers, return them
    if (whispers.length >= 3) {
      return whispers;
    } else {
      throw new Error('Not enough whispers generated');
    }
    
  } catch (error) {
    console.info('📰 RSS processing failed, using curated whispers:', error.message);
    console.info('🔍 Error details:', error);
    return getRandomFallbackWhispers(fallbackOptions);
  }
}

function getRandomFallbackWhispers(fallbackOptions: WhisperWithSource[]): WhisperWithSource[] {
  console.log('🎲 Selecting random fallback whispers');
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
    console.error('❌ Error creating poetic whispers:', error);
    // Fallback to static poetic phrases
    return [
      "The weight of unspoken words",
      "A memory that refuses to fade", 
      "The space between what was and what could be"
    ];
  }
}