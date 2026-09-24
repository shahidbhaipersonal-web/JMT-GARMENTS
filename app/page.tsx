import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";

export default async function Home() {
  let settings = null, cats: any[] = [], featured: any[] = [];
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    cats = await prisma.category.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 10, include: { _count: { select: { products: true } } } });
    featured = await prisma.product.findMany({ where: { status: "ACTIVE", featured: true }, take: 8, include: { images: true, category: true }, orderBy: { createdAt: "desc" } });
    if (!featured.length) featured = await prisma.product.findMany({ where: { status: "ACTIVE" }, take: 8, include: { images: true, category: true }, orderBy: { createdAt: "desc" } });
  } catch { /* demo fallback below */ }

  const demo = [
    { id: "1", name: "Maroon Anarkali Set", slug: "maroon-anarkali-set", sku: "JMT-001", category: "Ethnic Wear", colours: ["Maroon", "Gold"], sizes: ["S", "M", "L", "XL"], moq: 12, wholesalePrice: 1899, showPrice: true, image: "" },
    { id: "2", name: "Floral Girls Frock", slug: "floral-girls-frock", sku: "JMT-002", category: "Kids Wear", colours: ["Pink"], sizes: ["4Y", "6Y", "8Y"], moq: 24, wholesalePrice: 799, showPrice: true, image: "" }
  ];
  const list = featured.length ? featured.map((p: any) => ({
    id: p.id, name: p.name, slug: p.slug, sku: p.sku, category: p.category?.name ?? "",
    colours: p.colours, sizes: p.sizes, moq: p.moq, wholesalePrice: p.wholesalePrice, showPrice: settings?.showPrice || p.showPrice,
    image: p.images?.find((i: any) => i.primary)?.url || p.images?.[0]?.url || ""
  })) : demo;

  return (
    <>
      <Hero title={settings?.heroTitle ?? "Discover Premium Women's Fashion"} subtitle={settings?.heroSubtitle ?? "Wholesale fashion collections crafted for modern retailers and boutiques."} image={settings?.heroImage ?? ""} />
      <section className="max-w-7xl mx-auto px-5 py-12">
        <h2 className="font-serif text-3xl mb-1">Shop by Category</h2>
        <p className="text-gray-500 mb-6">Dresses, suits, kurtis, lehenga, gowns and more.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(cats.length ? cats : [{ name: "Dresses", slug: "dresses", _count: { products: 12 } }, { name: "Kurtis", slug: "kurtis", _count: { products: 20 } }, { name: "Lehenga", slug: "lehenga", _count: { products: 8 } }, { name: "Gowns", slug: "gowns", _count: { products: 6 } }, { name: "Kids Wear", slug: "kids", _count: { products: 15 } }]).map((c: any) => (
            <a key={c.slug} href={`/shop?cat=${c.slug}`} className="bg-white border rounded-2xl p-5 hover:shadow-lg transition">
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-gray-500">{c._count?.products ?? 0} products</div>
            </a>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 pb-4">
        <h2 className="font-serif text-3xl mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}
