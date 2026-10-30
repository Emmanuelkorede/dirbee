import { PageHeader } from "@/components/ui/page-header";
import { ReviewForm } from "@/features/reviews/components/admin/review-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewReviewPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add review"
        description="For a review you received another way, for example by message. It goes live straight away."
      />
      <ReviewForm />
    </div>
  );
}