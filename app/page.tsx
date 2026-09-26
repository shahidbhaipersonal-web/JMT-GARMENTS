import Link from "next/link";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ProductCarousel from "@/components/ProductCarousel";
import WholesaleCTA from "@/components/WholesaleCTA";
import HowToOrder from "@/components/HowToOrder";
import EnquirySection from "@/components/EnquirySection";
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
  let cats: any[] = [], fresh: CardProduct[] = [], best: CardProduct[] = [];
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    const show = Boolean(settings?.showPrice);
    cats = await prisma.category.findMany({ where: { active: true }, orderBy: { order: "asc" }, include: { _count: { select: { products: true } } } });
    const inc = { images: true, category: true };
    const n = await prisma.product.findMany({ where: { status: "ACTIVE", newArrival: true }, take: 10, include: inc, orderBy: { createdAt: "desc" } });
    const b = await prisma.product.findMany({ where: { status: "ACTIVE", bestseller: true }, take: 10, include: inc, orderBy: { createdAt: "desc" } });
    fresh = n.map((p) => toCard(p, show || p.showPrice));
    best = b.map((p) => toCard(p, show || p.showPrice));
  } catch { /* sections render empty states */ }

  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="max-w-7xl mx-auto px-4 py-9 md:py-14" aria-label="Shop by category">
        <div className="flex items-end justify-between mb-1">
          <h2 className="font-serif text-3xl md:text-4xl">Shop by Category</h2>
          <Link href="/shop" className="text-sm font-bold text-[var(--burgundy)]">View All →</Link>
        </div>
        <p className="text-sm text-[var(--muted)] mb-6">Explore our wholesale fashion collection</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cats.map((c: any) => (
            <Link key={c.id} href={`/shop?cat=${c.slug}`} className="group bg-white border border-[var(--line)] rounded-[16px] overflow-hidden hover:shadow-lg transition">
              <span className="block aspect-[4/5] bg-[#efe6da] overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={`${c.name} wholesale`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center font-serif text-4xl text-[var(--burgundy)]">{c.name.charAt(0)}</span>
                )}
              </span>
              <span className="block p-3 text-center">
                <span className="block font-bold text-[15px]">{c.name}</span>
                <span className="block text-xs text-[var(--muted)]">{c._count?.products ?? 0} Products</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="New arrivals">
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <h2 className="font-serif text-3xl md:text-4xl mb-1">New Arrivals</h2>
          <p className="text-sm text-[var(--muted)]">Fresh designs just landed in the catalogue</p>
        </div>
        {fresh.length ? (
          <ProductCarousel title="" items={fresh} />
        ) : (
          <p className="max-w-7xl mx-auto px-4 py-6 text-sm text-[var(--muted)]">New designs coming soon.</p>
        )}
      </section>

      <WholesaleCTA />

      <section aria-label="Bestsellers">
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <h2 className="font-serif text-3xl md:text-4xl mb-1">Wholesale Bestsellers</h2>
          <p className="text-sm text-[var(--muted)]">Popular designs selected by retailers</p>
        </div>
        {best.length ? (
          <ProductCarousel title="" items={best} />
        ) : (
          <p className="max-w-7xl mx-auto px-4 py-6 text-sm text-[var(--muted)]">Bestsellers updating soon.</p>
        )}
      </section>

      <HowToOrder />
      <EnquirySection />
    </>
  );
}
