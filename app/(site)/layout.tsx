import type { ReactNode } from "react";

import { SplashScreen } from "@/components/brand/splash-screen";
import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { getSiteSettings } from "@/features/settings/queries";

// Safety net: every public page regenerates at most once a day,
// even if nobody saves anything in the admin.
export const revalidate = 86400;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    
    <div className="overflow-x-clip">
      <SplashScreen />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <Navbar />
      <main id="main-content" className="pt-18">{children}</main>

      <Footer
        instagramUrl={settings.instagramUrl}
        tiktokUrl={settings.tiktokUrl}
        email={settings.contactEmail}
      />

      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <ThemeSwitcher />
      </div>
    </div>
  );
}