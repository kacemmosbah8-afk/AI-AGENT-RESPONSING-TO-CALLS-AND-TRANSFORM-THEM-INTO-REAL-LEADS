import { Divider, GoogleIcon } from "@/components/Auth";

/**
 * Google sign-in is intentionally disabled for now (OAuth wiring is a later
 * phase). Shown but inert so the layout is final.
 */
export function GoogleButton() {
  return (
    <>
      <Divider />
      <button
        type="button"
        disabled
        title="Google sign-in is coming soon"
        className="btn-ghost w-full cursor-not-allowed opacity-60"
      >
        <GoogleIcon /> Continue with Google
        <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
          soon
        </span>
      </button>
    </>
  );
}
