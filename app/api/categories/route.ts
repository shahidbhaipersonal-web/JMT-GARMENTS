import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cats = await prisma.category.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    return NextResponse.json({ categories: cats });
  } catch { return NextResponse.json({ categories: [] }); }
}
export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: "Admin only" }, { status: 403 });
}
