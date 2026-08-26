/** Dependency-free weekly bar chart (Spec §4.4). */
export function CallsChart({ data }: { data: { day: string; calls: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.calls));
  const total = data.reduce((s, d) => s + d.calls, 0);

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

      <div className="flex h-44 items-end gap-2 sm:gap-3">
        {data.map((d) => {
          const pct = Math.round((d.calls / max) * 100);
          return (
            <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[11px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">
                {d.calls}
              </span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-trust to-signal/80 transition-all duration-300 group-hover:from-trust group-hover:to-signal"
                style={{ height: `${d.calls === 0 ? 2 : Math.max(pct, 6)}%` }}
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
