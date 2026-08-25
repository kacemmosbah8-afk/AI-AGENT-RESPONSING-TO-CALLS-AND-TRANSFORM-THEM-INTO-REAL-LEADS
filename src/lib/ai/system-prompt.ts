/**
 * Core AI Engine — dynamic assistant instructions (Spec §5).
 *
 * There is NO single static prompt shared across tenants. For every live call,
 * the caller's business context (pricing, hours, FAQ) is injected from the
 * database so the assistant only ever speaks facts it was given (Spec §5.1).
 */

export type GreetingStyle = "formal" | "friendly";

export interface BusinessContext {
  name: string;
  industry?: string | null;
  timezone?: string | null;
  greetingStyle: GreetingStyle;
  hours?: Record<string, string>; // { monday: "8:00-17:00", ... }
  pricing: { service_name: string; price_range: string }[];
  faq: { question: string; answer: string }[];
}

/** Caller intents the engine classifies against (Spec §5.2). */
export const INTENTS = {
  book_appointment:
    "collect service type + preferred date, check the calendar, confirm immediately",
  faq_question:
    "answer ONLY from the provided knowledge base, otherwise take a message",
  emergency:
    "reassure the caller, capture details immediately, escalate to the owner mid-call",
  complaint: "empathize, log details, escalate to the owner with a priority flag",
  request_human:
    "take the message + number, promise a callback, never pressure the caller to stay",
  spam: "end the call politely without wasting time",
} as const;

/** Slot-filling order for a booking (Spec §5.3). */
export const BOOKING_SLOTS = [
  "name",
  "phone", // usually auto-captured from caller id
  "service",
  "preferred_datetime",
  "offer_nearest_available",
  "verbal_confirmation",
] as const;

/** Edge-case handling rules (Spec §5.4). */
export const EDGE_CASES = [
  "Caller silent >5s → one gentle prompt, then polite end after two attempts.",
  "Background noise → ask to repeat the LAST sentence only, never the whole question.",
  "Requested slot conflicts → automatically offer the 3 nearest available times.",
  "Two comprehension failures in a row → take a message + promise a human callback.",
  "Vapi/LLM outage → fall back to plain Twilio voicemail.",
  "After-hours but genuine emergency → escalate immediately via auto-call + SMS.",
] as const;

const HARD_RULES = [
  "Never invent prices or facts that are not in the context below.",
  "Always collect the caller's name and phone number within the first minute.",
  "Confirm any appointment out loud clearly before ending the call.",
  "Do not end the call before checking the caller has nothing else to ask.",
  "Open with the legally required recording disclosure before anything else.",
];

function toneLine(style: GreetingStyle): string {
  return style === "formal"
    ? "Speak in a professional, courteous tone."
    : "Speak in a warm, friendly, conversational tone.";
}

/** Build the full system prompt for one live call. */
export function buildSystemPrompt(ctx: BusinessContext): string {
  const pricing = ctx.pricing.length
    ? ctx.pricing.map((p) => `- ${p.service_name}: ${p.price_range}`).join("\n")
    : "- (no pricing provided — take a message instead of quoting)";

  const faq = ctx.faq.length
    ? ctx.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : "- (no FAQ provided)";

  const hours = ctx.hours
    ? Object.entries(ctx.hours)
        .map(([d, h]) => `- ${d}: ${h}`)
        .join("\n")
    : "- (hours not set)";

  return `You are the receptionist for ${ctx.name}${
    ctx.industry ? ` (${ctx.industry})` : ""
  }. You speak on their behalf. ${toneLine(ctx.greetingStyle)}

## Hard rules (never break)
${HARD_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## Business hours (timezone: ${ctx.timezone ?? "local"})
${hours}

## Pricing you may quote (and ONLY these)
${pricing}

## Knowledge base — answer FAQ only from here
${faq}

## Intent handling
${Object.entries(INTENTS)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## When booking, gather in this order
${BOOKING_SLOTS.join(" → ")}

## Edge cases
${EDGE_CASES.map((e) => `- ${e}`).join("\n")}`;
}

/** Post-call structured extraction target (fed to n8n, Spec §9.1). */
export interface CallExtraction {
  intent: keyof typeof INTENTS;
  outcome:
    | "appointment_booked"
    | "message_taken"
    | "emergency_escalated"
    | "spam"
    | "failed";
  customer_name?: string;
  customer_phone?: string;
  service?: string;
  datetime?: string;
  note?: string;
}
