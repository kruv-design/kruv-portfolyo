import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { ToastHost } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--adm-bg)" }}
    >
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto px-10 py-8">
        {children}
      </main>
      <ToastHost />
    </div>
  );
}
