import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// POST /api/bargain/start { product_id } — floor price never leaves backend.
export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "bstart"), 20, 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const { product_id } = await req.json().catch(() => ({}));
  if (typeof product_id !== "string" || !product_id) {
    return NextResponse.json({ error: "Invalid product." }, { status: 400 });
  }
  const p = await prisma.product.findUnique({ where: { id: product_id }, include: { images: true } });
  if (!p || p.status !== "ACTIVE") return NextResponse.json({ error: "Product unavailable." }, { status: 404 });
  if (!p.bargainEnabled) return NextResponse.json({ error: "Bargaining is OFF for this product." }, { status: 403 });
  if ((p as any).stock !== undefined && (p as any).stock <= 0) {
    return NextResponse.json({ error: "Out of stock." }, { status: 400 });
  }
  const timeoutMin = p.sessionTimeoutMin || 5;
  const s = await prisma.bargainSession.create({
    data: {
      productId: p.id, maxAttempts: p.maxAttempts || 4,
      currentOffer: p.mrp || p.wholesalePrice || 0,
      expiresAt: new Date(Date.now() + timeoutMin * 60 * 1000)
    }
  });
  const price = p.mrp || p.wholesalePrice || 0;
  await prisma.bargainMessage.create({
    data: { sessionId: s.id, role: "bot", message: `arre bhai aa gaye! ${p.name} ka price ₹${price} hai. batao kitne mein chahiye?` }
  });
  return NextResponse.json({
    session_id: s.id,
    bot_message: `arre bhai aa gaye! ${p.name} ka price ₹${price} hai. batao kitne mein chahiye?`,
    product: { name: p.name, price, image: p.images?.[0]?.url || "" },
    expires_at: s.expiresAt.toISOString()
  });
}
