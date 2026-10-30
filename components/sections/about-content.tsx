import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PROJECT_TYPE_OPTIONS } from "@/features/projects/options";

const rows = [
  {
    label: "What House of Bee does",
    text: "House of Bee is a premium creative production house specializing in high-concept music visuals, multi-platform artist content, and cinematic storytelling. Born in Lagos and engineered for the global stage, we translate musical eras into distinct visual universes. We don’t just film projects; we build the visual infrastructure that defines an artist’s identity.",
  },
  {
    label: "Creative approach",
    text: "We take projects from their sonic roots and map out an end-to-end visual rollout strategy, blending collaborative world-building with high-end digital cinema execution to turn an artist’s music into a cohesive, culturally resonant visual universe.",
  },
  {
    label: "Vision",
    text: "To pioneer the next era of African visual storytelling by creating timeless, culture-shifting imagery. We believe that in a fast-moving digital landscape, narrative longevity is everything. Our vision is to empower African creatives and position artists for global recognition through uncompromising visual art and strategy.",
  },
];

const rowClass = "grid gap-4 border-t border-border py-10 md:grid-cols-[1fr_2fr] md:gap-12";
const labelClass = "font-heading text-xl tracking-tight";

export function AboutContent() {
  return (
    <div>
      {rows.map((row) => (
        <Reveal key={row.label} className={rowClass}>
          <h2 className={labelClass}>{row.label}</h2>
          <p className="leading-relaxed text-foreground/80">{row.text}</p>
        </Reveal>
      ))}

      <Reveal className={rowClass}>
        <h2 className={labelClass}>Production services</h2>
        <ul className="divide-y divide-border border-b border-border">
          {PROJECT_TYPE_OPTIONS.map((option) => (
            <li key={option.value} className="py-3 text-sm font-medium">{option.label}</li>
          ))}
        </ul>
      </Reveal>

      <div className="border-t border-border pt-10">
        <Link href="/contact" className={buttonStyles()}>Work with House of Bee</Link>
      </div>
    </div>
  );
}