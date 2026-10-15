import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const headingFont = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase : new  URL("https://www.houseofbee.site/") ,

  title: {
    default: "House of Bee — Production Company",
    template: "%s | House of Bee",
  },
  description:
    "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",

    openGraph : {
    title: 'House of Bee — Production Company',
    description: 'House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.',
    type : 'website' ,
    siteName : 'House of Bee'

  } , 

  twitter: {
    card: 'summary_large_image',
    title: "House of Bee — Production Company",
    description: 'House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.',
  },

};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>
        {children}
        <Analytics />

      </body>
    </html>
  );
}