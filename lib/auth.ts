import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAuthSecret } from "./security";

const COOKIE = "jmt_admin";

export async function signAdmin(payload: { id: string; email: string; role: string }) {
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(getAuthSecret());
  cookies().set(COOKIE, jwt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
}

export async function getAdmin() {
  const v = cookies().get(COOKIE)?.value;
  if (!v) return null;
  try {
    const { payload } = await jwtVerify(v, getAuthSecret());
    return payload as { id: string; email: string; role: string };
  } catch { return null; }
}

export function clearAdmin() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}
