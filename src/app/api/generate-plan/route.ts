import { groqChat } from '@/lib/groq'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/* ─────────────────────────────────────────────────────────────
   CODEFORCES TAG MAP — topic slug → CF tag string
───────────────────────────────────────────────────────────── */
const cfTagMap: Record<string, string> = {
  'arrays':                'arrays',
  'strings':               'strings',
  'linked-lists':          'data structures',
  'stacks':                'data structures',
  'queues':                'data structures',
  'hash-tables':           'hashing',
  'recursion':             'recursion',
  'sorting':               'sortings',
  'binary-search':         'binary search',
  'two-pointers':          'two pointers',
  'sliding-window':        'two pointers',
  'prefix-sum':            'arrays',
  'trees':                 'trees',
  'binary-trees':          'trees',
  'binary-search-trees':   'trees',
  'heaps':                 'data structures',
  'graphs':                'graphs',
  'bfs':                   'bfs',
  'dfs':                   'dfs and similar',
  'shortest-paths':        'shortest paths',
  'dynamic-programming':   'dp',
  'greedy':                'greedy',
  'backtracking':          'backtracking',
  'divide-and-conquer':    'divide and conquer',
  'bit-manipulation':      'bitmasks',
  'math':                  'math',
  'number-theory':         'number theory',
  'segment-trees':         'data structures',
  'disjoint-set':          'dsu',
}

function cfUrl(slug: string): string {
  const tag = cfTagMap[slug] ?? 'implementation'
  // Simple tag filter — Codeforces handles this server-side correctly
  // &order=BY_RATING_ASC breaks their tag filter (returns "No items")
  return `https://codeforces.com/problemset?tags=${encodeURIComponent(tag)}`
}

// How many tasks to suggest based on available time
function baseTaskCount(minutes: number): number {
  if (minutes <= 30) return 1
  if (minutes <= 60) return 2
  if (minutes <= 120) return 3
  return 4
}

