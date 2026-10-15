import type { Metadata } from "next";

import { ContactOptions } from "@/components/contact/contact-options";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with House of Bee.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 sm:px-10">
      <h1 className="font-heading text-5xl uppercase tracking-tight sm:text-7xl">
        Contact
      </h1>

      {/* PLACEHOLDER COPY */}
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        Have a project in mind? Send an email or reach out on social media.
      </p>

      <div className="mt-12">
        <ContactOptions />
      </div>
    </div>
  );
}