import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { extractPrice, isAbusive, calculateCounter, aiReply, acceptReply, smartReply, withRate, detectIntent, businessReply, chatFallback } from "@/lib/bargain";

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
  const floor = s.product.floorPrice ?? Math.round(price * 0.6); // admin-fixed rate (per product)
  const userPrice = extractPrice(userText); // user ne kitna bola — pehle ye dekho
  let botMsg: string;
  let canBuy = false;
  let finalPrice: number | null = null;
  let currentOffer = s.currentOffer;
  let burnAttempt = true;

  // Recent chat — repeat se bachne + AI ko context dene ke liye
  const recent = await prisma.bargainMessage.findMany({ where: { sessionId: s.id }, orderBy: { createdAt: "desc" }, take: 6 });
  const lastBot = [...recent].reverse().find((m) => m.role === "bot")?.message;
  const history = [...recent].reverse().map((m) => `${m.role}: ${m.message}`);
  let settings: any = null;
  try { settings = await prisma.siteSettings.findUnique({ where: { id: "site" } }); } catch {}
  const facts = {
    productName: s.product.name,
    fabric: s.product.fabric || "premium",
    sizes: (s.product.sizes || []).join(", ") || "all sizes",
    moq: s.product.moq,
    address: settings?.address || "Main Market Road",
    phone: settings?.phone || "9702493977",
    currentOffer,
    mrp: price
  };

  if (!userPrice) {
    // Number nahi — FULL CHAT MODE: business sawal ka business jawab, baaki AI se
    // (attempt kat-ta nahi, sirf asli bid pe kat-ta hai)
    burnAttempt = false;
    const it = detectIntent(userText);
    if (it) {
      botMsg = businessReply(it, facts);
    } else {
      const ai = await aiReply({
        productName: s.product.name, originalPrice: price, floor,
        currentOffer, attempts: s.attempts, attemptsLeft: s.maxAttempts - s.attempts, userMessage: userText,
        history, factsLine: `fabric ${facts.fabric}; sizes ${facts.sizes}; MOQ ${facts.moq} pcs; address ${facts.address}; phone ${facts.phone}`,
        mode: "chat", seedHint: userText, lastBot
      });
      botMsg = (ai.length >= 20 && ai.length < 300)
        ? ai
        : chatFallback(s.product.name, `${userText}|${history.length}`, lastBot);
    }
  } else if (userPrice >= currentOffer) {
    // Customer offered MORE than bot's rate → instant deal at bot's rate. Customer feels they won.
    finalPrice = currentOffer;
    canBuy = true;
    botMsg = `arey wah! ₹${userPrice} toh mere rate se upar hai! imaandaari ka inaam — ₹${currentOffer} pe deal pakki! neeche Buy dabao!`;
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
    const left = s.maxAttempts - attempts;
    // Fast contextual reply first (instant), then try AI for extra wit with 8s cap.
    botMsg = smartReply({ userPrice, currentOffer, attemptsLeft: left, userMessage: userText, lastBot });
    const ai = await aiReply({
      productName: s.product.name, originalPrice: price, floor,
      currentOffer, attempts, attemptsLeft: left, userMessage: userText,
      history, factsLine: `fabric ${facts.fabric}; sizes ${facts.sizes}; MOQ ${facts.moq} pcs; address ${facts.address}; phone ${facts.phone}`,
      mode: "bid", seedHint: userText, lastBot
    });
    // Prefer AI only if it's a proper reply with a number (rate visible); else keep smart reply.
    if (/\d/.test(ai) && ai.length >= 20 && ai.length < 300) botMsg = withRate(ai, currentOffer);
  }

  await prisma.bargainSession.update({ where: { id: s.id }, data: { attempts: burnAttempt ? attempts : s.attempts, currentOffer } });
  await prisma.bargainMessage.create({ data: { sessionId: s.id, role: "bot", message: botMsg } });

  return NextResponse.json({
    bot_message: botMsg,
    current_offer: currentOffer,
    can_buy: canBuy,
    final_price: finalPrice,
    attempts_left: Math.max(0, s.maxAttempts - (burnAttempt ? attempts : s.attempts))
  });
}
