"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/config";
import { hasVapi } from "../env";
import { buildAssistantPayload } from "./assistant";
import { createAssistant, updateAssistant } from "./client";

export interface ProvisionResult {
  ok: boolean;
  assistantId?: string;
  error?: string;
  skipped?: string;
}

/**
 * Creates (or updates) the signed-in tenant's Vapi assistant from their current
 * business profile + pricing + FAQ, and stores the assistant id on the business.
 * Idempotent: safe to call again after editing settings to re-sync the prompt.
 *
 * No-ops gracefully when Supabase or Vapi aren't configured, so onboarding
 * "Go live" never blocks in demo mode or before the keys are added.
 */
export async function provisionAssistant(): Promise<ProvisionResult> {
  if (!isSupabaseConfigured) return { ok: false, skipped: "supabase-not-configured" };
  if (!hasVapi()) return { ok: false, skipped: "vapi-not-configured" };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) return { ok: false, error: "No business found." };

  const [{ data: pricing }, { data: faq }] = await Promise.all([
    supabase.from("business_pricing").select("service_name,price_range").eq("business_id", business.id),
    supabase.from("business_knowledge").select("question,answer").eq("business_id", business.id),
  ]);

  const payload = buildAssistantPayload({
    business,
    pricing: pricing ?? [],
    faq: faq ?? [],
  });

  const res = business.vapi_assistant_id
    ? await updateAssistant(business.vapi_assistant_id, payload)
    : await createAssistant(payload);

  if (!res.ok) return { ok: false, error: res.error || "Vapi request failed." };

  const assistantId = res.data?.id ?? business.vapi_assistant_id;
  if (assistantId && assistantId !== business.vapi_assistant_id) {
    await supabase
      .from("businesses")
      .update({ vapi_assistant_id: assistantId })
      .eq("id", business.id);
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, assistantId };
}
