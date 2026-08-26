import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, PhoneWaveIcon } from "@/components/ui/EmptyState";
import type { CallRow } from "@/lib/mock-data";

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

/** Recent calls, responsive: table on desktop, cards on mobile (Spec §5). */
export function CallsList({ calls }: { calls: CallRow[] }) {
  if (calls.length === 0) {
    return (
      <EmptyState
        icon={PhoneWaveIcon}
        title="No calls yet"
        message="Once your line is live, every call PulseDesk answers shows up here in real time — with a recording, transcript, and outcome."
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
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
            {calls.map((c) => (
              <tr key={c.id} className="hover:bg-canvas/60">
                <td className="px-6 py-3">
                  <p className="font-medium text-slate-800">{c.caller}</p>
                  <p className="text-xs text-slate-400">{c.number}</p>
                </td>
                <td className="px-6 py-3 text-slate-500">{c.time}</td>
                <td className="px-6 py-3 tabular-nums text-slate-500">{fmtDuration(c.durationSec)}</td>
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

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 sm:hidden">
        {calls.map((c) => (
          <li key={c.id}>
            <Link href={`/dashboard/calls/${c.id}`} className="flex items-center justify-between gap-3 px-4 py-3 active:bg-canvas">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{c.caller}</p>
                <p className="truncate text-xs text-slate-400">{c.time} · {fmtDuration(c.durationSec)}</p>
                <div className="mt-1.5"><Badge value={c.outcome} /></div>
              </div>
              <svg className="h-5 w-5 flex-none text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