/* ─────────────────────────────────────────────────────────────
   GET — return today's existing plan (no generation)
───────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ plan: null })

    const today = new Date().toISOString().split('T')[0]

    // Return today's plan if it exists
    const { data: existing } = await supabase
      .from('daily_plans')
      .select('tasks')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existing?.tasks) {
      return NextResponse.json({ plan: existing.tasks, isExisting: true })
    }

    // No plan yet — compute yesterday's stats to show as context
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const { data: yPlan } = await supabase
      .from('daily_plans')
      .select('tasks')
      .eq('user_id', user.id)
      .eq('date', yesterday.toISOString().split('T')[0])
      .single()

    let adaptiveNote = ''
    if (yPlan?.tasks) {
      const yTasks = (yPlan.tasks as { tasks?: unknown[] }).tasks ?? []
      const yDone  = (yPlan.tasks as { completedTaskIds?: string[] }).completedTaskIds ?? []
      if (yTasks.length > 0) {
        adaptiveNote = `Yesterday you completed ${yDone.length} of ${yTasks.length} tasks — today's plan will adapt to your pace.`
      }
    }

    return NextResponse.json({ plan: null, adaptiveNote })
  } catch {
    return NextResponse.json({ plan: null })
  }
}

/* ─────────────────────────────────────────────────────────────
   POST — generate (or return cached) daily plan
───────────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { timeAvailable, force = false } = await request.json()
    const today = new Date().toISOString().split('T')[0]

    // ── Return existing plan unless force-regenerating ──
    if (!force) {
      const { data: existing } = await supabase
        .from('daily_plans')
        .select('tasks')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (existing?.tasks) {
        return NextResponse.json({ plan: existing.tasks, isExisting: true })
      }
    }

    // ── Fetch all user context in parallel ─────────────
    const [
      { data: profile },
      { data: topics },
      { data: progress },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('topics').select('*').is('parent_id', null).order('order_index'),
      supabase.from('user_topic_progress').select('*').eq('user_id', user.id),
    ])

    // ── Yesterday's performance → adapt task count ─────
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const { data: yPlan } = await supabase
      .from('daily_plans')
      .select('tasks')
      .eq('user_id', user.id)
      .eq('date', yesterday.toISOString().split('T')[0])
      .single()

    let completionRate = 1
    let yesterdayContext = 'First session — no previous data'
    let taskCount = baseTaskCount(timeAvailable)

    if (yPlan?.tasks) {
      const yTasks = (yPlan.tasks as { tasks?: unknown[] }).tasks ?? []
      const yDone  = (yPlan.tasks as { completedTaskIds?: string[] }).completedTaskIds ?? []
      const total  = yTasks.length
      const done   = yDone.length
      completionRate = total > 0 ? done / total : 1
      yesterdayContext = `Completed ${done}/${total} tasks (${Math.round(completionRate * 100)}%)`

      // Slow learner → fewer tasks; fast → more
      if      (completionRate < 0.4)  taskCount = Math.max(1, taskCount - 2)
      else if (completionRate < 0.7)  taskCount = Math.max(1, taskCount - 1)
      else if (completionRate >= 1.0 && total > 0) taskCount = Math.min(5, taskCount + 1)
    }

    // ── Derive learning state ──────────────────────────
    const completedIds = new Set(
      progress?.filter(p => p.confidence === 'strong').map(p => p.topic_id)
    )
    const weakTopics = (topics ?? []).filter(t => {
      const p = progress?.find(r => r.topic_id === t.id)
      return p?.confidence === 'weak'
    })
    const notStarted = (topics ?? []).filter(t =>
      !progress?.find(p => p.topic_id === t.id)
    )
    const revisionDue = (progress ?? [])
      .filter(p => p.next_revision_at && new Date(p.next_revision_at) < new Date())
      .map(p => (topics ?? []).find(t => t.id === p.topic_id))
      .filter(Boolean)

    // Priority: revision > weak > next not-started
    const focusTopic = revisionDue[0] ?? weakTopics[0] ?? notStarted[0] ?? null
    const cfLink = focusTopic ? cfUrl((focusTopic as { slug: string }).slug) : 'https://codeforces.com/problemset'
    const cfTag  = focusTopic ? (cfTagMap[(focusTopic as { slug: string }).slug] ?? 'implementation') : 'implementation'

    const studyMode = (profile as { study_mode?: string } | null)?.study_mode ?? 'general'
    const studyModeDesc =
      studyMode === 'placement' ? 'placement prep — prioritize interview patterns, think LeetCode-style on CF problems' :
      studyMode === 'cp'        ? 'competitive programming — optimize for speed, target harder CF problems' :
                                  'general learning — understand concepts deeply, no pressure on speed'

    const completedTopicNames = (topics ?? [])
      .filter(t => completedIds.has(t.id))
      .map(t => t.title)

    const learningSpeed = completionRate < 0.5 ? 'slow' : completionRate < 0.8 ? 'medium' : 'fast'

    // Time budget per task type
    const conceptTime = timeAvailable <= 60 ? 20 : 30
    const timeForProblems = timeAvailable - conceptTime
    const problemsCount = Math.max(0, taskCount - 1) // subtract 1 for concept task
    const timePerProblem = problemsCount > 0
      ? Math.max(15, Math.floor(timeForProblems / problemsCount))
      : 0

    const prompt = `You are a DSA tutor who believes "learning happens through doing problems". Create a focused, single-topic daily study plan.

=== STUDENT PROFILE ===
- Available time: ${timeAvailable} minutes
- Study mode: ${studyModeDesc}
- Yesterday's performance: ${yesterdayContext}
- Learning speed: ${learningSpeed}
- Total tasks today (already adapted to their speed): ${taskCount}

=== TOPIC STATUS ===
- Completed: ${completedTopicNames.join(', ') || 'none yet'}
- Weak (needs revisiting): ${weakTopics.map(t => t.title).join(', ') || 'none'}
- Revision overdue: ${revisionDue.map(t => (t as { title: string }).title).join(', ') || 'none'}
- Next in roadmap: ${notStarted.slice(0, 3).map(t => t.title).join(', ') || 'all done!'}

=== TODAY'S SINGLE FOCUS TOPIC ===
Topic: "${(focusTopic as { title: string } | null)?.title ?? 'General Revision'}"
AlgoPath link: "/topic/${(focusTopic as { slug: string } | null)?.slug ?? 'roadmap'}"
Codeforces practice URL: ${cfLink}
CF tag for this topic: "${cfTag}"

=== HOW TO STRUCTURE THE PLAN (follow exactly) ===
Task 1 (ALWAYS): "Watch concept video on AlgoPath" — duration: ${conceptTime} min — link: /topic/${(focusTopic as { slug: string } | null)?.slug ?? 'roadmap'}
Tasks 2–${taskCount} (practice): Codeforces problems tagged "${cfTag}" — ${timePerProblem} min each — link: ${cfLink}
  - Start with rating 800–1000 (Easy), progress to 1200–1400 (Medium)
  - Action must name the approach: e.g. "Solve 2 Codeforces problems (800–1000 rated, tag: ${cfTag}) — use prefix sum approach"
  - NEVER link to LeetCode or GeeksforGeeks

=== ADAPTATION RULES ===
- Learning speed is "${learningSpeed}" → ${
  learningSpeed === 'slow' ? 'keep tasks simple, longer concept time, only Easy CF problems' :
  learningSpeed === 'fast' ? 'add a stretch Medium problem at the end' :
  'balanced mix of Easy + one Medium'
}

=== OUTPUT — return ONLY this JSON, no markdown, no extra text ===
{
  "greeting": "One sentence referencing yesterday's ${Math.round(completionRate * 100)}% completion and today's focus on ${(focusTopic as { title: string } | null)?.title ?? 'revision'}",
  "totalTime": ${timeAvailable},
  "focusTopic": "${(focusTopic as { title: string } | null)?.title ?? 'General Revision'}",
  "learningSpeed": "${learningSpeed}",
  "completedTaskIds": [],
  "tasks": [
    {
      "id": "1",
      "type": "learn",
      "topic": "${(focusTopic as { title: string } | null)?.title ?? 'Revision'}",
      "action": "Watch the ${(focusTopic as { title: string } | null)?.title} concept video on AlgoPath — pay attention to [specific key insight about this topic]",
      "duration": ${conceptTime},
      "link": "/topic/${(focusTopic as { slug: string } | null)?.slug ?? 'roadmap'}",
      "priority": "high"
    }
    /* add ${problemsCount} more practice tasks using Codeforces, each ${timePerProblem} min */
  ],
  "tip": "One concrete insight about ${(focusTopic as { title: string } | null)?.title ?? 'DSA'} that most students miss — mention a specific pattern or mistake"
}

