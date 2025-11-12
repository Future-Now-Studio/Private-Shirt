import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const placementArea_get = defineEventHandler(async (event) => {
  const productId = getRouterParam(event, "id");
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Product ID is required"
    });
  }
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), "server/data/placement-areas.json");
    let placementAreas = {};
    try {
      const data = await fs.readFile(dataPath, "utf-8");
      placementAreas = JSON.parse(data);
    } catch (error) {
      placementAreas = {};
    }
    const productAreas = placementAreas[productId] || { printingAreas: [] };
    return {
      productId,
      printingAreas: productAreas.printingAreas || []
    };
  } catch (error) {
    console.error("Error reading placement areas:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read placement areas"
    });
  }
});

export { placementArea_get as default };
//# sourceMappingURL=placement-area.get.mjs.map
