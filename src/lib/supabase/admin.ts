import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";
import { serverEnv } from "../env";

/**
 * Service-role Supabase client — bypasses Row Level Security. Use ONLY in
 * trusted server contexts that aren't tied to a logged-in user, i.e. the Vapi
 * webhook writing a call/appointment/lead for a tenant it identified from the
 * assistant metadata. Never import this from client code.
 *
 * Returns null if the service-role key isn't configured, so callers can no-op
 * gracefully instead of throwing.
 */
export function createAdminClient() {
  if (!SUPABASE_URL || !serverEnv.supabaseServiceRoleKey) return null;
  return createClient(SUPABASE_URL, serverEnv.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
