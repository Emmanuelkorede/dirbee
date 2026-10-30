import { Mail } from "lucide-react";
import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { InstagramIcon, TikTokIcon } from "@/lib/custom-icons";
import { navLinks, siteInfo } from "@/lib/site";

type FooterProps = {
  instagramUrl: string | null;
  tiktokUrl: string | null;
  email: string | null;
};

const linkClass =
  "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground";

export function Footer({ instagramUrl, tiktokUrl, email }: FooterProps) {
  const year = new Date().getFullYear();
  const hasConnectLinks = Boolean(instagramUrl || tiktokUrl || email);

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10 md:pb-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-5">
            <BrandLockup orientation="horizontal" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteInfo.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Navigate
            </h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasConnectLinks && (
            <div>
              <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Connect
              </h2>
              <ul className="space-y-3">
                {instagramUrl && (
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="House of Bee on Instagram (opens in a new tab)"
                      className={linkClass}
                    >
                      <InstagramIcon className="size-5" />
                      Instagram
                    </a>
                  </li>
                )}
                {tiktokUrl && (
                  <li>
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="House of Bee on TikTok (opens in a new tab)"
                      className={linkClass}
                    >
                      <TikTokIcon className="size-5" />
                      TikTok
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      aria-label="Email House of Bee"
                      className={linkClass}
                    >
                      <Mail className="size-5" aria-hidden="true" />
                      Email
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-14 text-xs text-muted-foreground">
          © {year} {siteInfo.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}