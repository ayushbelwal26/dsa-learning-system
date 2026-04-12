'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, CheckCircle2, Loader2 } from 'lucide-react'
import { markProblemAttempted, markProblemSolved } from './actions'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type AttemptStatus = 'solved' | 'attempted' | 'none'

interface ProblemRowProps {
  index: number
  problemId: string
  title: string
  url: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | string
  pattern: string | null
  initialStatus: AttemptStatus
  slug: string
}

/* ─────────────────────────────────────────────
   STYLE MAPS
───────────────────────────────────────────── */
const difficultyColor: Record<string, string> = {
  Easy:   '#22c55e',
  Medium: '#f59e0b',
  Hard:   '#ef4444',
}
const difficultyBg: Record<string, string> = {
  Easy:   '#22c55e18',
  Medium: '#f59e0b18',
  Hard:   '#ef444418',
}

/* ─────────────────────────────────────────────
   STATUS INDICATOR
───────────────────────────────────────────── */
function StatusIcon({ status }: { status: AttemptStatus }) {
  if (status === 'solved') {
    return <CheckCircle2 size={16} color="#22c55e" style={{ display: 'block', flexShrink: 0 }} />
  }
  if (status === 'attempted') {
    return (
      <span
        title="Attempted"
        style={{
          display: 'block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
          flexShrink: 0,
          margin: '0 3px',
        }}
      />
    )
  }
  return (
    <span
      title="Not attempted"
      style={{
        display: 'block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        border: '1.5px solid #3f3f46',
        flexShrink: 0,
        margin: '0 3px',
      }}
    />
  )
}

/* ─────────────────────────────────────────────
   ROW COMPONENT
───────────────────────────────────────────── */
export function ProblemRow({
  index,
  problemId,
  title,
  url,
  difficulty,
  pattern,
  initialStatus,
  slug,
}: ProblemRowProps) {
  const [status, setStatus] = useState<AttemptStatus>(initialStatus)
  const [isPending, startTransition] = useTransition()

  function handleSolve() {
    // Open in new tab immediately
    window.open(url, '_blank', 'noopener,noreferrer')

    // Only mark attempted if not already solved
    if (status === 'none') {
      setStatus('attempted') // optimistic
      startTransition(async () => {
        await markProblemAttempted(problemId, slug)
      })
    }
  }

  function handleMarkSolved() {
    if (status === 'solved') return
    setStatus('solved') // optimistic
    startTransition(async () => {
      await markProblemSolved(problemId, slug)
    })
  }

  const isSolved   = status === 'solved'
  const num        = String(index + 1).padStart(2, '0')

  return (
    <tr style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.15s' }}>
      {/* Status / number */}
      <td
        style={{
          padding: '12px 12px 12px 0',
          borderBottom: '1px solid #141414',
          verticalAlign: 'middle',
          color: '#3f3f46',
        }}
      >
        {isPending ? (
          <Loader2 size={14} color="#3f3f46" style={{ display: 'block', animation: 'spin 1s linear infinite' }} />
        ) : (
          <StatusIcon status={status} />
        )}
        {/* fallback index if all icons are hidden */}
        {status === 'none' && !isPending ? null : null}
        <span style={{ display: 'none' }}>{num}</span>
      </td>

      {/* Title */}
      <td
        style={{
          padding: '12px 12px 12px 0',
          borderBottom: '1px solid #141414',
          verticalAlign: 'middle',
          maxWidth: 220,
          color: isSolved ? '#3f3f46' : '#fafafa',
          textDecoration: isSolved ? 'line-through' : 'none',
          fontSize: 13,
        }}
      >
        {title}
      </td>

      {/* Difficulty */}
      <td
        style={{
          padding: '12px 12px 12px 0',
          borderBottom: '1px solid #141414',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: difficultyColor[difficulty] ?? '#71717a',
            backgroundColor: difficultyBg[difficulty] ?? '#1f1f1f',
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          {difficulty}
        </span>
      </td>

      {/* Pattern */}
      <td
        style={{
          padding: '12px 12px 12px 0',
          borderBottom: '1px solid #141414',
          color: '#3f3f46',
          fontSize: 12,
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
        }}
      >
        {pattern ?? '—'}
      </td>

      {/* Actions */}
      <td
        style={{
          padding: '12px 0',
          borderBottom: '1px solid #141414',
          verticalAlign: 'middle',
          textAlign: 'right',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {/* Mark Solved button */}
          <button
            onClick={handleMarkSolved}
            disabled={isSolved || isPending}
            title={isSolved ? 'Already solved' : 'Mark as solved'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: isSolved ? '#22c55e' : '#3f3f46',
              backgroundColor: isSolved ? '#22c55e18' : 'transparent',
              border: `1px solid ${isSolved ? '#22c55e40' : '#2a2a2a'}`,
              borderRadius: 7,
              padding: '4px 9px',
              cursor: isSolved ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <CheckCircle2 size={10} />
            {isSolved ? 'Solved' : 'Mark Solved'}
          </button>

          {/* Solve → button */}
          <button
            onClick={handleSolve}
            disabled={isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 500,
              color: '#fafafa',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 7,
              padding: '4px 10px',
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.15s',
            }}
          >
            Solve
            <ExternalLink size={10} />
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ─────────────────────────────────────────────
   SPIN KEYFRAMES (injected once)
───────────────────────────────────────────── */
export function SpinStyle() {
  return (
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  )
}
