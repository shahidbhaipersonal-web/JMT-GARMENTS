import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "contact"), 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const m = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: m.id });
}
