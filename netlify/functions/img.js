export default async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    });
  }

  const url = new URL(req.url);
  const src = url.searchParams.get("src");
  
  if (!src) {
    return new Response("src parameter required", { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    console.log('Fetching image:', src);
    
    const res = await fetch(src, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Netlify-Image-Proxy/1.0)',
        'Accept': 'image/*,*/*;q=0.8'
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch image:', res.status, res.statusText);
      return new Response(`Failed to fetch image: ${res.status} ${res.statusText}`, { 
        status: res.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        }
      });
    }

    const buf = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    
    console.log('Successfully fetched image:', src, 'Content-Type:', contentType);
    
    return new Response(buf, {
      status: 200,
      headers: { 
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response(`Error fetching image: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      }
    });
  }
};