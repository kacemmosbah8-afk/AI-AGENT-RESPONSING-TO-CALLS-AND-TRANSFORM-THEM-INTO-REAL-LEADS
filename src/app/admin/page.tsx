import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { TENANTS } from "@/lib/mock-data";

/**
 * Internal Admin Panel (Spec §4.9) — owner-only.
 * Lists every tenant, real operating margin, and calls needing review.
 */
export default function AdminPage() {
  const mrr = TENANTS.filter((t) => t.status !== "trial").reduce((s, t) => s + t.monthlyPrice, 0);
  const cost = TENANTS.reduce((s, t) => s + t.operatingCost, 0);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Admin panel</h1>
            <p className="text-sm text-slate-500">Cross-tenant operations — visible only to you.</p>
          </div>
          <Link href="/dashboard" className="btn-ghost">← Back to dashboard</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Active MRR" value={`$${mrr.toLocaleString()}`} />
          <Stat label="Monthly operating cost" value={`$${cost.toLocaleString()}`} />
          <Stat label="Gross margin" value={`$${(mrr - cost).toLocaleString()}`} accent />
        </div>

        {/* Tenants (Spec §4.9) */}
        <div className="card mt-6 !p-0">
          <div className="px-6 py-4">
            <h3 className="font-display text-lg font-semibold text-slate-900">Tenants</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Business</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Revenue</th>
                  <th className="px-6 py-3 font-medium">Cost</th>
                  <th className="px-6 py-3 font-medium">Real margin</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TENANTS.map((t) => {
                  const margin = t.monthlyPrice - t.operatingCost;
                  const thin = margin < 80; // flag thin margins
                  return (
                    <tr key={t.id} className="hover:bg-canvas/60">
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-800">{t.name}</p>
                        <p className="text-xs text-slate-400">{t.industry}</p>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{t.plan}</td>
                      <td className="px-6 py-3"><Badge value={t.status} /></td>
                      <td className="px-6 py-3 text-slate-600">${t.monthlyPrice}</td>
                      <td className="px-6 py-3 text-slate-600">${t.operatingCost}</td>
                      <td className={`px-6 py-3 font-semibold ${thin ? "text-alert" : "text-success"}`}>
                        ${margin}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {t.status === "past_due" ? (
                          <button className="text-xs font-semibold text-danger">Suspend</button>
                        ) : (
                          <button className="text-xs font-semibold text-slate-500 hover:text-trust">Pause</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calls needing review (Spec §4.9) */}
        <div className="card mt-6">
          <h3 className="font-display text-lg font-semibold text-slate-900">Calls needing review</h3>
          <p className="mt-1 text-sm text-slate-500">
            Aggregated across all tenants where the AI failed to understand more than once.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <span className="text-slate-700">CoolAir HVAC · caller asked about “ductless mini-split” pricing</span>
              <span className="rounded-full bg-alert/15 px-2.5 py-1 text-xs font-medium text-[#B26A00]">2 failures</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <span className="text-slate-700">Sharp &amp; Co. Law · caller accent / heavy background noise</span>
              <span className="rounded-full bg-alert/15 px-2.5 py-1 text-xs font-medium text-[#B26A00]">3 failures</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${accent ? "text-success" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}
