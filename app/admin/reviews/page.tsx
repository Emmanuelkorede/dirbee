import Link from "next/link";

import { FeaturedEditor } from "@/features/projects/components/admin/featured-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { setFeaturedReviewsAction } from "@/features/reviews/actions";
import { ReviewRow } from "@/features/reviews/components/admin/review-row";
import { getAdminReviews } from "@/features/reviews/queries";
import { requireAdmin } from "@/lib/auth/require-admin";
import { buttonStyles } from "@/components/ui/button";

import cn from "@/lib/utils";

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
] as const;

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminReviewsPage({ searchParams }: Props) {
  await requireAdmin();

  const { status } = await searchParams;
  const filter = FILTERS.find((item) => item.key === status)?.key ?? "pending";

  const all = await getAdminReviews();
  const shown = filter === "all" ? all : all.filter((review) => review.status === filter);

  const approved = all.filter((review) => review.status === "approved");
  const featuredIds = approved
    .filter((review) => review.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((review) => review.id);

  const count = (key: (typeof FILTERS)[number]["key"]) =>
    key === "all" ? all.length : all.filter((review) => review.status === key).length;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Reviews"
        description="Reviews appear on the site only after you approve them, and only when reviews are switched on in Settings."
        actions={
          <Link href="/admin/reviews/new" className={buttonStyles()}>
            Add review
          </Link>
        }
      />

      <section className="space-y-6">
        <nav aria-label="Filter reviews" className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Link
              key={item.key}
              href={`/admin/reviews?status=${item.key}`}
              aria-current={filter === item.key ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
                filter === item.key
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              {item.label} ({count(item.key)})
            </Link>
          ))}
        </nav>

        {shown.length === 0 ? (
          <EmptyState title="Nothing here" description="No reviews match this filter." />
        ) : (
          <div className="max-w-3xl space-y-4">
            {shown.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-heading text-2xl uppercase tracking-tight">Homepage testimonials</h2>
          <p className="text-sm text-muted-foreground">
            Only approved reviews can be featured. They show on the homepage if that is switched on in Settings.
          </p>
        </div>

        <FeaturedEditor
          action={setFeaturedReviewsAction}
          options={approved.map((review) => ({
            id: review.id,
            label: `${review.clientName}: ${review.reviewText.slice(0, 50)}${review.reviewText.length > 50 ? "…" : ""}`,
          }))}
          initialIds={featuredIds}
          max={20}
          addLabel="Add an approved review..."
          emptyText="No featured reviews yet."
          saveLabel="Save featured reviews"
          successText="Featured reviews saved."
        />
      </section>
    </div>
  );
}