import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Who is allowed to delete a contribution.
 *
 * One shared passphrase, held in `GIFT_FUND_ADMIN_PASSWORD`. The cookie
 * stores an HMAC derived from it rather than the passphrase itself, so a
 * leaked cookie doesn't hand over the passphrase — and it's `httpOnly`, so
 * page scripts can't read it at all.
 *
 * This is the right size of lock for what's behind it: a list of names and
 * amounts that guests typed in themselves. It is not an account system.
 */
export const ADMIN_COOKIE = "gift_fund_admin";

export function adminIsConfigured(): boolean {
  return Boolean(process.env.GIFT_FUND_ADMIN_PASSWORD);
}

export function adminToken(): string | null {
  const password = process.env.GIFT_FUND_ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("gift-fund-admin-v1").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const expected = adminToken();
  if (!expected) return false;

  const presented = (await cookies()).get(ADMIN_COOKIE)?.value;
  // timingSafeEqual throws on a length mismatch, so check that separately.
  if (!presented || presented.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(presented), Buffer.from(expected));
}
