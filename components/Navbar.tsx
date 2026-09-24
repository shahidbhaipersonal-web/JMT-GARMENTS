"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-[var(--maroon)] text-white font-extrabold px-2.5 py-1.5 rounded-lg tracking-wider">JMT</span>
          <span className="font-bold tracking-wide">JMT GARMENTS</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/shop?filter=new">New Arrivals</Link><Link href="/wholesale">Wholesale</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/shop" className="hidden sm:inline-block text-sm font-semibold">Search</Link>
          <Link href="/contact" className="bg-[var(--maroon)] text-white text-sm font-bold px-4 py-2 rounded-lg">Enquire</Link>
          <button className="md:hidden px-2" onClick={() => setOpen(!open)} aria-label="menu">☰</button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t px-5 py-3 grid gap-2 text-sm font-semibold bg-white">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/wholesale" onClick={() => setOpen(false)}>Wholesale</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
