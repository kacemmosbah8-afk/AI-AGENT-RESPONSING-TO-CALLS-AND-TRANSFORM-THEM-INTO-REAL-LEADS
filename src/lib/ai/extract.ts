import "server-only";
import { serverEnv } from "../env";
import type { CallExtraction } from "./system-prompt";

/**
 * Post-call transcript → structured data (Spec §9.1). Used by the webhook when
 * Vapi didn't already return structured analysis. Calls OpenAI directly with
 * the server-side OPENAI_API_KEY (fetch-based, JSON mode; no SDK dependency).
 *
 * Always returns a valid CallExtraction — falls back to a safe default on any
 * error so the webhook never fails the call for a parsing hiccup.
 */

const SYSTEM = `You extract structured data from a phone-call transcript for a small-business AI receptionist. Return ONLY JSON with this shape:
{
  "intent": one of ["book_appointment","faq_question","emergency","complaint","request_human","spam"],
  "outcome": one of ["appointment_booked","message_taken","emergency_escalated","spam","failed"],
  "customer_name": string | null,
  "customer_phone": string | null,
  "service": string | null,
  "datetime": ISO-8601 string | null,
  "note": one short sentence summarizing the call
}`;

const FALLBACK: CallExtraction = {
  intent: "faq_question",
  outcome: "message_taken",
  note: "Call received.",
};

export async function extractCall(transcript: string): Promise<CallExtraction> {
  if (!serverEnv.openaiApiKey || !transcript.trim()) return FALLBACK;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverEnv.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        model: serverEnv.openaiModel,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: transcript.slice(0, 12000) },
        ],
      }),
    });
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return FALLBACK;
    const parsed = JSON.parse(content) as Partial<CallExtraction>;
    return {
      intent: parsed.intent ?? FALLBACK.intent,
      outcome: parsed.outcome ?? FALLBACK.outcome,
      customer_name: parsed.customer_name ?? undefined,
      customer_phone: parsed.customer_phone ?? undefined,
      service: parsed.service ?? undefined,
      datetime: parsed.datetime ?? undefined,
      note: parsed.note ?? FALLBACK.note,
    };
  } catch {
    return FALLBACK;
  }
}
