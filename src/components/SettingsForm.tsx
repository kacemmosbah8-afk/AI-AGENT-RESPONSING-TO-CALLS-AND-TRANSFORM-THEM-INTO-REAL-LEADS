"use client";

import { useState } from "react";
import { saveBusiness, type BusinessPayload } from "@/lib/actions";
import { provisionAssistant } from "@/lib/vapi/provision";

const INDUSTRIES = ["Plumbing", "Dental", "HVAC", "Legal", "Salon", "Auto repair", "Landscaping", "Other"];
const VOICES = [
  ["aria", "Aria (Female · warm)"],
  ["noah", "Noah (Male · professional)"],
  ["mia", "Mia (Female · upbeat)"],
  ["leo", "Leo (Male · calm)"],
];

export function SettingsForm({ initial }: { initial: BusinessPayload }) {
  const [f, setF] = useState<BusinessPayload>(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [sync, setSync] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [syncMsg, setSyncMsg] = useState("");

  const set = (patch: Partial<BusinessPayload>) => setF((p) => ({ ...p, ...patch }));

  async function onSync() {
    setSync("syncing");
    const res = await provisionAssistant();
    if (res.ok) {
      setSync("done");
      setSyncMsg("AI receptionist updated with your latest info.");
    } else {
      setSync("error");
      setSyncMsg(
        res.skipped === "vapi-not-configured"
          ? "Add VAPI_API_KEY in your environment to enable the live phone assistant."
          : res.error || "Couldn't sync the assistant.",
      );
    }
    setTimeout(() => setSync("idle"), 4000);
  }

  async function onSave() {
    setState("saving");
    const res = await saveBusiness(f);
    if (res.ok) {
      setState("saved");
      setMsg(res.demo ? "Saved (demo mode — connect Supabase to persist)." : "Changes saved.");
      setTimeout(() => setState("idle"), 2500);
    } else {
      setState("error");
      setMsg(res.error || "Something went wrong.");
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900">Business info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Business name</label>
            <input className="input" value={f.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div>
            <label className="label">Industry</label>
            <select className="input" value={f.industry} onChange={(e) => set({ industry: e.target.value })}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={f.city} onChange={(e) => set({ city: e.target.value })} />
          </div>
          <div>
            <label className="label">Average deal value ($)</label>
            <input className="input" type="number" min={0} value={f.avgDealValue}
              onChange={(e) => set({ avgDealValue: Number(e.target.value) })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Business hours</label>
            <input className="input" value={f.hours} onChange={(e) => set({ hours: e.target.value })}
              placeholder="Mon–Fri, 8:00 AM – 6:00 PM" />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900">Voice &amp; tone</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Assistant voice</label>
            <select className="input" value={f.voiceId} onChange={(e) => set({ voiceId: e.target.value })}>
              {VOICES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tone</label>
            <select className="input" value={f.greetingStyle} onChange={(e) => set({ greetingStyle: e.target.value })}>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="warm-casual">Warm-casual</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900">Services &amp; pricing</h2>
        <p className="mt-1 text-sm text-slate-500">Your AI only quotes prices listed here.</p>
        <div className="mt-4 space-y-3">
          {f.pricing.map((p, i) => (
            <div key={i} className="flex gap-3">
              <input className="input" placeholder="Service" value={p.service_name}
                onChange={(e) => set({ pricing: f.pricing.map((x, j) => j === i ? { ...x, service_name: e.target.value } : x) })} />
              <input className="input max-w-[160px]" placeholder="$ range" value={p.price_range}
                onChange={(e) => set({ pricing: f.pricing.map((x, j) => j === i ? { ...x, price_range: e.target.value } : x) })} />
              <button className="px-2 text-slate-400 hover:text-danger" aria-label="Remove"
                onClick={() => set({ pricing: f.pricing.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm font-semibold text-trust"
          onClick={() => set({ pricing: [...f.pricing, { service_name: "", price_range: "" }] })}>
          + Add a service
        </button>
      </section>

      <section className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900">FAQ</h2>
        <p className="mt-1 text-sm text-slate-500">Answers your AI can give callers.</p>
        <div className="mt-4 space-y-4">
          {f.faq.map((q, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <input className="input mb-2" placeholder="Question" value={q.question}
                onChange={(e) => set({ faq: f.faq.map((x, j) => j === i ? { ...x, question: e.target.value } : x) })} />
              <textarea className="input" rows={2} placeholder="Answer" value={q.answer}
                onChange={(e) => set({ faq: f.faq.map((x, j) => j === i ? { ...x, answer: e.target.value } : x) })} />
              <button className="mt-2 text-xs font-semibold text-slate-400 hover:text-danger"
                onClick={() => set({ faq: f.faq.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm font-semibold text-trust"
          onClick={() => set({ faq: [...f.faq, { question: "", answer: "" }] })}>
          + Add a question
        </button>
      </section>

      <section className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900">AI receptionist</h2>
        <p className="mt-1 text-sm text-slate-500">
          After changing your info above, re-sync so your live phone assistant uses the latest
          prompt, pricing, and FAQ.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="btn-ghost" onClick={onSync} disabled={sync === "syncing"}>
            {sync === "syncing" ? "Syncing…" : "Sync AI receptionist"}
          </button>
          {sync === "done" && <span className="text-sm font-medium text-success">✓ {syncMsg}</span>}
          {sync === "error" && <span className="text-sm font-medium text-alert">{syncMsg}</span>}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {state === "saved" && <span className="text-sm font-medium text-success">✓ {msg}</span>}
        {state === "error" && <span className="text-sm font-medium text-danger">{msg}</span>}
        <button className="btn-primary" onClick={onSave} disabled={state === "saving"}>
          {state === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
