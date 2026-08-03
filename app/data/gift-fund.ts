import { unstable_cache } from "next/cache";
import { siteConfig } from "@/data/site-config";

/**
 * ===================================================================
 * The gift fund's data layer.
 * ===================================================================
 * Contributions live in a Google Sheet, reached through the Apps Script
 * web app in `scripts/gift-fund-sheet.gs` — the same arrangement the RSVP
 * form uses, so there's no database to run and no second bill to pay.
 *
 * Nothing here moves money. A row is a guest telling us "I sent you $50 by
 * Venmo"; the sending happens in Venmo or Zelle. Every total on the site is
 * therefore self-reported, which is why the owner can delete a row.
 * ===================================================================
 */

export type ContributionMethod = "Venmo" | "Zelle";

export type Contribution = {
  id: string;
  itemId: string;
  name: string;
  amount: number;
  method: ContributionMethod;
  note: string;
  submittedAt: string;
};

export type FundItem = (typeof siteConfig.giftFund.items)[number];

export type FundItemSummary = FundItem & {
  raised: number;
  contributors: number;
  /** Capped at 100 — someone can overshoot a goal and the bar shouldn't. */
  percent: number;
  funded: boolean;
};

export const CONTRIBUTIONS_TAG = "gift-fund-contributions";

/** True once the Sheet webhook is configured; drives the "not wired up yet" copy. */
export function fundIsConfigured(): boolean {
  return Boolean(process.env.GIFT_FUND_SHEET_WEBHOOK_URL);
}

/**
 * Talk to the Apps Script web app. Every action goes through one POST with
 * an `action` field, because a bound Apps Script deployment only gives you
 * the one `doPost` entry point.
 */
export async function callFundSheet(
  action: "list" | "add" | "delete",
  payload: Record<string, unknown> = {}
): Promise<{ ok: boolean; error?: string; contributions?: unknown[] }> {
  const url = process.env.GIFT_FUND_SHEET_WEBHOOK_URL;
  if (!url) {
    return { ok: false, error: "GIFT_FUND_SHEET_WEBHOOK_URL is not set" };
  }

  // Apps Script /exec answers with a 302 to script.googleusercontent.com;
  // fetch follows that automatically, so a non-ok response is a real failure.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      secret: process.env.GIFT_FUND_SHARED_SECRET ?? "",
      ...payload,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gift fund webhook responded ${res.status}`);
  }

  const body = (await res.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
    contributions?: unknown[];
  } | null;

  if (!body?.ok) {
    throw new Error(body?.error ?? "Gift fund webhook did not confirm");
  }
  return { ok: true, contributions: body.contributions };
}

function parseContribution(row: unknown): Contribution | null {
  if (typeof row !== "object" || row === null) return null;
  const r = row as Record<string, unknown>;
  const amount = Number(r.amount);
  // `> 0`, not merely finite. A stray row in the sheet — a duplicated header
  // is the usual one — parses to an amount of 0 and would otherwise be
  // counted as a real person who gave nothing, so the fund reads
  // "1 person has contributed" against a total of $0. The form already
  // refuses anything at or below zero, so no genuine row is lost here.
  if (!r.id || !Number.isFinite(amount) || amount <= 0) return null;

  return {
    id: String(r.id),
    itemId: String(r.itemId ?? ""),
    name: String(r.name ?? "").trim() || "Someone",
    amount,
    method: r.method === "Zelle" ? "Zelle" : "Venmo",
    note: String(r.note ?? ""),
    submittedAt: String(r.submittedAt ?? ""),
  };
}

async function fetchContributions(): Promise<Contribution[]> {
  if (!fundIsConfigured()) return [];
  try {
    const { contributions } = await callFundSheet("list");
    return (contributions ?? [])
      .map(parseContribution)
      .filter((c): c is Contribution => c !== null);
  } catch (error) {
    // A dead webhook must never take the home page down with it. The fund
    // renders at zero and the contribute form reports the failure honestly.
    console.error("Could not read the gift fund sheet:", error);
    return [];
  }
}

/**
 * Cached so a page view doesn't wait on Apps Script, which is slow enough to
 * be felt. `revalidate` is the ceiling; in practice the tag is busted the
 * moment anyone logs or deletes a contribution, so totals look immediate.
 */
export const getContributions = unstable_cache(
  fetchContributions,
  ["gift-fund-contributions"],
  { tags: [CONTRIBUTIONS_TAG], revalidate: 120 }
);

export function summarize(contributions: Contribution[]): {
  items: FundItemSummary[];
  raised: number;
  goal: number;
  percent: number;
  contributors: number;
} {
  const items = siteConfig.giftFund.items.map((item) => {
    const mine = contributions.filter((c) => c.itemId === item.id);
    const raised = mine.reduce((sum, c) => sum + c.amount, 0);
    return {
      ...item,
      raised,
      contributors: mine.length,
      percent: item.goal > 0 ? Math.min(100, (raised / item.goal) * 100) : 0,
      funded: item.goal > 0 && raised >= item.goal,
    };
  });

  const goal = items.reduce((sum, i) => sum + i.goal, 0);
  // Contributions against an item that has since been renamed still count
  // toward the overall total, which is why this sums the rows and not `items`.
  const raised = contributions.reduce((sum, c) => sum + c.amount, 0);

  return {
    items,
    raised,
    goal,
    percent: goal > 0 ? Math.min(100, (raised / goal) * 100) : 0,
    contributors: contributions.length,
  };
}

/** `$1,240` — no cents, because every goal here is a round number. */
export function money(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
