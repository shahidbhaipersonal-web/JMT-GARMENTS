"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; slug: string; name: string; sku: string; image: string; moq: number; qty: number };
export type WishItem = { id: string; slug: string; name: string; sku: string; image: string };

type Store = {
  cart: CartItem[];
  wish: WishItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addCart: (p: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeCart: (id: string) => void;
  clearCart: () => void;
  toggleWish: (p: WishItem) => void;
  inWish: (id: string) => boolean;
  cartCount: number;
};

const Ctx = createContext<Store | null>(null);

function load<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fb; } catch { return fb; }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<WishItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load("jmt_cart", []));
    setWish(load("jmt_wish", []));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("jmt_cart", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("jmt_wish", JSON.stringify(wish)); }, [wish, ready]);

  const v = useMemo<Store>(() => ({
    cart, wish, cartOpen, setCartOpen,
    addCart: (p, qty = 1) => {
      setCart((c) => {
        const f = c.find((i) => i.id === p.id);
        if (f) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + qty } : i);
        return [...c, { ...p, qty }];
      });
      setCartOpen(true);
    },
    setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => i.id === id ? { ...i, qty } : i)),
    removeCart: (id) => setCart((c) => c.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    toggleWish: (p) => setWish((w) => w.some((i) => i.id === p.id) ? w.filter((i) => i.id !== p.id) : [...w, p]),
    inWish: (id) => wish.some((i) => i.id === id),
    cartCount: cart.reduce((s, i) => s + i.qty, 0)
  }), [cart, wish, cartOpen]);

  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
