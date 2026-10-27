import Link from "next/link";

import { RemoteImage } from "@/components/ui/remote-image";
import { cloudinaryImage } from "@/lib/cloudinary/delivery";

type ShootCardProps = {
  shoot: { slug: string; title: string; photoCount: number; coverUrl: string | null };
};

export function ShootCard({ shoot }: ShootCardProps) {
  return (
    <Link href={`/photography/${shoot.slug}`} className="group block">
      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        {shoot.coverUrl && (
          <RemoteImage
            src={cloudinaryImage(shoot.coverUrl, 900)}
            alt=""
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-heading text-lg uppercase tracking-tight">{shoot.title}</h3>
        <p className="text-sm text-muted-foreground">
          {shoot.photoCount} photo{shoot.photoCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}