"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle between light and dark theme"
      className={[
        "grid size-11 place-items-center rounded-full",
        "border border-border bg-background/70 text-foreground",
        "shadow-sm backdrop-blur-md",
        "transition-colors duration-200 hover:bg-card",
        className,
      ].join(" ")}
    >
      {/* Shown in light mode: click to go dark */}
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      {/* Shown in dark mode: click to go light */}
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  );
}