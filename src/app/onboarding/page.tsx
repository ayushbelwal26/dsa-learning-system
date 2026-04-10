"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "./actions";

const GOALS = [
  {
    id: "placement" as const,
    title: "Placement Prep",
    description: "I want to crack product company interviews",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    id: "cp" as const,
    title: "Competitive Programming",
    description: "I want to get better at contests and CP",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 18.75h-9m9 0a3 3 0 01-3 3h-3a3 3 0 01-3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
      />
    ),
  },
  {
    id: "general" as const,
    title: "General Learning",
    description: "I want to learn DSA properly at my own pace",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    ),
  },
];

const TIMES = [
  { id: "30" as const, label: "30 minutes", hint: "For busy days" },
  { id: "60" as const, label: "1 hour", hint: "Recommended for beginners" },
  { id: "120" as const, label: "2 hours", hint: "For serious learners" },
  { id: "180_plus" as const, label: "3+ hours", hint: "Full focus mode" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<(typeof GOALS)[number]["id"] | null>(null);
  const [daily, setDaily] = useState<(typeof TIMES)[number]["id"] | null>(null);
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  function submit(target: string | null) {
    if (!goal || !daily) {
      setError("Please complete the earlier steps.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding(goal, daily, target);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative min-h-full bg-zinc-950 text-zinc-100 antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.1),transparent)]"
        aria-hidden
      />
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>
              Step {step} of 3
            </span>
            <span className="text-[#22c55e]">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#22c55e] transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2">
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
          <span className="text-sm font-semibold text-white">AlgoPath</span>
        </div>

        {error ? (
          <p
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {step === 1 ? (
          <section aria-labelledby="step1-title">
            <h1
              id="step1-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              What&apos;s your goal?
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Pick the path that best matches what you&apos;re aiming for.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {GOALS.map((g) => {
                const selected = goal === g.id;
                return (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                        selected
                          ? "border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]/40"
                          : "border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900/60"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-[#22c55e]/20 text-[#22c55e]"
                            : "bg-white/5 text-zinc-400"
                        }`}
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          {g.icon}
                        </svg>
                      </span>
                      <span>
                        <span className="block font-medium text-white">
                          {g.title}
                        </span>
                        <span className="mt-1 block text-sm text-zinc-400">
                          {g.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              disabled={!goal}
              onClick={() => setStep(2)}
              className="mt-10 w-full rounded-full bg-[#22c55e] py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-8px_rgba(34,197,94,0.5)] transition hover:bg-[#4ade80] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </section>
        ) : null}

        {step === 2 ? (
          <section aria-labelledby="step2-title">
            <h1
              id="step2-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              How much time can you dedicate daily?
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Be honest—you can change this later as your schedule shifts.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TIMES.map((t) => {
                const selected = daily === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setDaily(t.id)}
                      className={`flex h-full w-full flex-col rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]/40"
                          : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                      }`}
                    >
                      <span className="font-medium text-white">{t.label}</span>
                      <span className="mt-1 text-xs text-zinc-500">{t.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                disabled={!daily}
                onClick={() => setStep(3)}
                className="flex-1 rounded-full bg-[#22c55e] py-3 text-sm font-semibold text-zinc-950 transition hover:bg-[#4ade80] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border border-white/15 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
              >
                Back
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section aria-labelledby="step3-title">
            <h1
              id="step3-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              When is your target date?
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Optional—set a deadline for interviews or a contest you care
              about.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Skip if you don&apos;t have a deadline
            </p>
            <div className="mt-8">
              <label
                htmlFor="target-date"
                className="sr-only"
              >
                Target date
              </label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20 [color-scheme:dark]"
              />
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={pending}
                onClick={() => submit(targetDate || null)}
                className="flex-1 rounded-full bg-[#22c55e] py-3 text-sm font-semibold text-zinc-950 transition hover:bg-[#4ade80] disabled:opacity-60 sm:min-w-[140px]"
              >
                {pending ? "Saving…" : "Let's Go"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => submit(null)}
                className="flex-1 rounded-full border border-white/15 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5 disabled:opacity-60 sm:min-w-[140px]"
              >
                Skip
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setStep(2)}
                className="w-full rounded-full border border-transparent py-3 text-sm text-zinc-500 transition hover:text-zinc-300 sm:w-auto sm:px-4"
              >
                Back
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
