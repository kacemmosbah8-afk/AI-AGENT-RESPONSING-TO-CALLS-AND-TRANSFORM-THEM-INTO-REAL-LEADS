import type { CallOutcome } from "@/lib/mock-data";

/**
 * Outcome / status badge with FIXED semantic colors (Spec §3.4):
 * green = success, amber = alert, blue = neutral/info, red = error only.
 */
const OUTCOME_STYLES: Record<string, { label: string; cls: string }> = {
  appointment_booked: { label: "Appointment booked", cls: "bg-success/10 text-success" },
  message_taken: { label: "Message taken", cls: "bg-signal/10 text-signal" },
  emergency_escalated: { label: "Emergency escalated", cls: "bg-alert/15 text-[#B26A00]" },
  spam: { label: "Spam", cls: "bg-slate-100 text-slate-500" },
  failed: { label: "Needs review", cls: "bg-danger/10 text-danger" },
  active: { label: "Active", cls: "bg-success/10 text-success" },
  trial: { label: "Trial", cls: "bg-signal/10 text-signal" },
  past_due: { label: "Past due", cls: "bg-danger/10 text-danger" },
  booked: { label: "Booked", cls: "bg-success/10 text-success" },
  rescheduled: { label: "Rescheduled", cls: "bg-alert/15 text-[#B26A00]" },
  cancelled: { label: "Cancelled", cls: "bg-danger/10 text-danger" },
  completed: { label: "Completed", cls: "bg-slate-100 text-slate-600" },
  new: { label: "New", cls: "bg-signal/10 text-signal" },
  contacted: { label: "Contacted", cls: "bg-slate-100 text-slate-600" },
  converted: { label: "Converted", cls: "bg-success/10 text-success" },
  closed: { label: "Closed", cls: "bg-slate-100 text-slate-500" },
};

export function Badge({ value }: { value: CallOutcome | string }) {
  const s = OUTCOME_STYLES[value] ?? { label: value, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* Prominent, color-coded banner for the call detail "wow" screen (Spec §4). */
const BANNER: Record<string, { label: string; sub: string; ring: string; chip: string; icon: string }> = {
  appointment_booked: {
    label: "Appointment booked",
    sub: "This call turned into a confirmed job on the calendar.",
    ring: "border-success/30 bg-success/5",
    chip: "bg-success text-white",
    icon: "M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z",
  },
  message_taken: {
    label: "Message taken",
    sub: "The caller's details were captured for a callback.",
    ring: "border-signal/30 bg-signal/5",
    chip: "bg-signal text-white",
    icon: "M4 5h16v11H8l-4 3V5z",
  },
  emergency_escalated: {
    label: "Emergency escalated",
    sub: "You were alerted immediately by SMS and call.",
    ring: "border-alert/40 bg-alert/10",
    chip: "bg-alert text-white",
    icon: "M12 3l9 16H3L12 3zm0 6v5m0 3h.01",
  },
  spam: {
    label: "Spam / wrong number",
    sub: "Ended politely — no time wasted, nothing to action.",
    ring: "border-slate-200 bg-slate-50",
    chip: "bg-slate-400 text-white",
    icon: "M6 6l12 12M18 6L6 18",
  },
  failed: {
    label: "Needs review",
    sub: "The AI struggled here — worth a listen to tune responses.",
    ring: "border-danger/30 bg-danger/5",
    chip: "bg-danger text-white",
    icon: "M12 3l9 16H3L12 3zm0 6v5m0 3h.01",
  },
};

export function OutcomeBanner({ outcome }: { outcome: CallOutcome | string }) {
  const b = BANNER[outcome] ?? BANNER.message_taken;
  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 ${b.ring}`}>
      <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${b.chip}`}>
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={b.icon} />
        </svg>
      </span>
      <div>
        <p className="font-display text-lg font-bold text-slate-900">{b.label}</p>
        <p className="text-sm text-slate-500">{b.sub}</p>
      </div>
    </div>
  );
}
