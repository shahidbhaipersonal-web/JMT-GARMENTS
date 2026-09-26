import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJson } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "contact"), 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  let body: any = null;
  try { body = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const m = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: m.id });
}
