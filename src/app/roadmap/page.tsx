import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, Map, LayoutDashboard, Flame, CalendarDays } from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type TopicRow = {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  description?: string | null;
};

type ProgressRow = {
  topic_id: string;
  confidence: string | null;
  next_revision_at: string | null;
};

type TopicStatus = "completed" | "in-progress" | "locked";

/* ─────────────────────────────────────────────
   HARDCODED METADATA
───────────────────────────────────────────── */
const topicMeta: Record<string, { difficulty: string; problems: number }> = {
  'arrays':               { difficulty: 'Beginner',     problems: 12 },
  'strings':              { difficulty: 'Beginner',     problems: 10 },
  'linked-lists':         { difficulty: 'Beginner',     problems: 8  },
  'binary-search':        { difficulty: 'Beginner',     problems: 9  },
  'recursion':            { difficulty: 'Beginner',     problems: 7  },
  'stacks-queues':        { difficulty: 'Beginner',     problems: 5  },
  'hashing':              { difficulty: 'Beginner',     problems: 5  },
  'trees':                { difficulty: 'Intermediate', problems: 5  },
  'heaps':                { difficulty: 'Intermediate', problems: 5  },
  'graphs':               { difficulty: 'Intermediate', problems: 5  },
  'dynamic-programming':  { difficulty: 'Advanced',     problems: 5  },
  'greedy':               { difficulty: 'Intermediate', problems: 5  },
  'backtracking':         { difficulty: 'Intermediate', problems: 5  },
  'bit-manipulation':     { difficulty: 'Beginner',     problems: 5  },
  'tries':                { difficulty: 'Advanced',     problems: 5  },
};

const fallbackMeta = { difficulty: 'Intermediate', problems: 5 };

// Total problem count across all topics (used in sidebar)
const totalProblems = Object.values(topicMeta).reduce((sum, m) => sum + m.problems, 0);

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getStatus(topicId: string, progress: ProgressRow[]): TopicStatus {
  const p = progress.find((r) => r.topic_id === topicId);
  if (!p) return "locked";
  if (p.confidence === "strong") return "completed";
  return "in-progress";
}

const difficultyColor: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#3b82f6",
  Advanced: "#a855f7",
};

const difficultyBg: Record<string, string> = {
  Beginner: "#22c55e18",
  Intermediate: "#3b82f618",
  Advanced: "#a855f718",
};

const statusColor: Record<TopicStatus, string> = {
  completed: "#22c55e",
  "in-progress": "#f59e0b",
  locked: "#3f3f46",
};

const statusBg: Record<TopicStatus, string> = {
  completed: "#22c55e18",
  "in-progress": "#f59e0b18",
  locked: "#1f1f1f",
};

const statusLabel: Record<TopicStatus, string> = {
  completed: "completed",
  "in-progress": "in progress",
  locked: "locked",
};

