import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, CalendarIcon } from "@/components/ui/EmptyState";
import { isEmptyState } from "@/lib/mock-data";
import { getAppointments } from "@/lib/data";

/** Appointments (Spec §4.6): synced with Google Calendar; responsive. */
export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const { appts: all, isDemo } = await getAppointments();
  const appts = isDemo && isEmptyState(searchParams) ? [] : all;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">Every booking your AI made, synced with Google Calendar.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-signal/10 px-3 py-1.5 text-sm font-semibold text-signal">
          <span className="h-2 w-2 rounded-full bg-signal" /> Calendar connected
        </span>
      </div>

      <div className="card !p-0">
        <Reveal skeleton={<TableSkeleton rows={5} cols={4} />}>
          {appts.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No appointments booked yet"
              message="When PulseDesk books a caller straight into your calendar, it'll appear here — and you can reschedule or cancel with a tap."
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Customer</th>
                      <th className="px-6 py-3 font-medium">Service</th>
                      <th className="px-6 py-3 font-medium">When</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {appts.map((a) => (
                      <tr key={a.id} className="hover:bg-canvas/60">
                        <td className="px-6 py-4 font-medium text-slate-800">{a.customer}</td>
                        <td className="px-6 py-4 text-slate-600">{a.service}</td>
                        <td className="px-6 py-4 text-slate-600">{a.datetime}</td>
                        <td className="px-6 py-4"><Badge value={a.status} /></td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button className="text-xs font-semibold text-slate-500 hover:text-trust">Reschedule</button>
                          <button className="ml-4 text-xs font-semibold text-slate-500 hover:text-danger">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="divide-y divide-slate-100 sm:hidden">
                {appts.map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{a.customer}</p>
                        <p className="truncate text-sm text-slate-500">{a.service}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{a.datetime}</p>
                      </div>
                      <Badge value={a.status} />
                    </div>
                    <div className="mt-2 flex gap-4">
                      <button className="text-xs font-semibold text-slate-500">Reschedule</button>
                      <button className="text-xs font-semibold text-slate-500">Cancel</button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </div>
    </div>
  );
}
