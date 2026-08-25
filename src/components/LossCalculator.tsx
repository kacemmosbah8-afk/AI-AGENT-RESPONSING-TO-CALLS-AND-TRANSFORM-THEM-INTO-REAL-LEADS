"use client";

import { useState } from "react";

/**
 * Interactive lost-revenue calculator (Spec §4.1 / §2.2).
 * annual loss = missedCalls/mo × 12 × closeRate × avgDeal
 */
export function LossCalculator() {
  const [missed, setMissed] = useState(31);
  const [avgDeal, setAvgDeal] = useState(3500);
  const [closeRate, setCloseRate] = useState(20);

  const annualLoss = Math.round(missed * 12 * (closeRate / 100) * avgDeal);
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="card mx-auto max-w-2xl">
      <h3 className="font-display text-xl font-bold text-slate-900">
        How much are missed calls costing you?
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Drag the sliders — see your estimated lost revenue instantly.
      </p>

      <div className="mt-6 space-y-6">
        <Field
          label="Missed calls per month"
          value={missed}
          min={1}
          max={120}
          onChange={setMissed}
          display={`${missed}`}
        />
        <Field
          label="Average deal value"
          value={avgDeal}
          min={100}
          max={10000}
          step={100}
          onChange={setAvgDeal}
          display={`$${fmt(avgDeal)}`}
        />
        <Field
          label="Close rate"
          value={closeRate}
          min={1}
          max={100}
          onChange={setCloseRate}
          display={`${closeRate}%`}
        />
      </div>

      <div className="mt-8 rounded-xl bg-trust p-6 text-center text-white">
        <p className="text-sm font-medium text-white/70">
          Estimated revenue lost every year
        </p>
        <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">
          ${fmt(annualLoss)}
        </p>
        <p className="mt-2 text-sm text-white/70">
          PulseDesk AI recovers calls like these for a fraction of a human
          receptionist ($3,100/mo).
        </p>
      </div>

      <a href="/signup" className="btn-signal mt-5 w-full">
        Recover this revenue — start free 14-day trial
      </a>
    </div>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="font-display text-sm font-bold text-trust">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-signal"
      />
    </div>
  );
}