const leftBorderColor: Record<TopicStatus, string> = {
  completed: "#22c55e",
  "in-progress": "#f59e0b",
  locked: "#2f2f2f",
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default async function RoadmapPage() {
  // ── Data fetching ──────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: topicsRaw } = await supabase
    .from("topics")
    .select("*")
    .is("parent_id", null)
    .order("order_index");

  const { data: progressRaw } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id);

  const topics: TopicRow[] = topicsRaw ?? [];
  const progress: ProgressRow[] = progressRaw ?? [];

  // ── Derived ────────────────────────────────
  const completedCount = topics.filter(
    (t) => getStatus(t.id, progress) === "completed",
  ).length;
  const total = topics.length;
  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const now = new Date().toISOString();
  const nextRevisionRow = progress
    .filter((p) => p.next_revision_at !== null && p.next_revision_at < now)
    .sort((a, b) =>
      (a.next_revision_at ?? "").localeCompare(b.next_revision_at ?? ""),
    )[0];
  const nextRevisionTopic = nextRevisionRow
    ? topics.find((t) => t.id === nextRevisionRow.topic_id)
    : undefined;

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
              style={{ fontSize: 14, color: "#71717a", textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <Link
              href="/roadmap"
              style={{
                fontSize: 14,
                color: "#fafafa",
                fontWeight: 500,
                textDecoration: "none",
              }}
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
        {/* ── Page header ──────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            DSA Roadmap
          </h1>
          <p style={{ fontSize: 15, color: "#71717a", marginBottom: 20 }}>
            Your structured path from beginner to advanced
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 480 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "#71717a" }}>
                {completedCount} of {total} topics completed
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>
                {progressPct}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                backgroundColor: "#1f1f1f",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  backgroundColor: "#22c55e",
                  borderRadius: 999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Two-column layout ────────────── */}
        <div
          className="roadmap-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 65fr) minmax(0, 35fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* ── LEFT: topic list ───────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topics.length === 0 && (
              <div
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#3f3f46",
                  fontSize: 14,
                }}
              >
                No topics found. Check your database connection.
              </div>
            )}

            {topics.map((topic, idx) => {
              const status = getStatus(topic.id, progress);
              const meta = topicMeta[topic.slug] ?? fallbackMeta;
              const num = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={topic.id}
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #1f1f1f",
                    borderLeft: `3px solid ${leftBorderColor[status]}`,
                    borderRadius: 10,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    opacity: status === "locked" ? 0.5 : 1,
                    transition: "border-color 0.15s, opacity 0.15s",
                  }}
                >
                  {/* Number */}
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#2a2a2a",
                      minWidth: 32,
                      flexShrink: 0,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {num}
                  </span>

                  {/* Title + badges */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#fafafa",
                        marginBottom: 8,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {topic.title}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Difficulty badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: difficultyColor[meta.difficulty] ?? "#71717a",
                          backgroundColor:
                            difficultyBg[meta.difficulty] ?? "#1f1f1f",
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {meta.difficulty}
                      </span>

                      {/* Status badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: statusColor[status],
                          backgroundColor: statusBg[status],
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {statusLabel[status]}
                      </span>

                      {/* Problem count */}
                      <span style={{ fontSize: 11, color: "#3f3f46" }}>
                        {meta.problems} problems
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div style={{ flexShrink: 0 }}>
                    {status === "completed" && (
                      <Link
                        href={`/topic/${topic.slug}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#22c55e",
                          border: "1px solid #22c55e40",
                          backgroundColor: "transparent",
                          borderRadius: 8,
                          padding: "6px 14px",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Review
                      </Link>
                    )}
                    {status === "in-progress" && (
                      <Link
                        href={`/topic/${topic.slug}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0a0a0a",
                          backgroundColor: "#22c55e",
                          borderRadius: 8,
                          padding: "6px 14px",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Continue →
                      </Link>
                    )}
                    {status === "locked" && (
                      <Link
                        href={`/topic/${topic.slug}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#71717a",
                          border: "1px solid #2a2a2a",
                          backgroundColor: "transparent",
                          borderRadius: 8,
                          padding: "6px 14px",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Start
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT: sticky sidebar ──────── */}
          <div
            style={{
              position: "sticky",
              top: 72,
            }}
          >
            <div
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: 24,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <Map size={15} color="#71717a" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  Your Progress
                </span>
              </div>

              {/* Topics stat */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#71717a" }}>Topics</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fafafa",
                    }}
                  >
                    {completedCount}/{total || 10}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    backgroundColor: "#1f1f1f",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPct}%`,
                      backgroundColor: "#22c55e",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Problems stat */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#71717a" }}>Problems</span>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#fafafa" }}
                  >
                     0/{totalProblems}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    backgroundColor: "#1f1f1f",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "0%",
                      backgroundColor: "#3b82f6",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  backgroundColor: "#1f1f1f",
                  margin: "20px 0",
                }}
              />

              {/* Current Streak */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <Flame size={14} color="#f97316" />
                  <span style={{ fontSize: 13, color: "#71717a" }}>
                    Current Streak
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>0 days 🔥</span>
              </div>

              {/* Next Revision */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <CalendarDays size={14} color="#a855f7" />
                  <span style={{ fontSize: 13, color: "#71717a" }}>
                    Next Revision
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: nextRevisionTopic ? "#f59e0b" : "#3f3f46",
                    maxWidth: 120,
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nextRevisionTopic ? nextRevisionTopic.title : "None due"}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  backgroundColor: "#1f1f1f",
                  margin: "20px 0",
                }}
              />

              {/* Quick nav */}
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#71717a",
                  textDecoration: "none",
                }}
              >
                <LayoutDashboard size={14} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Responsive: collapse to single column on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .roadmap-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
