import { NextResponse } from "next/server";
import { isSupabaseConfigured, SUPABASE_URL } from "@/lib/supabase/config";
import { serverEnv } from "@/lib/env";

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
    // AI-engine env presence (runtime, server-only) — booleans only, no secrets.
    aiEngine: {
      openaiConfigured: Boolean(serverEnv.openaiApiKey),
      vapiConfigured: Boolean(serverEnv.vapiApiKey),
      vapiWebhookSecretSet: Boolean(serverEnv.vapiWebhookSecret),
      serviceRoleConfigured: Boolean(serverEnv.supabaseServiceRoleKey),
      appUrl: serverEnv.appUrl, // the public base URL used for the Vapi serverUrl
    },
    // True once everything the "Sync AI receptionist" button needs is live:
    readyToSync: isSupabaseConfigured && Boolean(serverEnv.vapiApiKey),
    // ── Definitive diagnostics (names + lengths + deployment identity; NEVER values) ──
    debug: {
      // Request-time dynamic read (independent of the module-init serverEnv above):
      runtimeOpenaiPresent: Boolean(process.env[["OPENAI", "API", "KEY"].join("_")]),
      openaiKeyLen: (process.env[["OPENAI", "API", "KEY"].join("_")] || "").length,
      vapiKeyLen: (process.env[["VAPI", "API", "KEY"].join("_")] || "").length,
      serviceRoleLen: (process.env[["SUPABASE", "SERVICE", "ROLE", "KEY"].join("_")] || "").length,
      // Every env-var NAME the running function actually received (names only):
      envNamesSeen: Object.keys(process.env)
        .filter((k) => /OPENAI|VAPI|SUPABASE|APP_URL|N8N/i.test(k))
        .sort(),
      // Which Vercel project / branch / commit / environment is serving THIS response:
      vercel: {
        env: process.env.VERCEL_ENV ?? null,
        url: process.env.VERCEL_URL ?? null,
        branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
        commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || null,
        prodUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
      },
    },
    builtAt: new Date().toISOString(),
  });
}
