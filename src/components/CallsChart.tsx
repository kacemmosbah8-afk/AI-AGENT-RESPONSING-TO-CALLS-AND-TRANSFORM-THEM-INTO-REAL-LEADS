import { WEEKLY_CALLS } from "@/lib/mock-data";

/** Dependency-free weekly bar chart (Spec §4.4). */
export function CallsChart() {
  const max = Math.max(...WEEKLY_CALLS.map((d) => d.calls));
  const total = WEEKLY_CALLS.reduce((s, d) => s + d.calls, 0);

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">
            Weekly call volume
          </h3>
          <p className="text-xs text-slate-400">{total} calls answered this week</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          Last 7 days
        </span>
      </div>

      {/* Fixed-height row so each column can fill it and bar %s resolve. */}
      <div className="flex h-44 items-end gap-2 sm:gap-3">
        {WEEKLY_CALLS.map((d) => {
          const pct = Math.round((d.calls / max) * 100);
          return (
            <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[11px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">
                {d.calls}
              </span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-trust to-signal/80 transition-all duration-300 group-hover:from-trust group-hover:to-signal"
                style={{ height: `${Math.max(pct, 6)}%` }}
                title={`${d.calls} calls`}
              />
              <span className="text-xs font-medium text-slate-400">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
