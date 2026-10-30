import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { getArtists } from "@/features/artists/queries";
import { getClients } from "@/features/clients/queries";
import { getPhotoShoots } from "@/features/photography/queries";
import { getAdminProjects } from "@/features/projects/queries";
import { getAdminReviews } from "@/features/reviews/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [projects, pendingReviews, shoots, artists, clients] = await Promise.all([
    getAdminProjects(),
    getAdminReviews({ status: "pending" }),
    getPhotoShoots(),
    getArtists(),
    getClients(),
  ]);

  const published = projects.filter((project) => project.status === "published").length;

  const cards = [
    { label: "Projects", href: "/admin/projects", value: projects.length, note: `${published} published, ${projects.length - published} drafts` },
    { label: "Pending reviews", href: "/admin/reviews", value: pendingReviews.length, note: "Waiting for your decision" },
    { label: "Photo shoots", href: "/admin/photography", value: shoots.length, note: "All galleries" },
    { label: "Artists", href: "/admin/artists", value: artists.length, note: "Available on projects" },
    { label: "Clients", href: "/admin/clients", value: clients.length, note: "Optional on projects" },
  ];

  return (
    <div className="space-y-10">
      <PageHeader title="Dashboard" description="A quick look at House of Bee." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
            <p className="mt-3 font-heading text-5xl">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}