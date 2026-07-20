"use client";

import Image from "next/image";
import { useActionState } from "react";
import { platformLoginAction, type LoginState } from "@/lib/actions/platformAuth";

const initialState: LoginState = {};

export default function PlatformLoginPage() {
  const [state, formAction, isPending] = useActionState(platformLoginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-white px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-graphite">
            <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
            Teqxure<span className="text-blue">.</span>
          </span>
          <h1 className="mt-3 text-xl font-medium text-graphite">Welcome back</h1>
          <p className="mt-1 text-sm text-slate">Sign in to your Teqxure workspace.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-light-gray bg-white p-8 shadow-sm">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-blue"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-blue"
            />
          </label>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate">
          New to Teqxure? Your program manager will send you an invite to set up your account.
        </p>
      </div>
    </div>
  );
}
