"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreContext";

export default function MobileBottomNav() {
  const { cartCount, wish } = useStore();
  const path = usePathname();
  const items = [
    { l: "Home", h: "/", i: "⌂" },
    { l: "Search", h: "/shop", i: "🔍" },
    { l: "Wishlist", h: "/wishlist", i: "♡", n: wish.length },
    { l: "Cart", h: "/cart", i: "🛒", n: cartCount },
    { l: "Menu", h: "/shop", i: "☰" }
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--line)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]" aria-label="Bottom navigation">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const on = path === it.h && it.l !== "Menu" && it.l !== "Search";
          return (
            <Link key={it.l} href={it.h} className={`relative flex flex-col items-center py-2 text-[11px] min-h-[56px] justify-center ${on ? "text-[var(--burgundy)] font-bold" : "text-[var(--muted)]"}`}>
              <span className="text-xl leading-none">{it.i}</span>
              {it.l}
              {!!it.n && <span className="absolute top-1 right-1/2 translate-x-4 bg-[var(--burgundy)] text-white text-[10px] font-bold rounded-full px-1.5">{it.n}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
