import { defineEventHandler, getQuery, setHeader, sendStream, sendError, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url?: string }
  if (!url) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing url' }))
  }

  try {
    const decodedUrl = decodeURIComponent(String(url))
    console.log('Proxy fetching:', decodedUrl)
    
    const res = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Private-Shirt-Proxy/1.0)',
        'Accept': 'image/*,*/*;q=0.8'
      }
    })
    
    if (!res.ok) {
      console.error('Proxy fetch failed:', res.status, res.statusText, decodedUrl)
      throw createError({ statusCode: res.status, statusMessage: res.statusText })
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    console.log('Proxy response:', res.status, contentType, decodedUrl)
    
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    
    return sendStream(event, res.body as any)
  } catch (error) {
    console.error('Proxy error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Proxy fetch failed' })
  }
})


