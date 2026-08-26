import "server-only";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import * as mock from "./mock-data";
import type { CallRow, Appt, Lead, CallOutcome } from "./mock-data";

/**
 * Server-side data access. When Supabase is configured AND a user is signed in,
 * every function returns that tenant's real rows (scoped by Row Level Security).
 * Otherwise it returns demo/mock data so the public keyless demo keeps working.
 *
 * Each function reports `isDemo` so pages know whether to honor the
 * `?state=empty` demo toggle (demo only) vs. show naturally-empty real data.
 */

const PLAN_MINUTES: Record<string, number> = { starter: 300, pro: 600, business: 1200 };

interface Ctx {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  business: any;
}

/** Resolve the signed-in tenant, or null for demo mode. */
async function ctx(): Promise<Ctx | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) return null;
  return { supabase, userId: user.id, business };
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const t = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return sameDay ? `Today · ${t}` : `${d.toLocaleDateString("en-US", { weekday: "short" })} · ${t}`;
}

const OUTCOMES: CallOutcome[] = [
  "appointment_booked",
  "message_taken",
  "emergency_escalated",
  "spam",
  "failed",
];
const asOutcome = (v: string | null): CallOutcome =>
  OUTCOMES.includes(v as CallOutcome) ? (v as CallOutcome) : "message_taken";

// ── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardData {
  businessName: string;
  isDemo: boolean;
  kpis: {
    callsThisMonth: number;
    callsRescued: number;
    appointmentsBooked: number;
    recoveredRevenue: number;
    deltas?: typeof mock.KPIS.deltas;
  };
  weekly: { day: string; calls: number }[];
  calls: CallRow[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const c = await ctx();
  if (!c) {
    return {
      businessName: mock.DEMO_BUSINESS.name,
      isDemo: true,
      kpis: { ...mock.KPIS },
      weekly: mock.WEEKLY_CALLS,
      calls: mock.RECENT_CALLS,
    };
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(Date.now() - 6 * 864e5);
  weekStart.setHours(0, 0, 0, 0);

  const [{ data: monthCalls }, { data: recent }, { count: apptCount }] = await Promise.all([
    c.supabase.from("calls").select("outcome,created_at").gte("created_at", monthStart.toISOString()),
    c.supabase.from("calls").select("*").order("created_at", { ascending: false }).limit(10),
    c.supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString()),
  ]);

  const month = monthCalls ?? [];
  const appointmentsBooked = apptCount ?? 0;
  const avgDeal = Number(c.business.avg_deal_value ?? 0);

  // Weekly buckets (Mon…Sun order)
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts: Record<string, number> = Object.fromEntries(labels.map((l) => [l, 0]));
  const { data: weekCalls } = await c.supabase
    .from("calls")
    .select("created_at")
    .gte("created_at", weekStart.toISOString());
  (weekCalls ?? []).forEach((r: any) => {
    const day = new Date(r.created_at).toLocaleDateString("en-US", { weekday: "short" });
    if (day in counts) counts[day]++;
  });

  return {
    businessName: c.business.name,
    isDemo: false,
    kpis: {
      callsThisMonth: month.length,
      callsRescued: month.filter((r: any) => r.outcome !== "spam").length,
      appointmentsBooked,
      recoveredRevenue: appointmentsBooked * avgDeal,
      // No week-over-week history yet → omit trend chips for real tenants.
    },
    weekly: labels.map((day) => ({ day, calls: counts[day] })),
    calls: (recent ?? []).map(rowToCall),
  };
}

function rowToCall(r: any): CallRow {
  return {
    id: r.id,
    caller: r.caller_number || "Unknown caller",
    number: r.caller_number || "",
    time: fmtTime(r.created_at),
    durationSec: r.duration_sec ?? 0,
    intent: r.intent || "faq_question",
    outcome: asOutcome(r.outcome),
    summary: "",
  };
}

// ── Appointments ─────────────────────────────────────────────────────────────
export async function getAppointments(): Promise<{ appts: Appt[]; isDemo: boolean }> {
  const c = await ctx();
  if (!c) return { appts: mock.APPOINTMENTS, isDemo: true };
  const { data } = await c.supabase
    .from("appointments")
    .select("*")
    .order("datetime", { ascending: true });
  const appts: Appt[] = (data ?? []).map((a: any) => ({
    id: a.id,
    customer: a.customer_name || "Customer",
    service: a.service || "—",
    datetime: a.datetime
      ? new Date(a.datetime).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })
      : "",
    status: (a.status as Appt["status"]) || "booked",
  }));
  return { appts, isDemo: false };
}

// ── Leads / messages ─────────────────────────────────────────────────────────
export async function getLeads(): Promise<{ leads: Lead[]; isDemo: boolean }> {
  const c = await ctx();
  if (!c) return { leads: mock.LEADS, isDemo: true };
  const { data } = await c.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  const leads: Lead[] = (data ?? []).map((l: any) => ({
    id: l.id,
    name: l.name || "Caller",
    phone: l.phone || "",
    note: l.note || "",
    time: fmtTime(l.created_at),
    status: (l.status as Lead["status"]) || "new",
  }));
  return { leads, isDemo: false };
}

