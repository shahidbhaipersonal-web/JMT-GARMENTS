import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} — JMT Garments` };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let p: any = null;
  try {
    p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: { orderBy: { order: "asc" } }, category: true } });
    if (p) await prisma.product.update({ where: { id: p.id }, data: { views: { increment: 1 } } });
  } catch {}
  if (!p) return notFound();

  const wa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(`Hello, I am interested in Product: ${p.name}, SKU: ${p.sku}. Please share wholesale details.`)}`;

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="rounded-2xl overflow-hidden bg-[#f3dfc9] min-h-[420px] flex items-center justify-center">
          {p.images?.[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <span className="font-serif text-7xl text-[#7a2340]">{p.name.charAt(0)}</span>}
        </div>
        <div className="flex gap-2 mt-3">
          {(p.images || []).slice(1, 5).map((im: any) => <img key={im.id} src={im.url} alt="" className="w-20 h-20 object-cover rounded-lg border" />)}
        </div>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#7a2340]">{p.category?.name}</div>
        <h1 className="font-serif text-4xl mb-2">{p.name}</h1>
        <div className="text-sm text-gray-500 mb-4">SKU: {p.sku} • Fabric: {p.fabric || "-"} • MOQ: {p.moq} pcs</div>
        <p className="mb-4">{p.description}</p>
        <div className="text-sm mb-4">Sizes: {p.sizes.join(", ")}<br />Colours: {p.colours.join(", ")}</div>
        <div className="flex gap-2 mb-8">
          <a href="#enquire" className="bg-[var(--maroon)] text-white font-bold px-6 py-3 rounded-xl">Send Enquiry</a>
          <a href={wa} target="_blank" className="border border-[var(--maroon)] text-[var(--maroon)] font-bold px-6 py-3 rounded-xl">Enquire on WhatsApp</a>
        </div>
        <div id="enquire"><EnquiryForm productId={p.id} sku={p.sku} /></div>
      </div>
    </div>
  );
}
