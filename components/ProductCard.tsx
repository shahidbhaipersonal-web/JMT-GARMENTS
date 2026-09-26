import Link from "next/link";
import WishButton from "./WishButton";

export type CardProduct = {
  id: string; name: string; slug: string; sku: string;
  category: string; colours: string[]; sizes: string[];
  moq: number; wholesalePrice?: number | null; showPrice: boolean;
  image?: string; mrp?: number | null; rating?: number; ratingCount?: number; soldCount?: number;
};

function PriceBlock({ p }: { p: CardProduct }) {
  // Wholesale shown ONLY when explicitly enabled with a real value — never mixed with MRP.
  if (p.showPrice && typeof p.wholesalePrice === "number") {
    return (
      <div>
        <div className="text-[11px] text-[var(--muted)]">Wholesale</div>
        <div className="font-extrabold text-lg">₹{p.wholesalePrice.toLocaleString("en-IN")}</div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[11px] text-[var(--muted)]">MRP</div>
      <div className="font-extrabold text-lg">{typeof p.mrp === "number" ? `₹${p.mrp.toLocaleString("en-IN")}` : "—"}</div>
      <div className="text-[11px] text-[var(--muted)]">Wholesale price on enquiry</div>
    </div>
  );
}

export default function ProductCard({ p }: { p: CardProduct }) {
  return (
    <div className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden flex flex-col hover:shadow-lg transition group">
      <Link href={`/product/${p.slug}`} className="relative aspect-[3/4] bg-[#f3ede4] flex items-center justify-center overflow-hidden">
        {p.image ? <img src={p.image} alt={`${p.name} — ${p.category} wholesale`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <span className="font-serif text-5xl text-[var(--burgundy)]">{p.name.charAt(0)}</span>}
        <span className="absolute top-2 left-2 bg-[var(--burgundy)] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">WHOLESALE</span>
        <span className="absolute top-2 right-2"><WishButton p={{ id: p.id, slug: p.slug, name: p.name, sku: p.sku, image: p.image || "" }} /></span>
      </Link>
      <div className="p-3 grid gap-1 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{p.category}</div>
        <Link href={`/product/${p.slug}`} className="font-semibold text-[15px] leading-snug hover:text-[var(--burgundy)] line-clamp-2 min-h-[40px]">{p.name}</Link>
        <PriceBlock p={p} />
        <div className="text-xs text-[var(--ink)]">MOQ: {p.moq} pcs</div>
        <div className="text-xs text-[var(--muted)]">Sizes: {p.sizes.slice(0, 4).join(", ")}{p.sizes.length > 4 ? "+" : ""}</div>
        <Link href={`/product/${p.slug}`} className="mt-1 text-center bg-[var(--burgundy)] text-white font-bold text-sm py-2.5 rounded-[10px] min-h-[44px] flex items-center justify-center">View Details</Link>
      </div>
    </div>
  );
}
