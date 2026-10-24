import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[16rem_1fr]">
      <AdminSidebar userEmail={user.email} />
      <main className="min-w-0 px-6 py-8 sm:px-10 sm:py-12">{children}</main>
    </div>
  );
}