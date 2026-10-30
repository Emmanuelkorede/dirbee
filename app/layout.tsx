import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";


import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteInfo } from "@/lib/site";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: { default: siteInfo.name, template: `%s | ${siteInfo.name}` },
  description: siteInfo.description,
  openGraph: {
    title: siteInfo.name,
    description: siteInfo.description,
    siteName: siteInfo.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}