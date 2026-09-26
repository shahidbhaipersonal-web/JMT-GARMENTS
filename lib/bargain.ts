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
  "arre bhai, {offer} se neeche? mera boss dukaan band kar dega! thoda upar aao na!",
  "abe yaar, tum toh pakke khiladi ho! chalo mera counter suno: {offer}. deal karein?",
  "itne mein toh mera chai-paani bhi nahi nikalta bhai. mera offer hai {offer} — bolo done?",
  "dil mat todo yaar! {offer} mein le jao, isse kam mein boss ghar bhej dega!",
  "boss se chhup ke rate ghata raha hu — sirf tumhare liye {offer}! fayda uthao!",
  "yeh suno: {offer}! isse ek rupaya kam nahi hoga. {left}!",
  "maan gaye ustaad, mol-bhav mein tez ho! mera aakhri jaisa offer: {offer}!",
  "tumhare liye special: {offer}! market mein is rate pe koi nahi dega!"
];

export function fallbackReply(seed = ""): string {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 997;
  return FALLBACKS[h % FALLBACKS.length];
}

// Dynamic contextual reply — ALWAYS shows the live counter rate + tries left,
// never repeats the previous bot line, so every turn feels fresh.
export function smartReply(ctx: { userPrice: number | null; currentOffer: number; attemptsLeft: number; userMessage: string; lastBot?: string }): string {
  const n = FALLBACKS.length;
  let h = 0;
  const seed = `${ctx.userMessage}|${ctx.currentOffer}|${ctx.attemptsLeft}`;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 997;
  const leftTxt = ctx.attemptsLeft === 1 ? "aakhri 1 chance bacha hai" : `${ctx.attemptsLeft} chance bache hain`;
  for (let k = 0; k < n; k++) {
    const t = FALLBACKS[(h + k) % n].replace("{offer}", `₹${ctx.currentOffer}`).replace("{left}", leftTxt);
    if (t !== ctx.lastBot) return t;
  }
  return FALLBACKS[h % n].replace("{offer}", `₹${ctx.currentOffer}`).replace("{left}", leftTxt);
}

// Business intents — customer ke sawal ka seedha jawab (product facts ke saath),
// taaki har sawal pe same dialogue na bole. Attempts sirf asli bid pe kat-te hain.
export type Intent = "delivery" | "size" | "fabric" | "moq" | "payment" | "location" | "exchange" | "greet" | "thanks" | "who";

export function detectIntent(text: string): Intent | null {
  const t = text.toLowerCase();
  if (/(tum (kaun|kon|koun|ho kaun)|tu (kaun|kon)|aap kaun|who are you|tera naam|tumhara naam|tumhara name|your name|tum ho)/.test(t)) return "who";
  if (/\b(hi|hello|hey|namaste|namaskar|ram ram|salam|sat sri|good morning|good evening)\b/.test(t) && t.length < 30) return "greet";
  if (/(shukriya|thank|dhanyavad|bahut badhiya)/.test(t)) return "thanks";
  if (/(deliver|dispatch|courier|transport|ship|pahuch|kab aayega|kitne din)/.test(t)) return "delivery";
  if (/(size|saiz|measurement|fit)/.test(t)) return "size";
  if (/(fabric|kapda|kapde|material|quality|cloth)/.test(t)) return "fabric";
  if (/(moq|minimum|minimam|kitne piece|kitne pcs|bulk me|wholesale me)/.test(t)) return "moq";
  if (/(payment|paisa|cod|cash|advance|upi|online|pay)/.test(t)) return "payment";
  if (/(location|address|dukaan|shop|kahan|kaha|store|market)/.test(t)) return "location";
  if (/(exchange|return|wapas|warranty|defect|kharab|guarantee)/.test(t)) return "exchange";
  return null;
}

export type Facts = { productName: string; fabric: string; sizes: string; moq: number; address: string; phone: string; currentOffer: number };

