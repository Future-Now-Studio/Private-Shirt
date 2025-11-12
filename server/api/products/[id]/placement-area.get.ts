export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'id')
  
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  try {
    // Read from the placement-areas.json file
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const dataPath = path.join(process.cwd(), 'server/data/placement-areas.json')
    
    let placementAreas = {}
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      placementAreas = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, return empty data
      placementAreas = {}
    }
    
    const productAreas = placementAreas[productId] || { printingAreas: [] }
    
    return {
      productId,
      printingAreas: productAreas.printingAreas || []
    }
  } catch (error) {
    console.error('Error reading placement areas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read placement areas'
    })
  }
})