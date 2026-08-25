import { NextResponse } from "next/server";
import type { CallExtraction } from "@/lib/ai/system-prompt";

/**
 * Vapi end-of-call webhook (Spec §6 step 5, §8.1, §9.1).
 *
 * Vapi POSTs the finished call here. We:
 *  1. verify the shared secret,
 *  2. normalize the payload into a CallExtraction,
 *  3. forward it to the n8n pipeline, which fans out to the right path
 *     (booking / message / emergency / error) and sends SMS + alerts.
 *
 * The real DB write + Google Calendar booking happen inside n8n using the
 * Supabase service-role key (which bypasses RLS). This route stays thin.
 */

export const runtime = "nodejs";

interface VapiEndOfCall {
  type: string;
  call?: {
    id?: string;
    customer?: { number?: string };
    assistantId?: string;
    // Vapi attaches per-tenant metadata we set when creating the assistant
    metadata?: { businessId?: string };
  };
  message?: {
    // structured output the assistant produced during the call
    analysis?: Partial<CallExtraction>;
    transcript?: string;
    recordingUrl?: string;
    durationSeconds?: number;
  };
}

export async function POST(req: Request) {
  // 1. Verify shared secret (Spec §11 — secrets never in code)
  const secret = req.headers.get("x-vapi-secret");
  if (!process.env.VAPI_WEBHOOK_SECRET || secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: VapiEndOfCall;
  try {
    body = (await req.json()) as VapiEndOfCall;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Only act on end-of-call reports
  if (body.type !== "end-of-call-report") {
    return NextResponse.json({ ok: true, ignored: body.type });
  }

  const businessId = body.call?.metadata?.businessId;
  if (!businessId) {
    return NextResponse.json({ error: "missing businessId" }, { status: 400 });
  }

  const analysis = body.message?.analysis ?? {};
  const payload = {
    businessId,
    callId: body.call?.id ?? null,
    callerNumber: body.call?.customer?.number ?? null,
    transcript: body.message?.transcript ?? "",
    recordingUrl: body.message?.recordingUrl ?? null,
    durationSec: body.message?.durationSeconds ?? 0,
    intent: analysis.intent ?? "faq_question",
    outcome: analysis.outcome ?? "message_taken",
    customerName: analysis.customer_name ?? null,
    customerPhone: analysis.customer_phone ?? null,
    service: analysis.service ?? null,
    datetime: analysis.datetime ?? null,
    note: analysis.note ?? null,
  };

  // 3. Forward to n8n (Spec §9.1). If n8n is unreachable, we still 200 so Vapi
  //    doesn't retry-storm; the failure is logged for manual replay.
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nUrl) {
    try {
      await fetch(n8nUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("[vapi-webhook] n8n forward failed", err);
      // TODO: persist to error_logs for replay
    }
  }

  return NextResponse.json({ ok: true });
}
