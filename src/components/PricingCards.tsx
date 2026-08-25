import { PLANS, HUMAN_RECEPTIONIST_MONTHLY } from "@/lib/design";

/** Three-tier pricing with human-receptionist comparison (Spec §4.1 / §13.3). */
export function PricingCards() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`card flex flex-col ${
              "popular" in plan && plan.popular
                ? "ring-2 ring-signal shadow-lift"
                : ""
            }`}
          >
            {"popular" in plan && plan.popular && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold text-signal">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-slate-900">
              {plan.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-slate-900">
                ${plan.price}
              </span>
              <span className="text-sm text-slate-400">/mo</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {plan.minutes.toLocaleString()} answered minutes
            </p>
            <ul className="mt-5 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-none text-success"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className={`mt-6 ${
                "popular" in plan && plan.popular ? "btn-signal" : "btn-ghost"
              }`}
            >
              Start free trial
            </a>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        A human receptionist costs about{" "}
        <span className="font-semibold text-slate-700">
          ${HUMAN_RECEPTIONIST_MONTHLY.toLocaleString()}/mo
        </span>{" "}
        — and can't answer at 2 AM.
      </p>
    </div>
  );
}
