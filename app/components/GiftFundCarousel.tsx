"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FundItemSummary } from "@/data/gift-fund";
import ContributeDialog from "./ContributeDialog";
import Meter from "./Meter";

/**
 * A scroll-snap carousel. The scrolling itself is the browser's — swipe,
 * trackpad and keyboard all work without our help — and the arrows and dots
 * drive that same scroll container rather than running a second state
 * machine that could disagree with it.
 *
 * Three things here are less obvious than they look, and all three were
 * bugs before:
 *
 *  1. The active card is the one nearest the LEFT edge, not the one nearest
 *     the middle. Cards are `snap-start`, and on desktop two are visible at
 *     once — measuring from the middle picked card 1 while the carousel was
 *     still parked at the very beginning, which lit the wrong dot and left
 *     the back arrow enabled with nowhere to go.
 *  2. Scrolling to a card subtracts the track's left padding. `offsetLeft`
 *     includes it, so scrolling straight to `offsetLeft` overshoots by the
 *     gutter and then fights the snap back.
 *  3. The arrows enable/disable on real scroll position, not on the index.
 *     The last card can never reach the left edge while two are on screen,
 *     so an index-based check would leave the forward arrow live forever.
 */
export default function GiftFundCarousel({
  items,
  venmoHandle,
  zelleHandle,
}: {
  items: FundItemSummary[];
  venmoHandle: string;
  zelleHandle: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /**
   * One entry per place the track can actually come to rest, not one per
   * card. On desktop two cards are on screen, so the last two share a
   * resting place — five dots there would leave one that can never light up
   * however hard you click it. Each stop keeps the index of its leftmost
   * card, which is what the dot is labelled with.
   */
  const [stops, setStops] = useState<{ scrollLeft: number; cardIndex: number }[]>(
    // Seeded one-per-card so the server renders a dot row of roughly the
    // right shape. `measure()` runs on mount and corrects it — on desktop
    // that's one dot fewer, which is why this is a guess and not the truth.
    () => items.map((_, cardIndex) => ({ scrollLeft: 0, cardIndex }))
  );
  const [openItem, setOpenItem] = useState<FundItemSummary | null>(null);
  // Bumped on every open so reopening the same card gets a fresh form
  // rather than the previous submission's success screen.
  const [opens, setOpens] = useState(0);

  const cardsOf = (track: HTMLDivElement) =>
    Array.from(track.children) as HTMLElement[];

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = cardsOf(track);
    if (cards.length === 0) return;

    const origin = cards[0].offsetLeft; // the track's own left padding
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    // Where each card would land if scrolled to, clamped: past a point the
    // track simply can't scroll any further, and several cards collapse
    // onto that same final resting place.
    const next: { scrollLeft: number; cardIndex: number }[] = [];
    cards.forEach((card, i) => {
      const scrollLeft = Math.min(card.offsetLeft - origin, maxScroll);
      const previous = next[next.length - 1];
      if (!previous || scrollLeft - previous.scrollLeft > 1) {
        next.push({ scrollLeft, cardIndex: i });
      }
    });

    let best = 0;
    let bestDistance = Infinity;
    next.forEach((stop, i) => {
      const distance = Math.abs(stop.scrollLeft - track.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });

    setStops((current) =>
      current.length === next.length &&
      current.every((s, i) => Math.abs(s.scrollLeft - next[i].scrollLeft) < 1)
        ? current // same geometry — don't hand React a new array every scroll frame
        : next
    );
    setActive(best);
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    // The breakpoint swaps one-up for two-up, which changes what "the end"
    // means — so remeasure when the track resizes, not just when it scrolls.
    const observer = new ResizeObserver(onScroll);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [measure]);

  /** One card plus one gap — the real distance between two snap points. */
  const step = (track: HTMLDivElement) => {
    const cards = cardsOf(track);
    if (cards.length < 2) return cards[0]?.clientWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Moving by a measured step rather than to an index behaves the same at
    // both ends: the browser clamps, and snapping tidies up the landing.
    track.scrollBy({ left: direction * step(track), behavior: "smooth" });
  };

  const scrollToStop = (index: number) => {
    const track = trackRef.current;
    const stop = stops[index];
    if (!track || !stop) return;
    track.scrollTo({ left: stop.scrollLeft, behavior: "smooth" });
  };

  function open(item: FundItemSummary) {
    setOpenItem(item);
    setOpens((n) => n + 1);
  }

  return (
    <div className="mt-5">
      <div
        ref={trackRef}
        className="fund-track"
        // A scrollable region needs to be reachable by keyboard on its own,
        // independently of the arrow buttons below it.
        tabIndex={0}
        role="region"
        aria-label="What we're saving for"
      >
        {items.map((item) => (
          <article key={item.id} className="fund-card card overflow-hidden">
            {/* Square, and `contain` rather than `cover`. Product shots are
                roughly 1:1, so a 4:3 box had to crop ~17% off the top and
                bottom of every one to fill it. `contain` also means a photo
                that isn't square gets letterboxed instead of beheaded. */}
            <div className="relative aspect-square w-full bg-paper-2">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 640px) 80vw, 320px"
                className="object-contain"
              />
              {item.funded && (
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-deep-2">
                  Fully funded
                </span>
              )}
            </div>

            <div className="flex flex-col p-5">
              <h4 className="font-display text-lg font-semibold text-deep-2">
                {item.name}
              </h4>
              <p className="mt-1 min-h-[2.6rem] text-[14px] leading-relaxed text-ink-soft">
                {item.blurb}
              </p>

              <div className="mt-4">
                <Meter percent={item.percent} label={item.name} />
                <p className="mt-2 text-[13px] text-ink-soft">
                  <span className="font-semibold text-deep-2">
                    ${Math.round(item.raised).toLocaleString("en-US")}
                  </span>{" "}
                  of ${item.goal.toLocaleString("en-US")}
                  {item.contributors > 0 && ` · ${item.contributors} contributed`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => open(item)}
                className="btn-primary mt-4 w-full justify-center py-3 text-[14.5px]"
              >
                {item.funded ? "Contribute anyway" : "Contribute"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {stops.map((stop, i) => (
            <button
              key={items[stop.cardIndex]?.id ?? i}
              type="button"
              onClick={() => scrollToStop(i)}
              aria-label={`Show ${items[stop.cardIndex]?.name ?? `group ${i + 1}`}`}
              aria-current={i === active ? "true" : undefined}
              className="group py-2"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === active
                    ? "w-6 bg-deep"
                    : "w-2 bg-deep/25 group-hover:bg-deep/50"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex gap-2.5">
          <ArrowButton direction="left" disabled={atStart} onClick={() => nudge(-1)} />
          <ArrowButton direction="right" disabled={atEnd} onClick={() => nudge(1)} />
        </div>
      </div>

      <ContributeDialog
        key={`${openItem?.id ?? "none"}-${opens}`}
        item={openItem}
        venmoHandle={venmoHandle}
        zelleHandle={zelleHandle}
        onClose={() => setOpenItem(null)}
      />
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous gift" : "Next gift"}
      className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-deep/40 bg-paper text-deep shadow-md shadow-deep/15 transition-colors hover:border-deep hover:bg-deep hover:text-white disabled:border-line disabled:bg-paper-2 disabled:text-ink-soft/40 disabled:shadow-none"
    >
      {/* Drawn rather than typed: "←" renders at a different weight and
          baseline in every font, and looked like a stray character. */}
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={direction === "left" ? "M15 18 9 12l6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
