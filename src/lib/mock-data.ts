/**
 * Demo data so the whole product renders — and demos — without a live backend.
 * In production these come from Supabase (see supabase/schema.sql).
 *
 * The set is intentionally varied — different outcomes, times of day, services,
 * and industries — so a click-through demo looks like a real, active product.
 */

export const DEMO_BUSINESS = {
  name: "BlueLine Plumbing",
  industry: "Plumbing",
  timezone: "America/Chicago",
  greetingStyle: "friendly" as const,
  plan: "pro" as const,
  minutesUsed: 512,
  minutesIncluded: 600,
  avgDealValue: 3500,
};

export const KPIS = {
  callsThisMonth: 128,
  callsRescued: 79, // would have been missed
  appointmentsBooked: 34,
  recoveredRevenue: 34 * DEMO_BUSINESS.avgDealValue, // avg deal × booked appts (Spec §4.4)
  // week-over-week deltas (positive = good)
  deltas: {
    callsThisMonth: 12,
    callsRescued: 18,
    appointmentsBooked: 6,
    recoveredRevenue: 21,
  },
};

// Weekly call volume for the dashboard chart (Spec §4.4)
export const WEEKLY_CALLS = [
  { day: "Mon", calls: 18 },
  { day: "Tue", calls: 24 },
  { day: "Wed", calls: 21 },
  { day: "Thu", calls: 27 },
  { day: "Fri", calls: 22 },
  { day: "Sat", calls: 11 },
  { day: "Sun", calls: 5 },
];

export type CallOutcome =
  | "appointment_booked"
  | "message_taken"
  | "emergency_escalated"
  | "spam"
  | "failed";

export interface CallRow {
  id: string;
  caller: string;
  number: string;
  time: string;
  durationSec: number;
  intent: string;
  outcome: CallOutcome;
  summary: string;
}

// A fuller, varied call log — mornings to evenings, every outcome type.
export const RECENT_CALLS: CallRow[] = [
  { id: "c_1042", caller: "Maria Gonzalez", number: "+1 (312) 555-0148", time: "Today · 2:14 PM", durationSec: 142, intent: "book_appointment", outcome: "appointment_booked", summary: "Kitchen sink leak — booked tomorrow 9:00 AM." },
  { id: "c_1041", caller: "Unknown caller", number: "+1 (312) 555-0991", time: "Today · 1:03 PM", durationSec: 58, intent: "faq_question", outcome: "message_taken", summary: "Asked about weekend rates — message taken." },
  { id: "c_1040", caller: "David Reyes", number: "+1 (708) 555-0217", time: "Today · 11:47 AM", durationSec: 205, intent: "emergency", outcome: "emergency_escalated", summary: "Burst pipe flooding basement — owner alerted." },
  { id: "c_1039", caller: "Telemarketer", number: "+1 (800) 555-3300", time: "Today · 10:22 AM", durationSec: 12, intent: "spam", outcome: "spam", summary: "Robocall — ended politely." },
  { id: "c_1038", caller: "Aisha Khan", number: "+1 (312) 555-0765", time: "Today · 9:15 AM", durationSec: 176, intent: "book_appointment", outcome: "appointment_booked", summary: "Water heater inspection — booked Tue 1:30 PM." },
  { id: "c_1037", caller: "Tom Whitfield", number: "+1 (630) 555-0412", time: "Yesterday · 5:41 PM", durationSec: 95, intent: "complaint", outcome: "message_taken", summary: "Follow-up on prior visit — flagged for owner." },
  { id: "c_1036", caller: "Priya Nair", number: "+1 (773) 555-0330", time: "Yesterday · 3:12 PM", durationSec: 188, intent: "book_appointment", outcome: "appointment_booked", summary: "Drain cleaning — booked Wed 11:00 AM." },
  { id: "c_1035", caller: "Marcus Lee", number: "+1 (312) 555-0199", time: "Yesterday · 8:03 AM", durationSec: 149, intent: "faq_question", outcome: "message_taken", summary: "Service-area question — callback requested." },
  { id: "c_1034", caller: "Wrong number", number: "+1 (415) 555-0101", time: "Yesterday · 7:22 AM", durationSec: 9, intent: "spam", outcome: "spam", summary: "Wrong number — ended in 9s." },
  { id: "c_1033", caller: "Elena Duarte", number: "+1 (312) 555-0288", time: "Mon · 6:58 PM", durationSec: 47, intent: "faq_question", outcome: "failed", summary: "Heavy background noise — couldn't understand; message taken." },
];

/** Transcript with per-line start times (seconds), for the synced player. */
export interface TranscriptLine {
  role: "assistant" | "caller";
  text: string;
  t: number; // start time in seconds
}

export const CALL_DURATION_SEC = 142;

