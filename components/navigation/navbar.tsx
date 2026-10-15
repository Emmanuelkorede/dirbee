"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { BeeLogo } from "@/components/brand/bee-logo";
import { MenuOverlay } from "@/components/navigation/menu-overlay";
import cn from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          open
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/60 bg-background/70 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            onClick={closeMenu}
            className="font-heading text-base uppercase tracking-[0.2em] sm:text-lg"
          >
            House of Bee
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            className="grid size-12 place-items-center rounded-lg transition-transform duration-200 hover:scale-105"
          >
            <motion.span
              className="block"
              animate={{ rotate: open ? 90 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <BeeLogo size={34} />
            </motion.span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={closeMenu} />
    </>
  );
}