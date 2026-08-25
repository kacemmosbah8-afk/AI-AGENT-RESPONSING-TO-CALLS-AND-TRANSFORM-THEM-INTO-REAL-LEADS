/**
 * Supabase client stub (Spec §8 — Supabase Postgres + Auth).
 *
 * Kept dependency-free so the MVP scaffold builds and runs without secrets.
 * To wire the real client:
 *   npm i @supabase/supabase-js
 * then replace the body below with createClient(url, anonKey).
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Real implementation:
 *
 * import { createClient } from "@supabase/supabase-js";
 * export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 *
 * All dashboard reads go through the anon key, so RLS (supabase/schema.sql)
 * automatically scopes every query to the signed-in owner's business_id.
 */
