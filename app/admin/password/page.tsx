"use client";
import { useState } from "react";

export default function PasswordPage() {
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState("");

  async function change(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setInfo("");
    const r = await fetch("/api/admin/password/change", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: cur, newPassword: nw })
    });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Failed."); return; }
    setInfo("Password change ho gaya.");
    setCur(""); setNw("");
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl mb-2">Change Password</h1>
      <p className="text-sm text-gray-500 mb-4">Min 10 characters + uppercase + lowercase + number + symbol.</p>
      <form onSubmit={change} className="bg-white border rounded-2xl p-5 grid gap-2">
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" className="border rounded-lg px-3 py-2" />
        <input type="password" value={nw} onChange={(e) => setNw(e.target.value)} placeholder="New password" className="border rounded-lg px-3 py-2" />
        <button className="bg-[var(--maroon)] text-white font-bold py-2.5 rounded-lg">Change Password</button>
        {msg && <p className="text-red-700 text-sm">{msg}</p>}
        {info && <p className="text-green-700 text-sm">{info}</p>}
      </form>
    </div>
  );
}
