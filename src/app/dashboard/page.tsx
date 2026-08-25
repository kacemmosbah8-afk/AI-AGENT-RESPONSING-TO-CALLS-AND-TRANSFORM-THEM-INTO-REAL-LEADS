import Link from "next/link";
import { KpiCard } from "@/components/ui/KpiCard";
import { CallsChart } from "@/components/CallsChart";
import { Badge } from "@/components/ui/Badge";
import { KPIS, RECENT_CALLS, DEMO_BUSINESS } from "@/lib/mock-data";

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function DashboardHome() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Good afternoon, {DEMO_BUSINESS.name}
          </h1>
          <p className="text-sm text-slate-500">Here's what PulseDesk handled this month.</p>
        </div>
        <span className="hidden items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-success" /> Line is live
        </span>
      </div>

      {/* KPI cards (Spec §4.4) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Calls this month" value={KPIS.callsThisMonth.toString()} accent="trust" />
        <KpiCard
          label="Calls rescued"
          value={KPIS.callsRescued.toString()}
          sub="would have been missed"
          accent="alert"
        />
        <KpiCard
          label="Appointments booked"
          value={KPIS.appointmentsBooked.toString()}
          accent="success"
        />
        <KpiCard
          label="Recovered revenue"
          value={`$${KPIS.recoveredRevenue.toLocaleString()}`}
          sub={`avg deal × booked appts`}
          accent="signal"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CallsChart />
        </div>
        <div className="card">
          <h3 className="font-display text-lg font-semibold text-slate-900">This month</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="Answer rate" v="100%" />
            <Row k="Avg. call length" v="2m 18s" />
            <Row k="Emergencies escalated" v="3" />
            <Row k="Spam blocked" v="11" />
          </dl>
        </div>
      </div>

      {/* Recent calls (Spec §4.4) */}
      <div className="card mt-6 !p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-slate-900">Recent calls</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Caller</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Length</th>
                <th className="px-6 py-3 font-medium">Outcome</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {RECENT_CALLS.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-800">{c.caller}</p>
                    <p className="text-xs text-slate-400">{c.number}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{c.time}</td>
                  <td className="px-6 py-3 text-slate-500">{fmtDuration(c.durationSec)}</td>
                  <td className="px-6 py-3"><Badge value={c.outcome} /></td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/dashboard/calls/${c.id}`} className="font-semibold text-trust hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-semibold text-slate-800">{v}</dd>
    </div>
  );
}
