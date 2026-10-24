import type { ReactNode } from "react";

import { SplashScreen } from "@/components/brand/splash-screen";
import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SplashScreen />
      <Navbar />

      <main id="main-content">{children}</main>

      <Footer />

      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <ThemeSwitcher />
      </div>
      
    </ThemeProvider>
  );
}