"use client";
import { useState } from "react";

export default function BargainControls({ p }: { p: { id: string; name: string; sku: string; mrp: number | null; bargainEnabled: boolean; floorPrice: number | null; costPrice: number | null; maxAttempts: number; sessionTimeoutMin: number; bestseller: boolean; featured: boolean } }) {
  const [on, setOn] = useState(p.bargainEnabled);
  const [best, setBest] = useState(p.bestseller);
  const [feat, setFeat] = useState(p.featured);
  const [floor, setFloor] = useState(String(p.floorPrice ?? ""));
  const [cost, setCost] = useState(String(p.costPrice ?? ""));
  const [tries, setTries] = useState(String(p.maxAttempts));
  const [mins, setMins] = useState(String(p.sessionTimeoutMin));
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");
    const r = await fetch(`/api/admin/products/${p.id}/bargain`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bargainEnabled: on,
        floorPrice: floor === "" ? null : Number(floor),
        costPrice: cost === "" ? null : Number(cost),
        maxAttempts: Number(tries),
        sessionTimeoutMin: Number(mins),
        bestseller: best,
        featured: feat
      })
    });
    setMsg(r.ok ? "Saved ✓" : "Failed");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <tr className="border-b">
      <td className="p-2">{p.name}<div className="text-xs text-gray-500">{p.sku} • MRP ₹{p.mrp || "-"}</div></td>
      <td className="p-2"><input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="auto" title="Floor — bot isse neeche kabhi nahi jayega" className="border rounded w-20 px-1 py-0.5" inputMode="numeric" /></td>
      <td className="p-2"><input value={cost} onChange={(e) => setCost(e.target.value)} placeholder="—" title="Cost — sirf tumhare hisaab ke liye" className="border rounded w-20 px-1 py-0.5" inputMode="numeric" /></td>
      <td className="p-2 flex gap-1">
        <input value={tries} onChange={(e) => setTries(e.target.value)} title="Max tries" className="border rounded w-11 px-1 py-0.5" inputMode="numeric" />
        <input value={mins} onChange={(e) => setMins(e.target.value)} title="Session minutes" className="border rounded w-11 px-1 py-0.5" inputMode="numeric" />
      </td>
      <td className="p-2 flex items-center gap-1 flex-wrap">
        <button onClick={() => setOn(!on)} title="Bargain ON/OFF" className={`text-xs font-bold border rounded-full px-2 py-0.5 ${on ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>{on ? "ON" : "OFF"}</button>
        <button onClick={() => setBest(!best)} title="Bestseller section" className={`text-xs font-bold border rounded-full px-2 py-0.5 ${best ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"}`}>Best</button>
        <button onClick={() => setFeat(!feat)} title="Featured" className={`text-xs font-bold border rounded-full px-2 py-0.5 ${feat ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>Feat</button>
        <button onClick={save} className="text-xs underline">Save</button>
        <span className="text-[11px] text-green-700">{msg}</span>
      </td>
    </tr>
  );
}
