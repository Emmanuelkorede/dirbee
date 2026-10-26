import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { FeaturedEditor } from "@/features/projects/components/admin/featured-editor";
import { setFeaturedProjectsAction } from "@/features/projects/actions";
import { ProjectsTable } from "@/features/projects/components/admin/projects-table";
import { getAdminProjects } from "@/features/projects/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getAdminProjects();

  const published = projects.filter((project) => project.status === "published");
  const featuredIds = projects
    .filter((project) => project.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((project) => project.id);

  const newLink = (
    <Link href="/admin/projects/new" className={buttonStyles()}>
      New project
    </Link>
  );

  return (
    <div className="space-y-12">
      <PageHeader
        title="Projects"
        description="A project needs at least one artist, and a synced Wistia video before it can be published."
        actions={newLink}
      />

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create your first project." action={newLink} />
      ) : (
        <ProjectsTable projects={projects} />
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-heading text-2xl uppercase tracking-tight">Homepage featured</h2>
          <p className="text-sm text-muted-foreground">Up to 10 published projects, in the order shown on the homepage.</p>
        </div>

        <FeaturedEditor
          action={setFeaturedProjectsAction}
          options={published.map((project) => ({ id: project.id, label: project.title }))}
          initialIds={featuredIds}
          max={10}
          addLabel="Add a published project..."
          emptyText="Nothing is featured on the homepage yet."
          saveLabel="Save homepage order"
          successText="Homepage order saved."
        />
      </section>
    </div>
  );
}