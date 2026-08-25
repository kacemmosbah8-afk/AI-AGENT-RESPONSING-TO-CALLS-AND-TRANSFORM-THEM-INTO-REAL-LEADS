/** Design tokens mirrored from Spec §3.2 (kept in sync with tailwind.config.ts). */
export const COLORS = {
  trust: "#1F4E79", // Deep Trust Blue — primary
  signal: "#0EA5A0", // Signal Teal — secondary
  success: "#16A765", // appointment booked
  alert: "#F5A623", // missed call / urgent
  danger: "#E5484D", // errors ONLY
  canvas: "#F4F6F8", // dashboard background
} as const;

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 149,
    minutes: 300,
    margin: "~$60–90",
    features: [
      "300 answered minutes / mo",
      "24/7 AI receptionist",
      "Live appointment booking",
      "Instant SMS confirmations",
      "Call transcripts & recordings",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 249,
    minutes: 600,
    margin: "~$155–185",
    popular: true,
    features: [
      "600 answered minutes / mo",
      "Everything in Starter",
      "Emergency escalation (call + SMS)",
      "Weekly ROI email reports",
      "Custom voice & tone",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 399,
    minutes: 1200,
    margin: "~$300–330",
    features: [
      "1,200 answered minutes / mo",
      "Everything in Pro",
      "Priority tuning & support",
      "Multi-service knowledge base",
      "Advanced usage analytics",
    ],
  },
] as const;

/** Human receptionist baseline used across the marketing site (Spec §2/§15). */
export const HUMAN_RECEPTIONIST_MONTHLY = 3100;
