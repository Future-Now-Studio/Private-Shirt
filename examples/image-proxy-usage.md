# Image Proxy Usage Examples

This document shows how to use the Netlify image proxy function with your application.

## Basic Usage

### 1. Import the composable

```javascript
import { useImageProxy } from '~/composables/useImageProxy'

export default {
  setup() {
    const { createProxiedImageUrl, loadImageWithProxy, preloadImage } = useImageProxy()
    
    return {
      createProxiedImageUrl,
      loadImageWithProxy,
      preloadImage
    }
  }
}
```

### 2. Using with Fabric.js Canvas (Bulletproof Approach)

```javascript
// In your Vue component
import { fabric } from 'fabric'
import { useImageProxy } from '~/composables/useImageProxy'

export default {
  setup() {
    const { loadImageWithProxy, createBlobUrl } = useImageProxy()
    
    const addImageToCanvas = async (imageUrl) => {
      try {
        // Bulletproof approach: fetch → blob → URL.createObjectURL → load into Fabric
        // This completely bypasses CORS and hotlink protection
        const img = await loadImageWithProxy(canvas, imageUrl, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        })
        
        console.log('Image loaded successfully:', img)
      } catch (error) {
        console.error('Failed to load image:', error)
      }
    }
    
    // Alternative: Manual blob URL approach with cleanup
    const addImageWithManualCleanup = async (imageUrl) => {
      try {
        const { blobUrl, cleanup } = await createBlobUrl(imageUrl)
        
        fabric.Image.fromURL(blobUrl, (img) => {
          if (img) {
            canvas.add(img)
            cleanup() // Clean up blob URL to prevent memory leaks
          }
        })
      } catch (error) {
        console.error('Failed to load image:', error)
      }
    }
    
    return {
      addImageToCanvas,
      addImageWithManualCleanup
    }
  }
}
```

### 3. Preloading Images (Bulletproof)

```javascript
// Preload multiple images using the bulletproof approach
const preloadImages = async (imageUrls) => {
  const { preloadImages } = useImageProxy()
  
  try {
    const images = await preloadImages(imageUrls)
    console.log('All images preloaded:', images)
    return images
  } catch (error) {
    console.error('Failed to preload images:', error)
  }
}

// Or preload individual images
const preloadSingleImage = async (imageUrl) => {
  const { preloadImage } = useImageProxy()
  
  try {
    const img = await preloadImage(imageUrl)
    console.log('Image preloaded:', img)
    return img
  } catch (error) {
    console.error('Failed to preload image:', error)
  }
}
```

### 4. Direct URL Creation

```javascript
// Create proxied URLs for use in templates or other contexts
const { createProxiedImageUrl } = useImageProxy()

// In your template
const imageUrl = 'https://example.com/image.jpg'
const proxiedUrl = createProxiedImageUrl(imageUrl)
// Result: /.netlify/functions/img?src=https%3A//example.com/image.jpg
```

## Integration with DesignCreator Component

To integrate with your existing DesignCreator component, you can modify the image loading functions:

```javascript
// In DesignCreator.vue
import { useImageProxy } from '~/composables/useImageProxy'

export default {
  setup() {
    const { loadImageWithProxy } = useImageProxy()
    
    // Replace existing image loading with proxied version
    const loadImageFromUrl = async (url) => {
      try {
        const img = await loadImageWithProxy(canvas, url, {
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center'
        })
        
        canvas.setActiveObject(img)
        canvas.renderAll()
      } catch (error) {
        console.error('Failed to load image:', error)
        // Show error message to user
      }
    }
    
    return {
      loadImageFromUrl
    }
  }
}
```

## Bulletproof Approach Benefits

The new bulletproof approach provides maximum compatibility and reliability:

1. **Zero CORS Issues**: By fetching through your same-origin proxy and creating blob URLs, CORS is completely bypassed
2. **No Hotlink Protection**: SiteGround and other hosting providers' hotlink protection is irrelevant
3. **Memory Management**: Automatic cleanup of blob URLs prevents memory leaks
4. **Universal Compatibility**: Works with any image source, regardless of CORS policies
5. **Error Resilience**: Comprehensive error handling at every step
6. **Performance**: Long-term caching (1 year) for optimal performance

### How It Works

```javascript
// The bulletproof process:
// 1. Original URL → 2. Same-origin proxy → 3. Fetch as blob → 4. Create blob URL → 5. Load into Fabric

const originalUrl = 'https://example.com/image.jpg'
const proxiedUrl = `/.netlify/functions/img?src=${encodeURIComponent(originalUrl)}`
const response = await fetch(proxiedUrl) // Same-origin, no CORS
const blob = await response.blob() // Convert to blob
const blobUrl = URL.createObjectURL(blob) // Create same-origin URL
fabric.Image.fromURL(blobUrl, callback) // Load into Fabric (no CORS needed)
URL.revokeObjectURL(blobUrl) // Clean up memory
```

## Benefits

1. **CORS Support**: Bypasses CORS restrictions for external images
2. **Hotlink Protection**: Bypasses SiteGround hotlink protection
3. **Caching**: Images are cached for 1 year for better performance
4. **Error Handling**: Proper error handling with meaningful messages
5. **TypeScript Support**: Full TypeScript support with proper types
6. **Memory Management**: Automatic blob URL cleanup prevents memory leaks

## Function Features

The Netlify function includes:
- SiteGround hotlink bypass with proper Referer header
- Long-term caching (1 year)
- CORS headers for cross-origin requests
- Base64 encoding for better compatibility
- Proper error handling and status codes
