"use client";

import { useActionState } from "react";
import { signInAdmin } from "../actions";
import { initialAdminState } from "../fund-state";

export default function AdminSignIn() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialAdminState);

  return (
    <form action={formAction} className="card max-w-[420px] p-7">
      <label
        htmlFor="admin-password"
        className="mb-1.5 block text-[14.5px] font-semibold text-deep-2"
      >
        Passphrase
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        aria-invalid={state.status === "error" ? true : undefined}
        className={`input ${state.status === "error" ? "border-error" : ""}`}
      />
      {state.status === "error" && (
        <p role="alert" className="mt-1.5 text-[13px] font-semibold text-error">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-5 w-full justify-center disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
