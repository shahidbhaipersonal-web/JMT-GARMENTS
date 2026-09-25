# JMT Garments — Wholesale Platform

Premium women's fashion wholesale: public catalogue + private admin.

## Stack
Next.js 14 / React / TypeScript / Tailwind / Framer Motion / Prisma / PostgreSQL / Jose (JWT) / Zod / Recharts.

## Setup
1. Install Node.js LTS (https://nodejs.org) — required. Current machine has no Node, so `npm` will fail until installed.
2. `cd jmt-wholesale`
3. `cp .env.example .env` — fill DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL
4. `npm install`
5. `npx prisma migrate dev` (or `npx prisma db push` for quick start)
6. `ADMIN_EMAIL=admin@jmtgarments.com ADMIN_PASSWORD=Admin@123 npm run db:seed`
7. `npm run dev` — open http://localhost:3000
8. Admin: http://localhost:3000/admin/login

## Structure
- `app/` public pages (home, shop, product/[slug], about, contact, wholesale)
- `app/admin/` private dashboard (middleware-protected)
- `app/api/` public + admin APIs
- `prisma/schema.prisma` full DB models
- `components/` reusable UI
- `lib/` db, auth, validation

## Notes
- Admin routes protected server-side via middleware + JWT cookie. No frontend-only hiding.
- Images: store URLs (Cloudinary). Upload endpoint to add with CLOUDINARY_* envs.
- Prices hidden unless SiteSettings.showPrice or product.showPrice is ON.
- Enquiry/Contact/Quotation save to DB for admin follow-up.

## Bargain Bot (Mol-Bhav Raja)
- Chat modal on product pages: `🤝 Bargain karo` button in the buy box.
- APIs: POST `/api/bargain/start`, `/api/bargain/message`, `/api/bargain/accept`, `/api/bargain/cancel`.
- Rules: 4 tries default, 5-min sessions, counter = midpoint(user, offer) floored at floor_price.
- Floor/cost prices NEVER leave the backend (not in any JSON response).
- AI: set `GROQ_API_KEY` (llama-3.3-70b) or `OPENAI_API_KEY` (gpt-4o-mini) in `.env`. Without keys, 10 witty Hinglish template replies are used.
- Seed floors: `npx tsx prisma/seed-bargain.ts` (≈62% of MRP).
- Admin: `/admin/bargains` — sessions, avg discount, conversion %, per-product ON/OFF + floor + tries (SUPER_ADMIN only).
