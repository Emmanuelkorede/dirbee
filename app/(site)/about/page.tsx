import type { Metadata } from "next";

import { AboutContent } from "@/components/sections/about-content";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "House of Bee is a premium creative production house specializing in high-concept music visuals, multi-platform artist content, and cinematic storytelling.",
};

export default function AboutPage() {
  return (
    <Container size="medium" className="space-y-14 py-12 sm:py-20">
      <PageHeader size="large" title="About" />
      <AboutContent />
    </Container>
  );
}