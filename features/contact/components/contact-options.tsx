import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";

import { InstagramIcon, TikTokIcon } from "@/lib/custom-icons";

type ContactOptionsProps = { instagramUrl: string | null; tiktokUrl: string | null };

type Tile = {
  name: string;
  href: string;
  handle: string;
  Icon: ComponentType<{ className?: string }>;
};

// "https://www.instagram.com/directorbee_" -> "@directorbee_"
function handleFrom(url: string, fallback: string) {
  try {
    const first = new URL(url).pathname.split("/").filter(Boolean)[0];
    if (!first) return fallback;
    return first.startsWith("@") ? first : `@${first}`;
  } catch {
    return fallback;
  }
}

export function ContactOptions({ instagramUrl, tiktokUrl }: ContactOptionsProps) {
  const tiles: Tile[] = [];

  if (instagramUrl) {
    tiles.push({ name: "Instagram", href: instagramUrl, handle: handleFrom(instagramUrl, "Instagram"), Icon: InstagramIcon });
  }
  if (tiktokUrl) {
    tiles.push({ name: "TikTok", href: tiktokUrl, handle: handleFrom(tiktokUrl, "TikTok"), Icon: TikTokIcon });
  }

  if (tiles.length === 0) return null;

  return (
    <section className="space-y-8 border-t border-border pt-16">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">Follow along</h2>
        <p className="text-sm text-muted-foreground">Find House of Bee on social media.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {tiles.map(({ name, href, handle, Icon }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}, ${handle} (opens in a new tab)`}
              className="group flex items-start justify-between gap-6 rounded-2xl border border-border p-6 transition-colors hover:bg-card sm:p-8"
            >
              <span className="space-y-8">
                <Icon className="size-7" />
                <span className="block">
                  <span className="block font-heading text-2xl tracking-tight">{name}</span>
                  <span className="block text-sm text-muted-foreground">{handle}</span>
                </span>
              </span>

              <ArrowUpRight
                className="size-6 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}