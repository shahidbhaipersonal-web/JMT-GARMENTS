"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <section className="bg-gradient-to-br from-[#5c1a2e] via-[#7a2340] to-[#c9a86a] text-white">
      <div className="max-w-7xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-xs tracking-widest uppercase opacity-80 mb-3">Wholesale • Boutique Supply</div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">{title}</h1>
          <p className="opacity-90 mb-6">{subtitle}</p>
          <div className="flex gap-3">
            <Link href="/shop" className="bg-white text-[#5c1a2e] font-bold px-6 py-3 rounded-xl">Explore Collection</Link>
            <Link href="/wholesale" className="border border-white/60 px-6 py-3 rounded-xl font-bold">Request Wholesale Enquiry</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="rounded-2xl overflow-hidden bg-white/10 min-h-[320px] flex items-center justify-center">
          {image ? <img src={image} alt="hero" className="w-full h-full object-cover" /> : <span className="font-serif text-6xl opacity-60">JMT</span>}
        </motion.div>
      </div>
    </section>
  );
}
