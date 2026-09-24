import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enquirySchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "enquiry"), 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const e = await prisma.enquiry.create({ data: { ...parsed.data, quantity: parsed.data.quantity ?? null } });
  return NextResponse.json({ ok: true, id: e.id });
}

export async function GET() {
  return NextResponse.json({ error: "Admin only" }, { status: 403 });
}
