import { SettingsForm } from "@/components/SettingsForm";
import { getSettings } from "@/lib/data";

/** Settings (Spec §4.7): edit business info, pricing, FAQ, voice/tone. */
export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-sm text-slate-500">Change anything without redoing onboarding.</p>
      <SettingsForm
        initial={{
          name: s.business.name,
          industry: s.business.industry || "Plumbing",
          city: s.business.city,
          hours: s.business.hours,
          greetingStyle: s.business.greetingStyle,
          voiceId: s.business.voiceId,
          avgDealValue: s.business.avgDealValue,
          pricing: s.pricing.map((p) => ({ service_name: p.service_name, price_range: p.price_range })),
          faq: s.faq.map((f) => ({ question: f.question, answer: f.answer })),
        }}
      />
    </div>
  );
}
