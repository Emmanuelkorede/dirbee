"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { navLinks } from "@/data/site";
import cn from "@/lib/utils";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Escape key + background scroll lock while the menu is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center bg-background/90 px-6 backdrop-blur-2xl sm:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
        >
          <nav aria-label="Main" className="mx-auto w-full max-w-7xl">
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-2 sm:space-y-3"
            >
              {navLinks.map((link, index) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.li key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex items-baseline gap-4 py-1 font-heading text-4xl uppercase tracking-tight transition-colors sm:text-6xl",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/55 hover:text-foreground"
                      )}
                    >
                      <span className="w-6 text-xs tracking-widest text-muted-foreground sm:w-8 sm:text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Mobile only: the floating switcher is hidden below md. */}
          <div className="absolute bottom-6 left-6 md:hidden">
            <ThemeSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}