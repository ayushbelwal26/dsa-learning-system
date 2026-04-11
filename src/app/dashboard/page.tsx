import Link from "next/link";
import { signOut } from "./actions";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <p className="text-lg font-semibold text-[#22c55e]">AlgoPath</p>
            </div>
            
            {/* Sign Out Button */}
            <div className="flex items-center">
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-red-600 bg-transparent px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
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
