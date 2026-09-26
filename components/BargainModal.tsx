"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string };

export default function BargainModal({ productId, price, onClose }: { productId: string; price: number; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sid, setSid] = useState("");
  const [typing, setTyping] = useState(false);
  const [left, setLeft] = useState(300);
  const [offer, setOffer] = useState(price);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [dead, setDead] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // start session on open
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/bargain/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId }) });
        const j = await r.json();
        if (!r.ok) { setDead(j.error || "Bargain start nahi hua."); return; }
        setSid(j.session_id);
        setMsgs([{ role: "bot", text: j.bot_message }]);
        setOffer(j.product.price);
        setLeft(Math.max(0, Math.round((new Date(j.expires_at).getTime() - Date.now()) / 1000)));
      } catch { setDead("Network error. Dobara try karo."); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // countdown timer — red under 1 min
  useEffect(() => {
    if (finalPrice || dead) return;
    if (left <= 0) { setDead("Time khatam! Session expired. Restart dabao."); return; }
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left, finalPrice, dead]);

  useEffect(() => { boxRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs, typing]);

  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing || finalPrice || dead) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setTyping(true);
    try {
      const r = await fetch("/api/bargain/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid, message: text }) });
      const j = await r.json();
      setTyping(false);
      if (!r.ok) {
        if (r.status === 410) setDead(j.error || "Session expired.");
        else setMsgs((m) => [...m, { role: "bot", text: j.error || "Error. Phir bolo!" }]);
        return;
      }
      setMsgs((m) => [...m, { role: "bot", text: j.bot_message }]);
      setOffer(j.current_offer);
      if (j.can_buy && j.final_price) setFinalPrice(j.final_price);
    } catch {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: "Network phas gaya bhai! Phir bolo." }]);
    }
  }

  async function accept() {
    const r = await fetch("/api/bargain/accept", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid }) });
    const j = await r.json();
    if (r.ok) setBuyUrl(j.checkout_url);
  }

  function restart() {
    setMsgs([]); setFinalPrice(null); setDead(""); setBuyUrl(""); setInput("");
    fetch("/api/bargain/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId }) })
      .then((r) => r.json()).then((j) => {
        if (j.session_id) {
          setSid(j.session_id); setMsgs([{ role: "bot", text: j.bot_message }]); setOffer(j.product.price);
          setLeft(Math.max(0, Math.round((new Date(j.expires_at).getTime() - Date.now()) / 1000)));
        } else setDead(j.error || "Restart failed.");
      });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-end justify-center sm:justify-end sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:w-[380px] h-[85vh] sm:h-[540px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-[var(--maroon)] text-white p-3 flex items-center gap-2">
          <span className="text-3xl">🧔🏽</span>
          <div className="flex-1">
            <div className="font-bold">Bargain / Mol-Bhav</div>
            <div className={`text-xs font-mono ${left < 60 ? "text-red-200 font-bold" : "opacity-90"}`}>⏱ {mm}:{ss}</div>
          </div>
          <button onClick={onClose} className="text-2xl leading-none px-1">×</button>
        </div>
        <div className="bg-orange-50 text-xs px-3 py-1.5 border-b">MRP ₹{price} • Bot offer: <b>₹{offer}</b></div>
        <div ref={boxRef} className="flex-1 overflow-auto p-3 grid gap-2 content-start bg-[#fffaf3]">
          {msgs.map((m, i) => (
            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm animate-[fadeIn_.3s] ${m.role === "user" ? "justify-self-end bg-[var(--maroon)] text-white rounded-br-sm" : "justify-self-start bg-white border rounded-bl-sm shadow-sm"}`}>{m.text}</div>
          ))}
          {typing && <div className="justify-self-start bg-white border rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-500 shadow-sm">Bargain / Mol-Bhav is typing…</div>}
          {dead && (
            <div className="justify-self-center bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl px-4 py-3 text-center">
              {dead}<br /><button onClick={restart} className="mt-2 bg-[var(--maroon)] text-white text-xs font-bold px-4 py-1.5 rounded-lg">↻ Restart Bargain</button>
            </div>
          )}
          {finalPrice && !buyUrl && (
            <div className="justify-self-center w-full">
              <button onClick={accept} className="w-full bg-green-600 text-white font-extrabold text-lg py-3 rounded-xl shadow">✅ ₹{finalPrice} pe Buy karo</button>
            </div>
          )}
          {buyUrl && (
            <div className="justify-self-center w-full grid gap-2">
              <a href={buyUrl} target="_blank" className="block text-center bg-green-600 text-white font-extrabold text-lg py-3 rounded-xl">Deal locked ₹{finalPrice} — Order on WhatsApp →</a>
            </div>
          )}
        </div>
        <form onSubmit={send} className="p-2 border-t flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Kitne mein chahiye? jaise 700" className="flex-1 border rounded-full px-4 py-2 text-sm outline-none" disabled={!!finalPrice || !!dead} />
          <button className="bg-[var(--maroon)] text-white rounded-full w-10 h-10 font-bold disabled:opacity-40" disabled={!!finalPrice || !!dead}>➤</button>
        </form>
      </div>
    </div>
  );
}
