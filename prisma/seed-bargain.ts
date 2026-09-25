import { prisma } from "../lib/db";

// Floor ≈ 62% of MRP (min acceptable), cost ≈ 80% of floor. Tune per product in /admin/bargains.
async function main() {
  const items = await prisma.product.findMany();
  for (const p of items) {
    const mrp = p.mrp || 1000;
    const floor = p.floorPrice ?? Math.round(mrp * 0.62);
    const cost = p.costPrice ?? Math.round(floor * 0.8);
    await prisma.product.update({ where: { id: p.id }, data: { floorPrice: floor, costPrice: cost, bargainEnabled: true, maxAttempts: 4, sessionTimeoutMin: 5 } });
    console.log("floor set", p.sku, floor);
  }
}

main().finally(() => prisma.$disconnect());
