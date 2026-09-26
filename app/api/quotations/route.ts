import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJson } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "quote"), 15, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  let body: any = null;
  try { body = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  if (!body?.name || !body?.phone || !Array.isArray(body?.items)) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  if (typeof body.name !== "string" || typeof body.phone !== "string") return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const items = body.items.slice(0, 20).map((i: any) => ({
    productId: String(i?.productId || "").slice(0, 64),
    productName: String(i?.productName || "Product").slice(0, 140),
    quantity: Math.min(100000, Math.max(1, Number(i?.quantity) || 1))
  }));
  if (!items.length || body.name.length > 120 || body.phone.length > 30) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const q = await prisma.quotation.create({
    data: {
      name: body.name.slice(0, 120), business: typeof body.business === "string" ? body.business.slice(0, 120) : null,
      phone: body.phone.slice(0, 30),
      email: typeof body.email === "string" ? body.email.slice(0, 120) : null,
      city: typeof body.city === "string" ? body.city.slice(0, 80) : null,
      message: typeof body.message === "string" ? body.message.slice(0, 2000) : null,
      items: { create: items }
    }
  });
  return NextResponse.json({ ok: true, id: q.id });
}
