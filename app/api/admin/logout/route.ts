import { NextResponse } from "next/server";
import { clearAdmin } from "@/lib/auth";
export async function POST() {
  clearAdmin();
  return NextResponse.json({ ok: true });
}
