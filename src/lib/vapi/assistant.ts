import "server-only";
import { renderReceptionistPrompt, type GreetingStyle } from "../ai/receptionist-prompt";
import { RECEPTIONIST_TOOLS } from "../ai/tools";
import { serverEnv } from "../env";

/**
 * Builds the Vapi assistant payload for one tenant from their business row +
 * pricing + FAQ. The system prompt is the canonical receptionist template,
 * rendered with this tenant's data; the four function tools are attached so
 * Vapi calls our webhook mid-call.
 */

export interface BusinessRow {
  id: string;
  name: string;
  industry?: string | null;
  city?: string | null;
  greeting_style?: string | null;
  voice_id?: string | null;
  hours_json?: { text?: string } | null;
}

// Map our friendly voice ids to Vapi's built-in voices (works without an
// ElevenLabs key; swap provider to "11labs" + real voiceId when configured).
const VOICE_MAP: Record<string, string> = {
  aria: "Kylie",
  mia: "Kylie",
  noah: "Elliot",
  leo: "Elliot",
};

function toGreetingStyle(v?: string | null): GreetingStyle {
  return v === "professional" || v === "warm-casual" ? v : "friendly";
}

export function buildAssistantPayload(input: {
  business: BusinessRow;
  pricing: { service_name: string; price_range: string }[];
  faq: { question: string; answer: string }[];
}) {
  const { business, pricing, faq } = input;

  const systemPrompt = renderReceptionistPrompt({
    business_name: business.name,
    industry: business.industry || "small business",
    location: business.city || "your area",
    greeting_style: toGreetingStyle(business.greeting_style),
    business_hours: business.hours_json?.text || "regular business hours",
    current_datetime: new Date().toISOString(),
    services_pricing: pricing,
    faq,
    callback_window_minutes: 15,
    owner_or_team: "the team",
  });

  const webhookUrl = `${serverEnv.appUrl.replace(/\/$/, "")}/api/vapi/webhook`;

  return {
    name: `PulseDesk — ${business.name}`,
    firstMessage: `Hi, thanks for calling ${business.name} — this call may be recorded for quality. How can I help you today?`,
    model: {
      provider: "openai",
      model: serverEnv.openaiModel,
      temperature: 0.4,
      messages: [{ role: "system", content: systemPrompt }],
      tools: RECEPTIONIST_TOOLS,
    },
    voice: {
      provider: "vapi",
      voiceId: VOICE_MAP[business.voice_id ?? "aria"] ?? "Kylie",
    },
    transcriber: { provider: "deepgram", model: "nova-2", language: "en" },
    // Post-call structured analysis (Vapi runs it; our webhook falls back to
    // its own OpenAI extraction if this is absent).
    analysisPlan: {
      structuredDataPrompt:
        "Extract the caller's intent (book_appointment, faq_question, emergency, complaint, request_human, spam), the outcome (appointment_booked, message_taken, emergency_escalated, spam, failed), and any customer_name, customer_phone, service, datetime (ISO 8601), and a one-sentence note.",
    },
    // Where Vapi sends tool-calls + the end-of-call report.
    server: { url: webhookUrl, secret: serverEnv.vapiWebhookSecret },
    serverMessages: ["end-of-call-report", "tool-calls", "status-update"],
    metadata: { businessId: business.id },
  };
}
