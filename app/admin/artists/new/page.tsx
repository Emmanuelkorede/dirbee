import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { createArtistAction } from "@/features/artists/actions";
import { PERSON_KIND_OPTIONS } from "@/features/artists/options";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewTalentPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader title="Add talent" />
      <NameForm
        action={createArtistAction}
        label="Name"
        listHref="/admin/artists"
        submitLabel="Add"
        kindOptions={PERSON_KIND_OPTIONS}
        kindHint="Artist for music videos. Starring for Editorials / Fashion Film."
      />
    </div>
  );
}