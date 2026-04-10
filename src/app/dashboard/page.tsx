import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium text-[#22c55e]">AlgoPath</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome to AlgoPath
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Your dashboard is being built.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex text-sm text-zinc-500 transition hover:text-[#22c55e]"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
