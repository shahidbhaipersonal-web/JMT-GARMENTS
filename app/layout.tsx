import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { StoreProvider } from "@/components/StoreContext";

export const metadata: Metadata = {
  title: "JMT Garments — Women's Fashion Wholesale",
  description: "Wholesale women's dresses, suits, kurtis, lehenga, gowns, frocks. Bulk enquiries for retailers and boutiques."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
