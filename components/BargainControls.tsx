"use client";
import { useState } from "react";

export default function BargainControls({ p }: { p: { id: string; name: string; sku: string; mrp: number | null; bargainEnabled: boolean; floorPrice: number | null; maxAttempts: number } }) {
  const [on, setOn] = useState(p.bargainEnabled);
  const [floor, setFloor] = useState(String(p.floorPrice ?? ""));
  const [tries, setTries] = useState(String(p.maxAttempts));
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");
    const r = await fetch(`/api/admin/products/${p.id}/bargain`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bargainEnabled: on, floorPrice: floor === "" ? null : Number(floor), maxAttempts: Number(tries) })
    });
    setMsg(r.ok ? "Saved ✓" : "Failed");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <tr className="border-b">
      <td className="p-2">{p.name}<div className="text-xs text-gray-500">{p.sku}</div></td>
      <td className="p-2">₹{p.mrp || "-"}</td>
      <td className="p-2"><input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="auto" className="border rounded w-20 px-1 py-0.5" inputMode="numeric" /></td>
      <td className="p-2"><input value={tries} onChange={(e) => setTries(e.target.value)} className="border rounded w-12 px-1 py-0.5" inputMode="numeric" /></td>
      <td className="p-2 flex items-center gap-1">
        <button onClick={() => setOn(!on)} className={`text-xs font-bold border rounded-full px-2 py-0.5 ${on ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>{on ? "ON" : "OFF"}</button>
        <button onClick={save} className="text-xs underline">Save</button>
        <span className="text-[11px] text-green-700">{msg}</span>
      </td>
    </tr>
  );
}
