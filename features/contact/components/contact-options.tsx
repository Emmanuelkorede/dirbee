import { ArrowUpRight, Mail } from "lucide-react";

import { InstagramIcon, TikTokIcon } from "@/components/navigation/footer";
import { siteConfig } from "@/data/site";

const options = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
    actionLabel: "Send email",
    ariaLabel: "Email House of Bee",
    icon: <Mail className="size-6" aria-hidden="true" />,
  },
  {
    label: "Instagram",
    value: "@directorbee_",
    href: siteConfig.instagramUrl,
    external: true,
    actionLabel: "Visit",
    ariaLabel: "House of Bee on Instagram (opens in a new tab)",
    icon: <InstagramIcon className="size-6" />,
  },
  {
    label: "TikTok",
    value: "@directorbee_",
    href: siteConfig.tiktokUrl,
    external: true,
    actionLabel: "Visit",
    ariaLabel: "House of Bee on TikTok (opens in a new tab)",
    icon: <TikTokIcon className="size-6" />,
  },
];

export function ContactOptions() {
  return (
    <ul className="grid max-w-3xl gap-4">
      {options.map((option) => (
        <li
          key={option.label}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {option.icon}
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {option.label}
              </p>
            </div>

            <a
              href={option.href}
              aria-label={option.ariaLabel}
              {...(option.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {option.actionLabel}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {/* Plain text: it can be highlighted and copied, and never wraps. */}
          <p className="mt-6 select-text whitespace-nowrap font-heading text-[length:clamp(0.75rem,4vw,1.25rem)]">
            {option.value}
          </p>
        </li>
      ))}
    </ul>
  );
}