/**
 * The progress bar, shared by the combined total and each carousel card.
 *
 * It lives in its own module because the carousel is a Client Component:
 * importing it from `GiftFund.tsx` would drag that file's server-only data
 * layer into the browser bundle. No hooks here, so both sides can use it.
 *
 * `aria-valuenow` is what a screen reader announces — the coloured bar on
 * its own says nothing at all.
 */
export default function Meter({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  const rounded = Math.round(percent);
  return (
    <div
      role="progressbar"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${rounded}% funded`}
      className="h-2.5 w-full overflow-hidden rounded-full bg-deep/12"
    >
      {/* A sliver of colour reads as "started" where a hairline reads as a
          rendering bug, so anything above zero gets at least 4%. */}
      <div
        className="h-full rounded-full bg-deep transition-[width] duration-500"
        style={{ width: `${percent > 0 ? Math.max(4, percent) : 0}%` }}
      />
    </div>
  );
}
