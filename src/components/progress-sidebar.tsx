"use client"

import { Flame } from "lucide-react"

interface ProgressSidebarProps {
  topicsCompleted: number
  totalTopics: number
  problemsSolved: number
  totalProblems: number
  currentStreak: number
  nextRevision: string
}

export function ProgressSidebar({
  topicsCompleted,
  totalTopics,
  problemsSolved,
  totalProblems,
  currentStreak,
  nextRevision,
}: ProgressSidebarProps) {
  const topicProgress = (topicsCompleted / totalTopics) * 100
  const problemProgress = (problemsSolved / totalProblems) * 100

  return (
    <div
      style={{
        position: 'sticky',
        top: '80px',
        backgroundColor: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#fafafa',
          marginBottom: '16px',
        }}
      >
        Your Progress
      </div>

      {/* Stats Section */}
      <div style={{ marginTop: '16px' }}>
        {/* Topics Completed */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#0a0a0a',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#71717a',
                }}
              >
                Topics
              </span>
            </div>
            <span
              style={{
                fontSize: '13px',
                color: '#fafafa',
                fontWeight: 500,
              }}
            >
              {topicsCompleted}/{totalTopics}
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
                width: `${topicProgress}%`,
                backgroundColor: '#22c55e',
                borderRadius: '9999px',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>

        {/* Problems Solved */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#71717a',
                }}
              >
                Problems
              </span>
            </div>
            <span
              style={{
                fontSize: '13px',
                color: '#fafafa',
                fontWeight: 500,
              }}
            >
              {problemsSolved}/{totalProblems}
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
                width: `${problemProgress}%`,
                backgroundColor: '#3b82f6',
                borderRadius: '9999px',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#1f1f1f',
            margin: '16px 0',
          }}
        />

        {/* Current Streak */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>🔥</span>
            <span
              style={{
                fontSize: '13px',
                color: '#71717a',
              }}
            >
              Current Streak
            </span>
          </div>
          <span
            style={{
              fontSize: '13px',
              color: '#fafafa',
              fontWeight: 500,
            }}
          >
            {currentStreak} days
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#1f1f1f',
            margin: '16px 0',
          }}
        />

        {/* Next Revision */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Flame size={16} color="#71717a" />
            <span
              style={{
                fontSize: '13px',
                color: '#71717a',
              }}
            >
              Next Revision
            </span>
          </div>
          <span
            style={{
              fontSize: '13px',
              color: '#22c55e',
              fontWeight: 500,
            }}
          >
            {nextRevision}
          </span>
        </div>
      </div>
    </div>
  )
}
