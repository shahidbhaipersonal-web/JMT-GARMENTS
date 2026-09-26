import Link from "next/link";

export default function WholesaleCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="rounded-[18px] overflow-hidden bg-gradient-to-br from-[var(--burgundy)] to-[var(--burgundy-dark)] text-white grid md:grid-cols-[1fr_320px]">
        <div className="p-8 md:p-12">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Looking for Bulk Orders?</h2>
          <p className="opacity-90 mb-1">Get wholesale pricing for your store.</p>
          <p className="text-[var(--gold-light)] font-semibold mb-6">MOQ starting from 6 pieces</p>
          <Link href="/wholesale" className="inline-block bg-white text-[var(--burgundy-dark)] font-bold px-6 py-3 rounded-[10px] text-sm min-h-[44px]">Request Wholesale Quote →</Link>
        </div>
        <div className="hidden md:block relative min-h-[240px]">
          <img
            src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80"
            alt="Retailer holding festive ethnic suits for bulk order"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
