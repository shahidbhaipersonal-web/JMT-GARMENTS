import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { extractPrice, isAbusive, calculateCounter, aiReply, acceptReply, fallbackReply } from "@/lib/bargain";

// POST /api/bargain/message { session_id, message }
export async function POST(req: NextRequest) {
  const { session_id, message } = await req.json().catch(() => ({}));
  if (typeof session_id !== "string" || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const rl = rateLimit(`bmsg:${session_id}`, 10, 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Slow down bhai, 1 min ruko!" }, { status: 429 });

  const s = await prisma.bargainSession.findUnique({ where: { id: session_id }, include: { product: true } });
  if (!s) return NextResponse.json({ error: "Invalid session." }, { status: 404 });
  if (s.status !== "active") return NextResponse.json({ error: "Session closed." }, { status: 400 });
  if (s.expiresAt < new Date()) {
    await prisma.bargainSession.update({ where: { id: s.id }, data: { status: "expired" } });
    return NextResponse.json({ error: "Session expired. Restart karo!" }, { status: 410 });
  }

  const userText = message.slice(0, 500);
  await prisma.bargainMessage.create({ data: { sessionId: s.id, role: "user", message: userText } });

  // Calm redirect for abuse — doesn't burn an attempt.
  if (isAbusive(userText)) {
    const calm = "bhai gussa mat karo, price pe baat karte hain. batao kitne mein chahiye?";
    await prisma.bargainMessage.create({ data: { sessionId: s.id, role: "bot", message: calm } });
    return NextResponse.json({ bot_message: calm, current_offer: s.currentOffer, can_buy: false, final_price: null, attempts_left: s.maxAttempts - s.attempts });
  }

  const attempts = s.attempts + 1;
  const price = s.product.mrp || s.product.wholesalePrice || 0;
  const floor = s.product.floorPrice ?? Math.round(price * 0.6);
  const userPrice = extractPrice(userText);
  let botMsg: string;
  let canBuy = false;
  let finalPrice: number | null = null;
  let currentOffer = s.currentOffer;

  if (!userPrice) {
    botMsg = "bhai number toh batao, kitne mein chahiye? jaise 700 ya 800!";
  } else if (attempts >= s.maxAttempts || userPrice <= floor) {
    // Attempts over OR user hit/below floor → lock at floor, customer "wins".
    finalPrice = floor;
    currentOffer = floor;
    canBuy = true;
    botMsg = attempts >= s.maxAttempts && userPrice > floor
      ? `last try bhai! boss maan gaya — ₹${floor} pe lock! neeche Buy dabao!`
      : acceptReply(floor);
  } else {
    currentOffer = calculateCounter(userPrice, s.currentOffer, floor);
    botMsg = await aiReply({
      productName: s.product.name, originalPrice: price, floor,
      currentOffer, attempts, attemptsLeft: s.maxAttempts - attempts, userMessage: userText
    });
  }

  await prisma.bargainSession.update({ where: { id: s.id }, data: { attempts, currentOffer } });
  await prisma.bargainMessage.create({ data: { sessionId: s.id, role: "bot", message: botMsg } });

  return NextResponse.json({
    bot_message: botMsg,
    current_offer: currentOffer,
    can_buy: canBuy,
    final_price: finalPrice,
    attempts_left: Math.max(0, s.maxAttempts - attempts)
  });
}