FINAL CHECK: sum of all durations must be exactly ${timeAvailable}. Verify before responding.`

    // ── Call AI ────────────────────────────────────────
    const content = await groqChat(prompt)
    console.log('[generate-plan] Raw Groq response:', content)

    const cleaned = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
    const plan = JSON.parse(cleaned)

    // Ensure completedTaskIds always exists
    if (!plan.completedTaskIds) plan.completedTaskIds = []

    // ── Server-side link override ──────────────────────
    // The AI often ignores link instructions and generates wrong URLs.
    // We enforce correct links here regardless of what the AI produced.
    const focusSlug = (focusTopic as { slug: string } | null)?.slug
    if (plan.tasks && Array.isArray(plan.tasks)) {
      plan.tasks = plan.tasks.map((task: { type: string; link: string; [key: string]: unknown }) => {
        if (task.type === 'practice') {
          // Always use the computed Codeforces filtered URL
          task.link = focusSlug ? cfUrl(focusSlug) : 'https://codeforces.com/problemset?order=BY_RATING_ASC'
        } else if (task.type === 'learn' || task.type === 'revise') {
          // Always link learn/revise tasks to the AlgoPath topic page
          task.link = focusSlug ? `/topic/${focusSlug}` : '/roadmap'
        }
        return task
      })
    }

    // ── Save to DB ─────────────────────────────────────
    const { error: dbErr } = await supabase.from('daily_plans').upsert({
      user_id:       user.id,
      date:          today,
      time_available: timeAvailable,
      tasks:         plan,
      generated_at:  new Date().toISOString(),
    }, { onConflict: 'user_id,date' })

    if (dbErr) console.error('[generate-plan] DB error:', dbErr)

    return NextResponse.json({ plan, isExisting: false })
  } catch (error) {
    console.error('[generate-plan] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
