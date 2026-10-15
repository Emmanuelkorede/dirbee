import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/data/site";

const options = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
    ariaLabel: "Email House of Bee",
  },
  {
    label: "Instagram",
    value: "@directorbee_",
    href: siteConfig.instagramUrl,
    external: true,
    ariaLabel: "House of Bee on Instagram (opens in a new tab)",
  },
  {
    label: "TikTok",
    value: "@directorbee_",
    href: siteConfig.tiktokUrl,
    external: true,
    ariaLabel: "House of Bee on TikTok (opens in a new tab)",
  },
];

export function ContactOptions() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {options.map((option) => (
        <li key={option.label}>
          <a
            href={option.href}
            aria-label={option.ariaLabel}
            {...(option.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group flex h-full flex-col justify-between gap-10 rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/40"
          >
            <ArrowUpRight
              className="size-5 self-end text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {option.label}
              </p>
              <p className="mt-1 break-all font-heading text-lg">
                {option.value}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}