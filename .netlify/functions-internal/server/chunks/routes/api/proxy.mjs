import { d as defineEventHandler, a as getQuery, s as sendError, c as createError, b as setHeader, e as sendStream } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const proxy = defineEventHandler(async (event) => {
  const { url } = getQuery(event);
  if (!url) {
    return sendError(event, createError({ statusCode: 400, statusMessage: "Missing url" }));
  }
  const res = await fetch(String(url));
  if (!res.ok) {
    throw createError({ statusCode: res.status, statusMessage: res.statusText });
  }
  setHeader(event, "Access-Control-Allow-Origin", "*");
  const type = res.headers.get("content-type") || "application/octet-stream";
  setHeader(event, "Content-Type", type);
  return sendStream(event, res.body);
});

export { proxy as default };
//# sourceMappingURL=proxy.mjs.map
