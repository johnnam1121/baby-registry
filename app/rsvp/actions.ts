"use server";

import { siteConfig } from "@/data/site-config";
import type { RsvpState } from "./rsvp-state";

/**
 * The exact column order the Google Sheet expects. The Apps Script on the
 * other end reads these keys by name, so adding a field here means adding
 * it to `scripts/rsvp-sheet.gs` too (and to the header row of the Sheet).
 */
type RsvpPayload = {
  secret: string;
  submittedAt: string;
  attending: "Yes" | "No";
  name: string;
  email: string;
  phone: string;
  partySize: string;
  guestNames: string;
  kidsCount: string;
  dietary: string;
  note: string;
};

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitRsvp(
  _prevState: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const fieldErrors: Record<string, string> = {};

  const attending = str(formData, "attending");
  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const partySizeRaw = str(formData, "partySize");
  const guestNames = str(formData, "guestNames");
  const kidsCountRaw = str(formData, "kidsCount");
  const dietary = str(formData, "dietary");
  const note = str(formData, "note");

  // --- Validation ---------------------------------------------------
  // Mirrors the `required` attributes on the inputs, because HTML
  // validation is trivially bypassed and this action is a public endpoint.
  if (attending !== "yes" && attending !== "no") {
    fieldErrors.attending = "Please let us know if you can make it.";
  }
  if (!name) {
    fieldErrors.name = "We need a name to put on the list.";
  }
  if (!email) {
    fieldErrors.email = "We need an email to reach you.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "That doesn't look like a valid email address.";
  }

  let partySize = 0;
  if (attending === "yes") {
    partySize = Number.parseInt(partySizeRaw, 10);
    if (!Number.isFinite(partySize) || partySize < 1 || partySize > 30) {
      fieldErrors.partySize = "Enter how many people are coming (1–30).";
    }
    if (!guestNames) {
      fieldErrors.guestNames = "Please list everyone who's coming with you.";
    }
    const kids = Number.parseInt(kidsCountRaw, 10);
    if (kidsCountRaw && (!Number.isFinite(kids) || kids < 0 || kids > partySize)) {
      fieldErrors.kidsCount = "Kids can't outnumber your party size.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Almost there — a couple of fields need fixing.",
      fieldErrors,
    };
  }

  // --- Send it to the Google Sheet ----------------------------------
  const webhookUrl = process.env.RSVP_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("RSVP received but RSVP_SHEET_WEBHOOK_URL is not set:", {
      name,
      email,
      attending,
    });
    return {
      status: "error",
      message:
        `Something went wrong on our end and your RSVP wasn't saved. ` +
        `Please text us at ${siteConfig.contact.phoneDisplay} and we'll add you by hand.`,
      fieldErrors: {},
    };
  }

  const payload: RsvpPayload = {
    secret: process.env.RSVP_SHARED_SECRET ?? "",
    submittedAt: new Date().toISOString(),
    attending: attending === "yes" ? "Yes" : "No",
    name,
    email,
    phone,
    partySize: attending === "yes" ? String(partySize) : "0",
    guestNames: attending === "yes" ? guestNames : "",
    kidsCount: attending === "yes" ? kidsCountRaw : "",
    dietary: attending === "yes" ? dietary : "",
    note,
  };

  try {
    // Apps Script /exec answers with a 302 to script.googleusercontent.com;
    // fetch follows that automatically, so a non-ok response here is a real
    // failure rather than the redirect.
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Sheet webhook responded ${res.status}`);
    }

    // The script replies with {"ok":true}; anything else means it rejected us
    // (usually a mismatched secret or a stale deployment URL).
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!body?.ok) {
      throw new Error("Sheet webhook did not confirm the write");
    }
  } catch (error) {
    console.error("Failed to record RSVP:", error);
    return {
      status: "error",
      message:
        `We couldn't save your RSVP just now. Please try again in a moment, or ` +
        `text us at ${siteConfig.contact.phoneDisplay} and we'll take care of it.`,
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message:
      attending === "yes"
        ? "You're on the list — thank you! We can't wait to see you."
        : "Thanks for letting us know. We'll miss you, and we'll send pictures.",
    fieldErrors: {},
  };
}
