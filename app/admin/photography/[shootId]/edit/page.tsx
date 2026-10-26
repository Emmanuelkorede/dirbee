import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { publishPhotoShootAction, unpublishPhotoShootAction } from "@/features/photography/actions";
import { PhotoManager } from "@/features/photography/components/admin/photo-manager";
import { PhotoUploader } from "@/features/photography/components/admin/photo-uploader";
import { ShootForm } from "@/features/photography/components/admin/shoot-form";
import { getPhotoShootById } from "@/features/photography/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = {
  params: Promise<{ shootId: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditPhotoShootPage({ params, searchParams }: Props) {
  await requireAdmin();

  const { shootId } = await params;
  const { created } = await searchParams;

  const shoot = await getPhotoShootById(shootId);
  if (!shoot) notFound();

  const { photos, ...details } = shoot; // the form only needs the shoot itself
  const published = shoot.status === "published";

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Edit photo shoot"
        title={shoot.title}
        actions={
          <>
            <Badge tone={published ? "success" : "warning"}>{published ? "Published" : "Draft"}</Badge>

            {published ? (
              <>
                <Link href={`/photography/${shoot.slug}`} target="_blank"
                  className={buttonStyles({ variant: "outline", size: "sm" })}>
                  View on site
                </Link>
                <ActionButton action={unpublishPhotoShootAction} id={shoot.id} variant="outline" size="sm">
                  Unpublish
                </ActionButton>
              </>
            ) : (
              <ActionButton action={publishPhotoShootAction} id={shoot.id} size="sm"
                disabled={photos.length === 0}
                title={photos.length === 0 ? "Add at least one photo first" : undefined}>
                Publish
              </ActionButton>
            )}
          </>
        }
      />

      {created && <Notice tone="success">Shoot created. Add photos below, then publish when you are ready.</Notice>}

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-tight">Details</h2>
        <ShootForm shoot={details} />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-tight">Add photos</h2>
        <PhotoUploader shootId={shoot.id} shootTitle={shoot.title} />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-tight">Photos ({photos.length})</h2>
        {/* The key rebuilds the manager when photos are added or removed. */}
        <PhotoManager
          key={photos.map((photo) => photo.id).sort().join()}
          shootId={shoot.id}
          photos={photos}
        />
      </section>
    </div>
  );
}