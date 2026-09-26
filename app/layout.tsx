import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import { StoreProvider } from "@/components/StoreContext";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "JMT Garments | Women's Fashion Wholesale Supplier",
  description: "Shop women's dresses, kurtis, suits, lehengas, gowns and kids wear from JMT Garments. Wholesale fashion catalogue for retailers, boutiques and resellers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <StoreProvider>
          <Navbar />
          <main className="min-h-[60vh] pb-16 md:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
