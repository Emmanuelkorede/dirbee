import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactOptions } from "@/features/contact/components/contact-options";
import { EmailLink } from "@/features/contact/components/email-link";
import { getSiteSettings } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with House of Bee.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container size="medium" className="space-y-20 py-12 sm:py-20">
      <header className="space-y-10">
        <PageHeader
          size="large"
          title="Contact"
          description="Tell us about the artist, the song and what you have in mind."
        />

        {settings.contactEmail && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Prefer email?</p>
            <EmailLink email={settings.contactEmail} />
          </div>
        )}
      </header>

      <ContactForm />

      <ContactOptions instagramUrl={settings.instagramUrl} tiktokUrl={settings.tiktokUrl} />
    </Container>
  );
}