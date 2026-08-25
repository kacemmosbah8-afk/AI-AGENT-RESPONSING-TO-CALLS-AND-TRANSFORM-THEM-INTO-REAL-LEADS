import Link from "next/link";
import { AuthShell, Divider, GoogleIcon } from "@/components/Auth";

/** Signup (Spec §4.2) — after signup, redirect to the onboarding wizard. */
export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your free 14-day trial — live in minutes."
    >
      <form className="space-y-4" action="/onboarding">
        <div>
          <label className="label">Work email</label>
          <input className="input" type="email" placeholder="you@business.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" required />
        </div>
        <button className="btn-primary w-full" type="submit">
          Create account
        </button>
      </form>

      <Divider />

      <button className="btn-ghost w-full">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-trust">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
