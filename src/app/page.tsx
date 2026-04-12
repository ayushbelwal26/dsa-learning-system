import Link from "next/link";
import {
  Map,
  Bookmark,
  Zap,
  Repeat,
  CheckCircle2,
  Play,
  LayoutGrid,
  BrainCircuit,
} from "lucide-react";

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const problems = [
  {
    icon: Play,
    color: "#ef4444",
    title: "Random YouTube rabbit holes",
    desc: "Watching video after video with no clear direction or goal",
  },
  {
    icon: LayoutGrid,
    color: "#f97316",
    title: "Tab chaos",
    desc: "Jumping between LeetCode, blogs, sheets and getting nowhere",
  },
  {
    icon: BrainCircuit,
    color: "#eab308",
    title: "Decision fatigue",
    desc: "Spending 30 minutes deciding what to study instead of studying",
  },
];

const features = [
  {
    icon: Map,
    title: "Structured Roadmap",
    desc: "Clear path from Arrays to DP. No confusion about what's next.",
    hero: false,
  },
  {
    icon: Bookmark,
    title: "Curated Resources",
    desc: "Best video + problems for every topic. We remove the noise.",
    hero: false,
  },
  {
    icon: Zap,
    title: "AI Daily Planner",
    desc: "Tell us your time. We tell you exactly what to do today.",
    hero: true,
  },
  {
    icon: Repeat,
    title: "Smart Revision",
    desc: "Spaced repetition so you never forget what you learned.",
    hero: false,
  },
];

const steps = [
  {
    num: "01",
    title: "Tell us your goal",
    desc: "Choose your study mode and how much time you have daily",
  },
  {
    num: "02",
    title: "Get your daily plan",
    desc: "AI builds a personalized plan based on your progress",
  },
  {
    num: "03",
    title: "Track and improve",
    desc: "Mark problems solved, track weak areas, revise on time",
  },
];

const pricingFeatures = [
  "Full DSA roadmap access",
  "Curated resources for every topic",
  "AI daily planner (5 plans/day)",
  "Progress tracking",
  "Spaced revision reminders",
];

