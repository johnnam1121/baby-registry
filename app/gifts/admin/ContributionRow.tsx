"use client";

import { useActionState, useState } from "react";
import type { Contribution } from "@/data/gift-fund";
import { deleteContribution } from "../actions";
import { initialAdminState } from "../fund-state";

/**
 * One logged contribution, with a two-step delete. The confirm step is a
 * local state flip rather than `window.confirm` so it can't be suppressed
 * by a browser's "prevent additional dialogs" checkbox.
 */
export default function ContributionRow({
  contribution,
  itemName,
}: {
  contribution: Contribution;
  itemName: string;
}) {
  const [state, formAction, pending] = useActionState(
    deleteContribution,
    initialAdminState
  );
  const [confirming, setConfirming] = useState(false);

  const when = contribution.submittedAt
    ? new Date(contribution.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[15.5px] font-semibold text-deep-2">
            {contribution.name}{" "}
            <span className="font-normal text-ink-soft">
              →{" "}
              {/* Cents always shown here: this is the ledger you check a
                  wrong entry against, so $75.50 must not read as $75.5. */}
              $
              {contribution.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              · {itemName}
            </span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            {contribution.method}
            {when && ` · ${when}`}
          </p>
          {contribution.note && (
            <p className="mt-2 text-[14px] italic leading-relaxed text-ink-soft">
              “{contribution.note}”
            </p>
          )}
        </div>

        <form action={formAction} className="shrink-0">
          <input type="hidden" name="id" value={contribution.id} />
          {confirming ? (
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-error px-4 py-2 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Really delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:text-deep-2"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:border-error/50 hover:text-error"
            >
              Delete
            </button>
          )}
        </form>
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-3 text-[13px] font-semibold text-error">
          {state.message}
        </p>
      )}
    </li>
  );
}
