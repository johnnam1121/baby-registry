import { siteConfig } from "@/data/site-config";

/**
 * The registry link, as a solid panel in Amazon's own navy rather than a
 * thin outlined box — it needs to hold its own next to the tan Venmo/Zelle
 * panel above it, and a hairline border read as unfinished.
 *
 * The wordmark is drawn inline as text + an SVG smile rather than loaded
 * from Amazon's servers: nothing to hotlink, nothing to break if they move
 * the file, and it stays crisp at any size.
 */
export default function AmazonRegistryButton() {
  return (
    <a
      href={siteConfig.gifts.amazonRegistryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 rounded-xl2 bg-navy px-6 py-8 text-center shadow-lg shadow-navy/25 transition-transform hover:-translate-y-0.5"
    >
      <span className="relative inline-block font-body text-[38px] font-bold lowercase leading-none tracking-[-0.03em] text-paper">
        amazon
        <svg
          viewBox="0 0 120 18"
          aria-hidden="true"
          className="absolute -bottom-2 left-0 w-full overflow-visible"
        >
          <path
            d="M3 4 Q 58 26 106 8"
            fill="none"
            stroke="#FF9900"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path d="M99 0.5 L118 6 L103 15 Z" fill="#FF9900" />
        </svg>
      </span>

      <span className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/70">
        Our baby registry
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9900] px-5 py-2.5 text-[14.5px] font-bold text-navy transition-transform group-hover:scale-[1.03]">
        View the list <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}
