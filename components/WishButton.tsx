"use client";
import { useStore, WishItem } from "./StoreContext";

export default function WishButton({ p }: { p: WishItem }) {
  const { toggleWish, inWish } = useStore();
  const on = inWish(p.id);
  return (
    <button
      aria-label="wishlist"
      onClick={(e) => { e.preventDefault(); toggleWish(p); }}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow ${on ? "bg-red-600 text-white" : "bg-white/90 text-gray-600"}`}
    >
      {on ? "♥" : "♡"}
    </button>
  );
}
