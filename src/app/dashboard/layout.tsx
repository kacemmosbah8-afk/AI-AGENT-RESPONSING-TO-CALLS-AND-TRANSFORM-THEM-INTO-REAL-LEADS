import { Sidebar, MobileTopBar } from "@/components/Sidebar";

// Always render per-request so tenant data/session is never statically cached.
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <MobileTopBar />
      <div className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
