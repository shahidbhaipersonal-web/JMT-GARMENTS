import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[var(--burgundy-dark)] text-white overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80"
        alt="Indian women's ethnic wear — kurtis, suits and lehengas wholesale collection"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a0813]/90 via-[#2a0813]/55 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-24 min-h-[380px] md:min-h-[460px] flex items-center">
        <div className="max-w-xl">
          <div className="text-[11px] md:text-xs tracking-[0.3em] text-[var(--gold-light)] mb-3">NEW SEASON COLLECTION</div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-3">Wholesale Fashion<br />for Your Store</h1>
          <p className="text-sm md:text-base opacity-90 mb-1">Women&apos;s Dresses • Kurtis • Suits • Lehengas • Kids Wear</p>
          <p className="text-sm md:text-base text-[var(--gold-light)] font-semibold mb-6">MOQ starting from 6 pieces</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="bg-white text-[var(--burgundy-dark)] font-bold px-6 py-3 rounded-[10px] text-sm min-h-[44px] inline-flex items-center">Explore Collection →</Link>
            <Link href="/wholesale" className="border border-[var(--gold-light)] text-[var(--gold-light)] font-bold px-6 py-3 rounded-[10px] text-sm min-h-[44px] inline-flex items-center">Request Wholesale Quote</Link>
          </div>
          <div className="flex gap-2 mt-8" aria-hidden="true">
            <span className="h-1.5 w-8 rounded-full bg-white" />
            <span className="h-1.5 w-4 rounded-full bg-white/40" />
            <span className="h-1.5 w-4 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
