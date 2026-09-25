"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "./StoreContext";

const CATS = ["Dresses", "Suits", "Kurtis", "Lehenga", "Gowns", "Frocks", "Kids Wear", "Dupattas"];

export default function Navbar() {
  const { cartCount, wish, setCartOpen } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const r = useRouter();

  function go(e: React.FormEvent) {
    e.preventDefault();
    r.push(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div className="bg-[#1a0a11] text-[#e8d9de] text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between">
          <span>Wholesale only • Bulk orders for retailers &amp; boutiques</span>
          <span className="hidden sm:flex gap-4"><Link href="/wholesale">Bulk Enquiry</Link><Link href="/contact">Help</Link><Link href="/admin/login">Seller Login</Link></span>
        </div>
      </div>
      <div className="bg-[var(--maroon)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="bg-white text-[var(--maroon)] font-extrabold px-2 py-1 rounded tracking-wider">JMT</span>
            <span className="font-bold tracking-wide hidden xs:inline">GARMENTS</span>
          </Link>
          <form onSubmit={go} className="flex-1 flex bg-white rounded overflow-hidden">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dresses, kurtis, lehenga, SKU…" className="flex-1 px-3 py-2 text-sm text-black outline-none" />
            <button className="bg-[var(--gold)] text-black font-bold px-4 text-sm">Search</button>
          </form>
          <Link href="/wishlist" className="relative shrink-0 px-2 text-center">
            <span className="text-xl">♡</span>
            {wish.length > 0 && <span className="absolute -top-1 right-0 bg-[var(--gold)] text-black text-[11px] font-bold rounded-full px-1.5">{wish.length}</span>}
            <span className="hidden md:block text-[11px]">Wishlist</span>
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative shrink-0 px-2 text-center">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && <span className="absolute -top-1 right-0 bg-[var(--gold)] text-black text-[11px] font-bold rounded-full px-1.5">{cartCount}</span>}
            <span className="hidden md:block text-[11px]">Enquiry Cart</span>
          </button>
          <button className="md:hidden px-1" onClick={() => setOpen(!open)} aria-label="menu">☰</button>
        </div>
      </div>
      <nav className="bg-[#2b0f1a] text-white text-[13px] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex gap-5 py-1.5">
          <Link href="/shop" className="font-bold">All Products</Link>
          {CATS.map((c) => <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="opacity-90 hover:opacity-100">{c}</Link>)}
          <Link href="/shop?filter=new" className="text-[var(--gold)] font-bold">New Arrivals</Link>
        </div>
      </nav>
      {open && (
        <nav className="md:hidden bg-[#2b0f1a] text-white text-sm px-4 py-2 grid gap-2">
          <Link href="/shop" onClick={() => setOpen(false)}>All Products</Link>
          {CATS.map((c) => <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} onClick={() => setOpen(false)}>{c}</Link>)}
          <Link href="/cart" onClick={() => setOpen(false)}>Enquiry Cart ({cartCount})</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist ({wish.length})</Link>
        </nav>
      )}
    </header>
  );
}
