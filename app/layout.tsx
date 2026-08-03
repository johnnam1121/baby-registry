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

const title = `${siteConfig.babyName}'s Baby Shower`;
const description =
  `Join ${siteConfig.coupleNames} for a baby shower on ` +
  `${siteConfig.event.dateLong}, ${siteConfig.event.timeStart}–${siteConfig.event.timeEnd}, ` +
  `in ${siteConfig.event.address.line2}.`;

/**
 * Where the site lives. Only used to turn the link-preview image into an
 * absolute URL, which iMessage and Facebook both insist on.
 *
 * This normally needs no attention: Vercel fills its own domain in at
 * build time. To point it somewhere else, set `siteUrl` in
 * `app/data/site-config.ts`. The localhost fallback is for `npm run dev`.
 */
const vercelDomain =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

const siteUrl =
  siteConfig.siteUrl ||
  (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // The preview card apps show when the link is texted or posted. The
  // image itself is drawn by `app/opengraph-image.tsx`; Next.js finds it
  // by filename and fills in the og:image tags, so it isn't listed here.
  openGraph: {
    type: "website",
    url: "/",
    siteName: title,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
