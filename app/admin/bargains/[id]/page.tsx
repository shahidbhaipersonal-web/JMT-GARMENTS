import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BargainDetail({ params }: { params: { id: string } }) {
  if (!(await requireAdmin())) redirect("/admin/login");
  let s: any = null;
  try {
    s = await prisma.bargainSession.findUnique({ where: { id: params.id }, include: { product: true, messages: { orderBy: { createdAt: "asc" } } } });
  } catch {}
  if (!s) return notFound();
  const mrp = s.product.mrp || 0;
  const disc = s.finalPrice && mrp ? Math.round(((mrp - s.finalPrice) / mrp) * 100) : 0;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/bargains" className="text-sm underline">← All sessions</Link>
      <h1 className="font-serif text-2xl my-2">{s.product?.name} <span className="text-sm text-gray-500">{s.product?.sku}</span></h1>
      <div className="flex gap-2 text-xs mb-4">
        <span className="border rounded-full px-2 py-0.5">{s.status}</span>
        <span className="border rounded-full px-2 py-0.5">Tries {s.attempts}/{s.maxAttempts}</span>
        <span className="border rounded-full px-2 py-0.5">Offer ₹{s.currentOffer}</span>
        {s.finalPrice && <span className="border rounded-full px-2 py-0.5 bg-green-50">Final ₹{s.finalPrice} ({disc}% off)</span>}
      </div>
      <div className="bg-white border rounded-xl p-4 grid gap-2">
        {s.messages.map((m: any) => (
          <div key={m.id} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "justify-self-end bg-[var(--maroon)] text-white rounded-br-sm" : "justify-self-start bg-gray-100 rounded-bl-sm"}`}>
            <span className="text-[10px] opacity-70 block">{m.role === "user" ? "Customer" : "Mol-Bhav"} • {new Date(m.createdAt).toLocaleTimeString("en-IN")}</span>
            {m.message}
          </div>
        ))}
        {!s.messages.length && <p className="text-gray-500 text-sm">No messages.</p>}
      </div>
    </div>
  );
}
