import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@jmtgarments.com";
  const pass = process.env.ADMIN_PASSWORD || "Admin@123";
  const hash = await bcrypt.hash(pass, 10);
  await prisma.adminUser.upsert({ where: { email }, update: {}, create: { email, passHash: hash, role: "SUPER_ADMIN" } });
  await prisma.siteSettings.upsert({ where: { id: "site" }, update: {}, create: {} });
  const cats = [
    { name: "Dresses", slug: "dresses" }, { name: "Suits", slug: "suits" },
    { name: "Kurtis", slug: "kurtis" }, { name: "Lehenga", slug: "lehenga" },
    { name: "Gowns", slug: "gowns" }, { name: "Frocks", slug: "frocks" },
    { name: "Kids Wear", slug: "kids-wear" }, { name: "Dupattas", slug: "dupattas" }
  ];
  for (let i = 0; i < cats.length; i++) {
    const c = cats[i];
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, order: i } });
  }
  console.log("Seed done. Admin:", email);
}
main();
