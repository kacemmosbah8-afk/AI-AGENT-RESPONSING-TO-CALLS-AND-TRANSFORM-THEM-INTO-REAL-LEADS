# 📞 PulseDesk AI

**A multi-tenant SaaS AI Voice Receptionist** — answers small businesses' missed
calls 24/7, books appointments live during the call, and turns every missed call
into recovered revenue instead of lost revenue.

> The product doesn't sell a "tech feature" — it sells **recovered revenue that
> was leaking every day**. Every design and pricing decision follows from that.

This repository contains the **web platform** (marketing site + self-serve
onboarding + tenant dashboard + internal admin) plus the database schema, the
core AI-engine prompt logic, and the post-call webhook that drives the
automation pipeline. Built from the full project spec (`docs/`).

---

## Why it exists (the numbers that sell it)

- The average small business misses **62%** of its calls.
- A contractor taking 42 calls/mo and missing 74% of them — at a 20% close rate
  and a $3,500 avg deal — loses **~$260,400/year** in missed calls alone.
- A human receptionist costs **~$3,100/mo**; PulseDesk is 85–95% cheaper and
  never sleeps.

---

## What's in this repo

| Area | Where | Spec |
|------|-------|------|
| Marketing site (hero, 3-step how-it-works, **interactive loss calculator**, pricing) | `src/app/page.tsx`, `src/components/` | §4.1 |
| Signup / Login | `src/app/signup`, `src/app/login` | §4.2 |
| **6-step onboarding wizard** | `src/app/onboarding` | §4.3 |
| Tenant dashboard (KPIs, weekly chart, recent calls) | `src/app/dashboard` | §4.4 |
| Single-call detail (recording, transcript, actions) | `src/app/dashboard/calls/[id]` | §4.5 |
| Appointments (Google Calendar sync view) | `src/app/dashboard/appointments` | §4.6 |
| Settings (business, voice/tone, alerts) | `src/app/dashboard/settings` | §4.7 |
| Billing (plan, usage, invoices, 80% alert) | `src/app/dashboard/billing` | §4.8 |
| **Internal admin** (tenants, real margins, calls needing review) | `src/app/admin` | §4.9 |
| **Core AI engine** — canonical receptionist prompt template + per-tenant renderer, Vapi function tools, intents, slot-filling, edge cases | `src/lib/ai/receptionist-prompt.ts`, `src/lib/ai/tools.ts`, `src/lib/ai/system-prompt.ts` | §5 |
| **Full multi-tenant DB schema + Row Level Security** | `supabase/schema.sql` | §10, §11 |
| **Vapi post-call webhook → n8n** | `src/app/api/vapi/webhook/route.ts` | §8.1, §9.1 |

---

## Tech stack (Spec §8)

| Layer | Tool |
|-------|------|
| Telephony | **Twilio** |
| Live-call orchestration | **Vapi** |
| Speech-to-text | Deepgram (optional) |
| Text-to-speech | ElevenLabs (optional) |
| LLM | OpenAI GPT-4o / Anthropic Claude |
| Calendar | Google Calendar API |
| Post-call automation | **n8n** (self-hosted on a VPS) |
| Database + Auth | **Supabase** (Postgres + RLS) |
| Payments | **Stripe** |
| Frontend | **Next.js (App Router) + Tailwind CSS** |
| Hosting | Vercel (web) + VPS (n8n) |

**Live-call data flow:** Twilio → Vapi → Deepgram (STT) → LLM (+ tenant context
from Supabase) → ElevenLabs (TTS) → back to caller via Twilio — under ~1s per
turn.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys (see below)
npm run dev                  # http://localhost:3000
```

The UI runs on demo data with **no keys required**, so you can click through the
entire product immediately:

- `/` — marketing site + loss calculator
- `/signup` → `/onboarding` — the 6-step wizard
- `/dashboard` — tenant dashboard, then Appointments / Settings / Billing
- `/dashboard/calls/c_1042` — a call detail view
- `/admin` — internal cross-tenant admin

### Environment variables

See `.env.example`. The **absolute minimum to place a first test call** is
Twilio + Vapi + (OpenAI **or** Anthropic) — three accounts (Spec §8.2).
Everything else is added incrementally for booking, self-serve billing, and
multi-tenant isolation.

### Database

Apply `supabase/schema.sql` in the Supabase SQL editor. It creates all 11 tables
and enables **Row Level Security** so a tenant can never read another tenant's
rows — isolation is enforced at the database, scoped by `business_id`.

---

## Pricing (Spec §13.3)

| Plan | Price | Minutes | Net margin |
|------|-------|---------|-----------|
| Starter | $149/mo | 300 | ~$60–90 |
| Pro | $249/mo | 600 | ~$155–185 |
| Business | $399/mo | 1,200 | ~$300–330 |

Per-tenant operating cost is ~$65–95/mo; each customer funds its own
infrastructure from its subscription.

---

## Build roadmap (Spec §18)

1. **Technical proof** — Twilio + Vapi, one successful test call (2–3 days)
2. **Core automation** — n8n: SMS, alerts, calendar booking (3–4 days)
3. **Multi-tenant** — Supabase + per-tenant isolation (~1 week)
4. **Full UI** — onboarding + dashboard + Stripe (1–2 weeks)
5. **Testing & pilot** — QA scenarios (§16) + first real customer (~2 weeks)

---

## Security & compliance (Spec §11)

- Full logical isolation between tenants via **Row Level Security**.
- TLS in transit; encryption at rest (Supabase default).
- API keys live in environment secrets — **never in code**.
- Mandatory call-recording disclosure at the start of every call (some US states
  require two-party consent).
- TCPA-safe: inbound-only in v1. Any future outbound reminders require prior
  documented consent.
- Configurable data-retention window (e.g. 90 days); deletable on request.

---

_See `docs/` for the complete original specification and `docs/ARCHITECTURE.md`
for a system diagram and how the pieces fit together._
