export function KpiCard({
  label,
  value,
  sub,
  accent = "trust",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "trust" | "signal" | "success" | "alert";
}) {
  const ring: Record<string, string> = {
    trust: "before:bg-trust",
    signal: "before:bg-signal",
    success: "before:bg-success",
    alert: "before:bg-alert",
  };
  return (
    <div
      className={`card relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${ring[accent]}`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
