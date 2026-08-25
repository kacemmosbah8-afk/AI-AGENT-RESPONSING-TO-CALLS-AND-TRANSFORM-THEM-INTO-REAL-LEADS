import { PLANS } from "@/lib/design";
import { DEMO_BUSINESS } from "@/lib/mock-data";

/** Billing (Spec §4.8): current plan, usage, invoices, upgrade/downgrade. */
export default function BillingPage() {
  const plan = PLANS.find((p) => p.id === DEMO_BUSINESS.plan)!;
  const pct = Math.round((DEMO_BUSINESS.minutesUsed / DEMO_BUSINESS.minutesIncluded) * 100);
  const nearLimit = pct >= 80; // in-app alert at ≥80% (Spec §4.8)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Billing</h1>
      <p className="text-sm text-slate-500">Manage your plan and usage.</p>

      {nearLimit && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-alert/15 px-4 py-3 text-sm font-medium text-[#B26A00]">
          <span className="h-2 w-2 rounded-full bg-alert" />
          You've used {pct}% of your monthly minutes. Consider upgrading to avoid overage.
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Current plan</p>
              <p className="font-display text-2xl font-bold text-slate-900">
                {plan.name} · ${plan.price}/mo
              </p>
            </div>
            <button className="btn-primary">Upgrade plan</button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Minutes used</span>
              <span className="font-semibold text-slate-800">
                {DEMO_BUSINESS.minutesUsed} / {DEMO_BUSINESS.minutesIncluded}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${nearLimit ? "bg-alert" : "bg-signal"}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display text-lg font-semibold text-slate-900">Payment method</h3>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">VISA</span>
            <span className="text-sm text-slate-600">•••• 4242</span>
          </div>
          <button className="mt-3 text-sm font-semibold text-trust">Update card</button>
        </div>
      </div>

      <div className="card mt-6 !p-0">
        <div className="px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-slate-900">Invoice history</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-y border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Plan</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {["Aug 1, 2026", "Jul 1, 2026", "Jun 1, 2026"].map((d) => (
              <tr key={d}>
                <td className="px-6 py-3 text-slate-600">{d}</td>
                <td className="px-6 py-3 text-slate-600">Pro</td>
                <td className="px-6 py-3 text-slate-600">$249.00</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">Paid</span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="text-xs font-semibold text-trust">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
