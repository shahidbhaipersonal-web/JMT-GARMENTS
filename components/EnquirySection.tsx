"use client";
import { useState } from "react";

const inputCls = "w-full border border-[var(--line)] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[var(--burgundy)] bg-white";

export default function EnquirySection() {
  const [f, setF] = useState({ name: "", business: "", phone: "", city: "", product: "", qty: "", message: "" });
  const [errs, setErrs] = useState<string[]>([]);
  const [ok, setOk] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const bad: string[] = [];
    if (f.name.trim().length < 2) bad.push("Name required");
    if (!f.business.trim()) bad.push("Business / Shop Name required");
    if (f.phone.replace(/\D/g, "").length < 10) bad.push("Valid Mobile Number required");
    if (!f.city.trim()) bad.push("City required");
    if (!f.product) bad.push("Product / Category required");
    if (!Number(f.qty) || Number(f.qty) < 1) bad.push("Required Quantity required");
    setErrs(bad);
    if (bad.length) return;
    const r = await fetch("/api/enquiries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name, business: f.business, phone: f.phone, city: f.city,
        quantity: Number(f.qty), message: `[${f.product} x ${f.qty} pcs] ${f.message}`
      })
    });
    if (r.ok) {
      setOk("Thank you! Your wholesale enquiry has been received.");
      setF({ name: "", business: "", phone: "", city: "", product: "", qty: "", message: "" });
    } else setErrs(["Submission failed. Try again or WhatsApp us."]);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-9 md:py-14" aria-label="Request wholesale quote">
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-1">Request Wholesale Quote</h2>
      <p className="text-center text-sm text-[var(--muted)] mb-6">Bulk pricing for your store — reply within 24 hours</p>
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white border border-[var(--line)] rounded-[18px] p-5 md:p-8 grid gap-3" noValidate>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-xs font-bold" htmlFor="eq-name">Name *</label><input id="eq-name" className={inputCls} value={f.name} onChange={set("name")} placeholder="Your name" /></div>
          <div><label className="text-xs font-bold" htmlFor="eq-biz">Business / Shop Name *</label><input id="eq-biz" className={inputCls} value={f.business} onChange={set("business")} placeholder="Shop name" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-xs font-bold" htmlFor="eq-phone">Mobile Number *</label><input id="eq-phone" className={inputCls} value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" inputMode="tel" /></div>
          <div><label className="text-xs font-bold" htmlFor="eq-city">City *</label><input id="eq-city" className={inputCls} value={f.city} onChange={set("city")} placeholder="Your city" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold" htmlFor="eq-prod">Product / Category *</label>
            <select id="eq-prod" className={inputCls} value={f.product} onChange={set("product")}>
              <option value="">Select…</option>
              {["Dresses", "Suits", "Kurtis", "Lehengas", "Gowns", "Kids Wear", "Frocks", "Dupattas", "Co-ord Sets", "Party Wear", "Mixed Lot"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="text-xs font-bold" htmlFor="eq-qty">Required Quantity *</label><input id="eq-qty" className={inputCls} value={f.qty} onChange={set("qty")} placeholder="e.g. 50 pcs" inputMode="numeric" /></div>
        </div>
        <div><label className="text-xs font-bold" htmlFor="eq-msg">Message</label><textarea id="eq-msg" className={inputCls} rows={3} value={f.message} onChange={set("message")} placeholder="Sizes, colours, delivery city…" /></div>
        {!!errs.length && <ul className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-[10px] p-3">{errs.map((e) => <li key={e}>• {e}</li>)}</ul>}
        {ok && <p className="text-sm text-[var(--success)] bg-green-50 border border-green-200 rounded-[10px] p-3">{ok}</p>}
        <button className="bg-[var(--burgundy)] text-white font-bold py-3 rounded-[10px] min-h-[48px]">Send Wholesale Enquiry</button>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "919702493977"}?text=${encodeURIComponent("Hi JMT Garments, I want wholesale pricing for my store.")}`}
          target="_blank" className="bg-[var(--wa)] text-white font-bold py-3 rounded-[10px] text-center min-h-[48px]"
        >WhatsApp Enquiry</a>
      </form>
    </section>
  );
}
