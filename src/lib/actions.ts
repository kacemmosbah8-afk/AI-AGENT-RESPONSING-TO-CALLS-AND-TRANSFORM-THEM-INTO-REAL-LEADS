"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export interface BusinessPayload {
  name: string;
  industry: string;
  city: string;
  hours: string;
  greetingStyle: string;
  voiceId: string;
  avgDealValue: number;
  pricing: { service_name: string; price_range: string }[];
  faq: { question: string; answer: string }[];
}

export interface ActionResult {
  ok: boolean;
  demo?: boolean;
  error?: string;
}

/**
 * Persist the business profile, pricing list, and FAQ for the signed-in tenant.
 * `completeOnboarding` also marks onboarding as done. No-ops (as a friendly
 * success) in demo mode so the UI still feels responsive without Supabase.
 */
export async function saveBusiness(
  payload: BusinessPayload,
  completeOnboarding = false,
): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: true, demo: true };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) return { ok: false, error: "No business found for this account." };
  const businessId = business.id as string;

  const { error: bizErr } = await supabase
    .from("businesses")
    .update({
      name: payload.name || "My business",
      industry: payload.industry || null,
      city: payload.city || null,
      hours_json: { text: payload.hours || "" },
      greeting_style: payload.greetingStyle || "friendly",
      voice_id: payload.voiceId || null,
      avg_deal_value: Number.isFinite(payload.avgDealValue) ? payload.avgDealValue : 0,
      updated_at: new Date().toISOString(),
      ...(completeOnboarding ? { onboarding_done: true } : {}),
    })
    .eq("id", businessId);
  if (bizErr) return { ok: false, error: bizErr.message };

  // Replace pricing + FAQ (small per-tenant lists) with the submitted set.
  const pricing = payload.pricing.filter((p) => p.service_name.trim());
  await supabase.from("business_pricing").delete().eq("business_id", businessId);
  if (pricing.length) {
    await supabase
      .from("business_pricing")
      .insert(pricing.map((p) => ({ business_id: businessId, ...p })));
  }

  const faq = payload.faq.filter((f) => f.question.trim() && f.answer.trim());
  await supabase.from("business_knowledge").delete().eq("business_id", businessId);
  if (faq.length) {
    await supabase
      .from("business_knowledge")
      .insert(faq.map((f) => ({ business_id: businessId, source_type: "manual", ...f })));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { ok: true };
}
