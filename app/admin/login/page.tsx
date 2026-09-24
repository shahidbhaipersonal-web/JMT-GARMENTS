"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
  const [err, setErr] = useState("");
  const r = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) r.push("/admin"); else setErr("Invalid email or password");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <form onSubmit={submit} className="bg-white border rounded-2xl p-6 w-full max-w-sm grid gap-2">
        <h1 className="font-bold text-xl">Admin Login</h1>
        <p className="text-xs text-gray-500">Private. Customers cannot access.</p>
        <input name="email" type="email" required placeholder="Email" className="border rounded-lg px-3 py-2" />
        <input name="password" type="password" required placeholder="Password" className="border rounded-lg px-3 py-2" />
        <button className="bg-[var(--maroon)] text-white font-bold py-2.5 rounded-lg">Login</button>
        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}
