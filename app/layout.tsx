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
  metadataBase : new URL("https://www.houseofbee.site/"),

  title: {
    default: "House of Bee",
    template: "%s | House of Bee",
  },

  description:
    "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",

    openGraph: {
      title : "House of Bee",
      description:"House of Bee is a creative production house for music visuals, artist content and cinematic storytelling, led by Director Bee.",
      siteName : "House of Bee" , 
      type: "website"
    }
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable}`}>
      
      <body>
        {children}
      </body>

    </html>
  );
}