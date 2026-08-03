import type { Metadata } from "next";
import Link from "next/link";
import { getContributions, money, summarize } from "@/data/gift-fund";
import { adminIsConfigured, isAdmin } from "../auth";
import AdminSignIn from "./AdminSignIn";
import ContributionRow from "./ContributionRow";

export const metadata: Metadata = {
  title: "Gift fund admin",
  // Nothing here should ever turn up in a search result.
  robots: { index: false, follow: false },
};

/**
 * Where you fix a contribution someone typed in wrong.
 *
 * Reading `cookies()` through `isAdmin()` makes this route dynamic, which is
 * what we want — it must never be prerendered or cached at the edge.
 */
export default async function GiftFundAdminPage() {
  const signedIn = await isAdmin();

  return (
    <main className="mx-auto max-w-[760px] px-6 pb-24 pt-12">
      <Link
        href="/"
        className="mb-8 inline-block text-[14px] font-semibold text-deep underline underline-offset-2"
      >
        ← Back to the site
      </Link>

      <p className="eyebrow mb-2">Just for you</p>
      <h1 className="mb-8 font-display text-4xl font-semibold leading-tight text-deep-2">
        Gift fund
      </h1>

      {!adminIsConfigured() ? (
        <div className="card p-7">
          <p className="text-[15.5px] leading-relaxed text-ink">
            Set <code className="font-mono text-[14px]">GIFT_FUND_ADMIN_PASSWORD</code>{" "}
            in <code className="font-mono text-[14px]">.env.local</code> (and in Vercel)
            to unlock this page. SETUP.md step 5 has the details.
          </p>
        </div>
      ) : signedIn ? (
        <SignedIn />
      ) : (
        <AdminSignIn />
      )}
    </main>
  );
}

async function SignedIn() {
  const contributions = await getContributions();
  const fund = summarize(contributions);
  const byItem = new Map(fund.items.map((i) => [i.id, i.name]));

  // Newest first — a mistake is nearly always the row someone just added.
  const rows = [...contributions].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt)
  );

  return (
    <>
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="font-display text-3xl font-semibold text-deep-2">
            {money(fund.raised)}
          </p>
          <p className="mt-1 text-[14px] text-ink-soft">
            of {money(fund.goal)} · {rows.length}{" "}
            {rows.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <SignOutButton />
      </div>

      {rows.length === 0 ? (
        <div className="card p-7">
          <p className="text-[15.5px] leading-relaxed text-ink-soft">
            Nothing logged yet. Once guests start contributing, their entries show up
            here and you can delete any that came in wrong.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((contribution) => (
            <ContributionRow
              key={contribution.id}
              contribution={contribution}
              itemName={byItem.get(contribution.itemId) ?? contribution.itemId}
            />
          ))}
        </ul>
      )}

      <p className="mt-8 text-[13.5px] leading-relaxed text-ink-soft">
        Deleting removes the row from the Google Sheet and updates every total on the
        site. It can&apos;t be undone from here — the Sheet&apos;s own version history
        is your safety net. Guests type these in themselves, so treat the numbers as
        what people say they sent, not as a bank statement.
      </p>
    </>
  );
}

function SignOutButton() {
  // A one-line inline Server Function: no client JS needed to sign out.
  async function signOut() {
    "use server";
    const { signOutAdmin } = await import("../actions");
    await signOutAdmin();
  }

  return (
    <form action={signOut}>
      <button type="submit" className="btn-ghost py-2.5 text-[14px]">
        Sign out
      </button>
    </form>
  );
}

// Reading the admin cookie already forces this route dynamic; saying so
// explicitly keeps anyone from "optimising" it into the static shell later.
export const dynamic = "force-dynamic";
