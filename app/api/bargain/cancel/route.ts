import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/bargain/cancel { session_id }
export async function POST(req: NextRequest) {
  const { session_id } = await req.json().catch(() => ({}));
  if (typeof session_id !== "string") return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  await prisma.bargainSession.updateMany({ where: { id: session_id, status: "active" }, data: { status: "lost" } });
  return NextResponse.json({ success: true });
}
