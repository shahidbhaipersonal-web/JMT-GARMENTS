import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sameOrigin } from "@/lib/security";

// PUT /api/admin/products/[id]/bargain — toggle + floor/cost/attempts/timeout (SUPER_ADMIN only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const a = await requireAdmin();
  if (!a) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if ((a.role as string) !== "SUPER_ADMIN") return NextResponse.json({ error: "Super admin only." }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof b.bargainEnabled === "boolean") data.bargainEnabled = b.bargainEnabled;
  if (b.floorPrice !== undefined) data.floorPrice = Number(b.floorPrice) || null;
  if (b.costPrice !== undefined) data.costPrice = Number(b.costPrice) || null;
  if (b.maxAttempts !== undefined) data.maxAttempts = Math.min(10, Math.max(1, Number(b.maxAttempts) || 4));
  if (b.sessionTimeoutMin !== undefined) data.sessionTimeoutMin = Math.min(30, Math.max(1, Number(b.sessionTimeoutMin) || 5));
  if (typeof b.bestseller === "boolean") data.bestseller = b.bestseller;
  if (typeof b.featured === "boolean") data.featured = b.featured;
  const p = await prisma.product.update({ where: { id: params.id }, data });
  await prisma.auditLog.create({ data: { adminId: a.id as string, action: "bargain_config", entity: "Product", entityId: p.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
