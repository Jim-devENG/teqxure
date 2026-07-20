"use client";

import Image from "next/image";
import { use, useActionState } from "react";
import { acceptInviteAction, type AcceptInviteState } from "@/lib/actions/platformAuth";

const initialState: AcceptInviteState = {};

export default function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = use(searchParams);
  const [state, formAction, isPending] = useActionState(acceptInviteAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-white px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-graphite">
            <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
            Teqxure<span className="text-blue">.</span>
          </span>
          <h1 className="mt-3 text-xl font-medium text-graphite">Set your password</h1>
          <p className="mt-1 text-sm text-slate">Finish setting up your Teqxure workspace account.</p>
        </div>

        {!token ? (
          <p className="rounded-2xl border border-light-gray bg-white p-8 text-center text-sm text-red-500 shadow-sm">
            This link is missing its invite token. Ask your program manager to resend it.
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-light-gray bg-white p-8 shadow-sm">
            <input type="hidden" name="token" value={token} />
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">New password</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-blue"
              />
              <span className="mt-1.5 block text-xs text-slate">At least 8 characters.</span>
            </label>

            {state.error && <p className="text-sm text-red-500">{state.error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark disabled:opacity-60 cursor-pointer"
            >
              {isPending ? "Setting up…" : "Set password & sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
