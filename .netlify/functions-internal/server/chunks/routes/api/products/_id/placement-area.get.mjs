import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
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
const placementArea_get = defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, "id") || "");
  if (!id) return { points: [], updatedAt: null };
  const store = await readStore();
  return store[id] || { points: [], updatedAt: null };
});

export { placementArea_get as default };
//# sourceMappingURL=placement-area.get.mjs.map
