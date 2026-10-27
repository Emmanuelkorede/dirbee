import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ShootGrid } from "@/features/photography/components/public/shoot-grid";
import { getPublishedPhotoShoots } from "@/features/photography/queries";

export const metadata: Metadata = {
  title: "Photography",
  description: "Photography from House of Bee shoots.",
};

export default async function PhotographyPage() {
  const shoots = await getPublishedPhotoShoots();

  return (
    <Container className="space-y-12 py-12 sm:py-20">
      <PageHeader eyebrow="Gallery" title="Photography" description="Stills from our shoots." />

      {shoots.length === 0 ? (
        <EmptyState title="Galleries coming soon" description="New shoots will appear here." />
      ) : (
        <ShootGrid shoots={shoots} />
      )}
    </Container>
  );
}