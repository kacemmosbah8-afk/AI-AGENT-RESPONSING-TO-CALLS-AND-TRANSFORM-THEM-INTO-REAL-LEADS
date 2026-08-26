"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { GoogleButton } from "./GoogleButton";

/** Signup (Spec §4.2): real Supabase email/password, → onboarding on success. */
export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Demo mode (no Supabase configured): just move to onboarding.
    if (!isSupabaseConfigured) {
      router.push("/onboarding");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    // Session present → email confirmation disabled → go straight to onboarding.
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div className="rounded-xl bg-signal/10 px-4 py-6 text-center">
        <p className="font-display text-lg font-semibold text-slate-900">Check your inbox</p>
        <p className="mt-1 text-sm text-slate-600">
          We sent a confirmation link to <span className="font-medium">{email}</span>. Click it to
          activate your account, then log in.
        </p>
      </div>
    );
  }

  return (
    <>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="email">Work email</label>
          <input id="email" className="input" type="email" placeholder="you@business.com" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input" type="password" placeholder="At least 6 characters"
            minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm font-medium text-danger">{error}</p>}
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <GoogleButton />
    </>
  );
}
