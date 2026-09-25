"use client";
import Link from "next/link";
import { useStore } from "@/components/StoreContext";

export default function WishlistPage() {
  const { wish, toggleWish } = useStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-bold text-2xl mb-4">Wishlist ({wish.length})</h1>
      {wish.length === 0 ? <p className="text-gray-500">Kuch save nahi kiya. <Link href="/shop" className="underline">Shop now →</Link></p> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {wish.map((w) => (
            <div key={w.id} className="bg-white border rounded-lg overflow-hidden">
              <Link href={`/product/${w.slug}`} className="h-56 bg-[#f3ede4] flex items-center justify-center overflow-hidden font-serif text-5xl text-[#7a2340]">
                {w.image ? <img src={w.image} alt={w.name} className="w-full h-full object-cover" /> : w.name.charAt(0)}
              </Link>
              <div className="p-3">
                <Link href={`/product/${w.slug}`} className="font-semibold text-sm">{w.name}</Link>
                <button onClick={() => toggleWish(w)} className="text-xs text-red-700 underline mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
