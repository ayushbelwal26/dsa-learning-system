import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  LogOut,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Video,
  Link2,
  FileText,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Topic = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order_index: number;
};

type Problem = {
  id: string;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string | null;
};

type Resource = {
  id: string;
  title: string;
  url: string;
  type: "video" | "article" | "blog" | "interactive" | string;
};

type Attempt = {
  problem_id: string;
  status: string;
};

type TopicProgress = {
  topic_id: string;
  confidence: string | null;
  completed_at: string | null;
  next_revision_at: string | null;
} | null;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const difficultyColor: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};
const difficultyBg: Record<string, string> = {
  Easy: "#22c55e18",
  Medium: "#f59e0b18",
  Hard: "#ef444418",
};

function resourceIcon(type: string) {
  switch (type) {
    case "video":
      return <Video size={14} color="#71717a" />;
    case "article":
    case "blog":
      return <FileText size={14} color="#71717a" />;
    default:
      return <Link2 size={14} color="#71717a" />;
  }
}

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return url.replace("watch?v=", "embed/");
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── Data fetching ──────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!topic) redirect("/roadmap");

  const { data: problemsRaw } = await supabase
    .from("problems")
    .select("*")
    .eq("topic_id", topic.id);

  const { data: resourcesRaw } = await supabase
    .from("resources")
    .select("*")
    .eq("topic_id", topic.id);

  const { data: topicProgress } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("topic_id", topic.id)
    .single();

  const { data: attemptsRaw } = await supabase
    .from("problem_attempts")
    .select("*")
    .eq("user_id", user.id);

  // ── Cast types ─────────────────────────────
  const t = topic as Topic;
  const problems: Problem[] = (problemsRaw ?? []) as Problem[];
  const resources: Resource[] = (resourcesRaw ?? []) as Resource[];
  const progress: TopicProgress = topicProgress as TopicProgress;
  const attempts: Attempt[] = (attemptsRaw ?? []) as Attempt[];

  // ── Derived ────────────────────────────────
  const isCompleted = progress?.confidence === "strong";

  const solvedIds = new Set(
    attempts.filter((a) => a.status === "solved").map((a) => a.problem_id),
  );
  const solved = problems.filter((p) => solvedIds.has(p.id)).length;
  const total = problems.length;
  const progressPct = total > 0 ? Math.round((solved / total) * 100) : 0;

  const videoResource = resources.find((r) => r.type === "video");
  const embedUrl = videoResource ? youtubeEmbed(videoResource.url) : null;

  // ── Server actions ─────────────────────────
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  async function markComplete() {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_topic_progress")
      .upsert(
        {
          user_id: user.id,
          topic_id: t.id,
          confidence: "strong",
          completed_at: new Date().toISOString(),
          next_revision_at: new Date(Date.now() + 86400000).toISOString(),
        },
        { onConflict: "user_id,topic_id" },
      );

    revalidatePath("/dashboard");
    revalidatePath("/roadmap");
    revalidatePath(`/topic/${slug}`);
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

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link
              href="/dashboard"
              style={{ fontSize: 14, color: "#71717a", textDecoration: "none" }}
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
          padding: "32px 24px 80px",
        }}
      >
        {/* ── Back link ────────────────────── */}
        <Link
          href="/roadmap"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#71717a",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={13} />
          Back to Roadmap
        </Link>

        {/* ── Page header ──────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {t.title}
            </h1>
            {isCompleted && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  color: "#22c55e",
                  backgroundColor: "#22c55e18",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                ✓ COMPLETED
              </span>
            )}
          </div>
          {t.description && (
            <p style={{ fontSize: 15, color: "#71717a", maxWidth: 600 }}>
              {t.description}
            </p>
          )}
        </div>

        {/* ── Two-column layout ────────────── */}
        <div
          className="topic-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 65fr) minmax(0, 35fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN ────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Watch & Learn */}
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
                <Video size={16} color="#3b82f6" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  Watch &amp; Learn
                </span>
              </div>

              {embedUrl ? (
                <div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "56.25%",
                      borderRadius: 10,
                      overflow: "hidden",
                      backgroundColor: "#0d0d0d",
                      marginBottom: 12,
                    }}
                  >
                    <iframe
                      src={embedUrl}
                      title={videoResource!.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: 10,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 13, color: "#71717a" }}>
                    {videoResource!.title}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#0d0d0d",
                    border: "1px dashed #2a2a2a",
                    borderRadius: 10,
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "#3f3f46",
                    fontSize: 13,
                  }}
                >
                  No video resource yet
                </div>
              )}
            </section>

            {/* Practice Problems */}
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
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <BookOpen size={16} color="#a855f7" />
                  <span style={{ fontSize: 15, fontWeight: 600 }}>
                    Practice Problems
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: solved > 0 ? "#22c55e" : "#3f3f46",
                    backgroundColor: solved > 0 ? "#22c55e18" : "#1a1a1a",
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {solved}/{total} solved
                </span>
              </div>

              {problems.length === 0 ? (
                <p style={{ fontSize: 13, color: "#3f3f46" }}>
                  No problems added yet
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr>
                        {["#", "Problem", "Difficulty", "Pattern", ""].map(
                          (h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "0 12px 12px 0",
                                color: "#3f3f46",
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                borderBottom: "1px solid #1f1f1f",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {problems.map((p, i) => {
                        const isSolved = solvedIds.has(p.id);
                        return (
                          <tr key={p.id}>
                            <td
                              style={{
                                padding: "12px 12px 12px 0",
                                color: "#3f3f46",
                                borderBottom: "1px solid #141414",
                                verticalAlign: "middle",
                              }}
                            >
                              {isSolved ? (
                                <CheckCircle2
                                  size={14}
                                  color="#22c55e"
                                  style={{ display: "block" }}
                                />
                              ) : (
                                String(i + 1).padStart(2, "0")
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px 12px 12px 0",
                                color: "#fafafa",
                                borderBottom: "1px solid #141414",
                                verticalAlign: "middle",
                                maxWidth: 220,
                              }}
                            >
                              {p.title}
                            </td>
                            <td
                              style={{
                                padding: "12px 12px 12px 0",
                                borderBottom: "1px solid #141414",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color:
                                    difficultyColor[p.difficulty] ?? "#71717a",
                                  backgroundColor:
                                    difficultyBg[p.difficulty] ?? "#1f1f1f",
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                }}
                              >
                                {p.difficulty}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px 12px 12px 0",
                                borderBottom: "1px solid #141414",
                                color: "#3f3f46",
                                fontSize: 12,
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.pattern ?? "—"}
                            </td>
                            <td
                              style={{
                                padding: "12px 0",
                                borderBottom: "1px solid #141414",
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#71717a",
                                  backgroundColor: "#1a1a1a",
                                  border: "1px solid #2a2a2a",
                                  borderRadius: 7,
                                  padding: "4px 10px",
                                  textDecoration: "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Solve
                                <ExternalLink size={10} />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT COLUMN (sticky) ───────── */}
          <div style={{ position: "sticky", top: 72 }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Your Progress */}
              <section
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 14,
                  padding: 22,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  Your Progress
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#71717a" }}>Problems Solved</span>
                  <span style={{ fontWeight: 600 }}>
                    {solved}/{total}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    backgroundColor: "#1f1f1f",
                    borderRadius: 999,
                    overflow: "hidden",
                    marginBottom: 12,
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

                {solved === 0 && (
                  <p style={{ fontSize: 12, color: "#3f3f46" }}>
                    Start solving problems!
                  </p>
                )}
              </section>

              {/* Mark Complete */}
              <section
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 14,
                  padding: 22,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  Mark Complete
                </p>

                {isCompleted ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 12,
                      }}
                    >
                      <CheckCircle2 size={15} color="#22c55e" />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#22c55e",
                        }}
                      >
                        Topic Completed
                      </span>
                    </div>
                    <Link
                      href="/roadmap"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 13,
                        color: "#71717a",
                        textDecoration: "none",
                      }}
                    >
                      <ChevronRight size={13} />
                      View Next Topic
                    </Link>
                  </div>
                ) : (
                  <form action={markComplete}>
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        backgroundColor: "#22c55e",
                        color: "#0a0a0a",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        borderRadius: 9,
                        padding: "10px 0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                      }}
                    >
                      <CheckCircle2 size={15} />
                      Mark Topic Complete
                    </button>
                  </form>
                )}
              </section>

              {/* Resources */}
              <section
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid #1f1f1f",
                  borderRadius: 14,
                  padding: 22,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  Resources
                </p>

                {resources.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#3f3f46" }}>
                    No resources yet
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {resources.map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          fontSize: 13,
                          color: "#a1a1aa",
                          textDecoration: "none",
                          backgroundColor: "#0d0d0d",
                          border: "1px solid #1f1f1f",
                          borderRadius: 8,
                          padding: "9px 12px",
                        }}
                      >
                        {resourceIcon(r.type)}
                        <span
                          style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.title}
                        </span>
                        <ExternalLink
                          size={11}
                          color="#3f3f46"
                          style={{ flexShrink: 0 }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .topic-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
