"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

import { BeeLogo } from "@/components/brand/bee-logo";
import type { Project } from "@/data/projects";
import cn from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  thumbnailUrl?: string | null;
  index?: number;
  className?: string;
};

export function ProjectCard({
  project,
  thumbnailUrl,
  index = 0,
  className,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className={cn("group", className)}
      initial={
        prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : (index % 3) * 0.07,
      }}
    >
      <Link href={`/work/${project.slug}`} className="block rounded-xl">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-foreground/15">
              <BeeLogo size={72} />
            </div>
          )}

          <div className="absolute inset-0 grid place-items-center bg-espresso/0 transition-colors duration-300 group-hover:bg-espresso/35 group-focus-within:bg-espresso/35">
            <span className="grid size-12 scale-90 place-items-center rounded-full bg-ivory text-espresso opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
              <Play className="size-5 translate-x-px" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {project.artist}
          </p>
          <h3 className="font-heading text-xl underline-offset-4 group-hover:underline">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">{project.type}</p>
        </div>
      </Link>
    </motion.article>
  );
}