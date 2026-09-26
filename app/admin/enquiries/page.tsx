import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminEnquiries() {
  if (!(await requireAdmin())) redirect("/admin/login");
  let items: any[] = [];
  try { items = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 }); } catch {}
  return (
    <div>
      <h1 className="font-serif text-3xl mb-4">Enquiries</h1>
      <div className="bg-white border rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">SKU</th><th className="p-3">Qty</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {items.map((e) => <tr key={e.id} className="border-b"><td className="p-3">{e.name}<div className="text-xs text-gray-500">{e.business}</div></td><td className="p-3">{e.phone}</td><td className="p-3">{e.sku}</td><td className="p-3">{e.quantity}</td><td className="p-3">{e.status}</td></tr>)}
            {!items.length && <tr><td className="p-4 text-gray-500" colSpan={5}>No enquiries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
