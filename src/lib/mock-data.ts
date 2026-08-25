/**
 * Demo data so the dashboard renders without a live backend.
 * In production these come from Supabase (see supabase/schema.sql).
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
  recoveredRevenue: 34 * 3500, // appts × avg deal value (Spec §4.4)
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
}

export const RECENT_CALLS: CallRow[] = [
  { id: "c_1042", caller: "Maria G.", number: "+1 (312) 555-0148", time: "Today 2:14 PM", durationSec: 142, intent: "book_appointment", outcome: "appointment_booked" },
  { id: "c_1041", caller: "Unknown", number: "+1 (312) 555-0991", time: "Today 1:03 PM", durationSec: 58, intent: "faq_question", outcome: "message_taken" },
  { id: "c_1040", caller: "David R.", number: "+1 (708) 555-0217", time: "Today 11:47 AM", durationSec: 205, intent: "emergency", outcome: "emergency_escalated" },
  { id: "c_1039", caller: "Telemarketer", number: "+1 (800) 555-3300", time: "Today 10:22 AM", durationSec: 12, intent: "spam", outcome: "spam" },
  { id: "c_1038", caller: "Aisha K.", number: "+1 (312) 555-0765", time: "Today 9:15 AM", durationSec: 176, intent: "book_appointment", outcome: "appointment_booked" },
  { id: "c_1037", caller: "Tom W.", number: "+1 (630) 555-0412", time: "Yesterday 5:41 PM", durationSec: 95, intent: "complaint", outcome: "message_taken" },
];

export const DEMO_TRANSCRIPT: { role: "assistant" | "caller"; text: string }[] = [
  { role: "assistant", text: "Thanks for calling BlueLine Plumbing — this call may be recorded to improve service. How can I help you today?" },
  { role: "caller", text: "Hi, my kitchen sink is leaking pretty badly and I need someone to come out." },
  { role: "assistant", text: "I'm sorry to hear that — I can help get you scheduled. Can I start with your name?" },
  { role: "caller", text: "Maria Gonzalez." },
  { role: "assistant", text: "Thanks Maria. And the best callback number — is it the one you're calling from?" },
  { role: "caller", text: "Yes that's fine." },
  { role: "assistant", text: "Great. For a leak repair, our earliest opening is tomorrow at 9:00 AM, or today at 4:30 PM. Which works better?" },
  { role: "caller", text: "Tomorrow at 9 works." },
  { role: "assistant", text: "Perfect — I've booked a leak repair for tomorrow at 9:00 AM and you'll get a text confirmation shortly. Anything else I can help with?" },
  { role: "caller", text: "No that's it, thank you!" },
  { role: "assistant", text: "You're welcome, Maria. Talk soon!" },
];

export interface Appt {
  id: string;
  customer: string;
  service: string;
  datetime: string;
  status: "booked" | "cancelled" | "rescheduled" | "completed";
}

export const APPOINTMENTS: Appt[] = [
  { id: "a_501", customer: "Maria Gonzalez", service: "Leak repair", datetime: "Tue 9:00 AM", status: "booked" },
  { id: "a_502", customer: "Aisha Khan", service: "Water heater inspection", datetime: "Tue 1:30 PM", status: "booked" },
  { id: "a_503", customer: "Greg P.", service: "Drain cleaning", datetime: "Wed 11:00 AM", status: "booked" },
  { id: "a_504", customer: "Nina L.", service: "Faucet install", datetime: "Thu 3:00 PM", status: "rescheduled" },
  { id: "a_505", customer: "Sam O.", service: "Pipe repair", datetime: "Fri 10:00 AM", status: "completed" },
];

// Admin panel — cross-tenant view (Spec §4.9)
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
];
