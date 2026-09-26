"use client";

export default function WhatsAppButton() {
  const num = process.env.NEXT_PUBLIC_WHATSAPP || "919702493977";
  return (
    <a
      href={`https://wa.me/${num}?text=${encodeURIComponent("Hi JMT Garments, I am interested in your wholesale collection.")}`}
      target="_blank"
      aria-label="Chat with JMT Garments on WhatsApp"
      title="Chat with JMT Garments"
      className="fixed z-40 right-4 bottom-20 md:bottom-6 w-14 h-14 rounded-full bg-[var(--wa)] shadow-xl flex items-center justify-center text-[28px] hover:scale-105 transition"
    >
      ✆
    </a>
  );
}
