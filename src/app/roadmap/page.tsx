import { Navbar } from "@/components/navbar"
import { ProgressSidebar } from "@/components/progress-sidebar"
import { TopicCard, type TopicStatus, type Difficulty } from "@/components/topic-card"

interface Topic {
  number: string
  title: string
  description: string
  difficulty: Difficulty
  status: TopicStatus
  problemCount: number
}

const topics: Topic[] = [
  {
    number: "01",
    title: "Arrays",
    description: "Foundation of DSA",
    difficulty: "Beginner",
    status: "completed",
    problemCount: 12,
  },
  {
    number: "02",
    title: "Strings",
    description: "Text manipulation",
    difficulty: "Beginner",
    status: "in-progress",
    problemCount: 10,
  },
  {
    number: "03",
    title: "Linked Lists",
    description: "Pointer manipulation",
    difficulty: "Beginner",
    status: "locked",
    problemCount: 8,
  },
  {
    number: "04",
    title: "Binary Search",
    description: "Search techniques",
    difficulty: "Beginner",
    status: "locked",
    problemCount: 9,
  },
  {
    number: "05",
    title: "Recursion",
    description: "Recursive thinking",
    difficulty: "Beginner",
    status: "locked",
    problemCount: 7,
  },
  {
    number: "06",
    title: "Stacks & Queues",
    description: "LIFO and FIFO structures",
    difficulty: "Intermediate",
    status: "locked",
    problemCount: 11,
  },
  {
    number: "07",
    title: "Trees",
    description: "Hierarchical data structures",
    difficulty: "Intermediate",
    status: "locked",
    problemCount: 14,
  },
  {
    number: "08",
    title: "Graphs",
    description: "Network traversal problems",
    difficulty: "Advanced",
    status: "locked",
    problemCount: 16,
  },
  {
    number: "09",
    title: "Dynamic Programming",
    description: "Optimization techniques",
    difficulty: "Advanced",
    status: "locked",
    problemCount: 18,
  },
  {
    number: "10",
    title: "Greedy Algorithms",
    description: "Local optimization",
    difficulty: "Advanced",
    status: "locked",
    problemCount: 12,
  },
]

export default function RoadmapPage() {
  const completedTopics = topics.filter((t) => t.status === "completed").length
  const totalTopics = topics.length
  const progressPercentage = (completedTopics / totalTopics) * 100

  const totalProblems = topics.reduce((acc, t) => acc + t.problemCount, 0)
  const problemsSolved = 3

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main 
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '48px 24px 0',
        }}
      >
        {/* Page Header with Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <h1 
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#fafafa',
              marginBottom: '4px',
            }}
          >
            DSA Roadmap
          </h1>
          <p 
            style={{
              fontSize: '14px',
              color: '#71717a',
            }}
          >
            Your structured path from beginner to advanced
          </p>

          {/* Progress Section */}
          <div style={{ marginTop: '24px' }}>
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#71717a' }}>
                Overall Progress
              </span>
              <span style={{ fontSize: '13px', color: '#fafafa', fontWeight: 500 }}>
                {completedTopics} of {totalTopics} topics
              </span>
            </div>
            {/* Progress Bar */}
            <div 
              style={{
                height: '4px',
                backgroundColor: '#1f1f1f',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercentage}%`,
                  backgroundColor: '#22c55e',
                  borderRadius: '9999px',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div 
          style={{
            display: 'flex',
            gap: '32px',
          }}
        >
          {/* Topic Cards - Left Column (65% width) */}
          <div 
            style={{
              flex: '0 0 65%',
            }}
          >
            {topics.map((topic) => (
              <TopicCard
                key={topic.number}
                number={topic.number}
                title={topic.title}
                description={topic.description}
                difficulty={topic.difficulty}
                status={topic.status}
                problemCount={topic.problemCount}
              />
            ))}
          </div>

          {/* Progress Sidebar - Right Column (33% width) */}
          <div 
            style={{
              flex: '0 0 33%',
            }}
          >
            <ProgressSidebar
              topicsCompleted={completedTopics}
              totalTopics={totalTopics}
              problemsSolved={problemsSolved}
              totalProblems={totalProblems}
              currentStreak={5}
              nextRevision="Binary Search"
            />
          </div>
        </div>

        {/* Mobile Progress Stats */}
        <div style={{ marginTop: '32px', display: 'none' }} className="lg:hidden">
          <ProgressSidebar
            topicsCompleted={completedTopics}
            totalTopics={totalTopics}
            problemsSolved={problemsSolved}
            totalProblems={totalProblems}
            currentStreak={5}
            nextRevision="Binary Search"
          />
        </div>
      </main>
    </div>
  )
}
