import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) return new TextEncoder().encode("missing-secret-fail-closed-no-access-0000");
  return new TextEncoder().encode(s);
}
export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const v = req.cookies.get("jmt_admin")?.value;
  if (!v) return NextResponse.redirect(new URL("/admin/login", req.url));
  try {
    await jwtVerify(v, secret());
    return NextResponse.next();
  } catch { return NextResponse.redirect(new URL("/admin/login", req.url)); }
}
export const config = { matcher: ["/admin/:path*"] };
