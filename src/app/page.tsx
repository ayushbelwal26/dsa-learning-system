import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#1f1f1f] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
              A
            </div>
            <span className="text-xl font-bold text-white">AlgoPath</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#71717a] hover:text-white transition-colors">
              Features
            </a>
            <Link href="/roadmap" className="text-[#71717a] hover:text-white transition-colors">
              Roadmap
            </Link>
            <a href="#pricing" className="text-[#71717a] hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          {/* Get Started Button */}
          <Link 
            href="/login"
            className="bg-[#22c55e] text-[#0a0a0a] px-4 py-2 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1f1f1f] px-3 py-1 rounded-full text-sm text-[#71717a] mb-6">
            <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
            AI-powered DSA learning
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stop Grinding Randomly. <br />
            Start Learning with Direction.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-[#71717a] mb-8 leading-relaxed">
            Your AI-powered DSA guide that tells you exactly what to study every day.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-[#22c55e] text-[#0a0a0a] px-6 py-3 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors"
            >
              Start Learning Free
            </Link>
            <a
              href="#how-it-works"
              className="border border-[#1f1f1f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1f1f1f] transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sound familiar?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Problem Card 1 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="text-4xl mb-4">YouTube</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Watching random YouTube videos with no direction
            </h3>
            <p className="text-[#71717a]">
              Jumping from one tutorial to another without a clear learning path
            </p>
          </div>

          {/* Problem Card 2 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="text-4xl mb-4">LeetCode</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Jumping between LeetCode and blogs randomly
            </h3>
            <p className="text-[#71717a]">
              Solving random problems without understanding the underlying concepts
            </p>
          </div>

          {/* Problem Card 3 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="text-4xl mb-4">?</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Not knowing what to study next
            </h3>
            <p className="text-[#71717a]">
              Feeling overwhelmed and unsure about your learning progression
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to stay on track
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="w-12 h-12 bg-[#22c55e]/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-[#22c55e] rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Structured Roadmap
            </h3>
            <p className="text-[#71717a] text-sm">
              Expert-curated learning path from beginner to advanced
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Curated Resources
            </h3>
            <p className="text-[#71717a] text-sm">
              Best videos, articles, and problems for each topic
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Daily Planner
            </h3>
            <p className="text-[#71717a] text-sm">
              Personalized study plan based on your schedule and goals
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6 hover:border-[#2f2f2f] transition-colors">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-amber-500 rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Smart Revision System
            </h3>
            <p className="text-[#71717a] text-sm">
              Spaced repetition to keep concepts fresh in your mind
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a0a0a] mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Enter your time
            </h3>
            <p className="text-[#71717a]">
              Tell us how much time you can dedicate to DSA daily
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a0a0a] mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI builds your plan
            </h3>
            <p className="text-[#71717a]">
              Our AI creates a personalized learning roadmap just for you
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a0a0a] mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Execute and improve
            </h3>
            <p className="text-[#71717a]">
              Follow your daily plan and watch your progress grow
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center bg-[#111111] border border-[#1f1f1f] rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to stop being confused?
          </h2>
          <p className="text-lg text-[#71717a] mb-8 max-w-2xl mx-auto">
            Join thousands of students who are learning DSA the smart way with AlgoPath.
          </p>
          <Link
            href="/login"
            className="bg-[#22c55e] text-[#0a0a0a] px-8 py-3 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors text-lg"
          >
            Start Learning Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                A
              </div>
              <span className="text-xl font-bold text-white">AlgoPath</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 text-[#71717a] text-sm">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <Link href="/roadmap" className="hover:text-white transition-colors">
                Roadmap
              </Link>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-[#71717a] text-sm">
            © 2024 AlgoPath. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
