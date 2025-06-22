export async function handler() {
  try {
    const res = await fetch('https://www.theguardian.com/world/rss');
    const body = await res.text();
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body,
    };
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to fetch RSS feed' }),
    };
  }
}