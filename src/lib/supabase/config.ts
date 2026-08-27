/**
 * Supabase configuration (Spec §8 — Supabase Postgres + Auth).
 *
 * When these env vars are absent (e.g. the public keyless demo on Vercel), the
 * app falls back to demo/mock data and skips auth — so the marketing demo keeps
 * working with zero configuration. Set them to switch the whole app to real,
 * per-tenant data backed by Row Level Security.
 *
 * IMPORTANT: NEXT_PUBLIC_* values are inlined at BUILD time (both client and
 * server bundles). Adding them in Vercel only takes effect on the NEXT build —
 * redeploy WITHOUT build cache after setting them. This file is the single
 * inlining site, so a change here forces that re-inlining.
 */
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

/** True only when both public Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
