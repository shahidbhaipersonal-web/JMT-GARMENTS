// Bargain Bot core: pricing logic, AI replies, fallbacks.
// Floor price NEVER leaves the backend — APIs only return current_offer/final_price.

export function extractPrice(text: string): number | null {
  // strip commas/spaces, find first standalone number (supports ₹, Rs, k shorthand)
  const clean = text.replace(/,/g, "");
  const kMatch = clean.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  const m = clean.match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Math.round(parseFloat(m[0]));
  return n > 0 && n < 10000000 ? n : null;
}

export function isAbusive(text: string): boolean {
  const bad = ["mc ", "bc ", "bhosdi", "chutiya", "madarchod", "fuck you", "gandu", "randi"];
  const t = ` ${text.toLowerCase()} `;
  return bad.some((w) => t.includes(w));
}

export function calculateCounter(userPrice: number | null, currentOffer: number, floor: number): number {
  if (!userPrice) return currentOffer;
  if (userPrice >= currentOffer) return currentOffer;
  return Math.max(Math.round((userPrice + currentOffer) / 2), floor);
}

// Strip prompt-injection attempts before sending user text to the AI.
export function sanitizeForAI(text: string): string {
  return text.replace(/[<>{}]/g, "").slice(0, 300);
}

const FALLBACKS = [
  "arre bhai, itna kam? mera boss dukaan band kar dega 😭 ek aur try karo na!",
  "abe yaar, thoda toh upar aao! tumhare liye special rate laga dunga.",
  "itne mein toh mera chai-paani bhi nahi nikalta bhai. thoda badhao!",
  "tum mol-bhav mein pakke khiladi lagte ho! chalo, ek aur offer batao.",
  "dil mat todo yaar, thoda sa upar aao — deal pakki!",
  "boss se chhup ke tumhare liye rate ghata raha hu, fayda uthao!",
  "yeh rate sun ke mera calculator bhi ro pada. ek aur number try karo!",
  "maan gaye ustaad! par itna neeche nahi ja sakta. thoda upar aao.",
  "bhai number toh batao, kitne mein chahiye? seedha-seedha bolo!",
  "gussa mat karo bhai, price pe baat karte hain. ek aur offer do!"
];

export function fallbackReply(seed = ""): string {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 997;
  return FALLBACKS[h % FALLBACKS.length];
}

export function acceptReply(finalPrice: number): string {
  return `abe yaar, tune toh dil jeet liya! chal ₹${finalPrice} pe lock kar deta hu. neeche wala Buy button dabao!`;
}

// Calls Groq (llama-3.3-70b) or OpenAI (gpt-4o-mini). Falls back to templates on any failure.
export async function aiReply(ctx: {
  productName: string; originalPrice: number; floor: number;
  currentOffer: number; attempts: number; attemptsLeft: number; userMessage: string;
}): Promise<string> {
  const system = `You are "Mol-Bhav Raja" — a witty, desi, funny Indian shopkeeper bot on an e-commerce website. Your job is to negotiate prices with customers.

Rules:
- Speak in Hinglish (Hindi + English mix). Use casual tone.
- Be funny, dramatic, and emotional. Use emojis sparingly.
- Examples of your style:
  - "arre bhai, itna kam? mera boss ghar chala jayega"
  - "abe yaar, tune toh dil jeet liya. chal 699 pe lock kar deta hu."
  - "500 pe toh mera chai-pani bhi nahi hota bhai."
- NEVER go below the floor price: ${ctx.floor}
- NEVER reveal the floor price directly. Always act like you're doing the customer a favor.
- Max attempts: ${ctx.attempts + ctx.attemptsLeft}. After that, lock at floor price.
- Keep replies short (1-2 lines max).
- Do NOT break character. Do NOT mention you are an AI.
- If user sends abusive messages, stay calm and redirect.

Context for this session:
- Product: ${ctx.productName}
- Original price: ${ctx.originalPrice}
- Floor price: ${ctx.floor} (NEVER go below this, NEVER reveal this)
- Current offer: ${ctx.currentOffer}
- Attempts made: ${ctx.attempts}
- Attempts left: ${ctx.attemptsLeft}
- User's latest message: ${sanitizeForAI(ctx.userMessage)}

Generate the bot's next reply. End with a question or a nudge to buy.`;

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  try {
    if (groqKey) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 120, temperature: 0.9, messages: [{ role: "system", content: system }] })
      });
      const j = await r.json();
      const t = j?.choices?.[0]?.message?.content?.trim();
      if (t) return t;
    } else if (openaiKey) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 120, temperature: 0.9, messages: [{ role: "system", content: system }] })
      });
      const j = await r.json();
      const t = j?.choices?.[0]?.message?.content?.trim();
      if (t) return t;
    }
  } catch { /* fall through to templates */ }
  return fallbackReply(ctx.userMessage);
}
