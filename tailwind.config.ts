import type { Config } from "tailwindcss";

/**
 * Design System — PulseDesk AI (Spec §3.2 / §3.3)
 * Fixed semantic colors: green = success, amber = alert, red = error ONLY.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        trust: {
          DEFAULT: "#1F4E79", // Deep Trust Blue — primary / identity
          50: "#EAF1F8",
          100: "#CBDDEE",
          700: "#1F4E79",
          800: "#193f61",
          900: "#12314b",
        },
        signal: {
          DEFAULT: "#0EA5A0", // Signal Teal — secondary / connectivity
          50: "#E6FAF8",
          100: "#B9F1ED",
        },
        // Semantic (fixed meanings across the whole UI)
        success: "#16A765", // appointment booked
        alert: "#F5A623", // missed call / urgent
        danger: "#E5484D", // errors ONLY
        canvas: "#F4F6F8", // dashboard background
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.08)",
        lift: "0 8px 30px rgba(31,78,121,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
