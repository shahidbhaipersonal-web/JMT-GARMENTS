"use client";
import { useState } from "react";

export default function EnquiryForm({ productId, sku }: { productId?: string; sku?: string }) {
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const r = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, productId, sku }) });
    if (r.ok) { setOk(true); (e.target as HTMLFormElement).reset(); } else { const j = await r.json().catch(() => ({})); setErr(j.error || "Failed. Try again."); }
  }
  return (
    <form onSubmit={submit} className="bg-white border rounded-2xl p-5 grid gap-2">
      <h3 className="font-bold text-lg">Request Wholesale Quote</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        <input name="name" required placeholder="Your name" className="border rounded-lg px-3 py-2" />
        <input name="phone" required placeholder="Mobile number" className="border rounded-lg px-3 py-2" />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <input name="business" placeholder="Business / Shop name" className="border rounded-lg px-3 py-2" />
        <input name="city" placeholder="City" className="border rounded-lg px-3 py-2" />
      </div>
      <input name="quantity" type="number" min={1} placeholder="Required quantity (pcs)" className="border rounded-lg px-3 py-2" />
      <textarea name="message" rows={3} placeholder="Message" className="border rounded-lg px-3 py-2" />
      <button className="bg-[var(--maroon)] text-white font-bold py-2.5 rounded-lg">Request Wholesale Quote</button>
      {ok && <p className="text-green-700 text-sm">Enquiry saved. We will contact you soon.</p>}
      {err && <p className="text-red-700 text-sm">{err}</p>}
    </form>
  );
}
