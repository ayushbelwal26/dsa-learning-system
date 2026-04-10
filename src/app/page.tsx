export default function Home() {
  return (
    <div className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30">
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
          </a>

          <nav
            className="order-3 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 md:order-none md:w-auto md:justify-end"
            aria-label="Primary"
          >
            <a
              href="#features"
              className="transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#roadmap"
              className="transition-colors hover:text-white"
            >
              Roadmap
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-white"
            >
              Pricing
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-full bg-[#22c55e] px-4 py-2 text-sm font-medium text-zinc-950 shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)] transition hover:bg-[#4ade80] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Get Started
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-1 text-xs font-medium text-[#4ade80]">
              AI-powered DSA learning
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-tight">
              Stop Grinding Randomly.{" "}
              <span className="text-[#22c55e]">Start Learning with Direction.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-400">
              Your AI-powered DSA guide that tells you exactly what to study
              every day.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#22c55e] px-8 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-6px_rgba(34,197,94,0.45)] transition hover:bg-[#4ade80] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Start Learning Free
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section
          className="border-t border-white/5 bg-zinc-900/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          aria-labelledby="problem-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="problem-heading"
              className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Sound familiar?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
              Most students burn out not from lack of effort—but from lack of a
              clear path.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Random YouTube rabbit holes",
                  body: "Watching random videos with no direction—hours gone, little progress.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  ),
                },
                {
                  title: "Tab chaos",
                  body: "Jumping between LeetCode and blogs randomly without a cohesive plan.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  ),
                },
                {
                  title: "Decision fatigue",
                  body: "Not knowing what to study next—so you stall or default to easy problems.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-[#22c55e]/25 hover:bg-zinc-900/80"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/20">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="features-heading"
              className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Everything you need to stay on track
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
              AlgoPath turns scattered resources into one guided journey.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Structured Roadmap",
                  body: "A clear progression from foundations to advanced patterns—no guesswork.",
                },
                {
                  title: "Curated Resources",
                  body: "Hand-picked articles, visuals, and practice—quality over endless tabs.",
                },
                {
                  title: "AI Daily Planner",
                  body: "A focused plan each day based on your pace, goals, and weak spots.",
                },
                {
                  title: "Smart Revision System",
                  body: "Spaced reminders so concepts stick—not fade after one pass.",
                },
              ].map((f, i) => (
                <li
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-[#22c55e]/30"
                >
                  <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/15 text-xs font-bold text-[#22c55e] ring-1 ring-[#22c55e]/25">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {f.body}
                  </p>
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#22c55e]/10 blur-2xl transition group-hover:bg-[#22c55e]/15"
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Roadmap teaser — anchor target for nav */}
        <section
          id="roadmap"
          className="border-t border-white/5 bg-zinc-900/20 px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="roadmap-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2
                  id="roadmap-heading"
                  className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                  A roadmap that actually fits you
                </h2>
                <p className="mt-3 text-zinc-400">
                  Pick a goal—interviews, contests, or deep fundamentals—and
                  follow a path that adapts as you improve. No more “what
                  should I do today?”
                </p>
              </div>
              <ol className="flex flex-col gap-3 text-sm text-zinc-300 lg:text-right">
                <li className="flex items-center gap-3 lg:flex-row-reverse">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-zinc-950">
                    1
                  </span>
                  <span className="text-zinc-400 lg:text-zinc-300">
                    Foundations & complexity
                  </span>
                </li>
                <li className="flex items-center gap-3 lg:flex-row-reverse">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 text-xs font-bold text-[#22c55e]">
                    2
                  </span>
                  <span className="text-zinc-400 lg:text-zinc-300">
                    Core data structures
                  </span>
                </li>
                <li className="flex items-center gap-3 lg:flex-row-reverse">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold text-zinc-500">
                    3
                  </span>
                  <span className="text-zinc-400 lg:text-zinc-300">
                    Patterns & problem solving
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          aria-labelledby="how-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="how-heading"
              className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
              Three steps from chaos to consistency.
            </p>
            <div className="relative mx-auto mt-14 max-w-4xl">
              <div
                className="pointer-events-none absolute left-4 top-8 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#22c55e]/50 via-white/10 to-transparent md:left-[calc(16.666%-2px)] md:block lg:left-1/2 lg:-translate-x-px"
                aria-hidden
              />
              <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
              {[
                {
                  step: "01",
                  title: "Set your goal",
                  body: "Tell AlgoPath your timeline and target—campus prep, FAANG, or mastery.",
                },
                {
                  step: "02",
                  title: "Get your daily plan",
                  body: "Receive a focused mix of theory, practice, and review—no more random hopping.",
                },
                {
                  step: "03",
                  title: "Track & improve",
                  body: "Revision kicks in automatically so weak areas get attention before interviews.",
                },
              ].map((s) => (
                <li
                  key={s.step}
                  className="relative rounded-2xl border border-white/10 bg-zinc-900/40 p-6 pt-8 md:pt-6"
                >
                  <span className="absolute -top-3 left-6 inline-flex rounded-lg bg-zinc-950 px-2 py-0.5 text-xs font-bold tracking-wider text-[#22c55e] ring-1 ring-[#22c55e]/30">
                    {s.step}
                  </span>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {s.body}
                  </p>
                </li>
              ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section
          id="pricing"
          className="border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="pricing-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Simple pricing when you&apos;re ready
            </h2>
            <p className="mt-3 text-zinc-400">
              Start free. Upgrade when you want deeper AI planning and advanced
              analytics.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/50 p-8">
              <p className="text-sm font-medium text-[#22c55e]">Free tier</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                $0
                <span className="text-base font-normal text-zinc-500">
                  {" "}
                  / forever
                </span>
              </p>
              <p className="mt-4 text-sm text-zinc-400">
                Core roadmap, curated resources, and daily study structure.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="px-4 pb-20 pt-4 sm:px-6 lg:px-8"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#22c55e]/20 bg-gradient-to-br from-[#22c55e]/10 via-zinc-900/80 to-zinc-950 px-6 py-14 text-center sm:px-12">
            <h2
              id="cta-heading"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Ready for a smarter study routine?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">
              Join AlgoPath and let your next step be obvious—every single day.
            </p>
            <a
              href="/login"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#22c55e] px-10 text-sm font-semibold text-zinc-950 shadow-[0_0_32px_-8px_rgba(34,197,94,0.55)] transition hover:bg-[#4ade80] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Start Learning Free
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-lg font-semibold text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30">
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
            </a>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              Directional DSA learning for serious students.
            </p>
          </div>
          <nav
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-400 sm:justify-end"
            aria-label="Footer"
          >
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#roadmap" className="hover:text-white">
              Roadmap
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
          </nav>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-zinc-600 sm:text-left">
          © {new Date().getFullYear()} AlgoPath. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