export const DEMO_TRANSCRIPT: TranscriptLine[] = [
  { role: "assistant", t: 0, text: "Thanks for calling BlueLine Plumbing — this call may be recorded to improve service. How can I help you today?" },
  { role: "caller", t: 8, text: "Hi, my kitchen sink is leaking pretty badly and I need someone to come out." },
  { role: "assistant", t: 15, text: "I'm sorry to hear that — I can help get you scheduled. Can I start with your name?" },
  { role: "caller", t: 22, text: "Maria Gonzalez." },
  { role: "assistant", t: 27, text: "Thanks, Maria. And the best callback number — is it the one you're calling from?" },
  { role: "caller", t: 35, text: "Yes, that's fine." },
  { role: "assistant", t: 39, text: "Great. For a leak repair, our earliest opening is tomorrow at 9:00 AM, or today at 4:30 PM. Which works better?" },
  { role: "caller", t: 52, text: "Tomorrow at 9 works." },
  { role: "assistant", t: 57, text: "Perfect — I've booked a leak repair for tomorrow at 9:00 AM, and you'll get a text confirming this shortly. Anything else I can help with?" },
  { role: "caller", t: 72, text: "No, that's it, thank you!" },
  { role: "assistant", t: 77, text: "You're welcome, Maria. Talk soon!" },
];

export interface Appt {
  id: string;
  customer: string;
  service: string;
  datetime: string;
  status: "booked" | "cancelled" | "rescheduled" | "completed";
}

export const APPOINTMENTS: Appt[] = [
  { id: "a_501", customer: "Maria Gonzalez", service: "Leak repair", datetime: "Tue · 9:00 AM", status: "booked" },
  { id: "a_502", customer: "Aisha Khan", service: "Water heater inspection", datetime: "Tue · 1:30 PM", status: "booked" },
  { id: "a_503", customer: "Priya Nair", service: "Drain cleaning", datetime: "Wed · 11:00 AM", status: "booked" },
  { id: "a_504", customer: "Nina Lombardi", service: "Faucet install", datetime: "Thu · 3:00 PM", status: "rescheduled" },
  { id: "a_505", customer: "Sam Okafor", service: "Pipe repair", datetime: "Fri · 10:00 AM", status: "completed" },
  { id: "a_506", customer: "Derek Voss", service: "Sump pump check", datetime: "Fri · 2:15 PM", status: "booked" },
];

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  note: string;
  time: string;
  status: LeadStatus;
}

// Messages captured when no booking happened (Spec §10 leads table).
export const LEADS: Lead[] = [
  { id: "l_201", name: "Marcus Lee", phone: "+1 (312) 555-0199", note: "Wants to know if you service Oak Park.", time: "Yesterday · 8:03 AM", status: "new" },
  { id: "l_202", name: "Unknown caller", phone: "+1 (312) 555-0991", note: "Asked about weekend emergency rates.", time: "Today · 1:03 PM", status: "new" },
  { id: "l_203", name: "Tom Whitfield", phone: "+1 (630) 555-0412", note: "Follow-up on last week's visit — wants a callback.", time: "Yesterday · 5:41 PM", status: "contacted" },
  { id: "l_204", name: "Elena Duarte", phone: "+1 (312) 555-0288", note: "Call dropped — left name and number for a callback.", time: "Mon · 6:58 PM", status: "new" },
];

// Admin panel — cross-tenant view with a real mix of industries (Spec §4.9)
export interface Tenant {
  id: string;
  name: string;
  industry: string;
  status: "active" | "trial" | "past_due";
  plan: string;
  monthlyPrice: number;
  operatingCost: number; // real cost this month
}

export const TENANTS: Tenant[] = [
  { id: "t_01", name: "BlueLine Plumbing", industry: "Plumbing", status: "active", plan: "Pro", monthlyPrice: 249, operatingCost: 82 },
  { id: "t_02", name: "Smile Dental Care", industry: "Dental", status: "active", plan: "Business", monthlyPrice: 399, operatingCost: 141 },
  { id: "t_03", name: "CoolAir HVAC", industry: "HVAC", status: "trial", plan: "Starter", monthlyPrice: 149, operatingCost: 47 },
  { id: "t_04", name: "Sharp & Co. Law", industry: "Legal", status: "past_due", plan: "Pro", monthlyPrice: 249, operatingCost: 118 },
  { id: "t_05", name: "Lush Hair Studio", industry: "Salon", status: "active", plan: "Starter", monthlyPrice: 149, operatingCost: 51 },
  { id: "t_06", name: "Peak Auto Repair", industry: "Auto repair", status: "active", plan: "Business", monthlyPrice: 399, operatingCost: 133 },
  { id: "t_07", name: "GreenScape Lawn Care", industry: "Landscaping", status: "trial", plan: "Starter", monthlyPrice: 149, operatingCost: 39 },
];

/**
 * Demo helper: pages read data through these so a `?state=empty` query can
 * force the empty state for a demo, without touching the underlying arrays.
 */
export function isEmptyState(searchParams?: { state?: string }): boolean {
  return searchParams?.state === "empty";
}
