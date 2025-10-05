import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const src = event.queryStringParameters?.src;
  if (!src) return { statusCode: 400, body: 'Missing src' };

  try {
    const r = await fetch(src, {
      headers: {
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://timob10.sg-host.com/', // bypass SiteGround hotlink
        'User-Agent': 'Mozilla/5.0',
      },
      redirect: 'follow',
    });
    if (!r.ok) return { statusCode: r.status, body: `Upstream error: ${r.statusText}` };

    const buf = Buffer.from(await r.arrayBuffer());
    const type = r.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
        'Timing-Allow-Origin': '*',
      },
      body: buf.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (e: any) {
    return { statusCode: 502, body: `Proxy failed: ${e.message || e}` };
  }
};
