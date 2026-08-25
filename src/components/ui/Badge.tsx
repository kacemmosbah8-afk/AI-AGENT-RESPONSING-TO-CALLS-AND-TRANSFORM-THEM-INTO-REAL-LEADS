import type { CallOutcome } from "@/lib/mock-data";

/**
 * Outcome / status badge with FIXED semantic colors (Spec §3.4):
 * green = success, amber = alert, red = error only.
 */
const OUTCOME_STYLES: Record<string, { label: string; cls: string }> = {
  appointment_booked: { label: "Appointment booked", cls: "bg-success/10 text-success" },
  message_taken: { label: "Message taken", cls: "bg-signal/10 text-signal" },
  emergency_escalated: { label: "Emergency escalated", cls: "bg-alert/15 text-[#B26A00]" },
  spam: { label: "Spam", cls: "bg-slate-100 text-slate-500" },
  failed: { label: "Failed", cls: "bg-danger/10 text-danger" },
  active: { label: "Active", cls: "bg-success/10 text-success" },
  trial: { label: "Trial", cls: "bg-signal/10 text-signal" },
  past_due: { label: "Past due", cls: "bg-danger/10 text-danger" },
  booked: { label: "Booked", cls: "bg-success/10 text-success" },
  rescheduled: { label: "Rescheduled", cls: "bg-alert/15 text-[#B26A00]" },
  cancelled: { label: "Cancelled", cls: "bg-danger/10 text-danger" },
  completed: { label: "Completed", cls: "bg-slate-100 text-slate-600" },
};

export function Badge({ value }: { value: CallOutcome | string }) {
  const s = OUTCOME_STYLES[value] ?? { label: value, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
