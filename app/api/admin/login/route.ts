import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAdmin } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "login"), 10, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) return NextResponse.json({ error: "Invalid" }, { status: 401 });
  const ok = await bcrypt.compare(password, admin.passHash);
  if (!ok) return NextResponse.json({ error: "Invalid" }, { status: 401 });
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "login", entity: "AdminUser", entityId: admin.id } }).catch(() => {});
  await signAdmin({ id: admin.id, email: admin.email, role: admin.role });
  return NextResponse.json({ ok: true });
}
