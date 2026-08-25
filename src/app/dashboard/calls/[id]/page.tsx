import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RECENT_CALLS, DEMO_TRANSCRIPT } from "@/lib/mock-data";

/** Single call detail (Spec §4.5): recording, full transcript, outcome, notes. */
export default function CallDetailPage({ params }: { params: { id: string } }) {
  const call = RECENT_CALLS.find((c) => c.id === params.id) ?? RECENT_CALLS[0];

  return (
    <div>
      <Link href="/dashboard" className="text-sm font-semibold text-trust hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{call.caller}</h1>
          <p className="text-sm text-slate-400">
            {call.number} · {call.time}
          </p>
        </div>
        <Badge value={call.outcome} />
      </div>

      {/* Recording player (Spec §4.5) */}
      <div className="card mt-6">
        <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">Recording</h3>
        <div className="flex items-center gap-4 rounded-xl bg-canvas p-4">
          <button className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-trust text-white">
            ▶
          </button>
          <div className="h-1.5 flex-1 rounded-full bg-slate-200">
            <div className="h-full w-1/3 rounded-full bg-signal" />
          </div>
          <span className="text-xs text-slate-400">0:47 / 2:22</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Transcript (Spec §4.5) */}
        <div className="card lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900">Transcript</h3>
          <div className="space-y-3">
            {DEMO_TRANSCRIPT.map((t, i) => (
              <div key={i} className={`flex ${t.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    t.role === "assistant"
                      ? "rounded-tl-sm bg-trust/10 text-slate-700"
                      : "rounded-tr-sm bg-signal text-white"
                  }`}
                >
                  <p className="mb-0.5 text-[10px] font-semibold uppercase opacity-60">
                    {t.role === "assistant" ? "PulseDesk" : "Caller"}
                  </p>
                  {t.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meta + actions (Spec §4.5) */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Intent</dt>
                <dd className="font-medium text-slate-800">{call.intent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Outcome</dt>
                <dd><Badge value={call.outcome} /></dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <label className="label">Your note</label>
            <textarea className="input" rows={3} placeholder="Add a private note about this call…" />
            <div className="mt-3 flex flex-col gap-2">
              <button className="btn-ghost w-full">Mark for review</button>
              <button className="btn-ghost w-full !text-danger !border-danger/30">
                Report a bad response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
