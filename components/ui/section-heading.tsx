import Link from "next/link";

type SectionHeadingProps = { title: string; eyebrow?: string; href?: string; linkLabel?: string };

export function SectionHeading({ title, eyebrow, href, linkLabel = "View all" }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="space-y-2">
        {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
        <h2 className="font-heading text-3xl uppercase tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}