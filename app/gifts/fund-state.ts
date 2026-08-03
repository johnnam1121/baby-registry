/**
 * Shared shapes for the gift fund forms' action state.
 *
 * These live outside `actions.ts` for the same reason `rsvp-state.ts` does:
 * a `"use server"` module may only export async functions, so exporting an
 * initial-state object from there would hand the client `undefined`.
 */
export type FundFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Record<string, string>;
};

export const initialFundState: FundFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export type AdminState = {
  status: "idle" | "error" | "success";
  message: string;
};

export const initialAdminState: AdminState = { status: "idle", message: "" };
