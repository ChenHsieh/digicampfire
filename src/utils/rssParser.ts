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
    // Try multiple endpoints for better reliability
    let response;
    let lastError;
    
    // Try Netlify function first
    try {
      response = await fetch('/.netlify/functions/rss');
      if (!response.ok) throw new Error(`Netlify function failed: ${response.status}`);
    } catch (error) {
      lastError = error;
      console.log('Netlify function failed, trying local proxy...');
      
      // Fallback to local development proxy
      try {
        response = await fetch('/api/rss');
        if (!response.ok) throw new Error(`Local proxy failed: ${response.status}`);
      } catch (localError) {
        lastError = localError;
        console.log('Local proxy failed, using fallback data...');
        throw new Error('All RSS endpoints failed');
      }
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for XML parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse RSS XML');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const headlines: string[] = [];
    
    // Get first 4 headlines
    for (let i = 0; i < Math.min(4, items.length); i++) {
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
      'Cultural movements gain momentum across communities'
    ];
  }
}

export async function fetchPoeticWhispersWithSources(): Promise<WhisperWithSource[]> {
  try {
    // Try multiple endpoints for better reliability
    let response;
    let lastError;
    
    // Try Netlify function first
    try {
      response = await fetch('/.netlify/functions/rss');
      if (!response.ok) throw new Error(`Netlify function failed: ${response.status}`);
    } catch (error) {
      lastError = error;
      console.log('Netlify function failed, trying local proxy...');
      
      // Fallback to local development proxy
      try {
        response = await fetch('/api/rss');
        if (!response.ok) throw new Error(`Local proxy failed: ${response.status}`);
      } catch (localError) {
        lastError = localError;
        console.log('Local proxy failed, using fallback data...');
        throw new Error('All RSS endpoints failed');
      }
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for XML parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse RSS XML');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const whispers: WhisperWithSource[] = [];
    
    // Get first 3 items with headlines and links
    for (let i = 0; i < Math.min(3, items.length); i++) {
      const titleElement = items[i].querySelector('title');
      const linkElement = items[i].querySelector('link');
      
      if (titleElement && titleElement.textContent && linkElement && linkElement.textContent) {
        const headline = titleElement.textContent.trim();
        const link = linkElement.textContent.trim();
        
        try {
          const poeticPhrase = await transformHeadlineToPoetry(headline);
          whispers.push({
            poetic: poeticPhrase,
            headline: headline,
            link: link
          });
        } catch (error) {
          console.error('Error transforming headline:', headline, error);
          // Use original headline if transformation fails
          whispers.push({
            poetic: headline,
            headline: headline,
            link: link
          });
        }
      }
    }
    
    if (whispers.length === 0) {
      throw new Error('No whispers generated from RSS feed');
    }
    
    return whispers;
  } catch (error) {
    console.error('Error creating poetic whispers:', error);
    // Fallback to static poetic phrases
    return [
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