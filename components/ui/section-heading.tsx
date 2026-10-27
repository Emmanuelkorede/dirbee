import Link from "next/link";

type SectionHeadingProps = { title: string; href?: string; linkLabel?: string };

export function SectionHeading({ title, href, linkLabel = "View all" }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}