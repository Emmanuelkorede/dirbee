import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { ReviewForm } from "@/features/reviews/components/admin/review-form";
import { getReviewById } from "@/features/reviews/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = { params: Promise<{ reviewId: string }> };

export default async function EditReviewPage({ params }: Props) {
  await requireAdmin();

  const { reviewId } = await params;
  const review = await getReviewById(reviewId);
  if (!review) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit review"
        description="Status and consent are not changed here. Use Approve or Reject on the reviews list."
      />
      <ReviewForm review={review} />
    </div>
  );
}