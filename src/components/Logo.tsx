export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust text-white">
        {/* handset + pulse wave */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.3 1L7.2 11c1 2 2.8 3.8 4.8 4.8l1.2-1.6c.2-.3.6-.4 1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1C10.8 19 5 13.2 5 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-bold text-slate-900">
        PulseDesk<span className="text-signal"> AI</span>
      </span>
    </div>
  );
}
