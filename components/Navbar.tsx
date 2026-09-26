"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "./StoreContext";

const CATS = ["Dresses", "Suits", "Kurtis", "Lehengas", "Gowns", "Kids Wear", "Dupattas"];

function SearchForm({ mobile = false }: { mobile?: boolean }) {
  const [q, setQ] = useState("");
  const r = useRouter();
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); r.push(`/shop?q=${encodeURIComponent(q)}`); }}
      className={`flex bg-white rounded-[10px] overflow-hidden ${mobile ? "w-full" : "flex-1"}`}
      role="search"
    >
      <label htmlFor={mobile ? "msearch" : "dsearch"} className="sr-only">Search products</label>
      <input
        id={mobile ? "msearch" : "dsearch"}
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search dresses, kurtis, suits, lehengas..."
        className="flex-1 px-4 py-2.5 text-sm text-[var(--ink)] outline-none min-w-0"
      />
      <button className="bg-[var(--gold)] text-[var(--burgundy-dark)] font-bold px-5 text-sm min-h-[44px]">Search</button>
    </form>
  );
}

export default function Navbar() {
  const { cartCount, wish, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* announcement bar */}
      <div className="bg-[var(--burgundy-dark)] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-center sm:justify-between items-center gap-4">
          <span className="tracking-wide">Wholesale Only • Bulk Orders • Pan-India Dispatch</span>
          <span className="hidden sm:flex gap-4">
            <Link href="/contact" className="hover:underline">Contact Us</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "919702493977"}`} target="_blank" className="hover:underline">WhatsApp</a>
          </span>
        </div>
      </div>

      {/* desktop header */}
      <div className="hidden md:block bg-[var(--burgundy)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/" className="leading-none shrink-0" aria-label="JMT Garments home">
            <span className="block font-serif text-[26px] font-bold tracking-wide">JMT</span>
            <span className="block text-[11px] tracking-[0.35em] text-[var(--gold-light)]">GARMENTS</span>
          </Link>
          <SearchForm />
          <div className="flex items-center gap-5 shrink-0">
            <Link href="/wishlist" className="relative text-center" aria-label="Wishlist">
              <span className="text-2xl">♡</span>
              {wish.length > 0 && <span className="absolute -top-1 -right-1 bg-[var(--gold)] text-black text-[11px] font-bold rounded-full px-1.5">{wish.length}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative text-center" aria-label="Wholesale cart">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[var(--gold)] text-black text-[11px] font-bold rounded-full px-1.5">{cartCount}</span>}
            </button>
            <Link href="/admin/login" className="text-center" aria-label="Seller login">
              <span className="text-2xl">👤</span>
              <span className="block text-[11px] opacity-80">Seller Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* mobile header row 1 */}
      <div className="md:hidden bg-[var(--burgundy)] text-white">
        <div className="px-4 pt-2.5 flex items-center justify-between">
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="text-2xl min-w-[44px] min-h-[44px]">☰</button>
          <Link href="/" className="leading-none text-center" aria-label="JMT Garments home">
            <span className="block font-serif text-[22px] font-bold tracking-wide">JMT</span>
            <span className="block text-[9px] tracking-[0.35em] text-[var(--gold-light)]">GARMENTS</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/wishlist" aria-label="Wishlist" className="relative text-xl min-w-[44px] min-h-[44px] flex items-center justify-center">♡
              {wish.length > 0 && <span className="absolute top-1 right-0 bg-[var(--gold)] text-black text-[10px] font-bold rounded-full px-1">{wish.length}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label="Wholesale cart" className="relative text-xl min-w-[44px] min-h-[44px]">🛒
              {cartCount > 0 && <span className="absolute top-1 right-0 bg-[var(--gold)] text-black text-[10px] font-bold rounded-full px-1">{cartCount}</span>}
            </button>
          </div>
        </div>
        {/* mobile row 2: full-width search */}
        <div className="px-4 pb-3 pt-1"><SearchForm mobile /></div>
      </div>

      {/* nav strip (desktop) */}
      <nav className="hidden md:block bg-[var(--burgundy-dark)] text-white text-[13px]" aria-label="Categories">
        <div className="max-w-7xl mx-auto px-4 flex gap-5 py-2">
          <Link href="/shop" className="font-bold">All Products</Link>
          <Link href="/shop?filter=new" className="text-[var(--gold-light)] font-bold">New Arrivals</Link>
          {CATS.map((c) => <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="opacity-90 hover:opacity-100">{c}</Link>)}
        </div>
      </nav>

      {/* mobile menu dropdown */}
      {open && (
        <nav className="md:hidden bg-[var(--burgundy-dark)] text-white text-sm px-4 py-2 grid gap-1" aria-label="Menu">
          {[["All Products", "/shop"], ["New Arrivals", "/shop?filter=new"], ...CATS.map((c): [string, string] => [c, `/shop?cat=${encodeURIComponent(c)}`]), ["Wholesale Enquiry", "/wholesale"], ["Seller Login", "/admin/login"]].map(([l, h]) => (
            <Link key={l} href={h} onClick={() => setOpen(false)} className="py-2.5 border-b border-white/10 last:border-0">{l}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
