import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const headingFont = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.houseofbee.site/"),

  title: {
    default: "House of Bee — Production Company",
    template: "%s | House of Bee",
  },
  description:
    "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",

  openGraph: {
    title: "House of Bee — Production Company",
    description:
      "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",
    type: "website",
    siteName: "House of Bee",
  },

  twitter: {
    card: "summary_large_image",
    title: "House of Bee — Production Company",
    description:
      "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",
  },
};

// Runs before the page paints, so there is no flash of the wrong theme.
// Saved preference wins; otherwise the operating system preference is used.
// Admin, auth and API routes are left alone.
const themeInitScript = `
(function () {
  try {
    if (/^\\/(admin|auth|api)(\\/|$)/.test(location.pathname)) return;
    var saved = localStorage.getItem("house-of-bee-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}