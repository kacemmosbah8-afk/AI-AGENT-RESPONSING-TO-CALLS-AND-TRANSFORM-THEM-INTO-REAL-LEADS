import Link from "next/link";
import { LossCalculator } from "@/components/LossCalculator";
import { PricingCards } from "@/components/PricingCards";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#calc" className="hover:text-slate-900">ROI calculator</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary !px-4 !py-2 text-sm">
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — one giant number first (Spec §3.4) */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-alert/15 px-3 py-1 text-xs font-semibold text-[#B26A00]">
              <span className="h-2 w-2 rounded-full bg-alert" /> The average business misses 62% of calls
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
              <span className="text-trust">62%</span> of your calls go
              unanswered.
              <br />
              We answer <span className="text-signal">100%</span> of them.
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-600">
              PulseDesk AI is a 24/7 AI receptionist that answers every missed
              call, books appointments live, and turns lost calls into recovered
              revenue — no app, no new number.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Try free for 14 days
              </Link>
              <a href="#calc" className="btn-ghost">
                Calculate what you're losing
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              No credit card to start · Live in minutes · Keep your current number
            </p>
          </div>

          {/* Live-call mock */}
          <div className="relative">
            <div className="card mx-auto max-w-sm">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  Incoming call · answered by PulseDesk
                </span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <Bubble side="ai">Thanks for calling BlueLine Plumbing — how can I help?</Bubble>
                <Bubble side="caller">My sink is leaking, I need someone today.</Bubble>
                <Bubble side="ai">I can book that. Our earliest is 4:30 PM today — shall I lock it in?</Bubble>
                <Bubble side="caller">Yes please.</Bubble>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-semibold text-success">
                ✓ Appointment booked · SMS sent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 3 steps (Spec §4.1) */}
      <section id="how" className="bg-canvas py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "A customer calls", d: "Your usual number rings. If you don't pick up, the call forwards to PulseDesk automatically." },
              { n: "2", t: "The AI answers", d: "A natural voice greets them by your business name, understands the request, and answers questions." },
              { n: "3", t: "The appointment is booked", d: "It checks your Google Calendar, books live, and texts a confirmation to both of you." },
            ].map((s) => (
              <div key={s.n} className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-trust font-display text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loss calculator (Spec §4.1) */}
      <section id="calc" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <LossCalculator />
        </div>
      </section>

      {/* Pricing (Spec §4.1 / §13.3) */}
      <section id="pricing" className="bg-canvas py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900">
            Simple pricing that pays for itself
          </h2>
          <p className="mt-2 text-center text-slate-500">
            One booked job usually covers the whole month.
          </p>
          <div className="mt-12">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* Testimonials placeholder (Spec §4.1) */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Trusted by local businesses
          </h2>
          <p className="mt-3 text-slate-500">
            Testimonials from our first pilot customers land here. Want to be one
            of them?
          </p>
          <Link href="/signup" className="btn-primary mt-6">
            Become a pilot customer
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
          <Logo />
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-700">Terms</a>
            <a href="#" className="hover:text-slate-700">Privacy</a>
            <Link href="/login" className="hover:text-slate-700">Log in</Link>
          </div>
          <span>© {new Date().getFullYear()} PulseDesk AI</span>
        </div>
      </footer>
    </main>
  );
}

function Bubble({ side, children }: { side: "ai" | "caller"; children: React.ReactNode }) {
  return (
    <div className={`flex ${side === "ai" ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          side === "ai"
            ? "rounded-tl-sm bg-trust/10 text-slate-700"
            : "rounded-tr-sm bg-signal text-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