export function businessReply(intent: Intent, f: Facts): string {
  switch (intent) {
    case "delivery": return `bhai ${f.productName} 4-6 din mein dispatch, pan-India transport/courier se! bolo kitne pcs chahiye, rate bhi final kar dete hain?`;
    case "size": return `isme sizes hain: ${f.sizes}! bolo kaunsa size chahiye, usi hisaab se best rate lagata hu?`;
    case "fabric": return `yeh ${f.fabric} kapda hai bhai, quality ekdum solid! ab ek number bolo, deal pakki karte hain?`;
    case "moq": return `minimum ${f.moq} pcs lena padega (wholesale rule hai bhai). kitne pcs ka order hai?`;
    case "payment": return `wholesale mein advance + dispatch pe balance hota hai, GST bill ke saath! bolo, kitne mein deal lock karun?`;
    case "location": return `dukaan yahan hai: ${f.address}! aake dekh lo ya online order karo. bolo budget kya hai?`;
    case "exchange": return `defect nikle toh 7 din mein size exchange pakka, tension mat lo! ab bolo kitne mein deal karein?`;
    case "greet": return `namaste bhai! Bargain / Mol-Bhav mein swagat hai! ${f.productName} ke liye apna budget batao.`;
    case "thanks": return `koi baat nahi bhai, khushi hui! toh bolo, kitne mein lock karun?`;
    case "who": return `main Bargain / Mol-Bhav hu bhai — mol-bhav ka ustaad! ${f.productName} chahiye toh budget batao, best rate lagata hu?`;
  }
}

// Guarantees the reply shows a number — fixes "bot rate nahi dikhata" even when AI returns dry text.
export function withRate(text: string, currentOffer: number): string {
  return /\d/.test(text) ? text : `${text} (mera counter: ₹${currentOffer})`;
}

export function acceptReply(finalPrice: number): string {
  return `abe yaar, tune toh dil jeet liya! chal ₹${finalPrice} pe lock kar deta hu. neeche wala Buy button dabao!`;
}

// Calls Gemini (free) → Groq → OpenAI. Falls back to templates on any failure.
export async function aiReply(ctx: {
  productName: string; originalPrice: number; floor: number;
  currentOffer: number; attempts: number; attemptsLeft: number; userMessage: string;
  history?: string[]; factsLine?: string;
}): Promise<string> {
  const convo = (ctx.history || []).slice(-6).join("\n");
  const system = `You are "Bargain / Mol-Bhav" — a witty, desi, funny Indian shopkeeper bot on an e-commerce website. Your job is to chat with customers and negotiate prices.

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
${ctx.factsLine ? `- Shop facts (use these for delivery/size/fabric/payment/location questions): ${ctx.factsLine}` : ""}
${convo ? `Recent chat (do NOT repeat your old lines, say something new):\n${convo}` : ""}

Generate the bot's next reply. End with a question or a nudge to buy.`;

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  try {
    if (geminiKey) {
      // Gemini Flash — free tier (aistudio.google.com se key lo)
      const call = async (prompt: string): Promise<string> => {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 120, temperature: 0.9 } }),
          signal: AbortSignal.timeout(5000) // fast fail — never keep customer waiting
        });
        const j = await r.json();
        return j?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("").trim() || "";
      };
      let t = await call(system);
      const good = (s: string) => /\d/.test(s) && s.length >= 20 && s.length < 300;
      if (!good(t)) {
        // retry once with a minimal prompt (model kabhi glitch kare toh)
        t = await call(`Customer bola: "${sanitizeForAI(ctx.userMessage)}". Mera counter rate: ₹${ctx.currentOffer}. Sirf 1 line Hinglish funny reply de jisme ₹${ctx.currentOffer} ho.`);
      }
      if (good(t)) return t;
    }
    if (groqKey) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 120, temperature: 0.9, messages: [{ role: "system", content: system }] }),
        signal: AbortSignal.timeout(8000) // fast fail — never keep customer waiting
      });
      const j = await r.json();
      const t = j?.choices?.[0]?.message?.content?.trim();
      if (t) return t;
    } else if (openaiKey) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 120, temperature: 0.9, messages: [{ role: "system", content: system }] }),
        signal: AbortSignal.timeout(8000) // fast fail — never keep customer waiting
      });
      const j = await r.json();
      const t = j?.choices?.[0]?.message?.content?.trim();
      if (t) return t;
    }
  } catch { /* fall through to templates */ }
  // Filled template fallback — placeholders kabhi kacche nahi jayenge.
  return smartReply({ userPrice: null, currentOffer: ctx.currentOffer, attemptsLeft: Math.max(1, ctx.attemptsLeft), userMessage: ctx.userMessage });
}
