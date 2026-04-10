import Link from "next/link";
import { Suspense } from "react";
import { GoogleSignInButton } from "./google-sign-in-button";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-col bg-zinc-950 text-zinc-100 antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]"
        aria-hidden
      />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </span>
          AlgoPath
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-[0_0_40px_-15px_rgba(34,197,94,0.15)] backdrop-blur-sm sm:p-10">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign in to continue your DSA journey
          </p>

          <div className="mt-8">
            <Suspense
              fallback={
                <div className="flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm text-zinc-500">
                  Loading…
                </div>
              }
            >
              <GoogleSignInButton />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            <Link
              href="/"
              className="text-[#22c55e] transition hover:text-[#4ade80]"
            >
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
