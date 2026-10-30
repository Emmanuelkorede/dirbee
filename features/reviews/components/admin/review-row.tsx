import Link from "next/link";

import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { approveReviewAction, deleteReviewAction, rejectReviewAction } from "@/features/reviews/actions";
import type { Review } from "@/types/database";

const statusTone = { pending: "warning", approved: "success", rejected: "danger" } as const;
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function ReviewRow({ review }: { review: Review }) {
  const byline = [review.role, review.company].filter(Boolean).join(", ");

  return (
    <article className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-medium">{review.clientName}</h3>
          {byline && <p className="text-sm text-muted-foreground">{byline}</p>}
          <p className="text-xs text-muted-foreground">
            {review.email ?? "No email"} · Submitted {dateFormat.format(review.submittedAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone[review.status]}>{review.status}</Badge>
          <Badge tone={review.publicationConsent ? "success" : "danger"}>
            {review.publicationConsent ? "Consent given" : "No consent"}
          </Badge>
          {review.isFeatured && <Badge>Featured</Badge>}
          {review.submissionSource === "admin" && <Badge>Added by admin</Badge>}
        </div>
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed">{review.reviewText}</p>

      <div className="flex flex-wrap items-start gap-2">
        {review.status !== "approved" && (
          <ActionButton action={approveReviewAction} id={review.id} size="sm"
            disabled={!review.publicationConsent}
            title={review.publicationConsent ? undefined : "This reviewer did not agree to publication"}>
            Approve
          </ActionButton>
        )}
        {review.status !== "rejected" && (
          <ActionButton action={rejectReviewAction} id={review.id} variant="outline" size="sm"
            confirmMessage={review.status === "approved" ? "Reject this review? It will leave the site." : undefined}>
            Reject
          </ActionButton>
        )}
        <Link href={`/admin/reviews/${review.id}/edit`} className={buttonStyles({ variant: "outline", size: "sm" })}>
          Edit
        </Link>
        <ActionButton action={deleteReviewAction} id={review.id} variant="danger" size="sm"
          confirmMessage={`Delete the review from ${review.clientName} permanently?`}>
          Delete
        </ActionButton>
      </div>
    </article>
  );
}