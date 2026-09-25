"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  { tag: "Festive Collection 2026", title: "Anarkali, Lehenga & Suits — Wholesale Rates", sub: "Factory-rate bulk catalogue for retailers and boutiques.", cta: "Shop Ethnic Wear", href: "/shop?cat=Lehenga", bg: "from-[#5c1a2e] via-[#7a2340] to-[#b76a85]" },
  { tag: "Kids Wear Bulk", title: "Girls Frocks from ₹799 MRP", sub: "MOQ 24 pcs • sizes 2Y–10Y • soft cotton lining.", cta: "Shop Kids Wear", href: "/shop?cat=Kids%20Wear", bg: "from-[#1f3a5f] via-[#2b5c8a] to-[#c9a86a]" },
  { tag: "Daily Wear Kurtis", title: "Cotton Kurtis — New Designs Every Month", sub: "Sizes S–XXL • 5000+ pcs supplied every month.", cta: "Shop Kurtis", href: "/shop?cat=Kurtis", bg: "from-[#3d2b1f] via-[#6b4a2f] to-[#c9a86a]" }
];

export default function HeroCarousel() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[n];
  return (
    <section className={`bg-gradient-to-br ${s.bg} text-white`}>
      <div className="max-w-7xl mx-auto px-5 py-14 min-h-[300px]">
        <div className="text-xs tracking-widest uppercase opacity-80 mb-2">{s.tag}</div>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-3 max-w-2xl">{s.title}</h1>
        <p className="opacity-90 mb-5 max-w-xl">{s.sub}</p>
        <Link href={s.href} className="inline-block bg-white text-black font-bold px-6 py-3 rounded">Explore Collection</Link>
        <div className="flex gap-2 mt-6">
          {SLIDES.map((_, i) => (
            <button key={i} aria-label={`slide ${i + 1}`} onClick={() => setN(i)} className={`h-1.5 rounded-full transition-all ${i === n ? "w-8 bg-white" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
