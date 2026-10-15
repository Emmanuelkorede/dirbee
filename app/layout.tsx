import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const headingFont = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "House of Bee",
    template: "%s | House of Bee",
  },
  description:
    "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",
};

// Runs before the page paints, so there is no flash of the wrong theme
// and no splash flicker for repeat visitors.
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
  try {
    if (sessionStorage.getItem("house-of-bee-splash-seen") === "true") {
      document.documentElement.setAttribute("data-splash-seen", "true");
    }
  } catch (e) {}
})();
`;

// Paints the correct background even before globals.css has loaded.
const criticalCss = `html{background-color:#f0eadc}html.dark{background-color:#241b14}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}