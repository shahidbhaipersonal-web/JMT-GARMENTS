import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { sameOrigin } from "@/lib/security";

export async function POST(req: NextRequest) {
  const a = await requireAdmin();
  if (!a) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const p = await prisma.product.create({ data: { ...parsed.data, colours: parsed.data.colours, sizes: parsed.data.sizes } });
  return NextResponse.json({ ok: true, id: p.id });
}
export async function GET() {
  return NextResponse.json({ error: "Admin only" }, { status: 403 });
}
