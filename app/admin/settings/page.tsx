import { PageHeader } from "@/components/ui/page-header";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { getSiteSettings } from "@/features/settings/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Controls for reviews and the links in the site footer." />
      <SettingsForm settings={settings} />
    </div>
  );
}