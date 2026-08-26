import { getBilling } from "@/lib/data";

const PLAN_LABEL: Record<string, string> = { starter: "Starter", pro: "Pro", business: "Business" };

/** Billing (Spec §4.8): current plan, usage, invoices, upgrade/downgrade. */
export default async function BillingPage() {
  const { plan, price, minutesUsed, minutesIncluded, status } = await getBilling();
  const pct = minutesIncluded > 0 ? Math.round((minutesUsed / minutesIncluded) * 100) : 0;
  const nearLimit = pct >= 80; // in-app alert at ≥80% (Spec §4.8)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Billing</h1>
      <p className="text-sm text-slate-500">Manage your plan and usage.</p>

      {status === "trialing" && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-signal/10 px-4 py-3 text-sm font-medium text-signal">
          <span className="h-2 w-2 rounded-full bg-signal" />
          You're on a free trial. Add a payment method before it ends to keep your line live.
        </div>
      )}

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
                {PLAN_LABEL[plan] ?? plan} · ${price}/mo
              </p>
            </div>
            <button className="btn-primary">Upgrade plan</button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Minutes used</span>
              <span className="font-semibold text-slate-800">
                {minutesUsed} / {minutesIncluded}
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
          <p className="mt-4 text-sm text-slate-500">
            No card on file yet. Billing is wired up in a later step.
          </p>
          <button className="btn-ghost mt-3 w-full cursor-not-allowed opacity-60" disabled>
            Add payment method
          </button>
        </div>
      </div>
    </div>
  );
}
