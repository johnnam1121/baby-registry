import type { Metadata } from "next";
import { Fraunces, Karla, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { siteConfig } from "@/data/site-config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: `${siteConfig.babyName}'s Baby Shower`,
  description:
    `Join ${siteConfig.coupleNames} for a baby shower on ` +
    `${siteConfig.event.dateLong}, ${siteConfig.event.timeStart}–${siteConfig.event.timeEnd}, ` +
    `in ${siteConfig.event.address.line2}.`,
};

// ---------------------------------------------------------------------
// COLORS LIVE ELSEWHERE: this file only wires up fonts + page metadata.
// To change the palette, edit the `@theme` block at the top of
// `app/globals.css` — every component reads its colors from those
// variables through Tailwind classes like `bg-paper` / `text-deep`.
// Change a hex value there and the whole site updates.
// ---------------------------------------------------------------------

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${karla.variable} ${plexMono.variable} font-body bg-bg text-ink antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
