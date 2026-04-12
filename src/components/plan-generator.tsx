'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Circle,
  Zap,
  TrendingUp,
  Clock,
  RotateCcw,
  ExternalLink,
  Target,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Task {
  id: string
  type: 'learn' | 'revise' | 'practice' | string
  topic: string
  action: string
  duration: number
  link: string
  priority: 'high' | 'medium' | 'low' | string
}

interface Plan {
  greeting: string
  totalTime: number
  focusTopic?: string
  learningSpeed?: 'slow' | 'medium' | 'fast' | string
  completedTaskIds: string[]
  tasks: Task[]
  tip: string
}

type Status = 'loading' | 'no-plan' | 'has-plan' | 'generating' | 'error'

/* ─────────────────────────────────────────────
   STYLE MAPS
───────────────────────────────────────────── */
const typeStyle: Record<string, { bg: string; text: string }> = {
  learn:    { bg: '#14532d', text: '#86efac' },
  revise:   { bg: '#1e3a5f', text: '#93c5fd' },
  practice: { bg: '#3b0764', text: '#d8b4fe' },
}

const priorityBorder: Record<string, string> = {
  high:   '#22c55e',
  medium: '#f59e0b',
  low:    '#3f3f46',
}

const speedColor: Record<string, string> = {
  slow:   '#f97316',
  medium: '#f59e0b',
  fast:   '#22c55e',
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function PlanGenerator() {
  const [status, setStatus]           = useState<Status>('loading')
  const [plan, setPlan]               = useState<Plan | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [timeAvailable, setTimeAvailable] = useState('60')
  const [errorMsg, setErrorMsg]       = useState('')
  const [adaptiveNote, setAdaptiveNote] = useState('')
  const [toggling, setToggling]       = useState<string | null>(null) // taskId being toggled

  // ── Load today's plan on mount ───────────────────
  const loadTodaysPlan = useCallback(async () => {
    setStatus('loading')
    try {
      const res  = await fetch('/api/generate-plan')
      const data = await res.json()
      if (data.plan) {
        setPlan(data.plan)
        setCompletedIds(new Set(data.plan.completedTaskIds ?? []))
        setStatus('has-plan')
      } else {
        if (data.adaptiveNote) setAdaptiveNote(data.adaptiveNote)
        setStatus('no-plan')
      }
    } catch {
      setStatus('no-plan')
    }
  }, [])

  useEffect(() => { loadTodaysPlan() }, [loadTodaysPlan])

  // ── Generate (or force-regenerate) plan ─────────
  async function generatePlan(force = false) {
    setStatus('generating')
    setErrorMsg('')
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeAvailable: parseInt(timeAvailable), force }),
      })
      const data = await res.json()
      if (data.error) {
        setErrorMsg(data.error)
        setStatus('error')
      } else {
        setPlan(data.plan)
        setCompletedIds(new Set(data.plan.completedTaskIds ?? []))
        setStatus('has-plan')
      }
    } catch {
      setErrorMsg('Failed to generate plan. Check your connection.')
      setStatus('error')
    }
  }

  // ── Toggle task completion ───────────────────────
  async function toggleTask(taskId: string) {
    if (toggling) return
    setToggling(taskId)

    // Optimistic update
    setCompletedIds(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })

    try {
      await fetch('/api/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      })
    } catch {
      // Revert on failure
      setCompletedIds(prev => {
        const next = new Set(prev)
        if (next.has(taskId)) next.delete(taskId)
        else next.add(taskId)
        return next
      })
    } finally {
      setToggling(null)
    }
  }

  // ── Derived values ───────────────────────────────
  const doneCount  = plan ? plan.tasks.filter(t => completedIds.has(t.id)).length : 0
  const totalCount = plan?.tasks.length ?? 0
  const progress   = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
  const allDone    = totalCount > 0 && doneCount === totalCount

  /* ════════════════ RENDER STATES ════════════════ */

  // ── Loading ──────────────────────────────────────
  if (status === 'loading') {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#3f3f46', fontSize: 13 }}>
          Loading today&apos;s plan…
        </div>
      </Card>
    )
  }

  // ── Generating ───────────────────────────────────
  if (status === 'generating') {
    return (
      <Card>
        <Header label="Today's Plan" />
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#71717a', fontSize: 13,
          backgroundColor: '#0d0d0d', border: '1px dashed #2a2a2a', borderRadius: 10 }}>
          🤖 AI is analyzing your progress and building today&apos;s plan…
        </div>
      </Card>
    )
  }

  // ── No plan / error ──────────────────────────────
  if (status === 'no-plan' || status === 'error') {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Header label="Today's Plan" />
          <button
            id="generate-plan-btn"
            onClick={() => generatePlan()}
            style={{
              backgroundColor: '#22c55e', color: '#0a0a0a', border: 'none',
              borderRadius: 8, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Generate Plan
          </button>
        </div>

        {/* Yesterday's adaptive note */}
        {adaptiveNote && (
          <div style={{ backgroundColor: '#0f1f0f', border: '1px solid #1a3a1a', borderRadius: 8,
            padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#86efac', margin: 0 }}>📊 {adaptiveNote}</p>
          </div>
        )}

        {/* Time selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Clock size={13} color="#71717a" />
          <span style={{ fontSize: 13, color: '#71717a' }}>I have</span>
          <select
            id="time-available-select"
            value={timeAvailable}
            onChange={e => setTimeAvailable(e.target.value)}
            style={{ backgroundColor: '#1f1f1f', color: '#fafafa', border: '1px solid #2f2f2f',
              borderRadius: 6, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="30">30 min</option>
            <option value="60">1 hr</option>
            <option value="120">2 hrs</option>
            <option value="180">3 hrs</option>
          </select>
          <span style={{ fontSize: 13, color: '#71717a' }}>today</span>
        </div>

        {errorMsg && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{errorMsg}</p>}

        <div style={{ textAlign: 'center', padding: '24px', color: '#3f3f46', fontSize: 13,
          backgroundColor: '#0d0d0d', border: '1px dashed #2a2a2a', borderRadius: 10 }}>
          One focused plan per day — AI builds it around your pace and today&apos;s topic.
          <br />
          <span style={{ color: '#22c55e' }}>Click Generate Plan</span> to start.
        </div>
      </Card>
    )
  }

  /* ── Has plan ──────────────────────────────────── */
  return (
    <Card>
      {/* ── Header row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + focus topic badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={15} color="#22c55e" />
              <span style={{ fontSize: 15, fontWeight: 600 }}>Today&apos;s Plan</span>
            </div>
            {plan?.focusTopic && (
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                backgroundColor: '#22c55e18', color: '#22c55e', padding: '2px 9px', borderRadius: 999 }}>
                <Target size={9} style={{ display: 'inline', marginRight: 3 }} />
                {plan.focusTopic}
              </span>
            )}
          </div>
          {/* Greeting */}
          <p style={{ fontSize: 12, color: '#22c55e', margin: 0, lineHeight: 1.5 }}>{plan?.greeting}</p>
        </div>

        {/* Regenerate button */}
        <button
          onClick={() => generatePlan(true)}
          title="Regenerate today's plan"
          style={{ backgroundColor: 'transparent', border: '1px solid #1f1f1f', borderRadius: 8,
            color: '#71717a', padding: '4px 10px', fontSize: 11, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 12 }}
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5,
          fontSize: 11, color: '#71717a' }}>
          <span>{doneCount}/{totalCount} tasks completed</span>
          <span style={{ color: allDone ? '#22c55e' : '#71717a', fontWeight: allDone ? 700 : 400 }}>
            {allDone ? '🎉 All done!' : `${progress}%`}
          </span>
        </div>
        <div style={{ height: 5, backgroundColor: '#1f1f1f', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: allDone ? '#22c55e' : '#3b82f6',
            borderRadius: 999,
            transition: 'width 0.35s ease',
          }} />
        </div>
      </div>

      {/* ── Learning speed indicator ── */}
      {plan?.learningSpeed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <TrendingUp size={11} color="#71717a" />
          <span style={{ fontSize: 11, color: '#71717a' }}>
            Your pace:{' '}
            <span style={{ color: speedColor[plan.learningSpeed] ?? '#71717a', fontWeight: 600 }}>
              {plan.learningSpeed}
            </span>
            {' '}· tasks adjusted accordingly
          </span>
        </div>
      )}

      {/* ── Task list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {plan?.tasks.map(task => {
          const isDone    = completedIds.has(task.id)
          const isToggling = toggling === task.id
          const ts        = typeStyle[task.type] ?? { bg: '#1a1a1a', text: '#71717a' }
          const isCF      = task.link?.includes('codeforces.com')

          return (
            <div
              key={task.id}
              style={{
                backgroundColor: isDone ? '#0d1a0d' : '#1a1a1a',
                border: `1px solid ${isDone ? '#22c55e30' : '#2a2a2a'}`,
                borderLeft: `3px solid ${isDone ? '#22c55e80' : (priorityBorder[task.priority] ?? '#3f3f46')}`,
                borderRadius: 9,
                padding: '11px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                opacity: isDone ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                disabled={isToggling}
                style={{ background: 'none', border: 'none', padding: 0, cursor: isToggling ? 'wait' : 'pointer',
                  flexShrink: 0, marginTop: 2 }}
              >
                {isDone
                  ? <CheckCircle2 size={16} color="#22c55e" />
                  : <Circle size={16} color="#3f3f46" />}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Type badge + topic */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: ts.bg, color: ts.text,
                    padding: '1px 7px', borderRadius: 999 }}>
                    {task.type}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: isDone ? '#3f3f46' : '#fafafa',
                    textDecoration: isDone ? 'line-through' : 'none' }}>
                    {task.topic}
                  </span>
                  {isCF && (
                    <span style={{ fontSize: 10, color: '#f59e0b', backgroundColor: '#f59e0b15',
                      padding: '1px 6px', borderRadius: 999, fontWeight: 600 }}>
                      Codeforces
                    </span>
                  )}
                </div>

                {/* Action */}
                <p style={{ fontSize: 12, color: isDone ? '#2a2a2a' : '#71717a',
                  margin: '0 0 8px', lineHeight: 1.6 }}>
                  {task.action}
                </p>

                {/* Footer: time + link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#3f3f46' }}>⏱ {task.duration} min</span>
                  {isCF ? (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, color: '#f59e0b', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 3 }}
                    >
                      Open Codeforces <ExternalLink size={9} />
                    </a>
                  ) : (
                    <Link
                      href={task.link || '/roadmap'}
                      style={{ fontSize: 11, color: '#22c55e', textDecoration: 'none' }}
                    >
                      Go to topic →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Tip ── */}
      {plan?.tip && (
        <div style={{ backgroundColor: '#0f2a1a', border: '1px solid #14532d', borderRadius: 8, padding: '10px 14px' }}>
          <p style={{ color: '#86efac', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            💡 {plan.tip}
          </p>
        </div>
      )}

      {/* ── All done banner ── */}
      {allDone && (
        <div style={{ marginTop: 12, textAlign: 'center', padding: '14px',
          backgroundColor: '#0f2a1a', border: '1px solid #22c55e40', borderRadius: 10 }}>
          <p style={{ color: '#22c55e', fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>
            🎉 Day complete!
          </p>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
            Your completion rate is tracked. Tomorrow&apos;s plan will level up.
          </p>
        </div>
      )}
    </Card>
  )
}

/* ─────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────── */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #1f1f1f',
      borderRadius: 14,
      padding: 24,
    }}>
      {children}
    </div>
  )
}

function Header({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Zap size={15} color="#22c55e" />
      <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
    </div>
  )
}
