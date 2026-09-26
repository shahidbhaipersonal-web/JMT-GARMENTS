import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAdmin, logSecurity } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJson } from "@/lib/security";

// Dummy hash so "user not found" takes ~same time as a real compare (timing-attack mitigation).
const DUMMY_HASH = "$2a$10$o7meP2Cx3CPzEE5SEn2gee4nwu7ufSoiIgkSnt9uUZZiVpsbN9SNe";

export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "login"), 5, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  let body: any = null;
  try { body = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const { email, password } = body || {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  const ok = admin ? await bcrypt.compare(password, admin.passHash) : await bcrypt.compare(password, DUMMY_HASH).then(() => false);
  if (!admin || !ok) {
    await logSecurity(admin?.id || null, "login_failed", "AdminUser", email.toLowerCase().trim());
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "login", entity: "AdminUser", entityId: admin.id } }).catch(() => {});
  await signAdmin({ id: admin.id, email: admin.email, role: admin.role });
  return NextResponse.json({ ok: true });
}
