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
  { id: "aria", name: "Aria", tag: "Female · warm" },
  { id: "noah", name: "Noah", tag: "Male · professional" },
  { id: "mia", name: "Mia", tag: "Female · upbeat" },
  { id: "leo", name: "Leo", tag: "Male · calm" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState("aria");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [reception, setReception] = useState<"forward" | "new">("forward");

  const last = step === STEPS.length - 1;
  const next = () => (last ? router.push("/dashboard") : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo />
          <span className="text-sm text-slate-400">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${
                  i <= step ? "bg-signal" : "bg-slate-200"
                }`}
              />
              <p
                className={`mt-2 hidden text-xs sm:block ${
                  i === step ? "font-semibold text-slate-700" : "text-slate-400"
                }`}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="card">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {STEPS[step]}
          </h1>

          <div className="mt-6">
            {step === 0 && <BusinessInfo />}
            {step === 1 && <Pricing />}
            {step === 2 && <Faq />}
            {step === 3 && (
              <Calendar
                connected={calendarConnected}
                onConnect={() => setCalendarConnected(true)}
              />
            )}
            {step === 4 && <Reception value={reception} onChange={setReception} />}
            {step === 5 && <VoicePicker value={voice} onChange={setVoice} />}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-40"
            >
              Back
            </button>
            <button onClick={next} className={last ? "btn-signal" : "btn-primary"}>
              {last ? "🚀 Go Live" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function BusinessInfo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Business name</label>
        <input className="input" placeholder="e.g. BlueLine Plumbing" />
      </div>
      <div>
        <label className="label">Industry</label>
        <select className="input">
          {INDUSTRIES.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">City</label>
        <input className="input" placeholder="e.g. Chicago, IL" />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Business hours</label>
        <input className="input" placeholder="Mon–Fri 8:00 AM – 6:00 PM" />
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
        The assistant may only quote prices you list here (Spec §5.1).
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-3">
            <input
              className="input"
              value={r.service}
              onChange={(e) =>
                setRows(rows.map((x, j) => (j === i ? { ...x, service: e.target.value } : x)))
              }
              placeholder="Service name"
            />
            <input
              className="input max-w-[180px]"
              value={r.price}
              onChange={(e) =>
                setRows(rows.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))
              }
              placeholder="Price range"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => setRows([...rows, { service: "", price: "" }])}
        className="mt-4 text-sm font-semibold text-trust"
      >
        + Add service
      </button>
    </div>
  );
}

function Faq() {
  const presets = [
    "Do you accept insurance?",
    "Is there an emergency fee?",
    "What areas do you serve?",
  ];
  return (
    <div className="space-y-4">
      {presets.map((q) => (
        <div key={q}>
          <label className="label">{q}</label>
          <textarea className="input" rows={2} placeholder="Your answer…" />
        </div>
      ))}
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">
          Or upload a PDF and we'll extract answers automatically
        </p>
        <button className="btn-ghost mt-3">Upload PDF</button>
      </div>
    </div>
  );
}

function Calendar({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return (
    <div className="text-center">
      <p className="mx-auto max-w-md text-sm text-slate-500">
        Connect Google Calendar so the assistant can check availability and book
        appointments live during the call (Spec §4.3).
      </p>
      {connected ? (
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg bg-success/10 px-4 py-3 font-semibold text-success">
          ✓ Google Calendar connected
        </div>
      ) : (
        <button onClick={onConnect} className="btn-primary mx-auto mt-6">
          Connect Google Calendar
        </button>
      )}
    </div>
  );
}

function Reception({
  value,
  onChange,
}: {
  value: "forward" | "new";
  onChange: (v: "forward" | "new") => void;
}) {
  return (
    <div className="space-y-4">
      <Choice
        active={value === "forward"}
        onClick={() => onChange("forward")}
        title="Forward from my current number"
        desc="Keep the number your customers know. Calls forward to PulseDesk when you don't answer. Most popular."
      />
      <Choice
        active={value === "new"}
        onClick={() => onChange("new")}
        title="Get a brand-new number"
        desc="We provision a new number handled entirely by PulseDesk."
      />
      {value === "forward" && (
        <div className="rounded-xl bg-canvas p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-700">Forwarding setup</p>
          <p className="mt-1">
            Pick your carrier and we'll show the exact short code to dial
            (usually under 2 minutes).
          </p>
          <select className="input mt-3 max-w-xs">
            <option>Verizon</option>
            <option>AT&amp;T</option>
            <option>T-Mobile</option>
            <option>Other</option>
          </select>
        </div>
      )}
    </div>
  );
}

function VoicePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        Preview a voice, then go live (Spec §4.3).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {VOICES.map((v) => (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
              value === v.id
                ? "border-signal bg-signal/5 ring-1 ring-signal"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <p className="font-semibold text-slate-900">{v.name}</p>
              <p className="text-xs text-slate-500">{v.tag}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-trust text-white">
              ▶
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active ? "border-trust bg-trust/5 ring-1 ring-trust" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </button>
  );
}
