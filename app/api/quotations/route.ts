import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rate-limit";
export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "quote"), 15, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.phone || !Array.isArray(body?.items)) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const q = await prisma.quotation.create({
    data: {
      name: String(body.name), business: body.business || null, phone: String(body.phone),
      email: body.email || null, city: body.city || null, message: body.message || null,
      items: { create: body.items.slice(0, 50).map((i: any) => ({ productId: String(i.productId), productName: String(i.productName || "Product"), quantity: Number(i.quantity) || 1 })) }
    }
  });
  return NextResponse.json({ ok: true, id: q.id });
}
