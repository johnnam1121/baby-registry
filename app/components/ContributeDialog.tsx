"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { logContribution } from "@/gifts/actions";
import { initialFundState } from "@/gifts/fund-state";
import type { FundItemSummary } from "@/data/gift-fund";
import CopyButton from "./CopyButton";

const QUICK_AMOUNTS = [25, 50, 100, 250];

/**
 * The "contribute" modal.
 *
 * A native <dialog> rather than a hand-rolled overlay: focus trapping, Esc
 * to close, inert background and the top layer all come free and correct.
 *
 * The form does NOT take a payment. The guest sends money in Venmo or
 * Zelle, and this writes down what they say they sent — which is why the
 * handles and the "send it first" instruction sit above the fields rather
 * than being tucked away at the bottom.
 */
export default function ContributeDialog({
  item,
  venmoHandle,
  zelleHandle,
  onClose,
}: {
  item: FundItemSummary | null;
  venmoHandle: string;
  zelleHandle: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(logContribution, initialFundState);
  const [method, setMethod] = useState<"Venmo" | "Zelle">("Venmo");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  if (!item) return <dialog ref={ref} className="fund-dialog" />;

  const handle = method === "Venmo" ? venmoHandle : zelleHandle;

  return (
    <dialog
      ref={ref}
      className="fund-dialog"
      onClose={onClose}
      // A click that lands on the dialog element itself is a click on the
      // backdrop — the contents sit in the child <div>.
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
    >
      <div className="p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Contribute</p>
            <h2 className="font-display text-2xl font-semibold text-deep-2">
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 rounded-full px-2.5 py-1 text-xl leading-none text-ink-soft transition-colors hover:bg-paper-2 hover:text-deep-2"
          >
            ×
          </button>
        </div>

        {state.status === "success" ? (
          <div className="text-center">
            <p className="mb-4 text-5xl" aria-hidden="true">
              🧸
            </p>
            <p className="mb-6 text-[16px] leading-relaxed text-ink">{state.message}</p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn-primary w-full justify-center"
            >
              Done
            </button>
          </div>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="method" value={method} />

            {state.status === "error" && state.message && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-error/35 bg-error/8 px-4 py-3 text-[14px] font-semibold text-error"
              >
                {state.message}
              </p>
            )}

            {/* Step one, stated first, because the rest of this form is
                only bookkeeping for money that has already moved. */}
            <div className="mb-6 rounded-xl2 border border-gold bg-gold/25 p-4">
              <p className="mb-3 text-[14px] leading-relaxed text-ink">
                <strong className="font-semibold text-deep-2">
                  Send the money first
                </strong>{" "}
                — in your {method} app, to the handle below. This form doesn&apos;t take
                a payment, it just tells us it&apos;s on the way.
              </p>
              <div className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3.5 py-2.5">
                <span className="w-12 shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  {method}
                </span>
                <span className="flex-1 truncate text-[14px] font-semibold text-deep-2">
                  {handle}
                </span>
                <CopyButton text={handle} />
              </div>
            </div>

            <fieldset className="mb-5">
              <legend className="mb-2 text-[14.5px] font-semibold text-deep-2">
                Which did you use?
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {(["Venmo", "Zelle"] as const).map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl2 border px-4 py-3 text-[14.5px] font-semibold transition-colors ${
                      method === option
                        ? "border-deep bg-deep/8 text-deep-2"
                        : "border-line bg-paper-2 text-ink hover:border-deep/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="methodChoice"
                      value={option}
                      checked={method === option}
                      onChange={() => setMethod(option)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                        method === option ? "border-deep" : "border-ink-soft/50"
                      }`}
                    >
                      {method === option && (
                        <span className="h-2 w-2 rounded-full bg-deep" />
                      )}
                    </span>
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mb-5">
              <label
                htmlFor="contribution-name"
                className="mb-1.5 block text-[14.5px] font-semibold text-deep-2"
              >
                Who&apos;s it from?
              </label>
              <input
                id="contribution-name"
                name="name"
                required
                maxLength={80}
                autoComplete="name"
                placeholder="Jane & John Doe"
                aria-invalid={state.fieldErrors.name ? true : undefined}
                className={`input ${state.fieldErrors.name ? "border-error" : ""}`}
              />
              <FieldError message={state.fieldErrors.name} />
            </div>

            <div className="mb-5">
              <label
                htmlFor="contribution-amount"
                className="mb-1.5 block text-[14.5px] font-semibold text-deep-2"
              >
                How much did you send?
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-ink-soft">
                  $
                </span>
                <input
                  id="contribution-amount"
                  name="amount"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="50"
                  aria-invalid={state.fieldErrors.amount ? true : undefined}
                  className={`input pl-7 ${
                    state.fieldErrors.amount ? "border-error" : ""
                  }`}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmount(String(quick))}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                      amount === String(quick)
                        ? "border-deep bg-deep/10 text-deep-2"
                        : "border-line text-ink-soft hover:border-deep/40 hover:text-deep-2"
                    }`}
                  >
                    ${quick}
                  </button>
                ))}
              </div>
              <FieldError message={state.fieldErrors.amount} />
            </div>

            <div className="mb-6">
              <label
                htmlFor="contribution-note"
                className="mb-1.5 block text-[14.5px] font-semibold text-deep-2"
              >
                A note for us
                <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>
              </label>
              <textarea
                id="contribution-note"
                name="note"
                rows={2}
                maxLength={300}
                placeholder="Can't wait to meet him!"
                className="input resize-y"
              />
              <FieldError message={state.fieldErrors.note} />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {pending ? "Saving…" : "I've sent it"}
            </button>
            <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-soft">
              Your name and amount show up in our tally. Nothing here charges you.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] font-semibold text-error">{message}</p>;
}
