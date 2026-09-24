import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JMT Garments — Women's Fashion Wholesale",
  description: "Wholesale women's dresses, suits, kurtis, lehenga, gowns, frocks. Bulk enquiries for retailers and boutiques."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
