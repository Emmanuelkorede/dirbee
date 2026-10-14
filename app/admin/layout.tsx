
import { requireAdmin } from "@/lib/auth/require-admin";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <>{children}</>;
}
