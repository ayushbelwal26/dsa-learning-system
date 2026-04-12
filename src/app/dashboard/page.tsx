import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlanGenerator } from "@/components/plan-generator";
import { RevisionCard } from "@/components/revision-card";
import {
  BarChart2,
  Flame,
  Target,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  Map,
  LogOut,
} from "lucide-react";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getHour() {
  return new Date().getHours();
}

function greeting(name: string) {
  const h = getHour();
  const salutation =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${salutation}, ${name} 👋`;
}

type ProgressRow = {
  topic_id:         string;
  confidence:       string | null;
  next_revision_at: string | null;
  revision_count?:  number;
};
type TopicRow = {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  description?: string | null;
};

function topicStatus(topicId: string, progress: ProgressRow[]) {
  const p = progress.find((r) => r.topic_id === topicId);
  if (!p) return "locked";
  if (p.confidence === "strong") return "completed";
  return "in-progress";
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default async function DashboardPage() {
  // ── Data fetching ──────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .is("parent_id", null)
    .order("order_index");

  const { data: progress } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id);

  const { data: attempts } = await supabase
    .from("problem_attempts")
    .select("*")
    .eq("user_id", user.id);

  // ── Derived stats ──────────────────────────
  const safeProgress: ProgressRow[] = progress ?? [];
  const safeTopics: TopicRow[] = topics ?? [];
  const safeAttempts = attempts ?? [];

  const completedTopics =
    safeProgress.filter((p) => p.confidence === "strong").length || 0;
  const solvedProblems =
    safeAttempts.filter((a) => (a as { status: string }).status === "solved")
      .length || 0;
  const userName =
    (profile as { first_name?: string } | null)?.first_name ||
    user.user_metadata?.full_name?.split(" ")[0] ||
    "there";

  const weakTopics = safeTopics.filter((t) => {
    const p = safeProgress.find((r) => r.topic_id === t.id);
    return p?.confidence === "weak";
  });

  const now = new Date().toISOString();
  const revisionDue = safeProgress.filter(
    (p) =>
      p.next_revision_at !== null &&
      p.next_revision_at !== undefined &&
      p.next_revision_at < now,
  );

  // Build serialisable array for RevisionCard client component
  const revisionItems = revisionDue
    .map((r) => {
      const topic = safeTopics.find((t) => t.id === r.topic_id);
      if (!topic) return null;
      return {
        topicId:        r.topic_id,
        topicTitle:     topic.title,
        topicSlug:      topic.slug,
        nextRevisionAt: r.next_revision_at ?? now,
        revisionCount:  r.revision_count ?? 0,
      };
    })
    .filter(Boolean) as {
      topicId: string;
      topicTitle: string;
      topicSlug: string;
      nextRevisionAt: string;
      revisionCount: number;
    }[];

  // First topic with no progress record at all
  const continueTopicId = safeTopics.find(
    (t) => !safeProgress.find((p) => p.topic_id === t.id),
  );

  const interviewReadiness = Math.round((completedTopics / 10) * 100);

  // ── Server action ──────────────────────────
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  // ── Render ─────────────────────────────────
  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        minHeight: "100vh",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {/* ── NAVBAR ───────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 56,
          backgroundColor: "rgba(10,10,10,0.85)",
          borderBottom: "1px solid #1f1f1f",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#fafafa", fontWeight: 600, fontSize: 15 }}>
              AlgoPath
            </span>
          </Link>

          {/* Center links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: 14,
                color: "#fafafa",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/roadmap"
              style={{ fontSize: 14, color: "#71717a", textDecoration: "none" }}
            >
              Roadmap
            </Link>
          </div>

          {/* Sign out */}
          <form action={signOut}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#71717a",
                backgroundColor: "transparent",
                border: "1px solid #1f1f1f",
                borderRadius: 8,
                padding: "5px 12px",
                cursor: "pointer",
              }}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* ── MAIN ─────────────────────────────── */}
      <main
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* ── Greeting ─────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {greeting(userName)}
          </h1>
          <p style={{ fontSize: 15, color: "#71717a" }}>
            Ready to continue your DSA journey?
          </p>
        </div>

        {/* ── Stats row ────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            {
              icon: Target,
              label: "Topics Completed",
              value: `${completedTopics}/10`,
              color: "#22c55e",
            },
            {
              icon: CheckCircle2,
              label: "Problems Solved",
              value: `${solvedProblems}/45`,
              color: "#3b82f6",
            },
            {
              icon: Flame,
              label: "Current Streak",
              value: "0 days 🔥",
              color: "#f97316",
            },
            {
              icon: BarChart2,
              label: "Interview Readiness",
              value: `${interviewReadiness}%`,
              color: "#a855f7",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 12,
                padding: "20px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Icon size={14} color={color} />
                <span style={{ fontSize: 12, color: "#71717a" }}>{label}</span>
              </div>
              <p
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#fafafa",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 65fr) minmax(0, 35fr)",
            gap: 16,
            alignItems: "start",
          }}
          className="dashboard-grid"
        >
          {/* ── LEFT COLUMN ────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Today's Plan — interactive client component */}
            <PlanGenerator />

            {/* Continue Learning */}
            <section
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <BookOpen size={16} color="#3b82f6" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  Continue Learning
                </span>
              </div>

              {continueTopicId ? (
                <Link
                  href={`/topic/${continueTopicId.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      backgroundColor: "#0d0d0d",
                      border: "1px solid #1f1f1f",
                      borderRadius: 10,
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#fafafa",
                          marginBottom: 4,
                        }}
                      >
                        {continueTopicId.title}
                      </p>
                      <p style={{ fontSize: 12, color: "#71717a" }}>
                        Not started · Begin now →
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: "#22c55e18",
                        color: "#22c55e",
                        padding: "3px 10px",
                        borderRadius: 999,
                      }}
                    >
                      START
                    </span>
                  </div>
                </Link>
              ) : (
                <p style={{ fontSize: 13, color: "#71717a" }}>
                  🎉 All topics started. Check your weak areas below.
                </p>
              )}
            </section>

            {/* Weak Areas */}
            <section
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <AlertTriangle size={16} color="#f97316" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  Weak Areas
                </span>
              </div>

              {weakTopics.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {weakTopics.map((t) => (
                    <Link
                      key={t.id}
                      href={`/topic/${t.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          backgroundColor: "#0d0d0d",
                          border: "1px solid #2a1a0e",
                          borderRadius: 9,
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: 14, color: "#fafafa" }}>
                          {t.title}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#f97316",
                            backgroundColor: "#f9731618",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          weak
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#71717a" }}>
                  No weak areas yet. Keep learning!
                </p>
              )}
            </section>
          </div>

          {/* ── RIGHT COLUMN ───────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Revision Due — interactive client component */}
            <RevisionCard items={revisionItems} />

            {/* Roadmap Progress */}
            <section
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <Map size={15} color="#71717a" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  Roadmap Progress
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  marginBottom: 16,
                }}
              >
                {safeTopics.slice(0, 8).map((t) => {
                  const status = topicStatus(t.id, safeProgress);
                  const dot =
                    status === "completed"
                      ? "✅"
                      : status === "in-progress"
                        ? "🔄"
                        : "⬜";
                  return (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{dot}</span>
                      <span
                        style={{
                          color:
                            status === "locked" ? "#3f3f46" : "#a1a1aa",
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                  );
                })}
                {safeTopics.length === 0 && (
                  <p style={{ fontSize: 13, color: "#3f3f46" }}>
                    No topics found.
                  </p>
                )}
              </div>

              <Link
                href="/roadmap"
                style={{
                  fontSize: 13,
                  color: "#22c55e",
                  textDecoration: "none",
                }}
              >
                View Full Roadmap →
              </Link>
            </section>

            {/* Study Streak */}
            <section
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <Flame size={15} color="#f97316" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  Study Streak
                </span>
              </div>

              {/* 7-day grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dayLabel = d
                    .toLocaleDateString("en", { weekday: "short" })
                    .slice(0, 2);
                  return (
                    <div
                      key={i}
                      style={{ textAlign: "center" }}
                    >
                      <div
                        style={{
                          height: 32,
                          borderRadius: 6,
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #1f1f1f",
                          marginBottom: 5,
                        }}
                      />
                      <span
                        style={{ fontSize: 10, color: "#3f3f46" }}
                      >
                        {dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: 12, color: "#3f3f46" }}>
                Start your streak today!
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* responsive: stack columns on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
