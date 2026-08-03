import { getContributions, money, summarize } from "@/data/gift-fund";
import { siteConfig } from "@/data/site-config";
import GiftFundCarousel from "./GiftFundCarousel";
import Meter from "./Meter";

/**
 * The gift fund block: one combined progress bar, then a carousel of the
 * five things we're saving for.
 *
 * Totals are read on the server so the bars are filled in the HTML that
 * arrives — no empty bars flashing to full a moment later. The read is
 * cached and tagged, and logging a contribution busts the tag, so a guest
 * sees their own money land the instant they submit.
 */
export default async function GiftFund() {
  const contributions = await getContributions();
  const fund = summarize(contributions);

  return (
    <section className="mt-5" aria-labelledby="gift-fund-heading">
      <div className="card p-7">
        <h3
          id="gift-fund-heading"
          className="font-display text-xl font-semibold text-deep-2"
        >
          {siteConfig.giftFund.overallLabel}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {siteConfig.giftFund.overallBlurb}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-end justify-between gap-3">
            <p className="font-display text-2xl font-semibold text-deep-2">
              {money(fund.raised)}{" "}
              <span className="text-[15px] font-normal text-ink-soft">
                of {money(fund.goal)}
              </span>
            </p>
            <p className="text-[13px] text-ink-soft">
              {fund.contributors === 0
                ? "Be the first"
                : `${fund.contributors} ${
                    fund.contributors === 1 ? "person has" : "people have"
                  } contributed`}
            </p>
          </div>
          <Meter percent={fund.percent} label="Total raised so far" />
        </div>
      </div>

      <GiftFundCarousel
        items={fund.items}
        venmoHandle={siteConfig.gifts.venmoHandle}
        zelleHandle={siteConfig.gifts.zelleHandle}
      />
    </section>
  );
}
