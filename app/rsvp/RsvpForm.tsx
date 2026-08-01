"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitRsvp } from "./actions";
import { initialRsvpState } from "./rsvp-state";
import { siteConfig } from "@/data/site-config";

export default function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialRsvpState);

  // Drives which half of the form is visible. Kept in React state (rather
  // than CSS) so the "coming" fields aren't submitted at all when someone
  // picks "can't make it".
  const [attending, setAttending] = useState<"yes" | "no" | "">("");

  if (state.status === "success") {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4 text-5xl" aria-hidden="true">
          🧸
        </p>
        <h2 className="mb-3 font-display text-2xl font-semibold text-deep-2">
          Got it!
        </h2>
        <p className="mx-auto mb-7 max-w-[38ch] text-[16px] leading-relaxed text-ink-soft">
          {state.message}
        </p>
        <Link href="/" className="btn-ghost">
          Back to the details
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="card p-7"
    >
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mb-6 rounded-lg border-[1.5px] border-error/35 bg-error/8 px-4 py-3 text-[14.5px] font-semibold text-error"
        >
          {state.message}
        </p>
      )}

      <fieldset className="mb-7">
        <legend className="mb-3 text-[16px] font-bold text-deep-2">
          Will you be able to make it?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard
            value="yes"
            checked={attending === "yes"}
            onSelect={setAttending}
            emoji="🎉"
            label="Yes, count us in"
          />
          <ChoiceCard
            value="no"
            checked={attending === "no"}
            onSelect={setAttending}
            emoji="💌"
            label="Sorry, we can't"
          />
        </div>
        <FieldError message={state.fieldErrors.attending} />
      </fieldset>

      {attending !== "" && (
        <div className="space-y-5 border-t border-line pt-7">
          <Field
            label="Your name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            error={state.fieldErrors.name}
          />

          {/* Only required from people who are coming — we need a way to
              reach them if something changes on the day. There's nothing
              to send someone who's already told us they can't make it. */}
          <Field
            label="Email"
            name="email"
            type="email"
            required={attending === "yes"}
            autoComplete="email"
            placeholder="jane@example.com"
            hint={
              attending === "yes"
                ? "So we can send you any updates before the shower."
                : "Only if you'd like us to keep you in the loop."
            }
            error={state.fieldErrors.email}
          />

          {attending === "yes" && (
            <>
              <Field
                label="Mobile number"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                hint="Only used if something changes the day of."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="How many are coming?"
                  name="partySize"
                  type="number"
                  required
                  min={1}
                  max={30}
                  defaultValue={1}
                  hint="Including yourself."
                  error={state.fieldErrors.partySize}
                />
                <Field
                  label="How many are kids?"
                  name="kidsCount"
                  type="number"
                  min={0}
                  max={30}
                  placeholder="0"
                  hint="Helps us plan food."
                  error={state.fieldErrors.kidsCount}
                />
              </div>

              <Field
                label="Who's coming with you?"
                name="guestNames"
                as="textarea"
                required
                rows={3}
                placeholder="Jane Doe, John Doe, Emma (age 4)"
                hint=""
                error={state.fieldErrors.guestNames}
              />

              <Field
                label="Allergies or dietary needs"
                name="dietary"
                as="textarea"
                rows={2}
                placeholder="Peanut allergy, one vegetarian"
                hint=""
              />
            </>
          )}

          <Field
            label={
              attending === "yes" ? "Anything else?" : "Want to leave us a note?"
            }
            name="note"
            as="textarea"
            rows={3}
            placeholder="Ex. a note for the parents-to-be."
          />

          <div className="pt-2">
            <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">
              {pending ? "Sending…" : "Send our RSVP"}
            </button>
            <p className="mt-3 text-center text-[13px] text-ink-soft">
              Trouble with this form? Text us at{" "}
              <a
                href={`sms:${siteConfig.contact.phoneRaw}`}
                className="font-semibold text-deep underline underline-offset-2"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The real radio is visually hidden and replaced by the ring below, so the
 * selected state is carried by an actual control shape rather than only by
 * the card's border colour — colour alone isn't enough on its own.
 */
function ChoiceCard({
  value,
  checked,
  onSelect,
  emoji,
  label,
}: {
  value: "yes" | "no";
  checked: boolean;
  onSelect: (v: "yes" | "no") => void;
  emoji: string;
  label: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl2 border px-4 py-4 transition-colors ${
        checked
          ? "border-deep bg-deep/8"
          : "border-line bg-paper-2 hover:border-deep/40"
      }`}
    >
      <input
        type="radio"
        name="attending"
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
        required
      />
      <span
        aria-hidden="true"
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
          checked ? "border-deep" : "border-ink-soft/50"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-deep" />}
      </span>
      <span aria-hidden="true" className="text-xl leading-none">
        {emoji}
      </span>
      <span
        className={`text-[15px] font-semibold ${checked ? "text-deep-2" : "text-ink"}`}
      >
        {label}
      </span>
    </label>
  );
}

type FieldProps = {
  label: string;
  name: string;
  as?: "input" | "textarea";
  type?: string;
  required?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  defaultValue?: string | number;
};

function Field({
  label,
  name,
  as = "input",
  type = "text",
  required,
  rows,
  min,
  max,
  placeholder,
  hint,
  error,
  autoComplete,
  defaultValue,
}: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[14.5px] font-bold text-deep-2">
        {label}
        {!required && (
          <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>
        )}
      </label>

      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`input resize-y ${error ? "border-error" : ""}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          min={min}
          max={max}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`input ${error ? "border-error" : ""}`}
        />
      )}

      {hint && (
        <p id={hintId} className="mt-1.5 text-[13px] text-ink-soft">
          {hint}
        </p>
      )}
      <FieldError message={error} id={errorId} />
    </div>
  );
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] font-semibold text-error">
      {message}
    </p>
  );
}
