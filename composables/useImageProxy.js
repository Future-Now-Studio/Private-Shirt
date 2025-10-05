/**
 * Composable for handling image proxying through Netlify Functions
 * This helps bypass CORS issues and hotlink protection
 */

/**
 * Creates a proxied image URL using the Netlify function
 * @param {string} originalImageUrl - The original image URL to proxy
 * @returns {string} - The proxied URL
 */
export const createProxiedImageUrl = (originalImageUrl) => {
  if (!originalImageUrl) return ''
  
  // If it's already a relative URL or data URL, return as is
  if (originalImageUrl.startsWith('/') || originalImageUrl.startsWith('data:')) {
    return originalImageUrl
  }
  
  // Create the proxied URL
  return `/.netlify/functions/img?src=${encodeURIComponent(originalImageUrl)}`
}

/**
 * Loads an image with Fabric.js using the bulletproof blob URL approach
 * This completely bypasses CORS by fetching through same-origin proxy and creating blob URLs
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance
 * @param {string} imageUrl - The image URL to load
 * @param {Object} options - Additional options for the image
 * @returns {Promise<fabric.Image>} - Promise that resolves to the loaded image
 */
export const loadImageWithProxy = async (canvas, imageUrl, options = {}) => {
  try {
    // Always go through your same-origin proxy
    const proxiedUrl = createProxiedImageUrl(imageUrl)
    
    const res = await fetch(proxiedUrl, { method: 'GET' })
    if (!res.ok) {
      throw new Error(`Proxy fetch failed: ${res.status} ${res.statusText}`)
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob) // Same-origin URL, no CORS

    return new Promise((resolve, reject) => {
      // No crossOrigin needed for blob URLs, but harmless if left in
      fabric.Image.fromURL(blobUrl, (img) => {
        if (img) {
          // Apply any additional options
          Object.assign(img, options)
          canvas.add(img)
          
          // Clean up the blob URL after a short delay to ensure image is fully processed
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl)
          }, 100) // Small delay to ensure Fabric.js has finished processing
          
          resolve(img)
        } else {
          URL.revokeObjectURL(blobUrl)
          reject(new Error('Failed to load image'))
        }
      }, { 
        crossOrigin: 'anonymous',
        ...options
      })
    })
  } catch (error) {
    throw new Error(`Image loading failed: ${error.message}`)
  }
}

/**
 * Preloads an image using the bulletproof blob URL approach
 * @param {string} imageUrl - The image URL to preload
 * @returns {Promise<HTMLImageElement>} - Promise that resolves to the loaded image element
 */
export const preloadImage = async (imageUrl) => {
  try {
    // Always go through your same-origin proxy
    const proxiedUrl = createProxiedImageUrl(imageUrl)
    
    const res = await fetch(proxiedUrl, { method: 'GET' })
    if (!res.ok) {
      throw new Error(`Proxy fetch failed: ${res.status} ${res.statusText}`)
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob) // Same-origin URL, no CORS

    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        // Clean up the blob URL after a short delay to ensure image is fully loaded
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
        }, 100)
        resolve(img)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl)
        reject(new Error(`Failed to load image: ${imageUrl}`))
      }
      
      // No crossOrigin needed for blob URLs
      img.src = blobUrl
    })
  } catch (error) {
    throw new Error(`Image preloading failed: ${error.message}`)
  }
}

/**
 * Checks if an image URL needs proxying
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - True if the URL needs proxying
 */
export const needsProxying = (imageUrl) => {
  if (!imageUrl) return false
  
  // Don't proxy relative URLs, data URLs, or already proxied URLs
  return !(
    imageUrl.startsWith('/') || 
    imageUrl.startsWith('data:') || 
    imageUrl.includes('/.netlify/functions/img')
  )
}

/**
 * Bulletproof image loading - completely bypasses CORS by using blob URLs
 * This is the recommended approach for maximum compatibility
 * @param {string} imageUrl - The image URL to load
 * @returns {Promise<Blob>} - Promise that resolves to the image blob
 */
export const fetchImageAsBlob = async (imageUrl) => {
  const proxiedUrl = createProxiedImageUrl(imageUrl)
  
  const res = await fetch(proxiedUrl, { method: 'GET' })
  if (!res.ok) {
    throw new Error(`Proxy fetch failed: ${res.status} ${res.statusText}`)
  }

  return await res.blob()
}

/**
 * Creates a blob URL from an image URL (with automatic cleanup tracking)
 * @param {string} imageUrl - The image URL to convert
 * @returns {Promise<{blobUrl: string, cleanup: function}>} - Object with blob URL and cleanup function
 */
export const createBlobUrl = async (imageUrl) => {
  const blob = await fetchImageAsBlob(imageUrl)
  const blobUrl = URL.createObjectURL(blob)
  
  return {
    blobUrl,
    cleanup: () => URL.revokeObjectURL(blobUrl)
  }
}

/**
 * Batch preload multiple images using the bulletproof approach
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise<HTMLImageElement[]>} - Promise that resolves to array of loaded image elements
 */
export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => preloadImage(url))
  return await Promise.all(promises)
}

export const useImageProxy = () => {
  return {
    createProxiedImageUrl,
    loadImageWithProxy,
    preloadImage,
    preloadImages,
    fetchImageAsBlob,
    createBlobUrl,
    needsProxying
  }
}
