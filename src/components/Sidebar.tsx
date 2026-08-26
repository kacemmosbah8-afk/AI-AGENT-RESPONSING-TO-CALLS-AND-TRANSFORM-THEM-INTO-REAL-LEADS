"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV_ITEM_CLS =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white";

export const NAV = [
  { href: "/dashboard", label: "Home", icon: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "M8 7V3m8 4V3M4 11h16M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" },
  { href: "/dashboard/leads", label: "Messages", icon: "M4 13h4l2 3h4l2-3h4M4 13l2.5-7h11L20 13v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5z" },
  { href: "/dashboard/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.4 2.5h4l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z" },
  { href: "/dashboard/billing", label: "Billing", icon: "M3 10h18M3 7a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" },
];

const FOOTER_NAV = [
  { href: "/admin", label: "Admin", icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" },
];

function BrandMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.3 1L7.2 11c1 2 2.8 3.8 4.8 4.8l1.2-1.6c.2-.3.6-.4 1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1C10.8 19 5 13.2 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavLink({ href, label, icon, active, onClick }: { href: string; label: string; icon: string; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
      {label}
    </Link>
  );
}

/** Desktop sidebar (Spec §3.4: dark Deep Trust Blue sidebar). */
export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-trust text-white md:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <BrandMark />
        </span>
        <span className="font-display text-lg font-bold">PulseDesk</span>
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={path === item.href} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        {FOOTER_NAV.map((item) => (
          <NavLink key={item.href} {...item} active={path === item.href} />
        ))}
        <SignOutButton className={NAV_ITEM_CLS} />
      </div>
    </aside>
  );
}

/** Mobile top bar + slide-down drawer (Spec §5: dashboard used from phones). */
export function MobileTopBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-trust px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <BrandMark />
          </span>
          <span className="font-display text-base font-bold">PulseDesk</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={close} />
          <nav className="fixed inset-x-0 top-[57px] z-40 space-y-1 border-b border-white/10 bg-trust px-3 py-3 text-white shadow-lift">
            {[...NAV, ...FOOTER_NAV].map((item) => (
              <NavLink key={item.href} {...item} active={path === item.href} onClick={close} />
            ))}
            <SignOutButton className={NAV_ITEM_CLS} onDone={close} />
          </nav>
        </>
      )}
    </div>
  );
}
