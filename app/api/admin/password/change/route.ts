import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/security";

function strong(pw: string): string | null {
  if (pw.length < 10) return "Password min 10 characters.";
  if (!/[A-Z]/.test(pw)) return "Add 1 uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Add 1 lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Add 1 number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add 1 symbol.";
  return null;
}

export async function POST(req: NextRequest) {
  const a = await requireAdmin();
  if (!a) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const rl = rateLimit(`pwchange:${a.id}:${clientKey(req, "x")}`, 5, 15 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }
  const admin = await prisma.adminUser.findUnique({ where: { id: a.id as string } });
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await bcrypt.compare(currentPassword, admin.passHash))) {
    return NextResponse.json({ error: "Current password wrong." }, { status: 400 });
  }
  const msg = strong(newPassword);
  if (msg) return NextResponse.json({ error: msg }, { status: 400 });
  if (await bcrypt.compare(newPassword, admin.passHash)) {
    return NextResponse.json({ error: "New password must differ." }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id: admin.id }, data: { passHash: await bcrypt.hash(newPassword, 12) } });
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "password_change", entity: "AdminUser", entityId: admin.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
