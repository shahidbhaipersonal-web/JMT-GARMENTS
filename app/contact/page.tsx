"use client";
import { useState } from "react";
export default function ContactPage() {
  const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) { setOk(true); (e.target as HTMLFormElement).reset(); }
  }
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-serif text-4xl mb-4">Contact</h1>
      <form onSubmit={submit} className="bg-white border rounded-2xl p-5 grid gap-2">
        <input name="name" required placeholder="Name" className="border rounded-lg px-3 py-2" />
        <input name="phone" required placeholder="Phone" className="border rounded-lg px-3 py-2" />
        <input name="email" placeholder="Email" className="border rounded-lg px-3 py-2" />
        <input name="subject" placeholder="Subject" className="border rounded-lg px-3 py-2" />
        <textarea name="message" required rows={4} placeholder="Message" className="border rounded-lg px-3 py-2" />
        <button className="bg-[var(--maroon)] text-white font-bold py-2.5 rounded-lg">Send Message</button>
        {ok && <p className="text-green-700 text-sm">Message saved.</p>}
      </form>
    </div>
  );
}
