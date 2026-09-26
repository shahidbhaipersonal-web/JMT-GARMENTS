import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sameOrigin, readJson } from "@/lib/security";

const STATUSES = ["New", "Contacted", "Quoted", "Confirmed", "Completed", "Cancelled"];

// PUT /api/admin/enquiries/[id] { status }
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const a = await requireAdmin();
  if (!a) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  let body: any = null;
  try { body = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  if (typeof body?.status !== "string" || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  await prisma.enquiry.update({ where: { id: params.id }, data: { status: body.status } });
  await prisma.auditLog.create({ data: { adminId: a.id, action: "enquiry_status", entity: "Enquiry", entityId: params.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
