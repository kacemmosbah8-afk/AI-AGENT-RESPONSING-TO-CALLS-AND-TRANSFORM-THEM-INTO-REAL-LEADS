"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Simulates the production fetch feel: shows a skeleton for a beat, then reveals
 * the (mock) content with a soft fade. In production this is where the real
 * Supabase query resolves. Skips the delay for reduced-motion users.
 */
export function Reveal({
  skeleton,
  children,
  delay = 750,
}: {
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!ready) return <>{skeleton}</>;
  return <div className="animate-[fadeIn_.35s_ease]">{children}</div>;
}
