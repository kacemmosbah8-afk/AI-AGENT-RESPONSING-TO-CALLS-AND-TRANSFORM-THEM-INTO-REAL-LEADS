import { KpiCard } from "@/components/ui/KpiCard";
import { CallsChart } from "@/components/CallsChart";
import { CallsList } from "@/components/CallsList";
import { Reveal } from "@/components/ui/Reveal";
import { TableSkeleton, KpiSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { isEmptyState } from "@/lib/mock-data";
import { getDashboardData } from "@/lib/data";

export default async function DashboardHome({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const data = await getDashboardData();
  // The ?state=empty demo toggle only applies in demo mode.
  const calls = data.isDemo && isEmptyState(searchParams) ? [] : data.calls;
  const k = data.kpis;
  const avgDeal = k.appointmentsBooked > 0 ? Math.round(k.recoveredRevenue / k.appointmentsBooked) : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Welcome back, {data.businessName}
          </h1>
          <p className="text-sm text-slate-500">Here's everything PulseDesk handled for you this month.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
          <span className="h-2 w-2 rounded-full bg-success" /> Your line is live
        </span>
      </div>

      <Reveal
        skeleton={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Calls this month" value={k.callsThisMonth} delta={k.deltas?.callsThisMonth} accent="trust" />
          <KpiCard label="Calls rescued" value={k.callsRescued} delta={k.deltas?.callsRescued} sub="would've been missed" accent="alert" />
          <KpiCard label="Appointments booked" value={k.appointmentsBooked} delta={k.deltas?.appointmentsBooked} accent="success" />
          <KpiCard
            label="Recovered revenue"
            value={k.recoveredRevenue}
            prefix="$"
            delta={k.deltas?.recoveredRevenue}
            accent="signal"
            info={`Estimated as your average deal value${avgDeal ? ` ($${avgDeal.toLocaleString()})` : ""} × appointments booked (${k.appointmentsBooked}). Adjust your average deal value in Settings.`}
          />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal
            skeleton={
              <div className="card">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-6 h-40 w-full" />
              </div>
            }
          >
            <CallsChart data={data.weekly} />
          </Reveal>
        </div>
        <Reveal
          skeleton={
            <div className="card space-y-4">
              <Skeleton className="h-5 w-28" />
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          }
        >
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-slate-900">This month at a glance</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Answer rate" v={data.calls.length ? "100%" : "—"} good={data.calls.length > 0} />
              <Row k="Appointments booked" v={String(k.appointmentsBooked)} />
              <Row k="Calls this month" v={String(k.callsThisMonth)} />
              <Row k="Spam blocked" v={String(Math.max(0, k.callsThisMonth - k.callsRescued))} />
            </dl>
          </div>
        </Reveal>
      </div>

      <div className="card mt-6 !p-0">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <h3 className="font-display text-lg font-semibold text-slate-900">Recent calls</h3>
        </div>
        <Reveal skeleton={<TableSkeleton rows={5} cols={4} />}>
          <CallsList calls={calls} />
        </Reveal>
      </div>
    </div>
  );
}

function Row({ k, v, good }: { k: string; v: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{k}</dt>
      <dd className={`font-semibold ${good ? "text-success" : "text-slate-800"}`}>{v}</dd>
    </div>
  );
}
