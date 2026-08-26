"use client";

import { useEffect, useRef, useState } from "react";
import type { TranscriptLine } from "@/lib/mock-data";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/**
 * Simulated recording player with a transcript that highlights the active line
 * as playback advances (podcast-style), and click-to-seek on any line.
 *
 * There's no real audio yet — a timer drives a virtual playhead over the known
 * call duration. When a recording URL exists, swap the timer for an <audio>
 * element's timeupdate event; the highlight logic is unchanged.
 */
export function CallPlayer({
  transcript,
  duration,
}: {
  transcript: TranscriptLine[];
  duration: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Active line = last line whose start time has passed.
  const activeIndex = transcript.reduce(
    (acc, line, i) => (t >= line.t ? i : acc),
    -1,
  );

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const step = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, duration]);

  // Keep the active line visible.
  useEffect(() => {
    if (activeIndex < 0) return;
    lineRefs.current[activeIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const toggle = () => {
    if (t >= duration) setT(0);
    setPlaying((p) => !p);
  };
  const seek = (to: number) => {
    setT(Math.max(0, Math.min(to, duration)));
  };

  const pct = (t / duration) * 100;

  return (
    <div>
      {/* Player */}
      <div className="flex items-center gap-4 rounded-xl bg-canvas p-4">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-trust text-white transition hover:bg-trust-800"
        >
          {playing ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="flex-1">
          <div
            className="group relative h-2 cursor-pointer rounded-full bg-slate-200"
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * duration);
            }}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-signal" style={{ width: `${pct}%` }} />
            <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-signal shadow" style={{ left: `${pct}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs tabular-nums text-slate-400">
            <span>{fmt(t)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* Synced transcript */}
      <div className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {transcript.map((line, i) => {
          const active = i === activeIndex;
          const spoken = t >= line.t;
          return (
            <button
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              onClick={() => seek(line.t + 0.01)}
              className={`flex w-full gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                active
                  ? "bg-trust/10 ring-1 ring-trust/30"
                  : "hover:bg-slate-50"
              }`}
            >
              <span className="w-10 flex-none pt-0.5 text-[11px] tabular-nums text-slate-400">
                {fmt(line.t)}
              </span>
              <span className="flex-1">
                <span
                  className={`mb-0.5 block text-[10px] font-semibold uppercase tracking-wide ${
                    line.role === "assistant" ? "text-trust" : "text-signal"
                  }`}
                >
                  {line.role === "assistant" ? "PulseDesk" : "Caller"}
                </span>
                <span className={spoken ? "text-slate-800" : "text-slate-400"}>{line.text}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
