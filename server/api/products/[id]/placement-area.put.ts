export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'id')
  
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  try {
    const body = await readBody(event)
    const { printingAreas } = body
    
    if (!Array.isArray(printingAreas)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'printingAreas must be an array'
      })
    }

    // Read existing data
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const dataPath = path.join(process.cwd(), 'server/data/placement-areas.json')
    
    let placementAreas = {}
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      placementAreas = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, create empty object
      placementAreas = {}
    }
    
    // Update the product's printing areas
    placementAreas[productId] = {
      printingAreas,
      updatedAt: new Date().toISOString()
    }
    
    // Ensure the data directory exists
    const dataDir = path.dirname(dataPath)
    await fs.mkdir(dataDir, { recursive: true })
    
    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(placementAreas, null, 2))
    
    return {
      success: true,
      productId,
      printingAreas,
      message: 'Printing areas saved successfully'
    }
  } catch (error) {
    console.error('Error saving placement areas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save placement areas'
    })
  }
})