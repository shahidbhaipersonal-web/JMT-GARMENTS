// Simple in-memory rate limiter (per-process). For multi-instance prod, use Redis/Upstash.
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || now > cur.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  cur.count += 1;
  if (cur.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - cur.count };
}

export function clientKey(req: Request, prefix: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
