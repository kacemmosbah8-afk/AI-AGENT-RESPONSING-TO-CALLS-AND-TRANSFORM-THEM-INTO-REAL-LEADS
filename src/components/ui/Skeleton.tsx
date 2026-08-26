/** Shimmering skeleton primitives (Spec: loading states, not spinners). */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/70 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton rows for a data table while it "loads". */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="px-6 py-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-slate-50 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 ${c === 0 ? "w-40" : c === cols - 1 ? "ml-auto w-16" : "w-24"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Skeleton block for a KPI card. */
export function KpiSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  );
}
