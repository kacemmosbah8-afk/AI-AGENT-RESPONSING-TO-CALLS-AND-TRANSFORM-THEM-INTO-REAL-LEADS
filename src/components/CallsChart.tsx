import { WEEKLY_CALLS } from "@/lib/mock-data";

/** Simple dependency-free weekly bar chart (Spec §4.4). */
export function CallsChart() {
  const max = Math.max(...WEEKLY_CALLS.map((d) => d.calls));
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Weekly call volume
        </h3>
        <span className="text-xs text-slate-400">Last 7 days</span>
      </div>
      <div className="flex h-44 items-end gap-3">
        {WEEKLY_CALLS.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-trust/85 transition-all hover:bg-trust"
                style={{ height: `${(d.calls / max) * 100}%` }}
                title={`${d.calls} calls`}
              />
            </div>
            <span className="text-xs font-medium text-slate-400">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
