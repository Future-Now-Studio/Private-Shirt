import { d as defineEventHandler, g as getRouterParam, r as readBody } from '../../../../nitro/nitro.mjs';
import { promises } from 'fs';
import path from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const DATA_DIR = path.join(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "placement-areas.json");
async function ensureDataFile() {
  try {
    await promises.mkdir(DATA_DIR, { recursive: true });
    await promises.access(DATA_FILE);
  } catch {
    await promises.writeFile(DATA_FILE, JSON.stringify({}), "utf8");
  }
}
async function readStore() {
  await ensureDataFile();
  const raw = await promises.readFile(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}
async function writeStore(store) {
  await ensureDataFile();
  await promises.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}
const placementArea_put = defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, "id") || "");
  if (!id) {
    event.node.res.statusCode = 400;
    return { error: "Missing product id" };
  }
  const body = await readBody(event);
  if (!body || !Array.isArray(body.points)) {
    event.node.res.statusCode = 400;
    return { error: "Invalid payload: { points: Array<{x:number,y:number}>" };
  }
  const store = await readStore();
  store[id] = {
    points: body.points,
    updatedAt: body.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
  };
  await writeStore(store);
  return { ok: true };
});

export { placementArea_put as default };
//# sourceMappingURL=placement-area.put.mjs.map
