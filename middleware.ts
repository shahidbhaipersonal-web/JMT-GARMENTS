import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = process.env.NODE_ENV === "production" ? "__Host-jmt_admin" : "jmt_admin";

function secret(): Uint8Array | null {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) return null; // fail closed: no valid secret = no admin access
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const v = req.cookies.get(COOKIE)?.value;
  if (!v) return NextResponse.redirect(new URL("/admin/login", req.url));
  const sec = secret();
  if (!sec) return NextResponse.redirect(new URL("/admin/login", req.url));
  try {
    await jwtVerify(v, sec);
    return NextResponse.next();
  } catch { return NextResponse.redirect(new URL("/admin/login", req.url)); }
}
export const config = { matcher: ["/admin/:path*"] };
