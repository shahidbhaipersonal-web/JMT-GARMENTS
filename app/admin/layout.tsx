import Link from "next/link";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-[220px_1fr]">
      <aside className="bg-[#1a0a11] text-white p-4">
        <div className="font-extrabold mb-4">JMT ADMIN</div>
        <nav className="grid gap-1 text-sm">
          <Link href="/admin" className="py-2 px-2 rounded hover:bg-white/10">Dashboard</Link>
          <Link href="/admin/products" className="py-2 px-2 rounded hover:bg-white/10">Products</Link>
          <Link href="/admin/enquiries" className="py-2 px-2 rounded hover:bg-white/10">Enquiries</Link>
          <Link href="/admin/bargains" className="py-2 px-2 rounded hover:bg-white/10">Bargain Bot</Link>
          <Link href="/admin/password" className="py-2 px-2 rounded hover:bg-white/10">Password</Link>
          <Link href="/admin/settings" className="py-2 px-2 rounded hover:bg-white/10">Settings</Link>
          <Link href="/" className="py-2 px-2 rounded hover:bg-white/10 opacity-70">← View Site</Link>
        </nav>
      </aside>
      <div className="p-6 bg-[var(--cream)]">{children}</div>
    </div>
  );
}
