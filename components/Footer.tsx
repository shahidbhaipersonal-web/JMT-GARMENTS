import Link from "next/link";

const COLS: [string, string[]][] = [
  ["Shop", ["All Products", "New Arrivals", "Dresses", "Suits", "Kurtis", "Lehenga"]],
  ["Help", ["Wholesale Enquiry", "Contact Us", "Size Guide", "Bulk Orders", "Track Enquiry"]],
  ["Company", ["About Us", "Seller Login", "Privacy Policy", "Terms of Use", "Sitemap"]]
];

export default function Footer() {
  return (
    <footer className="bg-[#1a0a11] text-[#cbb9bf] mt-10">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="text-white font-extrabold mb-2">JMT GARMENTS</div>
          <p>Women &amp; girls ethnic wear — wholesale catalogue for retailers, boutiques and resellers.</p>
          <p className="mt-2">Main Market Road • Mon–Sun 10am–9pm</p>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <div className="text-white font-bold mb-2">{h}</div>
            <ul className="grid gap-1.5">
              {links.map((l) => <li key={l}><Link href={l === "All Products" ? "/shop" : l === "New Arrivals" ? "/shop?filter=new" : l === "Wholesale Enquiry" ? "/wholesale" : l === "Contact Us" ? "/contact" : l === "About Us" ? "/about" : l === "Seller Login" ? "/admin/login" : l === "Sitemap" ? "/sitemap.xml" : "/shop"} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© 2026 JMT Garments • Wholesale catalogue • Prices on enquiry</div>
    </footer>
  );
}
