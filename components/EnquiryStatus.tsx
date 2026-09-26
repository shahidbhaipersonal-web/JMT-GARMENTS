"use client";
import { useState } from "react";

const STATUSES = ["New", "Contacted", "Quoted", "Confirmed", "Completed", "Cancelled"];

export default function EnquiryStatus({ id, status }: { id: string; status: string }) {
  const [v, setV] = useState(status);
  const [msg, setMsg] = useState("");
  async function change(nv: string) {
    setV(nv); setMsg("");
    const r = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nv })
    });
    setMsg(r.ok ? "✓" : "!");
    setTimeout(() => setMsg(""), 2000);
  }
  return (
    <span className="flex items-center gap-1">
      <select value={v} onChange={(e) => change(e.target.value)} className="border rounded px-1 py-0.5 text-xs bg-white" aria-label="Enquiry status">
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <span className="text-[11px] text-green-700">{msg}</span>
    </span>
  );
}
