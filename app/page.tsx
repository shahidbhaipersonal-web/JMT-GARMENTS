import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { CardProduct } from "@/components/ProductCard";
import { prisma } from "@/lib/db";

function toCard(p: any, showPrice: boolean): CardProduct {
  return {
    id: p.id, name: p.name, slug: p.slug, sku: p.sku, category: p.category?.name ?? "",
    colours: p.colours, sizes: p.sizes, moq: p.moq, wholesalePrice: p.wholesalePrice,
    showPrice, mrp: p.mrp, rating: p.rating, ratingCount: p.ratingCount, soldCount: p.soldCount,
    image: p.images?.find((i: any) => i.primary)?.url || p.images?.[0]?.url || ""
  };
}

export default async function Home() {
  let cats: any[] = [], featured: CardProduct[] = [], fresh: CardProduct[] = [], top: CardProduct[] = [];
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    const show = Boolean(settings?.showPrice);
    cats = await prisma.category.findMany({ where: { active: true }, orderBy: { order: "asc" }, include: { _count: { select: { products: true } } } });
    const inc = { images: true, category: true };
    const f = await prisma.product.findMany({ where: { status: "ACTIVE", featured: true }, take: 10, include: inc, orderBy: { createdAt: "desc" } });
    const n = await prisma.product.findMany({ where: { status: "ACTIVE", newArrival: true }, take: 10, include: inc, orderBy: { createdAt: "desc" } });
    const t = await prisma.product.findMany({ where: { status: "ACTIVE" }, take: 10, include: inc, orderBy: { soldCount: "desc" } });
    featured = f.map((p) => toCard(p, show || p.showPrice));
    fresh = n.map((p) => toCard(p, show || p.showPrice));
    top = t.map((p) => toCard(p, show || p.showPrice));
  } catch { /* show sections that loaded */ }

  return (
    <>
      <HeroCarousel />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="font-bold text-2xl mb-1">Shop by Category</h2>
        <p className="text-sm text-gray-500 mb-4">Dresses, suits, kurtis, lehenga, gowns and more.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cats.map((c: any) => (
            <Link key={c.id} href={`/shop?cat=${c.slug}`} className="bg-white border rounded-lg p-3 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#5c1a2e] to-[#c9a86a] text-white font-serif text-2xl flex items-center justify-center mb-2">{c.name.charAt(0)}</div>
              <div className="font-semibold text-[13px]">{c.name}</div>
              <div className="text-[11px] text-gray-500">{c._count?.products ?? 0} items</div>
            </Link>
          ))}
        </div>
      </section>

      <ProductCarousel title="Best of Ethnic Wear" sub="Retailer-favourite bulk designs" items={featured} />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/shop?filter=new" className="rounded-lg bg-gradient-to-r from-[#5c1a2e] to-[#8a2f4d] text-white p-6">
            <div className="text-xs uppercase tracking-widest opacity-80">New Arrivals</div>
            <div className="font-serif text-2xl">Fresh designs every month</div>
            <div className="text-sm mt-1 underline">Shop now →</div>
          </Link>
          <Link href="/wholesale" className="rounded-lg bg-gradient-to-r from-[#1f3a5f] to-[#2b5c8a] text-white p-6">
            <div className="text-xs uppercase tracking-widest opacity-80">Bulk Orders</div>
            <div className="font-serif text-2xl">MOQ from 6 pcs • Pan-India dispatch</div>
            <div className="text-sm mt-1 underline">Request quote →</div>
          </Link>
        </div>
      </section>

      <ProductCarousel title="New Arrivals" sub="Just landed in the catalogue" items={fresh} />
      <ProductCarousel title="Bestsellers" sub="Most supplied pcs this season" items={top} />

      <section className="bg-white border-t mt-4">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[["✓ Genuine Products", "Factory-direct catalogue"], ["◉ Bulk Pricing", "Wholesale rates on enquiry"], ["↺ 7-Day Exchange", "Size exchange support"], ["▣ Pan-India Dispatch", "Transport + courier options"]].map(([a, b]) => (
            <div key={a} className="flex gap-2 items-start"><span className="text-xl">{a.split(" ")[0]}</span><span><b>{a.split(" ").slice(1).join(" ")}</b><br /><span className="text-gray-500 text-xs">{b}</span></span></div>
          ))}
        </div>
      </section>
    </>
  );
}
