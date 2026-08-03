"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { CONTRIBUTIONS_TAG, callFundSheet, fundIsConfigured } from "@/data/gift-fund";
import { siteConfig } from "@/data/site-config";
import { ADMIN_COOKIE, adminToken, isAdmin } from "./auth";
import type { AdminState, FundFormState } from "./fund-state";

const MAX_AMOUNT = 10_000;

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Bust both caches: the tag holds the data, the path holds the rendered page.
 *
 * `updateTag` rather than `revalidateTag(tag, "max")` on purpose. The latter
 * is stale-while-revalidate, which would show a guest the total from *before*
 * their own contribution — the one moment they're certain to be looking. This
 * is a read-your-own-writes case, so the next read waits for fresh data.
 * `updateTag` is only callable from a Server Action, which is all we do here.
 */
function refreshTotals() {
  updateTag(CONTRIBUTIONS_TAG);
  revalidatePath("/");
  revalidatePath("/gifts/admin");
}

/**
 * Record that a guest sent money. This does not take a payment — the money
 * moves in Venmo or Zelle, and this only writes down what they say they sent.
 * The form copy has to keep saying so.
 */
export async function logContribution(
  _prevState: FundFormState,
  formData: FormData
): Promise<FundFormState> {
  const fieldErrors: Record<string, string> = {};

  const itemId = str(formData, "itemId");
  const name = str(formData, "name");
  const method = str(formData, "method");
  const note = str(formData, "note");
  // People type "$50", "50.00" and "1,200" — all of which are fine.
  const amountRaw = str(formData, "amount").replace(/[$,\s]/g, "");
  const amount = Number.parseFloat(amountRaw);

  const item = siteConfig.giftFund.items.find((i) => i.id === itemId);
  if (!item) {
    return {
      status: "error",
      message: "That gift isn't on the list any more. Try picking it again.",
      fieldErrors: {},
    };
  }

  if (!name) {
    fieldErrors.name = "Please tell us who this is from.";
  } else if (name.length > 80) {
    fieldErrors.name = "That name is too long for the sheet.";
  }

  if (!amountRaw) {
    fieldErrors.amount = "How much did you send?";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    fieldErrors.amount = "Enter an amount like 50.";
  } else if (amount > MAX_AMOUNT) {
    fieldErrors.amount = "That's wonderfully generous — please text us instead.";
  }

  if (method !== "Venmo" && method !== "Zelle") {
    fieldErrors.method = "Venmo or Zelle?";
  }

  if (note.length > 300) {
    fieldErrors.note = "Could you shorten that a little?";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Almost there — a couple of fields need fixing.",
      fieldErrors,
    };
  }

  if (!fundIsConfigured()) {
    console.error("Contribution received but GIFT_FUND_SHEET_WEBHOOK_URL is not set:", {
      itemId,
      name,
      amount,
    });
    return {
      status: "error",
      message:
        `Your money went through fine — it's only our tracker that's broken. ` +
        `Please text us at ${siteConfig.contact.phoneDisplay} so we can add it by hand.`,
      fieldErrors: {},
    };
  }

  try {
    await callFundSheet("add", {
      // Generated here rather than from the row number, so deleting a row
      // never shifts anyone else's id.
      id: crypto.randomUUID(),
      itemId,
      name,
      amount: Math.round(amount * 100) / 100,
      method,
      note,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to record a contribution:", error);
    return {
      status: "error",
      message:
        `We couldn't write that down just now. If you've already sent the money, ` +
        `text us at ${siteConfig.contact.phoneDisplay} and we'll add it manually.`,
      fieldErrors: {},
    };
  }

  refreshTotals();

  return {
    status: "success",
    message: `Thank you — we've added it to ${item.name.toLowerCase()}.`,
    fieldErrors: {},
  };
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */

export async function signInAdmin(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const expected = adminToken();
  if (!expected) {
    return {
      status: "error",
      message: "GIFT_FUND_ADMIN_PASSWORD isn't set, so there's nothing to sign in to.",
    };
  }

  const password = str(formData, "password");
  if (password !== process.env.GIFT_FUND_ADMIN_PASSWORD) {
    return { status: "error", message: "That passphrase doesn't match." };
  }

  (await cookies()).set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  revalidatePath("/gifts/admin");
  return { status: "success", message: "" };
}

export async function signOutAdmin(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/gifts/admin");
}

export async function deleteContribution(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  if (!(await isAdmin())) {
    return { status: "error", message: "You've been signed out — sign in again." };
  }

  const id = str(formData, "id");
  if (!id) return { status: "error", message: "Nothing to delete." };

  try {
    await callFundSheet("delete", { id });
  } catch (error) {
    console.error("Failed to delete a contribution:", error);
    return { status: "error", message: "The sheet wouldn't accept that. Try again." };
  }

  refreshTotals();
  return { status: "success", message: "Deleted." };
}
