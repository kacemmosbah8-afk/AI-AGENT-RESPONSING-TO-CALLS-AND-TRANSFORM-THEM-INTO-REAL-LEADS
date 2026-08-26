/**
 * Supabase configuration (Spec §8 — Supabase Postgres + Auth).
 *
 * When these env vars are absent (e.g. the public keyless demo on Vercel), the
 * app falls back to demo/mock data and skips auth — so the marketing demo keeps
 * working with zero configuration. Set them to switch the whole app to real,
 * per-tenant data backed by Row Level Security.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when both public Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
