"use client";
import { useState } from "react";
import { useStore } from "./StoreContext";
import BargainModal from "./BargainModal";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [n, setN] = useState(0);
  if (!images.length) {
    return <div className="rounded-lg bg-[#f3ede4] min-h-[420px] flex items-center justify-center font-serif text-7xl text-[#7a2340]">{name.charAt(0)}</div>;
  }
  return (
    <div>
      <div className="rounded-lg overflow-hidden bg-[#f3ede4] min-h-[420px] flex items-center justify-center">
        <img src={images[n]} alt={name} className="w-full max-h-[520px] object-cover" />
      </div>
      <div className="flex gap-2 mt-2">
        {images.slice(0, 6).map((src, i) => (
          <button key={i} onClick={() => setN(i)} className={`w-16 h-16 rounded border-2 overflow-hidden ${i === n ? "border-[var(--maroon)]" : "border-gray-200"}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function BuyBox({ p }: { p: { id: string; slug: string; name: string; sku: string; image: string; moq: number; price: number; bargainOn: boolean } }) {
  const { addCart } = useStore();
  const [qty, setQty] = useState(p.moq);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [bargain, setBargain] = useState(false);
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Qty (MOQ {p.moq}):</span>
        <button onClick={() => setQty(Math.max(p.moq, qty - 1))} className="border rounded w-8 h-8">−</button>
        <input value={qty} onChange={(e) => setQty(Math.max(p.moq, Number(e.target.value) || p.moq))} className="border rounded w-16 text-center py-1" inputMode="numeric" />
        <button onClick={() => setQty(qty + 1)} className="border rounded w-8 h-8">+</button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => addCart(p, qty)} className="flex-1 bg-[var(--gold)] text-black font-bold py-3 rounded">ADD TO CART</button>
        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "919702493977"}?text=${encodeURIComponent(`Hello, I want ${p.name} (${p.sku}) x ${qty} pcs. Share wholesale price.`)}`} target="_blank" className="flex-1 text-center bg-[var(--maroon)] text-white font-bold py-3 rounded">ENQUIRE NOW</a>
      </div>
      <div className="flex gap-2 items-center text-sm">
        <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Delivery pincode" className="border rounded px-2 py-1.5 w-36" inputMode="numeric" />
        <button onClick={() => setPinMsg(pin.length === 6 ? `✓ Dispatch to ${pin} in 4–6 days (estimate).` : "6-digit pincode dalo.")} className="underline">Check</button>
      </div>
      {pinMsg && <p className="text-xs text-gray-600">{pinMsg}</p>}
      {p.bargainOn && (
        <button onClick={() => setBargain(true)} className="w-full border-2 border-orange-600 text-orange-700 font-bold py-2.5 rounded">🤝 Bargain karo — Mol-Bhav Raja se mol-bhav!</button>
      )}
      {bargain && <BargainModal productId={p.id} price={p.price} onClose={() => setBargain(false)} />}
    </div>
  );
}

export function ProductTabs({ desc, specs }: { desc: string; specs: [string, string][] }) {
  const [t, setT] = useState(0);
  return (
    <div className="mt-8 bg-white border rounded-lg">
      <div className="flex border-b text-sm font-bold">
        {["Description", "Specifications", "Bulk Terms"].map((x, i) => (
          <button key={x} onClick={() => setT(i)} className={`px-4 py-2.5 ${t === i ? "border-b-2 border-[var(--maroon)] text-[var(--maroon)]" : "text-gray-500"}`}>{x}</button>
        ))}
      </div>
      <div className="p-4 text-sm">
        {t === 0 && <p>{desc || "Premium wholesale garment from JMT Garments catalogue."}</p>}
        {t === 1 && <table className="w-full">{specs.map(([k, v]) => <tr key={k} className="border-b"><td className="py-1.5 text-gray-500 w-32">{k}</td><td className="py-1.5 font-medium">{v}</td></tr>)}</table>}
        {t === 2 && <ul className="list-disc ml-5 grid gap-1 text-gray-700"><li>Wholesale only — no single-piece retail.</li><li>Price confirmed on call/WhatsApp after enquiry.</li><li>7-day size exchange on manufacturing defects.</li><li>Pan-India dispatch via transport or courier.</li></ul>}
      </div>
    </div>
  );
}
