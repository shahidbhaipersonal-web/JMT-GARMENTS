"use client";
import { useRef } from "react";
import ProductCard, { CardProduct } from "./ProductCard";

export default function ProductCarousel({ title, sub, items }: { title: string; sub?: string; items: CardProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);
  if (!items.length) return null;
  const go = (d: number) => ref.current?.scrollBy({ left: d * 480, behavior: "smooth" });
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <div><h2 className="font-bold text-2xl">{title}</h2>{sub && <p className="text-sm text-gray-500">{sub}</p>}</div>
        <div className="flex gap-2">
          <button onClick={() => go(-1)} aria-label="prev" className="w-9 h-9 border rounded-full bg-white">‹</button>
          <button onClick={() => go(1)} aria-label="next" className="w-9 h-9 border rounded-full bg-white">›</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {items.map((p) => <div key={p.id} className="min-w-[220px] max-w-[220px] snap-start"><ProductCard p={p} /></div>)}
      </div>
    </section>
  );
}
