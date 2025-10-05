export default async (req) => {
  const url = new URL(req.url);
  const src = url.searchParams.get("src");
  if (!src) return new Response("src required", { status: 400 });

  try {
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      status: res.status,
      headers: { 
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      }
    });
  } catch (error) {
    return new Response("Failed to fetch image", { status: 500 });
  }
};
