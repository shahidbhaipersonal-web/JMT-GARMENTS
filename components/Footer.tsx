import Link from "next/link";

const SHOP = [["All Products", "/shop"], ["New Arrivals", "/shop?filter=new"], ["Dresses", "/shop?cat=Dresses"], ["Suits", "/shop?cat=Suits"], ["Kurtis", "/shop?cat=Kurtis"], ["Lehengas", "/shop?cat=Lehenga"], ["Kids Wear", "/shop?cat=Kids%20Wear"]];
const WHOLESALE: [string, string][] = [["Bulk Orders", "/wholesale"], ["Wholesale Enquiry", "/wholesale"], ["Size Guide", "/shop"], ["Shipping", "/wholesale"], ["Exchange Policy", "/about"], ["Track Enquiry", "/contact"]];
const COMPANY: [string, string][] = [["About Us", "/about"], ["Contact Us", "/contact"], ["Seller Login", "/admin/login"], ["Privacy Policy", "/about"], ["Terms of Use", "/about"], ["Sitemap", "/sitemap.xml"]];

export default function Footer() {
  return (
    <footer className="bg-[var(--burgundy-dark)] text-[#d8c6cd]">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <div className="leading-none mb-2">
            <span className="block font-serif text-2xl font-bold text-white tracking-wide">JMT</span>
            <span className="block text-[10px] tracking-[0.35em] text-[var(--gold-light)]">GARMENTS</span>
          </div>
          <p className="text-[13px]">Women &amp; girls wholesale fashion catalogue for retailers, boutiques and resellers.</p>
        </div>
        <nav aria-label="Shop">
          <div className="text-white font-bold mb-3 tracking-wide text-[13px]">SHOP</div>
          <ul className="grid gap-2">{SHOP.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Wholesale">
          <div className="text-white font-bold mb-3 tracking-wide text-[13px]">WHOLESALE</div>
          <ul className="grid gap-2">{WHOLESALE.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Company">
          <div className="text-white font-bold mb-3 tracking-wide text-[13px]">COMPANY</div>
          <ul className="grid gap-2">{COMPANY.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}</ul>
        </nav>
        <div>
          <div className="text-white font-bold mb-3 tracking-wide text-[13px]">CONTACT</div>
          <ul className="grid gap-2 text-[13px]">
            <li>Phone: +91 97024 93977</li>
            <li><a className="hover:text-white" target="_blank" href="https://wa.me/919702493977">WhatsApp: Chat now</a></li>
            <li>Email: shahidbhaipersonal@gmail.com</li>
            <li>Main Market Road</li>
            <li>Mon–Sun, 10am–9pm</li>
          </ul>
          <div className="flex gap-2 mt-3">
            {[["Instagram", "#"], ["Facebook", "#"], ["YouTube", "#"]].map(([l, h]) => (
              <a key={l} href={h} aria-label={l} className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 text-sm">{l.charAt(0)}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© 2026 JMT Garments. All rights reserved.</div>
    </footer>
  );
}
