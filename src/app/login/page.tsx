import Link from "next/link";
import { AuthShell, Divider, GoogleIcon } from "@/components/Auth";

/** Login (Spec §4.2). */
export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your PulseDesk dashboard.">
      <form className="space-y-4" action="/dashboard">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@business.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" required />
        </div>
        <button className="btn-primary w-full" type="submit">
          Log in
        </button>
      </form>

      <Divider />

      <button className="btn-ghost w-full">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-trust">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
