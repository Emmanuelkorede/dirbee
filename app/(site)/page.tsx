import { DirectorPreview } from "@/components/sections/director-preview";
import { Hero } from "@/components/sections/hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeaturedProjects } from "@/features/projects/components/public/featured-projects";
import { getFeaturedProjects } from "@/features/projects/queries";
import { ReviewSection } from "@/features/reviews/components/public/review-section";
import { getFeaturedReviews } from "@/features/reviews/queries";

export default async function HomePage() {
  const [projects, reviews] = await Promise.all([getFeaturedProjects(10), getFeaturedReviews()]);

  return (
    <>
      <Hero />
      <FeaturedProjects projects={projects} />
      <DirectorPreview />

      {reviews.length > 0 && (
        <section className="pb-24 pt-8">
          <Container className="space-y-10">
            <SectionHeading title="Kind words" href="/reviews" linkLabel="Read more" />
            <ReviewSection reviews={reviews} />
          </Container>
        </section>
      )}
    </>
  );
}