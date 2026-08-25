-- ════════════════════════════════════════════════════════════════════════
-- PulseDesk AI — Full multi-tenant schema (Spec §10)
-- Postgres / Supabase. Tenant isolation is enforced by Row Level Security:
-- every row is scoped by business_id, and every business is owned by an
-- auth.users id. A tenant can NEVER read another tenant's rows (Spec §10/§11).
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type call_intent as enum
    ('book_appointment','faq_question','emergency','complaint','request_human','spam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type call_outcome as enum
    ('appointment_booked','message_taken','emergency_escalated','spam','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum ('booked','cancelled','rescheduled','completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new','contacted','converted','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sub_plan as enum ('starter','pro','business');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sub_status as enum ('trialing','active','past_due','canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type forward_mode as enum ('no_answer','always','ported');
exception when duplicate_object then null; end $$;

-- ── businesses — the core tenant profile (Spec §10) ──────────────────────
create table if not exists businesses (
  id             uuid primary key default gen_random_uuid(),
  owner_user_id  uuid not null references auth.users(id) on delete cascade,
  name           text not null,
  industry       text,                       -- plumbing / dental / hvac / legal / salon...
  timezone       text default 'America/New_York',
  hours_json     jsonb default '{}'::jsonb,  -- business hours per weekday
  greeting_style text default 'friendly',    -- 'formal' | 'friendly'
  voice_id       text,                       -- selected TTS voice (Spec §4.3)
  onboarding_done boolean default false,
  created_at     timestamptz default now()
);

-- ── business_knowledge — per-tenant FAQ / knowledge base (Spec §5.1) ──────
create table if not exists business_knowledge (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  question     text not null,
  answer       text not null,
  source_type  text default 'manual',        -- 'manual' | 'pdf'
  created_at   timestamptz default now()
);

-- ── business_pricing — reference price list the assistant may quote ───────
create table if not exists business_pricing (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  service_name text not null,
  price_range  text not null                 -- e.g. "$120–$180"
);

-- ── phone_lines — the Twilio number wiring per tenant ─────────────────────
create table if not exists phone_lines (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references businesses(id) on delete cascade,
  twilio_number text,
  forward_mode  forward_mode default 'no_answer',
  is_active     boolean default false,
  created_at    timestamptz default now()
);

-- ── calls — every answered call, transcript + outcome (Spec §10) ──────────
create table if not exists calls (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references businesses(id) on delete cascade,
  caller_number text,
  transcript    jsonb default '[]'::jsonb,    -- [{role, text, at}]
  intent        call_intent,
  outcome       call_outcome,
  recording_url text,
  duration_sec  integer default 0,
  needs_review  boolean default false,        -- flagged for admin review (Spec §4.9)
  created_at    timestamptz default now()
);

-- ── appointments — bookings created during a call (Spec §10) ──────────────
create table if not exists appointments (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references businesses(id) on delete cascade,
  call_id           uuid references calls(id) on delete set null,
  customer_name     text,
  customer_phone    text,
  service           text,
  datetime          timestamptz not null,
  status            appointment_status default 'booked',
  calendar_event_id text,                     -- Google Calendar event id
  created_at        timestamptz default now()
);

-- ── leads — requests captured but not booked (Spec §10) ───────────────────
create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  call_id      uuid references calls(id) on delete set null,
  name         text,
  phone        text,
  note         text,
  status       lead_status default 'new',
  created_at   timestamptz default now()
);

-- ── subscriptions — Stripe billing state (Spec §10) ───────────────────────
create table if not exists subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  business_id        uuid not null references businesses(id) on delete cascade,
  plan               sub_plan default 'starter',
  stripe_customer_id text,
  stripe_sub_id      text,
  status             sub_status default 'trialing',
  minutes_included   integer default 300,
  renews_at          timestamptz,
  created_at         timestamptz default now()
);

-- ── usage_logs — real minutes + cost, drives margin view (Spec §4.9/§9.2) ─
create table if not exists usage_logs (
  id             uuid primary key default gen_random_uuid(),
  business_id    uuid not null references businesses(id) on delete cascade,
  month          date not null,               -- first of month
  minutes_used   integer default 0,
  cost_estimate  numeric(10,2) default 0,
  unique (business_id, month)
);

-- ── error_logs — comprehension failures / outages (Spec §9.1) ─────────────
create table if not exists error_logs (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  call_id      uuid references calls(id) on delete set null,
  error_type   text,
  created_at   timestamptz default now()
);

-- ── notifications_log — every alert sent to the owner (Spec §10) ──────────
create table if not exists notifications_log (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  channel      text,                          -- 'sms' | 'email' | 'call'
  type         text,                          -- 'booking' | 'emergency' | 'summary'...
  sent_at      timestamptz default now()
);

-- ── Helpful indexes ───────────────────────────────────────────────────────
create index if not exists idx_calls_business_created on calls (business_id, created_at desc);
create index if not exists idx_appts_business_dt      on appointments (business_id, datetime);
create index if not exists idx_leads_business         on leads (business_id, created_at desc);
create index if not exists idx_usage_business_month   on usage_logs (business_id, month);

-- ════════════════════════════════════════════════════════════════════════
-- Row Level Security — tenant isolation (Spec §11)
-- ════════════════════════════════════════════════════════════════════════
alter table businesses         enable row level security;
alter table business_knowledge enable row level security;
alter table business_pricing   enable row level security;
alter table phone_lines        enable row level security;
alter table calls              enable row level security;
alter table appointments       enable row level security;
alter table leads              enable row level security;
alter table subscriptions      enable row level security;
alter table usage_logs         enable row level security;
alter table error_logs         enable row level security;
alter table notifications_log  enable row level security;

-- Owner can access their own business row
create policy "own business" on businesses
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- Generic per-tenant policy: the row's business must belong to the caller.
-- Applied to every child table via a reusable predicate.
do $$
declare t text;
begin
  foreach t in array array[
    'business_knowledge','business_pricing','phone_lines','calls',
    'appointments','leads','subscriptions','usage_logs',
    'error_logs','notifications_log'
  ] loop
    execute format($f$
      create policy "tenant access" on %1$I
        for all using (
          business_id in (select id from businesses where owner_user_id = auth.uid())
        )
        with check (
          business_id in (select id from businesses where owner_user_id = auth.uid())
        );
    $f$, t);
  end loop;
end $$;

-- NOTE: The Vapi webhook + n8n automation use the service-role key, which
-- bypasses RLS. All tenant-facing reads from the dashboard go through the
-- anon key and are therefore always constrained to the caller's business_id.
