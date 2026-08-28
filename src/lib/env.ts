import "server-only";

/**
 * Server-only secrets for the AI engine (Spec §8.2 / §11).
 * Never referenced from client code — these are read at runtime on the server,
 * so setting them in Vercel does NOT require a rebuild (unlike NEXT_PUBLIC_*).
 */
export const serverEnv = {
  // LLM — used by our webhook for post-call transcript extraction. (Vapi uses
  // its own copy of this key, configured in the Vapi dashboard, for the live call.)
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o",

  // Vapi — REST API key to create/manage assistants + the shared secret we use
  // to verify inbound Vapi webhooks.
  vapiApiKey: process.env.VAPI_API_KEY ?? "",
  vapiWebhookSecret: process.env.VAPI_WEBHOOK_SECRET ?? "",
  // Optional: a Vapi phone-number id to attach to newly created assistants.
  vapiPhoneNumberId: process.env.VAPI_PHONE_NUMBER_ID ?? "",

  // Supabase service role — lets the webhook write across tenants (bypasses RLS).
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  // Public base URL, so the assistant's serverUrl points back at our webhook.
  appUrl:
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Post-call automation (still optional / on hold).
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL ?? "",
};

export const hasOpenAI = () => Boolean(serverEnv.openaiApiKey);
export const hasVapi = () => Boolean(serverEnv.vapiApiKey);
export const hasServiceRole = () => Boolean(serverEnv.supabaseServiceRoleKey);
