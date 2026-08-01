import Image from "next/image";
import Link from "next/link";
import AmazonRegistryButton from "@/components/AmazonRegistryButton";
import CopyButton from "@/components/CopyButton";
import { fullAddress, mapEmbedUrl, mapLinkUrl, siteConfig } from "@/data/site-config";

const { event, gifts, contact, hero, dog } = siteConfig;

/**
 * One long page, built as a stack of full-bleed bands. Each section names
 * its own surface colour through the `tone` prop and the colours are
 * sequenced so no two neighbours repeat: the denim hero, then cool, powder
 * blue, warm sand, cool again, and blush for the closing block. Only the
 * hero goes deep — everything below it stays pale, which is what keeps a
 * long scroll feeling light. See `.section--*` in `app/globals.css`.
 */
export default function HomePage() {
  return (
    <main>
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
    <section className="section--denim">
      <div className="shell py-20 text-center md:py-28">
        <p className="mb-5 text-5xl" aria-hidden="true">
          🧸
        </p>
        <p className="eyebrow mb-6">{hero.eyebrow}</p>
        <h1 className="font-display text-[52px] font-semibold leading-[1.02] text-chalk md:text-[68px]">
          {siteConfig.babyName}
        </h1>
        <div className="rule my-8" />
        <p className="mb-6 font-display text-xl italic text-chalk">{event.dateLong}</p>
        <p className="mx-auto mb-10 max-w-[42ch] text-[17px] leading-relaxed text-chalk-soft">
          {hero.subhead}
        </p>
        <Link href="/rsvp" className="btn-on-denim">
          RSVP
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Details() {
  return (
    <Section eyebrow="The Details" title="When & where" tone="bg">
      <div className="card p-7">
        <dl className="space-y-6">
          <Row label="Date">
            <p className="text-[17px] font-semibold text-deep-2">{event.dateLong}</p>
          </Row>

          <Row label="Time">
            <p className="text-[17px] font-semibold text-deep-2">
              {event.timeStart} – {event.timeEnd}
            </p>
          </Row>

          <Row label="Where">
            <p className="text-[17px] font-semibold text-deep-2">{event.address.line1}</p>
            <p className="text-[15px] text-ink-soft">{event.address.line2}</p>
            <a
              href={mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[14px] font-semibold text-deep underline underline-offset-2"
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
          className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5 text-[14px] font-semibold text-deep transition-colors hover:bg-paper-2"
        >
          <span>{fullAddress}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Three asks, in descending order of how much they'd help us, and the
 * order matters: cash, then the registry, then the book.
 *
 * The book request has to come last and it has to be introduced as
 * "instead of a card", because on its own it flatly contradicts the line
 * above it asking people not to carry gifts to the party. Framed as a
 * swap for the card everyone was bringing anyway, it isn't a contradiction
 * — it's the same gesture in a different object. Keep that framing if you
 * reword any of this.
 */
function Gifts() {
  return (
    <Section eyebrow="Gifts" title="If you'd like to bring something" tone="band">
      <div className="card p-7">
        <p className="mb-4 text-[16px] leading-relaxed text-ink">
          We&apos;re grateful for everyone celebrating with us — your presence is more
          than enough.
        </p>
        <p className="mb-7 text-[16px] leading-relaxed text-ink">
          If you&apos;d like to give a gift,{" "}
          <strong className="font-semibold text-deep-2">
            a cash contribution is the most helpful and flexible
          </strong>{" "}
          option as we finish preparing for our little one. Thank you for being part of
          this exciting chapter with us!
        </p>

        <div className="rounded-xl2 border border-gold bg-gold/25 p-5">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-deep-2/80">
            Venmo or Zelle
          </p>
          <div className="space-y-3">
            <Handle method="Venmo" value={gifts.venmoHandle} />
            <Handle method="Zelle" value={gifts.zelleHandle} />
          </div>
        </div>

        <Divider label="or shop the registry" />

        <p className="mb-6 text-[16px] leading-relaxed text-ink">
          If you&apos;d rather pick out something specific, our registry is below.
          Everything on it ships straight to our door — so please don&apos;t bring
          wrapped gifts to the shower. It saves you carrying them, and us finding
          somewhere to put them on the day. Thank you!
        </p>

        <AmazonRegistryButton />

        <Divider label="instead of a card" />

        <BookRequest />
      </div>
    </Section>
  );
}

/**
 * The "bring a book" ask. Deliberately the softest panel in the section —
 * no border, no button — because it's the one thing here that isn't really
 * about gifts.
 */
function BookRequest() {
  return (
    <div className="rounded-xl2 bg-blush p-5">
      <div className="mb-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-lg leading-none"
        >
          📚
        </span>
        <p className="font-display text-xl font-semibold text-deep-2">
          Bring a book, not a card
        </p>
      </div>
      <p className="text-[15.5px] leading-relaxed text-ink">
        If you'd like, instead of bringing a card, feel free to bring a favorite
        children's book with a note written inside the cover. Whether it's a book you
        loved growing up or one you'd like to share with Baby Nam, we'd love to build a
        library filled with stories from the people we care about.      </p>
      <p className="mt-3 text-[14px] italic leading-relaxed text-ink-soft">
        New, secondhand, or well-loved and dog-eared — all equally welcome.
      </p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-7 flex items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Handle({ method, value }: { method: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3">
      <span className="w-14 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {method}
      </span>
      <span className="flex-1 truncate text-[15px] font-semibold text-deep-2">{value}</span>
      <CopyButton text={value} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Rsvp() {
  return (
    <Section eyebrow="RSVP" title="Please let us know if you're coming" tone="sand">
      <div className="card p-8 text-center">
        <p className="mx-auto mb-7 max-w-[40ch] text-[16px] leading-relaxed text-ink-soft">
          Please RSVP by{" "}
          <strong className="font-semibold text-deep-2">{siteConfig.rsvp.deadline}</strong>
          . To ensure we have a proper headcount for food!
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
    <Section eyebrow="The big brother" title={`Say hi to ${dog.name}`} tone="bg">
      <Link
        href="/benny"
        className="card group flex flex-col items-center gap-5 overflow-hidden p-6 text-center transition-colors hover:border-deep/35 sm:flex-row sm:text-left"
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
            He&apos;s taking the promotion well~
          </span>
          {/* <span className="mb-3 block text-[15px] leading-relaxed text-ink-soft">
            {dog.name} has been the baby of this house for years, and he has opinions
            about the new arrival. There are pictures.
          </span> */}
          <span className="text-[14.5px] font-semibold text-deep group-hover:underline">
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
    <Section eyebrow="Questions?" title="Just reach out" tone="blush">
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
        <span aria-hidden="true" className="mr-1.5 not-italic">
          🧸
        </span>
        Can&apos;t wait to see you. — {siteConfig.coupleNames}
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * `tone` picks the section's full-bleed background colour. The tones are
 * defined as `.section--*` in `app/globals.css`; `denim` additionally flips
 * the cards, eyebrows and contact tiles inside it to their light-on-dark
 * versions, so a section is made dark by changing this prop alone.
 */
function Section({
  eyebrow,
  title,
  tone,
  children,
}: {
  eyebrow: string;
  title: string;
  tone: "bg" | "band" | "sand" | "blush" | "denim";
  children: React.ReactNode;
}) {
  return (
    <section className={`section section--${tone}`}>
      <div className="shell">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="section-title mb-7">{title}</h2>
        {children}
      </div>
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
