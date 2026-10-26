import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { createArtistAction } from "@/features/artists/actions";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewArtistPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader title="New artist" />
      <NameForm
        action={createArtistAction}
        label="Artist name"
        listHref="/admin/artists"
        submitLabel="Create artist"
        hint="The page URL is created from the name."
      />
    </div>
  );
}