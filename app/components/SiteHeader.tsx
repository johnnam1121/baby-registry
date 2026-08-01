"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";

/**
 * Deliberately small: the site is one long vertical page plus two side
 * pages, so the header only needs to get you home, over to Benny, and
 * into the form.
 *
 * RSVP stays the only filled button — the gallery link is quieter on
 * purpose so it never competes with the thing we actually need guests
 * to do.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [first, second] = siteConfig.coupleNames.split("&").map((s) => s.trim());
  const onGallery = pathname === "/benny";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-[680px] items-center justify-between gap-3 px-6 py-3.5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold text-deep"
        >
          <span aria-hidden="true">🧸</span>
          <span className="hidden sm:inline">
            {first} <span className="text-slate">&</span> {second}
          </span>
          <span className="sm:hidden">
            {first[0]} <span className="text-slate">&</span> {second[0]}
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <Link
            href="/benny"
            aria-current={onGallery ? "page" : undefined}
            className={`rounded-full px-3 py-2 text-[13.5px] font-semibold transition-colors ${
              onGallery
                ? "bg-paper-2 text-deep-2"
                : "text-ink-soft hover:bg-paper-2 hover:text-deep-2"
            }`}
          >
            <span aria-hidden="true" className="mr-1">
              🐶
            </span>
            {siteConfig.dog.name}
          </Link>

          <Link
            href="/rsvp"
            className="rounded-full bg-deep px-4 py-2 text-sm font-bold text-paper shadow-md shadow-deep/25 transition-transform hover:-translate-y-0.5"
          >
            RSVP
          </Link>
        </nav>
      </div>
    </header>
  );
}
