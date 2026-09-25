import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";
import { ProductGallery, BuyBox, ProductTabs } from "@/components/ProductWidgets";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} — JMT Garments` };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let p: any = null;
  let related: any[] = [];
  let showPrice = false;
  try {
    p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: { orderBy: { order: "asc" } }, category: true } });
    if (!p) return notFound();
    const s = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    showPrice = Boolean(s?.showPrice || p.showPrice);
    await prisma.product.update({ where: { id: p.id }, data: { views: { increment: 1 } } });
    related = await prisma.product.findMany({ where: { status: "ACTIVE", categoryId: p.categoryId, id: { not: p.id } }, take: 4, include: { images: true, category: true } });
  } catch { if (!p) return notFound(); }

  const imgs: string[] = (p.images || []).map((i: any) => i.url);
  const specs: [string, string][] = [
    ["SKU", p.sku], ["Category", p.category?.name || "-"], ["Fabric", p.fabric || "-"],
    ["Colours", (p.colours || []).join(", ") || "-"], ["Sizes", (p.sizes || []).join(", ") || "-"],
    ["MOQ", `${p.moq} pcs`], ["Status", p.status]
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-xs text-gray-500 mb-3">
        <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> › <Link href={`/shop?cat=${p.category?.slug || ""}`}>{p.category?.name}</Link> › <span className="text-black">{p.name}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery images={imgs} name={p.name} />
        <div>
          <h1 className="font-bold text-2xl mb-1">{p.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={p.rating || 4.2} count={p.ratingCount || 0} />
            <span className="text-xs text-gray-500">{(p.soldCount || 0).toLocaleString("en-IN")}+ pcs supplied</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            {p.mrp && <span className="text-3xl font-extrabold">₹{p.mrp.toLocaleString("en-IN")}</span>}
            <span className="text-xs text-gray-500">MRP • final wholesale rate on enquiry</span>
          </div>
          {showPrice && p.wholesalePrice && <div className="text-green-700 font-bold mb-1">Wholesale: ₹{p.wholesalePrice.toLocaleString("en-IN")} / pc</div>}
          <p className="text-sm text-gray-600 mb-4">{p.shortDesc || p.description}</p>
          <BuyBox p={{ id: p.id, slug: p.slug, name: p.name, sku: p.sku, image: imgs[0] || "", moq: p.moq, price: p.mrp || p.wholesalePrice || 0, bargainOn: p.bargainEnabled }} />
          <ul className="text-xs text-gray-600 grid gap-1 mt-4">
            <li>✓ Factory-direct wholesale • GST invoice available</li>
            <li>✓ 7-day size exchange on defects</li>
            <li>✓ Pan-India dispatch in 4–6 days</li>
          </ul>
        </div>
      </div>
      <ProductTabs desc={p.description || ""} specs={specs} />
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-bold text-xl mb-3">Similar Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r: any) => (
              <ProductCard key={r.id} p={{
                id: r.id, name: r.name, slug: r.slug, sku: r.sku, category: r.category?.name || "",
                colours: r.colours, sizes: r.sizes, moq: r.moq, showPrice: false, mrp: r.mrp,
                rating: r.rating, ratingCount: r.ratingCount, soldCount: r.soldCount,
                image: r.images?.[0]?.url || ""
              }} />
            ))}
          </div>
        </section>
      )}
      <div id="enquire" className="mt-8 max-w-2xl"><EnquiryForm productId={p.id} sku={p.sku} /></div>
    </div>
  );
}
