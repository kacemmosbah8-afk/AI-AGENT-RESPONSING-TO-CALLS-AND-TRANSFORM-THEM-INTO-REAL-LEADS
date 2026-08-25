/**
 * Core AI Engine — engine metadata + entry point (Spec §5).
 *
 * The full runtime prompt lives in `./receptionist-prompt.ts` (the single
 * source of truth). This module re-exports the renderer + tools and keeps the
 * structured reference data (intents, slot order, edge cases, and the post-call
 * extraction shape) that the dashboard, admin, and n8n pipeline rely on.
 *
 * There is NO single static prompt shared across tenants: for every live call
 * the caller's business context (pricing, hours, FAQ) is injected so the
 * assistant only ever speaks facts it was given (Spec §5.1).
 */

export {
  RECEPTIONIST_PROMPT_TEMPLATE,
  renderReceptionistPrompt,
} from "./receptionist-prompt";
export type { ReceptionistContext, GreetingStyle } from "./receptionist-prompt";
export { RECEPTIONIST_TOOLS } from "./tools";
export type { FunctionTool } from "./tools";

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
