import Image from "next/image";
import Link from "next/link";
import AmazonRegistryButton from "@/components/AmazonRegistryButton";
import CopyButton from "@/components/CopyButton";
import { fullAddress, mapEmbedUrl, mapLinkUrl, siteConfig } from "@/data/site-config";

const { event, gifts, contact, hero, dog } = siteConfig;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[680px] px-6 pb-20">
      <Hero />
      <Details />
      <Gifts />
      <Rsvp />
      <MeetBenny />
      <Questions />
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="border-b border-line py-16 text-center md:py-24">
      <p className="mb-5 text-4xl" aria-hidden="true">
        🧸
      </p>
      <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {hero.eyebrow}
      </p>
      <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] text-deep-2 md:text-6xl">
        {siteConfig.babyName}
      </h1>
      <p className="mb-8 font-display text-xl italic text-deep">{event.dateLong}</p>
      <p className="mx-auto mb-9 max-w-[42ch] text-[17px] leading-relaxed text-ink-soft">
        {hero.subhead}
      </p>
      <Link href="/rsvp" className="btn-primary">
        RSVP
      </Link>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Details() {
  return (
    <Section eyebrow="The Details" title="When & where">
      <div className="card p-7">
        <dl className="space-y-6">
          <Row label="Date">
            <p className="text-[17px] font-bold text-deep-2">{event.dateLong}</p>
          </Row>

          <Row label="Time">
            <p className="text-[17px] font-bold text-deep-2">
              {event.timeStart} – {event.timeEnd}
            </p>
          </Row>

          <Row label="Where">
            <p className="text-[17px] font-bold text-deep-2">{event.address.line1}</p>
            <p className="text-[15px] text-ink-soft">{event.address.line2}</p>
            <a
              href={mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[14px] font-bold text-deep underline underline-offset-2"
            >
              Open in Maps →
            </a>
          </Row>

          <Row label="Good to know">
            <ul className="space-y-1.5">
              {event.notes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-[15px] text-ink">
                  <span aria-hidden="true" className="mt-0.5 text-deep">
                    •
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Row>
        </dl>
      </div>

      {/* The bar under the map matters on phones: tapping it hands the
          address to whatever maps app the guest actually uses, which the
          embedded iframe on its own won't do. */}
      <div className="card mt-5 overflow-hidden">
        <iframe
          src={mapEmbedUrl}
          title={`Map showing ${fullAddress}`}
          className="block h-[280px] w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={mapLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5 text-[14px] font-bold text-deep transition-colors hover:bg-paper-2"
        >
          <span>{fullAddress}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Gifts() {
  return (
    <Section eyebrow="Gifts" title="If you'd like to bring something" banded>
      <div className="card p-7">
        <p className="mb-7 text-[16px] leading-relaxed text-ink">
          Your presence is honestly the whole point — but a few people have asked, so
          here it is.{" "}
          <strong className="text-deep-2">
            A cash gift is the most helpful thing by far
          </strong>
          : no shipping, no returns, no fees, and it goes straight toward what we still
          need.
        </p>

        <div className="rounded-xl2 border-[1.5px] border-gold bg-gold/30 p-5">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-deep-2/80">
            Venmo or Zelle
          </p>
          <div className="space-y-3">
            <Handle method="Venmo" value={gifts.venmoHandle} />
            <Handle method="Zelle" value={gifts.zelleHandle} />
          </div>
        </div>

        <div className="my-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            or shop the registry
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <AmazonRegistryButton />
      </div>
    </Section>
  );
}

function Handle({ method, value }: { method: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3">
      <span className="w-14 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {method}
      </span>
      <span className="flex-1 truncate text-[15px] font-bold text-deep-2">{value}</span>
      <CopyButton text={value} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Rsvp() {
  return (
    <Section eyebrow="RSVP" title="Let us know you're coming">
      <div className="card p-8 text-center">
        <p className="mx-auto mb-7 max-w-[40ch] text-[16px] leading-relaxed text-ink-soft">
          It takes about a minute, and it tells us how much food to plan for. Please
          reply by <strong className="text-deep-2">{siteConfig.rsvp.deadline}</strong>.
        </p>
        <Link href="/rsvp" className="btn-primary">
          RSVP now
        </Link>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function MeetBenny() {
  return (
    <Section eyebrow="The big brother" title={`Say hi to ${dog.name}`} banded>
      <Link
        href="/benny"
        className="card group flex flex-col items-center gap-5 overflow-hidden p-6 text-center transition-transform hover:-translate-y-0.5 sm:flex-row sm:text-left"
      >
        <Image
          src="/benny/big-brother.jpg"
          alt={`${dog.name} wearing a bandana that reads 'big brother'`}
          width={1536}
          height={2048}
          sizes="140px"
          className="h-[140px] w-[140px] shrink-0 rounded-xl2 object-cover object-top"
        />
        <span>
          <span className="mb-2 block font-display text-2xl font-semibold text-deep-2">
            He&apos;s taking the promotion well
          </span>
          <span className="mb-3 block text-[15px] leading-relaxed text-ink-soft">
            {dog.name} has been the baby of this house for years, and he has opinions
            about the new arrival. There are pictures.
          </span>
          <span className="text-[14.5px] font-bold text-deep group-hover:underline">
            See the whole gallery →
          </span>
        </span>
      </Link>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Questions() {
  return (
    <Section eyebrow="Questions?" title="Just reach out">
      <div className="card p-7">
        <p className="mb-6 text-[16px] leading-relaxed text-ink-soft">
          Anything at all — directions, what to bring, who else is coming. Text or email
          us and we&apos;ll get right back to you.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={`sms:${contact.phoneRaw}`} className="contact-tile">
            <span className="contact-tile-label">Text us</span>
            <span className="contact-tile-value">{contact.phoneDisplay}</span>
          </a>
          <a href={`mailto:${contact.email}`} className="contact-tile">
            <span className="contact-tile-label">Email us</span>
            <span className="contact-tile-value">{contact.email}</span>
          </a>
        </div>
      </div>

      <p className="mt-12 text-center font-display text-lg italic text-ink-soft">
        Can&apos;t wait to see you. — {siteConfig.coupleNames}
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * `banded` sits the section on a tinted block instead of the bare page.
 * Alternating them down the page breaks up what would otherwise be one
 * very long uninterrupted scroll.
 */
function Section({
  eyebrow,
  title,
  banded,
  children,
}: {
  eyebrow: string;
  title: string;
  banded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={banded ? "section-band" : "pt-14 md:pt-20"}>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="mb-6 font-display text-3xl font-semibold text-deep-2">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-4">
      <dt className="pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
