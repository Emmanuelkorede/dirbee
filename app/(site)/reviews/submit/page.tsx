import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ReviewSubmissionForm } from "@/features/reviews/components/public/review-submission-form";

export const metadata: Metadata = {
  title: "Leave a review",
  description: "Tell us about your experience working with House of Bee.",
};

export default function SubmitReviewPage() {
  return (
    <Container size="narrow" className="space-y-10 py-12 sm:py-20">
      <PageHeader
        eyebrow="Reviews"
        title="Leave a review"
        description="Reviews are checked before they appear on the site."
      />
      <ReviewSubmissionForm />
    </Container>
  );
}