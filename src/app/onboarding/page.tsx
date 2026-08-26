"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

const STEPS = [
  "Business info",
  "Services & pricing",
  "FAQ",
  "Connect calendar",
  "Call reception",
  "Voice & go live",
] as const;

const INDUSTRIES = ["Plumbing", "Dental", "HVAC", "Legal", "Salon", "Auto repair", "Other"];

const VOICES = [
  { id: "aria", name: "Aria", tag: "Female · warm", freq: 392 },
  { id: "noah", name: "Noah", tag: "Male · professional", freq: 262 },
  { id: "mia", name: "Mia", tag: "Female · upbeat", freq: 440 },
  { id: "leo", name: "Leo", tag: "Male · calm", freq: 294 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState("aria");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [reception, setReception] = useState<"forward" | "new">("forward");
  const [saved, setSaved] = useState(false);

  // Step-1 fields + inline validation
  const [biz, setBiz] = useState({ name: "", industry: "Plumbing", city: "", hours: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errors = {
    name: !biz.name.trim() ? "Enter your business name — it's how the AI greets callers." : "",
    city: !biz.city.trim() ? "Add your city so the AI knows your service area." : "",
  };

  const last = step === STEPS.length - 1;

  const next = () => {
    if (step === 0) {
      setTouched({ name: true, city: true });
      if (errors.name || errors.city) return;
    }
    if (last) router.push("/dashboard");
    else setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const saveForLater = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <span className="rounded-full bg-canvas px-3 py-1 text-sm font-medium text-slate-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-signal" : "bg-slate-200"}`} />
              <p className={`mt-2 hidden text-xs sm:block ${i === step ? "font-semibold text-slate-700" : "text-slate-400"}`}>
                {s}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-slate-500 sm:hidden">{STEPS[step]}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="card">
          <h1 className="font-display text-2xl font-bold text-slate-900">{STEPS[step]}</h1>

          <div className="mt-6">
            {step === 0 && <BusinessInfo biz={biz} setBiz={setBiz} errors={errors} touched={touched} setTouched={setTouched} />}
            {step === 1 && <Pricing />}
            {step === 2 && <Faq />}
            {step === 3 && <Calendar connected={calendarConnected} onConnect={() => setCalendarConnected(true)} />}
            {step === 4 && <Reception value={reception} onChange={setReception} />}
            {step === 5 && <VoicePicker value={voice} onChange={setVoice} />}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button onClick={back} disabled={step === 0} className="btn-ghost disabled:opacity-40">
              Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={saveForLater} className="hidden text-sm font-semibold text-slate-500 hover:text-trust sm:inline">
                Save &amp; continue later
              </button>
              <button onClick={next} className={last ? "btn-signal" : "btn-primary"}>
                {last ? "🚀 Go live" : "Continue"}
              </button>
            </div>
          </div>
          <button onClick={saveForLater} className="mt-3 w-full text-center text-sm font-semibold text-slate-500 sm:hidden">
            Save &amp; continue later
          </button>
        </div>

        {saved && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
            ✓ Progress saved — we emailed you a link to pick up right here.
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, error, touched, children }: { label: string; error?: string; touched?: boolean; children: React.ReactNode }) {
  const show = touched && error;
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {show && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

function BusinessInfo({ biz, setBiz, errors, touched, setTouched }: any) {
  const cls = (k: string) =>
    `input ${touched[k] && errors[k] ? "!border-danger focus:!ring-danger/20" : ""}`;
  const mark = (k: string) => setTouched((t: any) => ({ ...t, [k]: true }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Business name" error={errors.name} touched={touched.name}>
          <input
            className={cls("name")}
            placeholder="e.g. BlueLine Plumbing"
            value={biz.name}
            onChange={(e) => setBiz({ ...biz, name: e.target.value })}
            onBlur={() => mark("name")}
          />
        </Field>
      </div>
      <div>
        <label className="label">Industry</label>
        <select className="input" value={biz.industry} onChange={(e) => setBiz({ ...biz, industry: e.target.value })}>
          {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <Field label="City" error={errors.city} touched={touched.city}>
          <input
            className={cls("city")}
            placeholder="e.g. Chicago, IL"
            value={biz.city}
            onChange={(e) => setBiz({ ...biz, city: e.target.value })}
            onBlur={() => mark("city")}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label className="label">Business hours</label>
        <input className="input" placeholder="Mon–Fri, 8:00 AM – 6:00 PM" value={biz.hours} onChange={(e) => setBiz({ ...biz, hours: e.target.value })} />
      </div>
    </div>
  );
}

function Pricing() {
  const [rows, setRows] = useState([
    { service: "Leak repair", price: "$120 – $250" },
    { service: "Drain cleaning", price: "$95 – $180" },
  ]);
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        Your AI will only ever quote the prices you list here — no guessing, no surprises.
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-3">
            <input className="input" value={r.service} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, service: e.target.value } : x)))} placeholder="Service name" />
            <input className="input max-w-[160px]" value={r.price} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} placeholder="Price range" />
          </div>
        ))}
      </div>
      <button onClick={() => setRows([...rows, { service: "", price: "" }])} className="mt-4 text-sm font-semibold text-trust">
        + Add a service
      </button>
    </div>
  );
}

function Faq() {
  const presets = ["Do you accept insurance?", "Is there an emergency fee?", "What areas do you serve?"];
  return (
    <div className="space-y-4">
      {presets.map((q) => (
        <div key={q}>
          <label className="label">{q}</label>
          <textarea className="input" rows={2} placeholder="Your answer…" />
        </div>
      ))}
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">Have a price sheet or FAQ PDF? Upload it and we'll pull the answers out for you.</p>
        <button className="btn-ghost mt-3">Upload a PDF</button>
      </div>
    </div>
  );
}

function Calendar({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return (
    <div className="text-center">
      <p className="mx-auto max-w-md text-sm text-slate-500">
        Connect Google Calendar so your AI can see your availability and book real appointments right during the call.
      </p>
      {connected ? (
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg bg-success/10 px-4 py-3 font-semibold text-success">
          ✓ Google Calendar connected
        </div>
      ) : (
        <button onClick={onConnect} className="btn-primary mx-auto mt-6">Connect Google Calendar</button>
      )}
    </div>
  );
}

function Reception({ value, onChange }: { value: "forward" | "new"; onChange: (v: "forward" | "new") => void }) {
  return (
    <div className="space-y-4">
      <Choice active={value === "forward"} onClick={() => onChange("forward")} title="Keep my current number" desc="Your customers keep calling the number they know. Calls forward to PulseDesk whenever you can't pick up. Most popular." />
      <Choice active={value === "new"} onClick={() => onChange("new")} title="Get a brand-new number" desc="We'll set you up with a fresh number handled entirely by PulseDesk." />
      {value === "forward" && (
        <div className="rounded-xl bg-canvas p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-700">Quick forwarding setup</p>
          <p className="mt-1">Pick your carrier and we'll show the exact code to dial — usually under 2 minutes.</p>
          <select className="input mt-3 max-w-xs">
            <option>Verizon</option><option>AT&amp;T</option><option>T-Mobile</option><option>Other</option>
          </select>
        </div>
      )}
    </div>
  );
}

function VoicePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [playing, setPlaying] = useState<string | null>(null);

  // Plays a short demo tone per voice using Web Audio (no asset needed).
  const preview = (id: string, freq: number) => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const now = ctx.currentTime;
      const notes = [freq, freq * 1.25, freq * 1.5];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        const start = now + i * 0.18;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.17);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
      setPlaying(id);
      setTimeout(() => { setPlaying((p) => (p === id ? null : p)); ctx.close(); }, 700);
    } catch {
      /* audio not available — no-op */
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">Take each voice for a spin, then go live.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {VOICES.map((v) => (
          <div
            key={v.id}
            className={`flex items-center justify-between rounded-xl border p-4 transition ${
              value === v.id ? "border-signal bg-signal/5 ring-1 ring-signal" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <button onClick={() => onChange(v.id)} className="text-left">
              <p className="font-semibold text-slate-900">{v.name}</p>
              <p className="text-xs text-slate-500">{v.tag}</p>
            </button>
            <button
              onClick={() => preview(v.id, v.freq)}
              aria-label={`Preview ${v.name}`}
              className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-white transition ${
                playing === v.id ? "bg-signal" : "bg-trust hover:bg-trust-800"
              }`}
            >
              {playing === v.id ? (
                <span className="flex items-end gap-0.5">
                  <span className="h-3 w-0.5 animate-pulse bg-white" />
                  <span className="h-4 w-0.5 animate-pulse bg-white [animation-delay:120ms]" />
                  <span className="h-2 w-0.5 animate-pulse bg-white [animation-delay:240ms]" />
                </span>
              ) : "▶"}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">Preview plays a short demo tone. Real voice samples are enabled once your line is provisioned.</p>
    </div>
  );
}

function Choice({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button onClick={onClick} className={`w-full rounded-xl border p-4 text-left transition ${active ? "border-trust bg-trust/5 ring-1 ring-trust" : "border-slate-200 hover:border-slate-300"}`}>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </button>
  );
}
