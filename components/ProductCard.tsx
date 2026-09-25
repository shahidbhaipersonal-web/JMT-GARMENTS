import Link from "next/link";
import RatingStars from "./RatingStars";
import WishButton from "./WishButton";

export type CardProduct = {
  id: string; name: string; slug: string; sku: string;
  category: string; colours: string[]; sizes: string[];
  moq: number; wholesalePrice?: number | null; showPrice: boolean;
  image?: string; mrp?: number | null; rating?: number; ratingCount?: number; soldCount?: number;
};

export default function ProductCard({ p }: { p: CardProduct }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition group">
      <Link href={`/product/${p.slug}`} className="relative h-64 bg-[#f3ede4] flex items-center justify-center overflow-hidden">
        {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <span className="font-serif text-5xl text-[#7a2340]">{p.name.charAt(0)}</span>}
        <span className="absolute top-2 left-2 bg-[var(--maroon)] text-white text-[11px] font-bold px-2 py-0.5 rounded">WHOLESALE</span>
        <span className="absolute top-2 right-2"><WishButton p={{ id: p.id, slug: p.slug, name: p.name, sku: p.sku, image: p.image || "" }} /></span>
      </Link>
      <div className="p-3 grid gap-1 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{p.category}</div>
        <Link href={`/product/${p.slug}`} className="font-semibold text-[15px] leading-snug hover:text-[var(--maroon)] line-clamp-2">{p.name}</Link>
        <RatingStars rating={p.rating ?? 4.2} count={p.ratingCount ?? 0} />
        <div className="flex items-baseline gap-2">
          {typeof p.mrp === "number" && <span className="font-extrabold text-lg">₹{p.mrp.toLocaleString("en-IN")}</span>}
          <span className="text-[11px] text-gray-500">MRP • wholesale on enquiry</span>
        </div>
        <div className="text-xs text-gray-500">MOQ: {p.moq} pcs • {p.sizes.slice(0, 4).join(", ")}{p.sizes.length > 4 ? "+" : ""}</div>
        {typeof p.soldCount === "number" && p.soldCount > 0 && <div className="text-[11px] text-green-700 font-semibold">{p.soldCount.toLocaleString("en-IN")}+ pcs supplied</div>}
      </div>
    </div>
  );
}
