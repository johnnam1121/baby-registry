/**
 * Shared shape for the RSVP form's action state.
 *
 * This deliberately lives outside `actions.ts`: a `"use server"` module may
 * only export async functions, so exporting the initial-state object from
 * there would hand the client `undefined` instead of the object.
 */
export type RsvpState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Record<string, string>;
};

export const initialRsvpState: RsvpState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
