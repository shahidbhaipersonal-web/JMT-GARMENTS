import { prisma } from "@/lib/db";
export default async function AdminHome() {
  let stats = { products: 0, enquiries: 0, messages: 0, quotations: 0 };
  try {
    const [products, enquiries, messages, quotations] = await Promise.all([
      prisma.product.count(), prisma.enquiry.count(), prisma.contactMessage.count(), prisma.quotation.count()
    ]);
    stats = { products, enquiries, messages, quotations };
  } catch {}
  const cards = [
    ["Total Products", stats.products], ["Total Enquiries", stats.enquiries],
    ["Total Messages", stats.messages], ["Quotations", stats.quotations]
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl mb-4">Dashboard</h1>
      <div className="grid sm:grid-cols-4 gap-4">
        {cards.map(([k, v]) => (
          <div key={k as string} className="bg-white border rounded-2xl p-5"><div className="text-xs text-gray-500">{k}</div><div className="text-3xl font-extrabold">{v as number}</div></div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-6">Charts, product views and enquiry analytics go here (recharts). Connect DB to see live data.</p>
    </div>
  );
}
