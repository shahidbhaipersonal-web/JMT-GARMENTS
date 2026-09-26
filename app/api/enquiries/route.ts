import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enquirySchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJson } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "enquiry"), 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  let body: any = null;
  try { body = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const e = await prisma.enquiry.create({ data: { ...parsed.data, quantity: parsed.data.quantity ?? null } });
  return NextResponse.json({ ok: true, id: e.id });
}

export async function GET() {
  return NextResponse.json({ error: "Admin only" }, { status: 403 });
}
