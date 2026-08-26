import { CountUp } from "./CountUp";
import { InfoDot } from "./Tooltip";

/**
 * KPI card with animated count-up, a semantic accent bar, an optional
 * week-over-week trend chip (good = green/up), and an optional info tooltip.
 */
export function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  sub,
  delta,
  accent = "trust",
  info,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sub?: string;
  delta?: number; // week-over-week %, positive = good
  accent?: "trust" | "signal" | "success" | "alert";
  info?: string;
}) {
  const ring: Record<string, string> = {
    trust: "before:bg-trust",
    signal: "before:bg-signal",
    success: "before:bg-success",
    alert: "before:bg-alert",
  };
  return (
    <div className={`card relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${ring[accent]}`}>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {info && <InfoDot label={info} />}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </p>
      <div className="mt-1 flex items-center gap-2">
        {typeof delta === "number" && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              delta > 0 ? "bg-success/10 text-success" : "bg-slate-100 text-slate-500"
            }`}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {delta > 0 ? <path d="M6 15l6-6 6 6" /> : <path d="M5 12h14" />}
            </svg>
            {delta > 0 ? `+${delta}%` : "—"}
          </span>
        )}
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}
