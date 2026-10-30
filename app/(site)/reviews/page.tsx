import type { Metadata } from "next";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ReviewSection } from "@/features/reviews/components/public/review-section";
import { getPublicReviews } from "@/features/reviews/queries";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What clients and artists say about working with House of Bee.",
};

export default async function ReviewsPage() {
  const reviews = await getPublicReviews(); // empty when reviews are switched off in Settings

  const submitLink = (
    <Link href="/reviews/submit" className={buttonStyles({ variant: "outline" })}>
      Leave a review
    </Link>
  );

  return (
    <Container className="space-y-12 py-12 sm:py-20">
      <PageHeader eyebrow="Testimonials" title="Reviews" description="What clients and artists say about working with us." actions={submitLink} />

      {reviews.length === 0 ? (
        <EmptyState title="No reviews to show yet" description="Worked with us? We would love to hear from you." action={submitLink} />
      ) : (
        <ReviewSection reviews={reviews} />
      )}
    </Container>
  );
}