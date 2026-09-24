import Link from "next/link";

export type CardProduct = {
  id: string; name: string; slug: string; sku: string;
  category: string; colours: string[]; sizes: string[];
  moq: number; wholesalePrice?: number | null; showPrice: boolean;
  image?: string;
};

export default function ProductCard({ p }: { p: CardProduct }) {
  const wa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "919876543210"}?text=${encodeURIComponent(`Hello, I am interested in Product: ${p.name}, SKU: ${p.sku}. Please share wholesale details.`)}`;
  return (
    <div className="bg-white border border-[var(--line)] rounded-2xl overflow-hidden flex flex-col">
      <Link href={`/product/${p.slug}`} className="h-64 bg-[#f3dfc9] flex items-center justify-center overflow-hidden">
        {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition" /> : <span className="font-serif text-5xl text-[#7a2340]">{p.name.charAt(0)}</span>}
      </Link>
      <div className="p-4 grid gap-1.5 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#7a2340]">{p.category}</div>
        <Link href={`/product/${p.slug}`} className="font-bold">{p.name}</Link>
        <div className="text-xs text-gray-500">SKU: {p.sku} • MOQ: {p.moq} pcs</div>
        <div className="text-xs text-gray-500">Sizes: {p.sizes.join(", ")} • Colours: {p.colours.join(", ")}</div>
        {p.showPrice && p.wholesalePrice ? <div className="font-extrabold">₹{p.wholesalePrice.toLocaleString("en-IN")} <span className="text-xs font-normal">wholesale</span></div> : null}
        <div className="flex gap-2 mt-2">
          <Link href={`/product/${p.slug}`} className="flex-1 text-center border border-[var(--maroon)] text-[var(--maroon)] font-bold text-sm py-2 rounded-lg">View Details</Link>
          <a href={wa} target="_blank" className="flex-1 text-center bg-[var(--maroon)] text-white font-bold text-sm py-2 rounded-lg">Enquire</a>
        </div>
      </div>
    </div>
  );
}
