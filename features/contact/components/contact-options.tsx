import { buttonStyles } from "@/components/ui/button";
import { InstagramIcon, TikTokIcon } from "@/lib/custom-icons";

type ContactOptionsProps = { instagramUrl: string | null; tiktokUrl: string | null };

export function ContactOptions({ instagramUrl, tiktokUrl }: ContactOptionsProps) {
  if (!instagramUrl && !tiktokUrl) return null;

  const pill = buttonStyles({ variant: "outline" });

  return (
    <section className="space-y-6 border-t border-border pt-12">
      <h2 className="font-heading text-2xl tracking-tight">Follow House of Bee</h2>

      <ul className="flex flex-wrap gap-3">
        {instagramUrl && (
          <li>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={pill}>
              <InstagramIcon className="size-4" />
              Instagram
            </a>
          </li>
        )}
        {tiktokUrl && (
          <li>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={pill}>
              <TikTokIcon className="size-4" />
              TikTok
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}