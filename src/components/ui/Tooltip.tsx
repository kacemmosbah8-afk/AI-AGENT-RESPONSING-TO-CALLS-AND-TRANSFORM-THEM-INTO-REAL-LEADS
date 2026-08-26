"use client";

import { useState, type ReactNode } from "react";

/**
 * Lightweight accessible tooltip (hover + keyboard focus). Used to explain how
 * "recovered revenue" is calculated so the number reads as credible, not magic.
 */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
}

/** Small info "i" glyph that carries a tooltip. */
export function InfoDot({ label }: { label: string }) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label="How this is calculated"
        className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 transition hover:bg-slate-300"
      >
        i
      </button>
    </Tooltip>
  );
}
