const STEPS: [string, string, string][] = [
  ["01", "BROWSE", "Explore our collection"],
  ["02", "SELECT", "Choose products and quantities"],
  ["03", "ENQUIRE", "Send your wholesale requirement"],
  ["04", "DISPATCH", "Confirm order and receive dispatch details"]
];

export default function HowToOrder() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-9 md:py-14" aria-label="How to order">
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-1">How to Order?</h2>
      <p className="text-center text-sm text-[var(--muted)] mb-8">Simple wholesale process for retailers</p>
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STEPS.map(([n, t, s]) => (
          <li key={n} className="bg-white border border-[var(--line)] rounded-[16px] p-5 text-center">
            <span className="mx-auto w-12 h-12 rounded-full bg-[var(--burgundy)] text-white font-serif text-lg flex items-center justify-center mb-3" aria-hidden="true">{n}</span>
            <span className="block font-bold tracking-wide text-sm mb-1">{t}</span>
            <span className="block text-xs text-[var(--muted)]">{s}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
