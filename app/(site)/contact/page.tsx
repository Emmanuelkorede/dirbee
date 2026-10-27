import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactOptions } from "@/features/contact/components/contact-options";
import { getSiteSettings } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with House of Bee.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container size="narrow" className="space-y-16 py-12 sm:py-20">
      <div className="space-y-6">
        <PageHeader
          size="large"
          title="Contact"
          description="Tell us about the artist, the song and what you have in mind."
        />

        {settings.contactEmail && (
          <p className="text-sm text-muted-foreground">
            Prefer email?{" "}
            <a href={`mailto:${settings.contactEmail}`} className="text-foreground underline underline-offset-4">
              {settings.contactEmail}
            </a>
          </p>
        )}
      </div>

      <ContactForm />

      <ContactOptions instagramUrl={settings.instagramUrl} tiktokUrl={settings.tiktokUrl} />
    </Container>
  );
}