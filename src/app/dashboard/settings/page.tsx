/** Settings (Spec §4.7): edit business info, pricing, FAQ, voice/tone, alerts. */
export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-sm text-slate-500">Change anything without redoing onboarding.</p>

      <div className="mt-6 space-y-6">
        <section className="card">
          <h2 className="font-display text-lg font-semibold text-slate-900">Business info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Business name</label>
              <input className="input" defaultValue="BlueLine Plumbing" />
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" defaultValue="Plumbing" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Business hours</label>
              <input className="input" defaultValue="Mon–Fri 8:00 AM – 6:00 PM" />
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-semibold text-slate-900">Voice &amp; tone</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Assistant voice</label>
              <select className="input">
                <option>Aria (Female · warm)</option>
                <option>Noah (Male · professional)</option>
                <option>Mia (Female · upbeat)</option>
                <option>Leo (Male · calm)</option>
              </select>
            </div>
            <div>
              <label className="label">Tone</label>
              <select className="input">
                <option>Friendly</option>
                <option>Formal</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-semibold text-slate-900">Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">How should we notify you (Spec §4.7)?</p>
          <div className="mt-4 space-y-3">
            {[
              ["Instant SMS on every booking", true],
              ["Instant SMS + call on emergencies", true],
              ["Daily email summary", false],
              ["Weekly ROI report", true],
            ].map(([label, on]) => (
              <label key={label as string} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-700">{label}</span>
                <span
                  className={`relative h-6 w-11 rounded-full transition ${
                    on ? "bg-success" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      on ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button className="btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}
