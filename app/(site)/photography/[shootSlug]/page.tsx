import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { PhotoGallery } from "@/features/photography/components/public/photo-gallery";
import { getPhotoShootBySlug, getPublishedPhotoShoots } from "@/features/photography/queries";
import { cloudinaryImage } from "@/lib/cloudinary/delivery";

type Props = { params: Promise<{ shootSlug: string }> };

const loadShoot = cache(getPhotoShootBySlug);

export async function generateStaticParams() {
  const shoots = await getPublishedPhotoShoots();
  return shoots.map((shoot) => ({ shootSlug: shoot.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shootSlug } = await params;
  const shoot = await loadShoot(shootSlug);
  if (!shoot) return { title: "Gallery not found" };

  const cover = shoot.photos[0];

  return {
    title: shoot.title,
    description: shoot.description ?? `Photography from the ${shoot.title} shoot.`,
    openGraph: { images: cover ? [cloudinaryImage(cover.imageUrl, 1200)] : undefined },
  };
}

export default async function ShootPage({ params }: Props) {
  const { shootSlug } = await params;
  const shoot = await loadShoot(shootSlug);
  if (!shoot) notFound();

  return (
    <Container className="space-y-12 py-12 sm:py-16">
      <div className="space-y-8">
        <Link href="/photography" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All galleries
        </Link>
        <PageHeader title={shoot.title} description={shoot.description ?? undefined} />
      </div>

      <PhotoGallery photos={shoot.photos} title={shoot.title} />
    </Container>
  );
}