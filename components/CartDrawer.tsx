"use client";
import Link from "next/link";
import { useStore } from "./StoreContext";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeCart, cartCount } = useStore();
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Enquiry Cart ({cartCount})</h2>
          <button onClick={() => setCartOpen(false)} className="text-2xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-auto p-4 grid gap-3 content-start">
          {cart.length === 0 && <p className="text-gray-500 text-sm">Cart khaali hai — products pe <b>Add to Cart</b> dabao, phir ek saath wholesale quote mango.</p>}
          {cart.map((i) => (
            <div key={i.id} className="flex gap-3 border rounded-lg p-2">
              <div className="w-16 h-20 bg-[#f3ede4] rounded overflow-hidden shrink-0 flex items-center justify-center font-serif text-2xl text-[#7a2340]">
                {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover" /> : i.name.charAt(0)}
              </div>
              <div className="flex-1 text-sm">
                <Link href={`/product/${i.slug}`} onClick={() => setCartOpen(false)} className="font-semibold">{i.name}</Link>
                <div className="text-xs text-gray-500">MOQ {i.moq} pcs</div>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="border rounded w-6 h-6">−</button>
                  <span className="font-bold">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="border rounded w-6 h-6">+</button>
                  <button onClick={() => removeCart(i.id)} className="text-xs text-red-700 underline ml-auto">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t grid gap-2">
            <Link href="/cart" onClick={() => setCartOpen(false)} className="bg-[var(--maroon)] text-white text-center font-bold py-2.5 rounded-lg">Request Wholesale Quote</Link>
            <button onClick={() => setCartOpen(false)} className="text-sm text-gray-600">Continue shopping</button>
          </div>
        )}
      </aside>
    </div>
  );
}
