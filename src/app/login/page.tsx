import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/Auth";
import { LoginForm } from "@/components/auth/LoginForm";

/** Login (Spec §4.2). */
export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your PulseDesk dashboard.">
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-trust">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
