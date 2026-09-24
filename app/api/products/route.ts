import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.toLowerCase() || "";
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }, { fabric: { contains: q, mode: "insensitive" } }] } : {})
      },
      take: 48, include: { images: true, category: true }, orderBy: { createdAt: "desc" }
    });
    const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    return NextResponse.json({
      products: products.map((p) => {
        const show = Boolean(settings?.showPrice || p.showPrice);
        return {
          id: p.id, name: p.name, slug: p.slug, sku: p.sku, category: p.category.name,
          colours: p.colours, sizes: p.sizes, moq: p.moq,
          ...(show ? { wholesalePrice: p.wholesalePrice } : {}),
          showPrice: show,
          image: p.images.find((i) => i.primary)?.url || p.images[0]?.url || ""
        };
      })
    });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
