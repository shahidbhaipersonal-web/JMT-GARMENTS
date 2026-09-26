import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson } from "@/lib/security";

// POST /api/bargain/cancel { session_id }
export async function POST(req: NextRequest) {
  let j: any = null;
  try { j = await readJson(req); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const { session_id } = j || {};
  if (typeof session_id !== "string" || session_id.length > 64) return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  await prisma.bargainSession.updateMany({ where: { id: session_id, status: "active" }, data: { status: "lost" } });
  return NextResponse.json({ success: true });
}