const companies = ["Google", "Amazon", "Microsoft", "Flipkart", "Adobe"];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div
      style={{ backgroundColor: "#0a0a0a", color: "#fafafa", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      className="min-h-screen"
    >
      {/* ── NAVBAR ─────────────────────────────── */}
      <nav
        style={{
          backgroundColor: "rgba(10,10,10,0.85)",
          borderBottom: "1px solid #1f1f1f",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          height: "56px",
        }}
        className="fixed top-0 inset-x-0 z-50 flex items-center px-6"
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span
              style={{ backgroundColor: "#22c55e", width: 20, height: 20 }}
              className="rounded-full flex-shrink-0"
            />
            <span style={{ color: "#fafafa", fontWeight: 600, fontSize: 15 }}>
              AlgoPath
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Roadmap", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{ color: "#71717a", fontSize: 14, textDecoration: "none" }}
                className="hover:text-white transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{
                color: "#71717a",
                fontSize: 14,
                textDecoration: "none",
                padding: "6px 14px",
                border: "1px solid #1f1f1f",
                borderRadius: 8,
              }}
              className="hidden sm:inline-flex items-center hover:border-zinc-600 hover:text-white transition-all duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              style={{
                backgroundColor: "#22c55e",
                color: "#0a0a0a",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
              }}
              className="inline-flex items-center hover:opacity-90 transition-opacity duration-150"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center text-center overflow-hidden"
        style={{ paddingTop: 176, paddingBottom: 100 }}
      >
        {/* Radial green glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 420,
            background:
              "radial-gradient(ellipse at center, rgba(34,197,94,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #1f1f1f",
            backgroundColor: "#111111",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            color: "#71717a",
            marginBottom: 28,
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              flexShrink: 0,
              boxShadow: "0 0 6px #22c55e",
            }}
          />
          AI-powered DSA learning
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Stop Grinding Randomly.
          <br />
          <span style={{ color: "#22c55e" }}>Start Learning with Direction.</span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "#71717a",
            maxWidth: 500,
            lineHeight: 1.65,
          }}
        >
          AlgoPath tells you exactly what to study every day.
          <br />
          No more confusion. No more wasted time.
        </p>

        {/* CTA buttons */}
        <div
          style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href="/login"
            style={{
              backgroundColor: "#22c55e",
              color: "#0a0a0a",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              height: 44,
              padding: "0 24px",
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
            }}
            className="hover:opacity-90 transition-opacity duration-150"
          >
            Start Learning Free
          </Link>
          <Link
            href="/login"
            style={{
              color: "#fafafa",
              fontSize: 15,
              textDecoration: "none",
              height: 44,
              padding: "0 24px",
              borderRadius: 10,
              border: "1px solid #1f1f1f",
              display: "inline-flex",
              alignItems: "center",
            }}
            className="hover:border-zinc-600 transition-colors duration-150"
          >
            See how it works ↓
          </Link>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────── */}
      <div
        style={{
          backgroundColor: "#111111",
          borderTop: "1px solid #1f1f1f",
          borderBottom: "1px solid #1f1f1f",
          padding: "16px 24px",
        }}
      >
        <div
          className="max-w-4xl mx-auto"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
        >
          <span style={{ fontSize: 13, color: "#71717a" }}>
            Trusted by 500+ students preparing for
          </span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {companies.map((c) => (
              <span
                key={c}
                style={{
                  backgroundColor: "#1f1f1f",
                  color: "#71717a",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "4px 14px",
                  borderRadius: 999,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROBLEM SECTION ─────────────────────── */}
      <section id="features" style={{ padding: "96px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#22c55e",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              The Problem
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              Sound familiar?
            </h2>
            <p style={{ fontSize: 15, color: "#71717a" }}>
              Most students struggle with the same problems
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {problems.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 14,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: `${color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={20} color={color} />
                </div>
                <h3
                  style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION SECTION ────────────────────── */}
      <section style={{ padding: "0 24px 96px" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#22c55e",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              The Solution
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {features.map(({ icon: Icon, title, desc, hero }) => (
              <div
                key={title}
                style={{
                  backgroundColor: "#111111",
                  border: `1px solid ${hero ? "#22c55e40" : "#1f1f1f"}`,
                  borderRadius: 14,
                  padding: 24,
                  position: "relative",
                }}
              >
                {hero && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#22c55e",
                      backgroundColor: "#22c55e18",
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    HERO FEATURE
                  </span>
                )}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: hero ? "#22c55e18" : "#1f1f1f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={20} color={hero ? "#22c55e" : "#71717a"} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          borderTop: "1px solid #1f1f1f",
          padding: "96px 24px",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div style={{ marginBottom: 56, textAlign: "center" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              How AlgoPath works
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 0,
              position: "relative",
            }}
          >
            {steps.map(({ num, title, desc }, i) => (
              <div
                key={num}
                style={{
                  padding: "0 32px 0 0",
                  position: "relative",
                }}
              >
                {/* Dashed connector (not last) */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 30,
                      right: 0,
                      width: 32,
                      height: 1,
                      borderTop: "1px dashed #2a2a2a",
                    }}
                    className="hidden md:block"
                  />
                )}
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: "#1f1f1f",
                    lineHeight: 1,
                    display: "block",
                    marginBottom: 16,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {num}
                </span>
                <h3
                  style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────── */}
      <section
        id="pricing"
        style={{ padding: "96px 24px", borderTop: "1px solid #1f1f1f" }}
      >
        <div className="max-w-5xl mx-auto" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#22c55e",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 48,
            }}
          >
            Simple pricing
          </h2>

          {/* Single card */}
          <div
            style={{
              maxWidth: 400,
              margin: "0 auto",
              backgroundColor: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 18,
              padding: "36px 32px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#71717a" }}>
                PLAN
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#22c55e",
                  backgroundColor: "#22c55e18",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                FREE
              </span>
            </div>

            <div style={{ marginBottom: 28 }}>
              <span
                style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.04em" }}
              >
                $0
              </span>
              <span style={{ fontSize: 16, color: "#71717a", marginLeft: 6 }}>
                / month
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid #1f1f1f",
                paddingTop: 24,
                marginBottom: 28,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {pricingFeatures.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#a1a1aa" }}>{f}</span>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#22c55e",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                padding: "12px 0",
                borderRadius: 10,
              }}
              className="hover:opacity-90 transition-opacity duration-150"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────── */}
      <section
        style={{
          backgroundColor: "#111111",
          borderTop: "1px solid #1f1f1f",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 14,
            }}
          >
            Ready to stop being confused?
          </h2>
          <p style={{ fontSize: 15, color: "#71717a", marginBottom: 32 }}>
            Join students who study smarter with AlgoPath
          </p>
          <Link
            href="/login"
            style={{
              backgroundColor: "#22c55e",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            className="hover:opacity-90 transition-opacity duration-150"
          >
            Start Learning Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#0a0a0a",
          borderTop: "1px solid #1f1f1f",
          padding: "40px 24px 28px",
        }}
      >
        <div
          className="max-w-5xl mx-auto"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Left */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{ backgroundColor: "#22c55e", width: 18, height: 18 }}
                className="rounded-full"
              />
              <span style={{ fontWeight: 600, fontSize: 14 }}>AlgoPath</span>
            </div>
            <p style={{ fontSize: 13, color: "#71717a" }}>Built for serious learners</p>
          </div>

          {/* Right links */}
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Features", href: "#features" },
              { label: "Roadmap", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "GitHub", href: "https://github.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{ fontSize: 13, color: "#71717a", textDecoration: "none" }}
                className="hover:text-white transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1f1f1f",
            paddingTop: 20,
            textAlign: "center",
            fontSize: 12,
            color: "#3f3f46",
          }}
        >
          © 2025 AlgoPath. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
