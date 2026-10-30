"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import cn from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "grid size-11 place-items-center rounded-full",
        "border border-border bg-background/70 text-foreground",
        "shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-card",
        className,
      )}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
    </button>
  );
}