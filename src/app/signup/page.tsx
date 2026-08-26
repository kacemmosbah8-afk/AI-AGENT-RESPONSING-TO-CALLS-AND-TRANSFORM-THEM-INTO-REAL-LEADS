import Link from "next/link";
import { AuthShell } from "@/components/Auth";
import { SignupForm } from "@/components/auth/SignupForm";

/** Signup (Spec §4.2) — after signup, redirect to the onboarding wizard. */
export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your free 14-day trial — live in minutes."
    >
      <SignupForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-trust">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
