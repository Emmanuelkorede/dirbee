import { Reveal } from "@/components/ui/reveal";
import { ReviewCard } from "./review-card";

type Review = { id: string; clientName: string; role: string | null; company: string | null; reviewText: string };

export function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <Reveal key={review.id} delay={Math.min(index, 3) * 0.08}>
          <ReviewCard review={review} />
        </Reveal>
      ))}
    </div>
  );
}