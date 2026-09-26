import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAuthSecret } from "./security";
import { prisma } from "./db";

// __Host- prefix in prod: locks cookie to HTTPS host (Secure + Path=/ + no Domain).
export const ADMIN_COOKIE = process.env.NODE_ENV === "production" ? "__Host-jmt_admin" : "jmt_admin";

export type Admin = { id: string; email: string; role: string };

export async function signAdmin(payload: Admin) {
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(getAuthSecret());
  cookies().set(ADMIN_COOKIE, jwt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
}

// Verifies JWT signature only. Use requireAdmin() for anything sensitive.
export async function getAdmin(): Promise<Admin | null> {
  const v = cookies().get(ADMIN_COOKIE)?.value;
  if (!v) return null;
  try {
    const { payload } = await jwtVerify(v, getAuthSecret());
    const p = payload as unknown as Admin;
    if (typeof p.id !== "string" || typeof p.email !== "string") return null;
    return { id: p.id, email: p.email, role: p.role };
  } catch { return null; }
}

// DB-verified admin: kills stale tokens (deleted admin loses access immediately).
export async function requireAdmin(): Promise<Admin | null> {
  const a = await getAdmin();
  if (!a) return null;
  try {
    const u = await prisma.adminUser.findUnique({ where: { id: a.id }, select: { id: true, email: true, role: true } });
    if (!u || u.email !== a.email) return null;
    return u;
  } catch { return null; }
}

export async function logSecurity(adminId: string | null, action: string, entity: string, entityId?: string) {
  try {
    await prisma.auditLog.create({ data: { adminId, action, entity, entityId } });
  } catch { /* logging must never break the request */ }
}

export function clearAdmin() {
  cookies().set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}
