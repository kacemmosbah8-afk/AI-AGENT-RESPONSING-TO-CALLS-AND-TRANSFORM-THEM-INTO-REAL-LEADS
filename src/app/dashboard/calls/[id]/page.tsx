import Link from "next/link";
import { OutcomeBanner } from "@/components/ui/Badge";
import { CallPlayer } from "@/components/CallPlayer";
import { RECENT_CALLS, DEMO_TRANSCRIPT, CALL_DURATION_SEC } from "@/lib/mock-data";

/** Single call detail (Spec §4.5): synced recording + transcript, outcome, notes. */
export default function CallDetailPage({ params }: { params: { id: string } }) {
  const call = RECENT_CALLS.find((c) => c.id === params.id) ?? RECENT_CALLS[0];

  return (
    <div>
      <Link href="/dashboard" className="text-sm font-semibold text-trust hover:underline">
        ← Back to calls
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{call.caller}</h1>
          <p className="text-sm text-slate-400">
            {call.number} · {call.time}
          </p>
        </div>
      </div>

      {/* Prominent, color-coded outcome (Spec §4.5) */}
      <div className="mt-5">
        <OutcomeBanner outcome={call.outcome} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recording + synced transcript (Spec §4.5) */}
        <div className="card lg:col-span-2">
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">
            Recording &amp; transcript
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Press play — the transcript follows along. Tap any line to jump there.
          </p>
          <CallPlayer transcript={DEMO_TRANSCRIPT} duration={CALL_DURATION_SEC} />
        </div>

        {/* Meta + actions (Spec §4.5) */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">Summary</h3>
            <p className="text-sm text-slate-600">{call.summary}</p>
            <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Detected intent</dt>
                <dd className="font-medium text-slate-800">{call.intent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Duration</dt>
                <dd className="font-medium text-slate-800">
                  {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <label className="label" htmlFor="note">Your note</label>
            <textarea id="note" className="input" rows={3} placeholder="Add a private note about this call…" />
            <div className="mt-3 flex flex-col gap-2">
              <button className="btn-ghost w-full">Flag for review</button>
              <button className="btn-ghost w-full !border-danger/30 !text-danger">
                Report a bad response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
