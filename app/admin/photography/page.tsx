import Link from "next/link";

import { AdminTable, Td, Th, Tr } from "@/components/admin/admin-table";
import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  deletePhotoShootAction,
  publishPhotoShootAction,
  unpublishPhotoShootAction,
} from "@/features/photography/actions";
import { getPhotoShoots } from "@/features/photography/queries";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cloudinaryImage } from "@/lib/cloudinary/delivery";

export default async function AdminPhotographyPage() {
  await requireAdmin();
  const shoots = await getPhotoShoots();

  const newLink = (
    <Link href="/admin/photography/new" className={buttonStyles()}>
      New shoot
    </Link>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Photography"
        description="Each shoot is a gallery. Add photos, then publish it when it is ready."
        actions={newLink}
      />

      {shoots.length === 0 ? (
        <EmptyState title="No shoots yet" description="Create your first gallery." action={newLink} />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Shoot</Th>
              <Th>Photos</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {shoots.map((shoot) => {
              const published = shoot.status === "published";

              return (
                <Tr key={shoot.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      {shoot.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cloudinaryImage(shoot.coverUrl, 160)}
                          alt=""
                          loading="lazy"
                          className="size-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-14 rounded-lg bg-muted" />
                      )}
                      <Link href={`/admin/photography/${shoot.id}/edit`} className="font-medium hover:underline">
                        {shoot.title}
                      </Link>
                    </div>
                  </Td>
                  <Td>{shoot.photoCount}</Td>
                  <Td>
                    <Badge tone={published ? "success" : "warning"}>{published ? "Published" : "Draft"}</Badge>
                  </Td>
                  <Td>
                    <div className="flex items-start justify-end gap-2">
                      <Link href={`/admin/photography/${shoot.id}/edit`}
                        className={buttonStyles({ variant: "outline", size: "sm" })}>
                        Edit
                      </Link>

                      {published ? (
                        <ActionButton action={unpublishPhotoShootAction} id={shoot.id} variant="outline" size="sm">
                          Unpublish
                        </ActionButton>
                      ) : (
                        <ActionButton action={publishPhotoShootAction} id={shoot.id} size="sm"
                          disabled={shoot.photoCount === 0}
                          title={shoot.photoCount === 0 ? "Add at least one photo first" : undefined}>
                          Publish
                        </ActionButton>
                      )}

                      <ActionButton action={deletePhotoShootAction} id={shoot.id} variant="danger" size="sm"
                        confirmMessage={`Delete "${shoot.title}" and its ${shoot.photoCount} photo(s)? The images are also removed from Cloudinary.`}>
                        Delete
                      </ActionButton>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}