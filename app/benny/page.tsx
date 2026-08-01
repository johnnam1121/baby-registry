import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bennyPhotos } from "@/data/benny-photos";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Meet ${siteConfig.dog.name} — ${siteConfig.babyName}'s Baby Shower`,
  description: `A gallery of ${siteConfig.dog.name}, ${siteConfig.coupleNames}'s ${siteConfig.dog.breed} and the baby's big brother.`,
};

export default function BennyPage() {
  const { dog } = siteConfig;

  return (
    <main className="mx-auto max-w-[900px] px-6 pb-24 pt-12">
      <Link
        href="/"
        className="mb-8 inline-block text-[14px] font-bold text-deep underline underline-offset-2"
      >
        ← Back to the shower details
      </Link>

      <header className="mb-12 text-center">
        <p className="eyebrow mb-3">The big brother</p>
        <h1 className="mb-5 font-display text-5xl font-semibold leading-tight text-deep-2">
          Meet {dog.name}
        </h1>
        <p className="mx-auto max-w-[52ch] text-[17px] leading-relaxed text-ink-soft">
          {dog.bio}
        </p>

        <dl className="mx-auto mt-9 grid max-w-[520px] grid-cols-3 gap-3">
          <Fact label="Breed" value={dog.breed} />
          <Fact label="Specialty" value={dog.specialty} />
          <Fact label="Status" value="Big brother" />
        </dl>
      </header>

      {/* CSS columns give a masonry layout that keeps every photo at its
          own aspect ratio, with no JavaScript and no cropping. */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {bennyPhotos.map((photo, i) => (
          <figure key={photo.src} className="card mb-5 break-inside-avoid overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              priority={i < 3}
              className="h-auto w-full"
            />
            <figcaption className="px-4 py-3 text-[14px] font-bold text-deep-2">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 text-center">
        <p className="mb-7 font-display text-xl italic text-ink-soft">
          He&apos;s counting on you to bring him a treat.
        </p>
        <Link href="/rsvp" className="btn-primary">
          RSVP to the shower
        </Link>
      </div>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-3">
      <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </dt>
      <dd className="text-[13.5px] font-bold leading-tight text-deep-2">{value}</dd>
    </div>
  );
}
