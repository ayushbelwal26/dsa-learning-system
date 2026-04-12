'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CalendarDays, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface RevisionItem {
  topicId:        string
  topicTitle:     string
  topicSlug:      string
  nextRevisionAt: string   // ISO string — already < now when passed in
  revisionCount:  number
}

interface RevisionCardProps {
  items: RevisionItem[]
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function daysAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function nextIntervalLabel(revisionCount: number): string {
  const intervals = [1, 3, 7, 14, 30]
  const next = intervals[Math.min(revisionCount, intervals.length - 1)]
  return `Next revision in ${next}d`
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function RevisionCard({ items }: RevisionCardProps) {
  // Track which topicIds have been marked done (optimistic removal)
  const [doneIds, setDoneIds]     = useState<Set<string>>(new Set())
  const [pending, setPending]     = useState<string | null>(null)
  const [errorId, setErrorId]     = useState<string | null>(null)
  const [, startTransition]       = useTransition()

  const visible = items.filter(i => !doneIds.has(i.topicId))

  async function handleRevised(item: RevisionItem) {
    if (pending) return
    setPending(item.topicId)
    setErrorId(null)

    // Optimistic: remove from list immediately
    setDoneIds(prev => new Set([...prev, item.topicId]))

    startTransition(async () => {
      try {
        const res = await fetch('/api/complete-revision', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ topicId: item.topicId }),
        })
        if (!res.ok) {
          // Revert optimistic update on failure
          setDoneIds(prev => {
            const next = new Set(prev)
            next.delete(item.topicId)
            return next
          })
          setErrorId(item.topicId)
        }
      } catch {
        setDoneIds(prev => {
          const next = new Set(prev)
          next.delete(item.topicId)
          return next
        })
        setErrorId(item.topicId)
      } finally {
        setPending(null)
      }
    })
  }

  /* ── Render ─────────────────────────────── */
  return (
    <section
      style={{
        backgroundColor: '#111111',
        border:          '1px solid #1f1f1f',
        borderRadius:    14,
        padding:         24,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <CalendarDays size={15} color="#a855f7" />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Revision Due</span>
        {visible.length > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              fontWeight: 700,
              color: '#a855f7',
              backgroundColor: '#a855f718',
              padding: '2px 8px',
              borderRadius: 999,
            }}
          >
            {visible.length}
          </span>
        )}
      </div>

      {visible.length === 0 ? (
        /* All caught up */
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <CheckCircle2 size={22} color="#22c55e" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: '#22c55e', marginBottom: 3 }}>
            You&apos;re all caught up! 🎉
          </p>
          <p style={{ fontSize: 12, color: '#3f3f46' }}>
            No revisions due right now.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.slice(0, 5).map(item => {
            const isThisPending = pending === item.topicId
            const hasError      = errorId === item.topicId

            return (
              <div
                key={item.topicId}
                style={{
                  backgroundColor: '#0d0d0d',
                  border:          `1px solid ${hasError ? '#7f1d1d' : '#1f1f1f'}`,
                  borderLeft:      '3px solid #a855f7',
                  borderRadius:    9,
                  padding:         '11px 14px',
                  display:         'flex',
                  alignItems:      'center',
                  gap:             12,
                  transition:      'opacity 0.2s',
                }}
              >
                {/* Text block */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#fafafa', marginBottom: 3 }}>
                    {item.topicTitle}
                  </p>
                  <p style={{ fontSize: 11, color: '#3f3f46', margin: 0 }}>
                    Due {daysAgo(item.nextRevisionAt)}
                    {item.revisionCount > 0 && (
                      <span style={{ marginLeft: 8, color: '#2a2a2a' }}>
                        · {nextIntervalLabel(item.revisionCount)}
                      </span>
                    )}
                  </p>
                  {hasError && (
                    <p style={{ fontSize: 11, color: '#ef4444', marginTop: 3 }}>
                      Failed to save — try again
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {/* "Revise Now" → opens topic page */}
                  <Link
                    href={`/topic/${item.topicSlug}`}
                    style={{
                      display:         'inline-flex',
                      alignItems:      'center',
                      gap:             4,
                      fontSize:        12,
                      fontWeight:      600,
                      color:           '#a855f7',
                      backgroundColor: '#a855f718',
                      border:          '1px solid #a855f730',
                      borderRadius:    7,
                      padding:         '5px 10px',
                      textDecoration:  'none',
                      whiteSpace:      'nowrap',
                    }}
                  >
                    Revise <ArrowRight size={10} />
                  </Link>

                  {/* "Done" button — marks revision complete + schedules next */}
                  <button
                    onClick={() => handleRevised(item)}
                    disabled={isThisPending || !!pending}
                    title="Mark revision done & schedule next"
                    style={{
                      display:         'inline-flex',
                      alignItems:      'center',
                      gap:             4,
                      fontSize:        12,
                      fontWeight:      500,
                      color:           '#71717a',
                      backgroundColor: 'transparent',
                      border:          '1px solid #2a2a2a',
                      borderRadius:    7,
                      padding:         '5px 10px',
                      cursor:          isThisPending || !!pending ? 'wait' : 'pointer',
                      whiteSpace:      'nowrap',
                    }}
                  >
                    {isThisPending ? (
                      <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <CheckCircle2 size={11} />
                    )}
                    Done
                  </button>
                </div>
              </div>
            )
          })}

          {items.length > 5 && (
            <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 4, textAlign: 'center' }}>
              +{items.length - 5} more due — <Link href="/roadmap" style={{ color: '#a855f7', textDecoration: 'none' }}>view all</Link>
            </p>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
