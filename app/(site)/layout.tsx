import type { ReactNode } from "react";

import { SplashScreen } from "@/components/brand/splash-screen";
import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

// Runs before the page paints, so there is no flash of the wrong theme.
// Saved preference wins; otherwise the operating system preference is used.
const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("house-of-bee-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

      <ThemeProvider>
        <SplashScreen />
        <Navbar />

        {/* The navbar is fixed, so each page adds its own top padding
            (for example pt-28) unless it has a full-bleed hero. */}
        <main id="main-content">{children}</main>

        <Footer />

        {/* Floating theme control: desktop only. On mobile the switcher
            lives inside the menu overlay. */}
        <div className="fixed bottom-6 left-6 z-40 hidden md:block">
          <ThemeSwitcher />
        </div>
      </ThemeProvider>
    </>
  );
}