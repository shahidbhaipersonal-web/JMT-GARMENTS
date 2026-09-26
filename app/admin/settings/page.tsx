import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminSettings() {
  if (!(await requireAdmin())) redirect("/admin/login");
  let s: any = null;
  try { s = await prisma.siteSettings.findUnique({ where: { id: "site" } }); } catch {}
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl mb-4">Settings</h1>
      <div className="bg-white border rounded-2xl p-5 text-sm grid gap-1">
        <div><b>Business:</b> {s?.businessName ?? "JMT Garments"}</div>
        <div><b>Phone:</b> {s?.phone}</div>
        <div><b>WhatsApp:</b> {s?.whatsapp}</div>
        <div><b>Show Price:</b> {String(s?.showPrice ?? false)}</div>
        <div><b>Hero:</b> {s?.heroTitle}</div>
      </div>
      <p className="text-xs text-gray-500 mt-3">Edit via Prisma Studio or extend with PUT /api/admin/settings.</p>
    </div>
  );
}
