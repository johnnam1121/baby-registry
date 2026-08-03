import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/data/site-config";

/**
 * THE LINK PREVIEW IMAGE — what shows up when someone texts the URL.
 *
 * Without this file, iMessage/WhatsApp/Facebook each pick whatever photo
 * they happen to like off the page, which is why the same link showed
 * Benny to one person and a stroller to another. Naming a single image
 * here settles it: every app now shows this one.
 *
 * It is a redraw of the hero band at the top of the home page, not a
 * screenshot — same denim, same fonts, same words, laid out for a wide
 * 1200×630 card. It's generated once when the site builds, so there is
 * nothing to re-export by hand when the date or the name changes in
 * `site-config.ts`; it follows along.
 *
 * Note for anyone editing the layout below: this is drawn by Satori, not
 * a browser. Only flexbox works (no grid), and any element with more than
 * one child needs an explicit `display: "flex"`.
 */

export const alt = `${siteConfig.babyName}'s baby shower — ${siteConfig.event.dateLong}`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/* The hero's colours, copied from the `@theme` block in globals.css.
   Satori can't read Tailwind classes, so they're spelled out here — if
   you restyle the hero, these five are what to bring across. */
const denim = "#3f6a88";
const chalk = "#ffffff";
const chalkSoft = "#dbe7f1";

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

export default async function Image() {
  const [fraunces, frauncesItalic, karla, plexMono, teddy] = await Promise.all([
    font("Fraunces-SemiBold.ttf"),
    font("Fraunces-Italic.ttf"),
    font("Karla-Regular.ttf"),
    font("IBMPlexMono-SemiBold.ttf"),
    // The 🧸 that opens the hero. Bundled as a file rather than written as
    // an emoji character because Satori has no emoji font of its own — a
    // literal 🧸 would come out as an empty box.
    readFile(join(process.cwd(), "assets/teddy-bear.svg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          textAlign: "center",
          backgroundColor: denim,
          // The same wash the real hero has, from `.section--denim`.
          backgroundImage:
            "radial-gradient(130% 90% at 50% -10%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 62%)",
          fontFamily: "Karla",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws
            a flat PNG; next/image has no meaning inside it. */}
        <img src={`data:image/svg+xml;base64,${teddy}`} width={76} height={76} alt="" />

        <div
          style={{
            marginTop: 26,
            fontFamily: "IBM Plex Mono",
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: chalkSoft,
          }}
        >
          {siteConfig.hero.eyebrow}
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: "Fraunces",
            fontSize: 108,
            fontWeight: 600,
            lineHeight: 1.02,
            color: chalk,
          }}
        >
          {siteConfig.babyName}
        </div>

        {/* The hairline under the name — `.rule`, widened for this canvas. */}
        <div
          style={{
            marginTop: 34,
            width: 84,
            height: 2,
            backgroundColor: chalk,
            opacity: 0.35,
          }}
        />

        <div
          style={{
            marginTop: 34,
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontSize: 40,
            color: chalk,
          }}
        >
          {siteConfig.event.dateLong}
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 27,
            lineHeight: 1.45,
            color: chalkSoft,
            maxWidth: 780,
          }}
        >
          {`${siteConfig.event.timeStart} – ${siteConfig.event.timeEnd} · ${siteConfig.event.address.line2}`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Fraunces", data: frauncesItalic, style: "italic", weight: 400 },
        { name: "Karla", data: karla, style: "normal", weight: 400 },
        { name: "IBM Plex Mono", data: plexMono, style: "normal", weight: 600 },
      ],
    }
  );
}
