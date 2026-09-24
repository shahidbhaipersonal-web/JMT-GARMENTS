"use client";
import { useEffect, useState } from "react";
import ProductCard, { CardProduct } from "@/components/ProductCard";

export default function ShopPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/products?q=${encodeURIComponent(q)}`);
        const j = await r.json();
        setItems(j.products || []);
      } catch { setItems([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="font-serif text-4xl mb-2">Shop</h1>
      <p className="text-gray-500 mb-6">Wholesale catalogue — enquire for bulk pricing.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, fabric, colour..." className="w-full border rounded-xl px-4 py-3 mb-6" />
      {loading ? <p>Loading...</p> : items.length === 0 ? <p>No products found.</p> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
