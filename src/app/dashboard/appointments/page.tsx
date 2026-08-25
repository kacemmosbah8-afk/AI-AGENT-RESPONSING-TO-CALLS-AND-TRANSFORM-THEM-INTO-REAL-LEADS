import { Badge } from "@/components/ui/Badge";
import { APPOINTMENTS } from "@/lib/mock-data";

/** Appointments (Spec §4.6): weekly view synced with Google Calendar. */
export default function AppointmentsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">Synced live with Google Calendar.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-signal/10 px-3 py-1.5 text-sm font-semibold text-signal">
          <span className="h-2 w-2 rounded-full bg-signal" /> Calendar connected
        </span>
      </div>

      <div className="card !p-0">
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
            {APPOINTMENTS.map((a) => (
              <tr key={a.id} className="hover:bg-canvas/60">
                <td className="px-6 py-4 font-medium text-slate-800">{a.customer}</td>
                <td className="px-6 py-4 text-slate-600">{a.service}</td>
                <td className="px-6 py-4 text-slate-600">{a.datetime}</td>
                <td className="px-6 py-4"><Badge value={a.status} /></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-semibold text-slate-500 hover:text-trust">Reschedule</button>
                  <button className="ml-4 text-xs font-semibold text-slate-500 hover:text-danger">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
