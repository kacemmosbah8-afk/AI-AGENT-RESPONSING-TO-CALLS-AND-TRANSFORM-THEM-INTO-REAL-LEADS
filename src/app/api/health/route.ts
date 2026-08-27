import { NextResponse } from "next/server";
import { isSupabaseConfigured, SUPABASE_URL } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Diagnostic endpoint — returns booleans only, never secret values. Lets us tell
 * whether the Supabase env vars actually reached the build vs. runtime.
 *
 * - buildTime*: read via a statically-inlined `process.env.NEXT_PUBLIC_*` (baked
 *   at build). This is what the app + browser client actually use.
 * - runtime*: read via a dynamic key so Next can't inline it, reflecting the
 *   live process environment. If runtime is true but buildTime is false, the
 *   var IS set on Vercel but the serving build was produced without it
 *   (stale build cache / rebuilt before the var existed) → rebuild needed.
 */
export async function GET() {
  const urlKey = ["NEXT", "PUBLIC", "SUPABASE", "URL"].join("_");
  const keyKey = ["NEXT", "PUBLIC", "SUPABASE", "ANON", "KEY"].join("_");

  const buildTimeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const runtimeUrl = process.env[urlKey] || "";
  const runtimeKey = process.env[keyKey] || "";

  // Mask: only expose the project ref subdomain (the URL is public anyway).
  const host = (buildTimeUrl || runtimeUrl).replace(/^https?:\/\//, "").split(".")[0] || null;

  return NextResponse.json({
    // What the app actually keys off (build-time inlined):
    supabaseConfigured: isSupabaseConfigured,
    buildTimeHasUrl: Boolean(SUPABASE_URL),
    // Live process env (dynamic read):
    runtimeHasUrl: Boolean(runtimeUrl),
    runtimeHasAnonKey: Boolean(runtimeKey),
    projectRef: host,
    mode: isSupabaseConfigured ? "real" : "demo",
    builtAt: new Date().toISOString(),
  });
}
