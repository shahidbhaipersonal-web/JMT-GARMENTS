import { prisma } from "@/lib/db";
import Link from "next/link";
import BargainControls from "@/components/BargainControls";

export default async function AdminBargains({ searchParams }: { searchParams: { status?: string } }) {
  const f = searchParams.status || "all";
  const aiLabel = process.env.GEMINI_API_KEY ? "Gemini LIVE" : process.env.GROQ_API_KEY ? "Groq LIVE" : process.env.OPENAI_API_KEY ? "OpenAI LIVE" : "Templates";
  let sessions: any[] = [];
  let products: any[] = [];
  let stats = { total: 0, won: 0, active: 0, lost: 0, expired: 0, avgDiscount: 0, conv: 0 };
  try {
    const [all, prods] = await Promise.all([
      prisma.bargainSession.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { product: true } }),
      prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, sku: true, mrp: true, bargainEnabled: true, floorPrice: true, costPrice: true, maxAttempts: true, sessionTimeoutMin: true } })
    ]);
    products = prods;
    sessions = f === "all" ? all : all.filter((s) => s.status === f);
    const won = all.filter((s) => s.status === "won" && s.finalPrice);
    const discs = won.map((s) => {
      const mrp = s.product.mrp || 0;
      return mrp > 0 ? ((mrp - (s.finalPrice || 0)) / mrp) * 100 : 0;
    });
    stats = {
      total: all.length,
      won: won.length,
      active: all.filter((s) => s.status === "active").length,
      lost: all.filter((s) => s.status === "lost").length,
      expired: all.filter((s) => s.status === "expired").length,
      avgDiscount: discs.length ? Math.round(discs.reduce((a, b) => a + b, 0) / discs.length) : 0,
      conv: all.length ? Math.round((won.length / all.length) * 100) : 0
    };
  } catch { /* DB down — show empty */ }

  const cards: [string, number | string][] = [
    ["Total Sessions", stats.total], ["Won", stats.won], ["Active", stats.active],
    ["Lost", stats.lost], ["Expired", stats.expired],
    ["Avg Discount", `${stats.avgDiscount}%`], ["Conversion", `${stats.conv}%`]
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-4">Bargain Bot <span className={`text-xs font-sans font-bold border rounded-full px-2 py-0.5 align-middle ${aiLabel === "Templates" ? "bg-gray-100" : "bg-green-100 text-green-800"}`}>AI: {aiLabel}</span></h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {cards.map(([k, v]) => (
          <div key={k} className="bg-white border rounded-xl p-3"><div className="text-[11px] text-gray-500">{k}</div><div className="text-xl font-extrabold">{v}</div></div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-2">Per-product settings</h2>
      <div className="bg-white border rounded-xl overflow-auto mb-6">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Product</th><th className="p-2">Floor ₹</th><th className="p-2">Cost ₹</th><th className="p-2">Tries / Mins</th><th className="p-2">ON/OFF</th></tr></thead>
          <tbody>
            {products.map((p) => <BargainControls key={p.id} p={p} />)}
            {!products.length && <tr><td className="p-3 text-gray-500" colSpan={5}>No products.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="font-bold text-lg mb-2">Sessions</h2>
      <div className="flex gap-2 text-xs mb-3">
        {["all", "active", "won", "lost", "expired"].map((s) => (
          <a key={s} href={`/admin/bargains${s === "all" ? "" : `?status=${s}`}`} className={`border rounded-full px-3 py-1 ${f === s ? "bg-[var(--maroon)] text-white" : "bg-white"}`}>{s}</a>
        ))}
      </div>
      <div className="bg-white border rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Date</th><th className="p-2">Product</th><th className="p-2">Tries</th><th className="p-2">Offer</th><th className="p-2">Final</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2 text-xs"><Link href={`/admin/bargains/${s.id}`} className="underline">{new Date(s.createdAt).toLocaleString("en-IN")}</Link></td>
                <td className="p-2">{s.product?.name}<div className="text-xs text-gray-500">{s.product?.sku}</div></td>
                <td className="p-2">{s.attempts}/{s.maxAttempts}</td>
                <td className="p-2">₹{s.currentOffer}</td>
                <td className="p-2">{s.finalPrice ? `₹${s.finalPrice}` : "-"}</td>
                <td className="p-2"><span className="text-xs border rounded-full px-2 py-0.5">{s.status}</span></td>
              </tr>
            ))}
            {!sessions.length && <tr><td className="p-3 text-gray-500" colSpan={6}>No sessions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
