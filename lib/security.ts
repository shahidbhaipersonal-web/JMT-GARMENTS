export function getAuthSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET missing or too short (min 32 chars). Set it in .env.");
  }
  return new TextEncoder().encode(s);
}

// CSRF: for cookie-authed mutations, require same-origin.
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
  if (!origin && !referer) return false;
  try {
    if (origin) return new URL(origin).host === host;
    if (referer) return new URL(referer).host === host;
  } catch { return false; }
  return false;
}

// Body-size guard: Next route handlers have no strict default — cap JSON at 100KB.
export async function readJson(req: Request, maxBytes = 100 * 1024): Promise<any> {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > maxBytes) throw new Error("too-large");
  const text = await req.text();
  if (text.length > maxBytes) throw new Error("too-large");
  try { return JSON.parse(text); } catch { return null; }
}
