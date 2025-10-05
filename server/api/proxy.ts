import { defineEventHandler, getQuery, setHeader, sendError, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url?: string }
  if (!url) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing url' }))
  }

  try {
    const decodedUrl = decodeURIComponent(String(url))
    console.log('Proxy fetching:', decodedUrl)
    
    // Validate URL for security
    const urlObj = new URL(decodedUrl)
    if (!urlObj.hostname.includes('sg-host.com') && !urlObj.hostname.includes('timob10')) {
      throw createError({ statusCode: 403, statusMessage: 'Domain not allowed' })
    }
    
    const res = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Private-Shirt-Proxy/1.0)',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://gentle-meerkat-967bfe.netlify.app/'
      }
    })
    
    if (!res.ok) {
      console.error('Proxy fetch failed:', res.status, res.statusText, decodedUrl)
      throw createError({ 
        statusCode: res.status, 
        statusMessage: `Upstream error: ${res.status} ${res.statusText}` 
      })
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const contentLength = res.headers.get('content-length')
    console.log('Proxy response:', res.status, contentType, contentLength, decodedUrl)
    
    // For Netlify Functions, we need to handle binary data properly
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range')
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
    if (contentLength) {
      setHeader(event, 'Content-Length', contentLength)
    }
    
    return buffer
  } catch (error) {
    console.error('Proxy error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: 'Proxy fetch failed' })
  }
})


