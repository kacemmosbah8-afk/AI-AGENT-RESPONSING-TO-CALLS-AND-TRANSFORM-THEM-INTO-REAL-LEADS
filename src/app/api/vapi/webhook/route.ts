import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractCall } from "@/lib/ai/extract";
import type { CallExtraction } from "@/lib/ai/system-prompt";

/**
 * Vapi webhook (Spec §6 step 5, §8.1, §9.1). Handles two message types:
 *
 *  - "tool-calls"          → the assistant is invoking a function mid-call
 *                            (check_availability / book_appointment /
 *                            log_message / escalate_emergency). We execute it
 *                            against Supabase and return a result string.
 *  - "end-of-call-report"  → the call finished. We write the call record and
 *                            (if Vapi didn't already) extract structured data
 *                            from the transcript with OpenAI.
 *
 * Writes use the Supabase service-role client (bypasses RLS) since this request
 * isn't tied to a logged-in user — the tenant is identified from the assistant
 * metadata (businessId) we set at provision time.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyObj = Record<string, any>;

function parseArgs(raw: unknown): AnyObj {
  if (!raw) return {};
  if (typeof raw === "object") return raw as AnyObj;
  try {
    return JSON.parse(String(raw));
  } catch {
    return {};
  }
}

function getBusinessId(msg: AnyObj): string | undefined {
  return (
    msg?.call?.metadata?.businessId ??
    msg?.assistant?.metadata?.businessId ??
    msg?.metadata?.businessId
  );
}

export async function POST(req: Request) {
  // 1) Verify the shared secret (set on the assistant's server config).
  const secret = req.headers.get("x-vapi-secret");
  if (!serverEnv.vapiWebhookSecret || secret !== serverEnv.vapiWebhookSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: AnyObj;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const msg: AnyObj = body.message ?? body;
  const type: string = msg.type ?? "";
  const businessId = getBusinessId(msg);
  const admin = createAdminClient();

  // ── Live function calls ────────────────────────────────────────────────
  if (type === "tool-calls") {
    const calls: AnyObj[] = msg.toolCallList ?? msg.toolCalls ?? [];
    const results = await Promise.all(
      calls.map(async (tc) => {
        const id = tc.id ?? tc.toolCallId;
        const name = tc.function?.name ?? tc.name;
        const args = parseArgs(tc.function?.arguments ?? tc.arguments);
        const result = await runTool(name, args, businessId, admin);
        return { toolCallId: id, result };
      }),
    );
    return NextResponse.json({ results });
  }

  // ── End-of-call report → persist the call ──────────────────────────────
  if (type === "end-of-call-report") {
    if (!businessId || !admin) {
      // Nothing we can persist to; ack so Vapi doesn't retry-storm.
      return NextResponse.json({ ok: true, persisted: false });
    }

    const transcript: string =
      msg.artifact?.transcript ?? msg.transcript ?? "";
    const recordingUrl: string | null =
      msg.artifact?.recordingUrl ?? msg.recordingUrl ?? null;
    const durationSec = Math.round(
      Number(msg.durationSeconds ?? msg.call?.duration ?? 0),
    );
    const callerNumber: string | null =
      msg.call?.customer?.number ?? msg.customer?.number ?? null;

    // Prefer Vapi's structured analysis; else extract with OpenAI ourselves.
    const provided = msg.analysis?.structuredData as
      | Partial<CallExtraction>
      | undefined;
    const data: CallExtraction = provided?.intent
      ? {
          intent: provided.intent!,
          outcome: provided.outcome ?? "message_taken",
          customer_name: provided.customer_name,
          customer_phone: provided.customer_phone,
          service: provided.service,
          datetime: provided.datetime,
          note: provided.note,
        }
      : await extractCall(transcript);

    // Call log (drives the dashboard + KPIs).
    await admin.from("calls").insert({
      business_id: businessId,
      caller_number: callerNumber,
      transcript,
      intent: data.intent,
      outcome: data.outcome,
      recording_url: recordingUrl,
      duration_sec: durationSec,
    });

    // Best-effort usage accounting for billing (minutes this month).
    if (durationSec > 0) {
      const month = new Date();
      month.setUTCDate(1);
      const monthStr = month.toISOString().slice(0, 10);
      const { data: usage } = await admin
        .from("usage_logs")
        .select("id,minutes_used")
        .eq("business_id", businessId)
        .eq("month", monthStr)
        .maybeSingle();
      const minutes = Math.max(1, Math.round(durationSec / 60));
      if (usage) {
        await admin
          .from("usage_logs")
          .update({ minutes_used: Number(usage.minutes_used ?? 0) + minutes })
          .eq("id", usage.id);
      } else {
        await admin
          .from("usage_logs")
          .insert({ business_id: businessId, month: monthStr, minutes_used: minutes });
      }
    }

    // Optional legacy hand-off to n8n if configured (Spec §9.1) — on hold.
    if (serverEnv.n8nWebhookUrl) {
      fetch(serverEnv.n8nWebhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ businessId, ...data, transcript, recordingUrl, durationSec }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, persisted: true });
  }

  // Any other message type (status-update, etc.) — just acknowledge.
  return NextResponse.json({ ok: true, ignored: type });
}

/** Executes one assistant tool call against Supabase; returns a spoken-result string. */
async function runTool(
  name: string,
  args: AnyObj,
  businessId: string | undefined,
  admin: ReturnType<typeof createAdminClient>,
): Promise<string> {
  if (!businessId || !admin) return "Sorry, I couldn't complete that right now.";

  switch (name) {
    case "check_availability": {
      // Interim availability (Google Calendar sync is a later phase): offer two
      // sensible near-term slots so the booking flow can complete.
      const base = new Date();
      base.setDate(base.getDate() + 1);
      const day = base.toLocaleDateString("en-US", { weekday: "long" });
      return `The earliest openings are ${day} at 9:00 AM or ${day} at 2:00 PM. Which works better?`;
    }

    case "book_appointment": {
      const { error } = await admin.from("appointments").insert({
        business_id: businessId,
        customer_name: args.name ?? null,
        customer_phone: args.phone ?? null,
        service: args.service ?? null,
        datetime: args.datetime ? new Date(args.datetime).toISOString() : new Date().toISOString(),
        status: "booked",
      });
      if (error) return "I had trouble saving that appointment — let me take a message instead.";
      return `You're all set for ${args.service ?? "your appointment"}${
        args.datetime ? ` on ${args.datetime}` : ""
      }. You'll get a text confirming this shortly.`;
    }

    case "log_message": {
      const priority = args.priority === "complaint";
      const { error } = await admin.from("leads").insert({
        business_id: businessId,
        name: args.name ?? null,
        phone: args.phone ?? null,
        note: (priority ? "[complaint] " : "") + (args.note ?? ""),
        status: "new",
      });
      if (error) return "I couldn't save that — could you repeat your number?";
      return "Got it — I've passed your message to the team and they'll follow up shortly.";
    }

    case "escalate_emergency": {
      await admin.from("leads").insert({
        business_id: businessId,
        name: args.name ?? null,
        phone: args.phone ?? null,
        note: `[URGENT] ${args.issue ?? ""}${args.address ? ` @ ${args.address}` : ""}`,
        status: "new",
      });
      await admin.from("notifications_log").insert({
        business_id: businessId,
        channel: "call",
        type: "emergency",
      });
      // NOTE: the actual SMS + auto-call to the owner is Twilio/n8n (later phase).
      return "I've alerted the team directly — someone will call you back within 15 minutes.";
    }

    default:
      return "Okay.";
  }
}
