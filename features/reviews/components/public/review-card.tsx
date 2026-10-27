type ReviewCardProps = {
  review: { clientName: string; role: string | null; company: string | null; reviewText: string };
};

export function ReviewCard({ review }: ReviewCardProps) {
  const byline = [review.role, review.company].filter(Boolean).join(", ");

  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-8">
      <blockquote className="whitespace-pre-line leading-relaxed">“{review.reviewText}”</blockquote>
      <figcaption>
        <p className="font-heading text-sm uppercase tracking-[0.1em]">{review.clientName}</p>
        {byline && <p className="text-sm text-muted-foreground">{byline}</p>}
      </figcaption>
    </figure>
  );
}