import { prisma } from "@/lib/db";
import Link from "next/link";
export default async function AdminProducts() {
  let items: any[] = [];
  try { items = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { category: true } }); } catch {}
  return (
    <div>
      <h1 className="font-serif text-3xl mb-4">Products</h1>
      <div className="bg-white border rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-3">Name</th><th className="p-3">SKU</th><th className="p-3">Category</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {items.map((p) => <tr key={p.id} className="border-b"><td className="p-3 font-semibold">{p.name}</td><td className="p-3">{p.sku}</td><td className="p-3">{p.category?.name}</td><td className="p-3">{p.status}</td></tr>)}
            {!items.length && <tr><td className="p-4 text-gray-500" colSpan={4}>No products yet — run seed or add via API.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3">Full Add/Edit/Delete with image upload: use POST/PUT/DELETE /api/admin/products (protected). UI form is next step after DB connect.</p>
    </div>
  );
}
