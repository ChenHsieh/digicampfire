export async function handler(event, context) {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('Fetching RSS feed from Guardian...');
    
    const res = await fetch('https://www.theguardian.com/world/rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Guardian RSS returned ${res.status}: ${res.statusText}`);
    }
    
    const body = await res.text();
    console.log('RSS feed fetched successfully, length:', body.length);
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body,
    };
  } catch (error) {
    console.error('Error fetching RSS:', error);
    
    // Return a fallback RSS feed structure
    const fallbackRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Fallback News</title>
    <item>
      <title>Global tensions continue to shape international discourse</title>
      <link>https://www.theguardian.com</link>
    </item>
    <item>
      <title>Technology breakthrough promises to reshape industry</title>
      <link>https://www.theguardian.com</link>
    </item>
    <item>
      <title>Climate scientists warn of accelerating environmental changes</title>
      <link>https://www.theguardian.com</link>
    </item>
  </channel>
</rss>`;
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: fallbackRSS,
    };
  }
}