// ── Single call ──────────────────────────────────────────────────────────────
export interface CallDetail {
  call: CallRow;
  transcript: mock.TranscriptLine[];
  durationSec: number;
  isDemo: boolean;
}

export async function getCall(id: string): Promise<CallDetail> {
  const c = await ctx();
  if (!c) {
    const call = mock.RECENT_CALLS.find((x) => x.id === id) ?? mock.RECENT_CALLS[0];
    return { call, transcript: mock.DEMO_TRANSCRIPT, durationSec: mock.CALL_DURATION_SEC, isDemo: true };
  }
  const { data } = await c.supabase.from("calls").select("*").eq("id", id).maybeSingle();
  if (!data) {
    const call = mock.RECENT_CALLS[0];
    return { call, transcript: mock.DEMO_TRANSCRIPT, durationSec: mock.CALL_DURATION_SEC, isDemo: false };
  }
  return {
    call: rowToCall(data),
    transcript: parseTranscript(data.transcript),
    durationSec: data.duration_sec ?? 0,
    isDemo: false,
  };
}

/** Transcript is stored as text — accept a JSON array or fall back to one line. */
function parseTranscript(raw: string | null): mock.TranscriptLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((l: any, i: number) => ({
        role: l.role === "caller" ? "caller" : "assistant",
        text: String(l.text ?? ""),
        t: Number(l.t ?? i * 5),
      }));
    }
  } catch {
    /* not JSON */
  }
  return [{ role: "assistant", text: raw, t: 0 }];
}

// ── Billing ──────────────────────────────────────────────────────────────────
export interface BillingData {
  plan: string;
  price: number;
  minutesUsed: number;
  minutesIncluded: number;
  status: string;
  isDemo: boolean;
}

const PLAN_PRICE: Record<string, number> = { starter: 149, pro: 249, business: 399 };

export async function getBilling(): Promise<BillingData> {
  const c = await ctx();
  if (!c) {
    const p = mock.DEMO_BUSINESS.plan;
    return {
      plan: p,
      price: PLAN_PRICE[p],
      minutesUsed: mock.DEMO_BUSINESS.minutesUsed,
      minutesIncluded: mock.DEMO_BUSINESS.minutesIncluded,
      status: "active",
      isDemo: true,
    };
  }
  const monthStart = new Date();
  monthStart.setDate(1);
  const [{ data: sub }, { data: usage }] = await Promise.all([
    c.supabase.from("subscriptions").select("*").eq("business_id", c.business.id).maybeSingle(),
    c.supabase
      .from("usage_logs")
      .select("minutes_used")
      .eq("business_id", c.business.id)
      .gte("month", monthStart.toISOString().slice(0, 10))
      .maybeSingle(),
  ]);
  const plan = sub?.plan ?? "starter";
  return {
    plan,
    price: PLAN_PRICE[plan] ?? 149,
    minutesUsed: Number(usage?.minutes_used ?? 0),
    minutesIncluded: PLAN_MINUTES[plan] ?? 300,
    status: sub?.status ?? "trialing",
    isDemo: false,
  };
}

// ── Settings ─────────────────────────────────────────────────────────────────
export interface SettingsData {
  business: {
    name: string;
    industry: string;
    city: string;
    hours: string;
    greetingStyle: string;
    voiceId: string;
    avgDealValue: number;
  };
  pricing: { id?: string; service_name: string; price_range: string }[];
  faq: { id?: string; question: string; answer: string }[];
  isDemo: boolean;
}

export async function getSettings(): Promise<SettingsData> {
  const c = await ctx();
  if (!c) {
    return {
      business: {
        name: mock.DEMO_BUSINESS.name,
        industry: mock.DEMO_BUSINESS.industry,
        city: "Chicago, IL",
        hours: "Mon–Fri, 8:00 AM – 6:00 PM",
        greetingStyle: mock.DEMO_BUSINESS.greetingStyle,
        voiceId: "aria",
        avgDealValue: mock.DEMO_BUSINESS.avgDealValue,
      },
      pricing: [
        { service_name: "Leak repair", price_range: "$120 – $250" },
        { service_name: "Drain cleaning", price_range: "$95 – $180" },
      ],
      faq: [],
      isDemo: true,
    };
  }
  const [{ data: pricing }, { data: faq }] = await Promise.all([
    c.supabase.from("business_pricing").select("*").eq("business_id", c.business.id),
    c.supabase.from("business_knowledge").select("*").eq("business_id", c.business.id),
  ]);
  const b = c.business;
  return {
    business: {
      name: b.name ?? "",
      industry: b.industry ?? "",
      city: b.city ?? "",
      hours: b.hours_json?.text ?? "",
      greetingStyle: b.greeting_style ?? "friendly",
      voiceId: b.voice_id ?? "aria",
      avgDealValue: Number(b.avg_deal_value ?? 0),
    },
    pricing: (pricing ?? []).map((p: any) => ({ id: p.id, service_name: p.service_name, price_range: p.price_range })),
    faq: (faq ?? []).map((f: any) => ({ id: f.id, question: f.question, answer: f.answer })),
    isDemo: false,
  };
}
