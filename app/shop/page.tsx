"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard, { CardProduct } from "@/components/ProductCard";

const SIZES = ["S", "M", "L", "XL", "XXL", "4Y", "6Y", "8Y", "10Y"];
const MRP_BANDS = [["Under ₹1000", 0, 1000], ["₹1000–1500", 1000, 1500], ["₹1500–2500", 1500, 2500], ["Above ₹2500", 2500, 9999999]] as [string, number, number][];

function ShopInner() {
  const sp = useSearchParams();
  const [items, setItems] = useState<CardProduct[]>([]);
  const [cats, setCats] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selCats, setSelCats] = useState<string[]>(sp.get("cat")?.split(",").filter(Boolean) || []);
  const [selSizes, setSelSizes] = useState<string[]>([]);
  const [band, setBand] = useState<number>(-1);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const q = sp.get("q") || "";
  const PER = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pr, cr] = await Promise.all([
          fetch(`/api/products?q=${encodeURIComponent(q)}`).then((r) => r.json()),
          fetch("/api/categories").then((r) => r.json()).catch(() => ({ categories: [] }))
        ]);
        setItems(pr.products || []);
        setCats(cr.categories || []);
      } catch { setItems([]); }
      setLoading(false);
    })();
  }, [q]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let l = items.filter((p) => {
      const catOk = selCats.length === 0 || selCats.some((s) => p.category.toLowerCase().includes(s.toLowerCase()) || p.category === s);
      const sizeOk = selSizes.length === 0 || selSizes.some((s) => p.sizes.includes(s));
      const priceOk = band < 0 || ((p.mrp || 0) >= MRP_BANDS[band][1] && (p.mrp || 0) < MRP_BANDS[band][2]);
      const rateOk = (p.rating || 0) >= minRating;
      return catOk && sizeOk && priceOk && rateOk;
    });
    if (sort === "low") l = [...l].sort((a, b) => (a.mrp || 0) - (b.mrp || 0));
    if (sort === "high") l = [...l].sort((a, b) => (b.mrp || 0) - (a.mrp || 0));
    if (sort === "rating") l = [...l].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "az") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [items, selCats, selSizes, band, minRating, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[230px_1fr] gap-6">
      <aside className="bg-white border rounded-lg p-4 h-fit text-sm">
        <h2 className="font-bold mb-3">Filters {q && <span className="font-normal text-gray-500">for “{q}”</span>}</h2>
        <div className="mb-4">
          <div className="font-bold text-[13px] mb-1">Category</div>
          {(cats.length ? cats.map((c) => c.name) : ["Dresses", "Suits", "Kurtis", "Lehenga", "Gowns", "Frocks", "Kids Wear", "Dupattas"]).map((c) => (
            <label key={c} className="flex gap-2 py-0.5"><input type="checkbox" checked={selCats.includes(c)} onChange={() => { toggle(selCats, c, setSelCats); setPage(1); }} />{c}</label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-bold text-[13px] mb-1">Size</div>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => <button key={s} onClick={() => { toggle(selSizes, s, setSelSizes); setPage(1); }} className={`border rounded px-2 py-1 text-xs ${selSizes.includes(s) ? "bg-[var(--maroon)] text-white" : ""}`}>{s}</button>)}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-[13px] mb-1">MRP</div>
          {MRP_BANDS.map(([label], i) => (
            <label key={label} className="flex gap-2 py-0.5"><input type="radio" name="mrp" checked={band === i} onChange={() => { setBand(band === i ? -1 : i); setPage(1); }} />{label}</label>
          ))}
        </div>
        <div>
          <div className="font-bold text-[13px] mb-1">Rating</div>
          {[0, 4, 4.5].map((r) => (
            <label key={r} className="flex gap-2 py-0.5"><input type="radio" name="rate" checked={minRating === r} onChange={() => { setMinRating(r); setPage(1); }} />{r === 0 ? "All" : `${r}★ & above`}</label>
          ))}
        </div>
      </aside>
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-600">{filtered.length} products{q ? ` for “${q}”` : ""}</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm">
            <option value="new">Newest</option><option value="rating">Top Rated</option>
            <option value="low">MRP: Low to High</option><option value="high">MRP: High to Low</option>
            <option value="az">Name A–Z</option>
          </select>
        </div>
        {loading ? <p>Loading…</p> : shown.length === 0 ? <p className="text-gray-500">No products match. Clear filters.</p> : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            <div className="flex gap-2 justify-center mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 border rounded ${n === page ? "bg-[var(--maroon)] text-white" : "bg-white"}`}>{n}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<p className="p-6">Loading…</p>}><ShopInner /></Suspense>;
}
