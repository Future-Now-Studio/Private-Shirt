import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const placementArea_put = defineEventHandler(async (event) => {
  const productId = getRouterParam(event, "id");
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Product ID is required"
    });
  }
  try {
    const body = await readBody(event);
    const { printingAreas } = body;
    if (!Array.isArray(printingAreas)) {
      throw createError({
        statusCode: 400,
        statusMessage: "printingAreas must be an array"
      });
    }
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
    placementAreas[productId] = {
      printingAreas,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const dataDir = path.dirname(dataPath);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(placementAreas, null, 2));
    return {
      success: true,
      productId,
      printingAreas,
      message: "Printing areas saved successfully"
    };
  } catch (error) {
    console.error("Error saving placement areas:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save placement areas"
    });
  }
});

export { placementArea_put as default };
//# sourceMappingURL=placement-area.put.mjs.map
