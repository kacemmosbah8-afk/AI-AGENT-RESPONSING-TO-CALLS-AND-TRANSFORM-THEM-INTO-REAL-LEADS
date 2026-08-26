import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, InboxIcon } from "@/components/ui/EmptyState";
import { LEADS, isEmptyState } from "@/lib/mock-data";

/** Messages / leads (Spec §10): captured requests that weren't booked. */
export default function LeadsPage({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const leads = isEmptyState(searchParams) ? [] : LEADS;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500">
          Callers who didn't book but left their details — ready for you to follow up.
        </p>
      </div>

      <div className="card !p-0">
        <Reveal skeleton={<TableSkeleton rows={4} cols={3} />}>
          {leads.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="No messages waiting"
              message="When a caller asks something PulseDesk can't book — a question, a callback request — their name and number land here so no lead slips away."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {leads.map((l) => (
                <li key={l.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{l.name}</p>
                      <Badge value={l.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{l.note}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{l.phone} · {l.time}</p>
                  </div>
                  <div className="flex flex-none gap-2">
                    <a href={`tel:${l.phone.replace(/[^+\d]/g, "")}`} className="btn-ghost !px-3 !py-2 text-sm">Call back</a>
                    <button className="btn-primary !px-3 !py-2 text-sm">Mark done</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </div>
  );
}
