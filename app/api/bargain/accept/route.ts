import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/bargain/accept { session_id } — locks price, marks won, returns order link.
export async function POST(req: NextRequest) {
  const { session_id } = await req.json().catch(() => ({}));
  if (typeof session_id !== "string") return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  const s = await prisma.bargainSession.findUnique({ where: { id: session_id }, include: { product: true } });
  if (!s) return NextResponse.json({ error: "Invalid session." }, { status: 404 });
  if (s.status !== "active") return NextResponse.json({ error: "Session closed." }, { status: 400 });

  const price = s.product.mrp || s.product.wholesalePrice || 0;
  const floor = s.product.floorPrice ?? Math.round(price * 0.6);
  const finalPrice = Math.max(s.currentOffer, floor);

  await prisma.bargainSession.update({ where: { id: s.id }, data: { status: "won", finalPrice } });
  const wa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "919702493977"}?text=${encodeURIComponent(`Namaste! Bargain deal LOCKED: ${s.product.name} (${s.product.sku}) at Rs.${finalPrice}. Reply here to confirm your order.`)}`;
  return NextResponse.json({ checkout_url: wa, final_price: finalPrice });
}
