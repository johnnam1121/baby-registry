import type { Metadata } from "next";
import Link from "next/link";
import RsvpForm from "./RsvpForm";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `RSVP — ${siteConfig.babyName}'s Baby Shower`,
  description: `RSVP for ${siteConfig.babyName}'s baby shower on ${siteConfig.event.dateLong}.`,
};

export default function RsvpPage() {
  const { event } = siteConfig;

  return (
    <main className="mx-auto max-w-[680px] px-6 pb-20 pt-12">
      <Link
        href="/"
        className="mb-8 inline-block text-[14px] font-bold text-deep underline underline-offset-2"
      >
        ← Back to the details
      </Link>

      <p className="eyebrow mb-2">RSVP</p>
      <h1 className="mb-4 font-display text-4xl font-semibold leading-tight text-deep-2">
        {siteConfig.babyName}&apos;s Baby Shower
      </h1>
      <p className="mb-9 text-[16px] leading-relaxed text-ink-soft">
        {event.dateLong} · {event.timeStart} – {event.timeEnd} ·{" "}
        {event.address.line2}
        <br />
        Please reply by{" "}
        <strong className="text-deep-2">{siteConfig.rsvp.deadline}</strong>.
      </p>

      <RsvpForm />
    </main>
  );
}
