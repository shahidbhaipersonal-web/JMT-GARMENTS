"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/StoreContext";

export default function CartPage() {
  const { cart, setQty, removeCart, clearCart, cartCount } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setOk("");
    const r = await fetch("/api/quotations", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, city, items: cart.map((i) => ({ productId: i.id, productName: i.name, quantity: i.qty })) })
    });
    const j = await r.json();
    if (!r.ok) { setErr(j.error || "Failed."); return; }
    setOk(`Quote request #${j.id.slice(0, 8)} received — team will call for pricing.`);
    clearCart();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-[1fr_320px] gap-6">
      <div>
        <h1 className="font-bold text-2xl mb-4">Wholesale Enquiry Cart ({cartCount})</h1>
        {cart.length === 0 ? <p className="text-gray-500">Cart khaali hai. <Link href="/shop" className="underline">Shop now →</Link></p> : (
          <div className="grid gap-3">
            {cart.map((i) => (
              <div key={i.id} className="bg-white border rounded-lg p-3 flex gap-3">
                <div className="w-20 h-24 bg-[#f3ede4] rounded overflow-hidden shrink-0 flex items-center justify-center font-serif text-3xl text-[#7a2340]">
                  {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover" /> : i.name.charAt(0)}
                </div>
                <div className="flex-1 text-sm">
                  <Link href={`/product/${i.slug}`} className="font-semibold">{i.name}</Link>
                  <div className="text-xs text-gray-500">SKU {i.sku} • MOQ {i.moq}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="border rounded w-7 h-7">−</button>
                    <span className="font-bold w-8 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="border rounded w-7 h-7">+</button>
                    <button onClick={() => removeCart(i.id)} className="text-xs text-red-700 underline ml-auto">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white border rounded-lg p-4 h-fit">
        <h2 className="font-bold mb-2">Selected Products</h2>
        <div className="text-sm grid gap-1 mb-3">
          <div className="flex justify-between"><span className="text-[var(--muted)]">Total Products</span><b>{cart.length}</b></div>
          <div className="flex justify-between"><span className="text-[var(--muted)]">Total Quantity</span><b>{totalQty} pcs</b></div>
        </div>
        <h2 className="font-bold mb-2">Request Wholesale Quote</h2>
        <p className="text-xs text-gray-500 mb-3">{cart.length} styles • {totalQty} pcs total • price confirmed on call.</p>
        <form onSubmit={submit} className="grid gap-2 text-sm">
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="border rounded px-2 py-2" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Mobile number" className="border rounded px-2 py-2" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border rounded px-2 py-2" />
          <button disabled={cart.length === 0} className="bg-[var(--maroon)] text-white font-bold py-2.5 rounded disabled:opacity-40">Submit Quote Request</button>
          {ok && <p className="text-green-700 text-xs">{ok}</p>}
          {err && <p className="text-red-700 text-xs">{err}</p>}
        </form>
      </div>
    </div>
  );
}
