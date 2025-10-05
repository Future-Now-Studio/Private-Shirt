// ... existing code ...
async function loadBackground(url) {
  if (!url) return false
  
  // Try Netlify function proxy first (no CORS issues)
  const proxied = `/.netlify/functions/img?src=${encodeURIComponent(url)}`
  let ok = await loadViaHTMLImage(proxied)
  console.debug('[BG-TRY] netlify function HTMLImage', proxied, ok)
  if (ok) return true

  ok = await loadBackgroundViaFabric(proxied, false)
  console.debug('[BG-TRY] netlify function Fabric', proxied, ok)
  if (ok) return true

  // Then try direct paths
  ok = await loadViaHTMLImage(url)
  console.debug('[BG-TRY] direct HTMLImage', url, ok)
  if (ok) return true

  ok = await loadBackgroundViaFabric(url, true)
  console.debug('[BG-TRY] fabric CORS', url, ok)
  if (ok) return true

  ok = await loadBackgroundViaBlob(url)
  console.debug('[BG-TRY] blob', url, ok)
  if (ok) return true

  ok = await loadBackgroundViaFabric(url, false)
  console.debug('[BG-TRY] fabric no-cors (tainted)', url, ok)
  return ok
}
// ... existing code ...