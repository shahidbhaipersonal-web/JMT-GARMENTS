const ITEMS: [string, string, string][] = [
  ["✓", "GENUINE PRODUCTS", "Factory / wholesale catalogue"],
  ["◉", "WHOLESALE PRICING", "Bulk order rates"],
  ["↺", "EASY EXCHANGE", "Size support"],
  ["▣", "PAN-INDIA DISPATCH", "Transport + courier options"]
];

export default function TrustStrip() {
  return (
    <section className="bg-white border-b border-[var(--line)]" aria-label="Why shop with us">
      <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map(([icon, title, sub]) => (
          <div key={title} className="flex items-center gap-3">
            <span className="w-11 h-11 shrink-0 rounded-full border border-[var(--gold)] text-[var(--burgundy)] flex items-center justify-center text-xl" aria-hidden="true">{icon}</span>
            <span>
              <span className="block font-bold text-[13px] tracking-wide">{title}</span>
              <span className="block text-xs text-[var(--muted)]">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
