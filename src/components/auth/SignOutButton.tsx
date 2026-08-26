"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Signs the user out (real when configured) and returns to /login. */
export function SignOutButton({
  className,
  onDone,
}: {
  className?: string;
  onDone?: () => void;
}) {
  const router = useRouter();

  async function signOut() {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    }
    onDone?.();
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={signOut} className={className}>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      </svg>
      Log out
    </button>
  );
}
