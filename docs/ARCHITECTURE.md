# PulseDesk AI — Architecture

## 1. The core idea

**One** multi-tenant platform serves every business — like Shopify, where each
merchant has their own store but the platform is shared. There is **no** separate
system per client. A single intelligent flow reads each tenant's settings from
the database based on the phone number that was called, so reaching 100 tenants
requires zero code changes (Spec §6.1).

When a new tenant signs up, the system programmatically creates: a `businesses`
row, a Vapi assistant (via API), and a Twilio number if needed — no manual work.

## 2. Live-call flow (≈1s per turn, Spec §8.1)

```
                 ┌─────────┐   audio   ┌──────────┐  text  ┌─────────────┐
  Caller ──call──▶ Twilio  ├──────────▶│   Vapi   ├───────▶│  Deepgram   │
                 └────┬────┘           │ (orchestr)│  STT   │   (STT)     │
                      │                └────┬─────┘        └──────┬──────┘
                      │                     │  prompt + context   │ text
                      │                     ▼                     ▼
                      │              ┌──────────────┐      ┌────────────┐
                      │              │  LLM (GPT-4o  │◀─────┤  Supabase  │
                      │              │  / Claude)    │ ctx  │ tenant cfg │
                      │              └──────┬───────┘      └────────────┘
                      │   audio reply       │ text reply
                      │  ┌──────────────────▼──────┐
                      └──┤     ElevenLabs (TTS)     │
                         └─────────────────────────┘
```

Tenant context (pricing, hours, FAQ) is injected per call from Supabase — the
assistant only ever speaks facts it was given (Spec §5.1). The dynamic prompt is
assembled by `src/lib/ai/system-prompt.ts`.

## 3. Post-call automation (n8n, Spec §9.1)

At end of call, Vapi POSTs to `/api/vapi/webhook`, which forwards a normalized
payload to n8n. n8n switches on the outcome:

- **Booking** → create Google Calendar event → insert `appointments` → SMS the
  caller → SMS/email the owner.
- **Message only** → insert `leads` → notify the owner (no urgency).
- **Emergency** → immediate SMS + automated call to the owner.
- **Error** → insert `error_logs`; if the same tenant errors 3× in a week, email
  the operator for manual review.

Cron workflows (Spec §9.2): daily usage pull vs. plan limit (alert at ≥80%),
weekly per-tenant ROI email, monthly Stripe reconciliation + auto-suspend of
past-due accounts.

## 4. Data model & isolation (Spec §10, §11)

11 tables, all scoped by `business_id`. Tenant isolation is enforced by
**Row Level Security** in Postgres: every dashboard query (via the anon key) is
automatically constrained to the signed-in owner's `business_id`, so one tenant
can never see another's data. The webhook + n8n use the service-role key (which
bypasses RLS) for trusted server-side writes. Full DDL in `supabase/schema.sql`.

## 5. Frontend (this repo)

Next.js App Router + Tailwind. Routes map 1:1 to the screen-by-screen spec (§4);
see the table in `README.md`. The design system (§3.2/§3.3) lives in
`tailwind.config.ts` + `src/lib/design.ts`: Deep Trust Blue primary, Signal Teal
secondary, and **fixed** semantic colors — green = success, amber = alert,
red = error only.

## 6. Minimum viable dependencies (Spec §8.2)

To place one successful test call you need only **Twilio + Vapi + (OpenAI or
Anthropic)**. Deepgram/ElevenLabs improve quality/cost; Google Calendar enables
live booking; Supabase enables multi-tenancy; Stripe enables self-serve billing;
n8n runs all post-call automation. Each is added in dependency order.
