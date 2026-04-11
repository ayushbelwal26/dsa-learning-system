"use client"

import { CheckCircle, Play, Lock } from "lucide-react"

export type TopicStatus = "completed" | "in-progress" | "locked"
export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

interface TopicCardProps {
  number: string
  title: string
  description: string
  difficulty: Difficulty
  status: TopicStatus
  problemCount: number
}

export function TopicCard({
  number,
  title,
  description,
  difficulty,
  status,
  problemCount,
}: TopicCardProps) {
  const getLeftBorderColor = () => {
    switch (status) {
      case "completed":
        return "#22c55e"
      case "in-progress":
        return "#f59e0b"
      case "locked":
        return "#2f2f2f"
      default:
        return "#2f2f2f"
    }
  }

  const getLeftBorderShadow = () => {
    switch (status) {
      case "completed":
        return "0 0 12px rgba(34,197,94,0.2)"
      case "in-progress":
        return "0 0 12px rgba(245,158,11,0.2)"
      case "locked":
        return "none"
      default:
        return "none"
    }
  }

  const getDifficultyBadgeStyles = () => {
    switch (difficulty) {
      case "Beginner":
        return {
          backgroundColor: "#14532d",
          color: "#86efac"
        }
      case "Intermediate":
        return {
          backgroundColor: "#1e3a5f",
          color: "#93c5fd"
        }
      case "Advanced":
        return {
          backgroundColor: "#3b0764",
          color: "#d8b4fe"
        }
      default:
        return {
          backgroundColor: "#14532d",
          color: "#86efac"
        }
    }
  }

  const getStatusBadgeStyles = () => {
    switch (status) {
      case "completed":
        return {
          backgroundColor: "#14532d",
          color: "#86efac"
        }
      case "in-progress":
        return {
          backgroundColor: "#451a03",
          color: "#fcd34d"
        }
      case "locked":
        return {
          backgroundColor: "#18181b",
          color: "#52525b"
        }
      default:
        return {
          backgroundColor: "#18181b",
          color: "#52525b"
        }
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#22c55e" />
      case "in-progress":
        return <Play size={16} color="#f59e0b" />
      case "locked":
        return <Lock size={16} color="#3f3f46" />
      default:
        return <Lock size={16} color="#3f3f46" />
    }
  }

  const getActionButtonStyles = () => {
    switch (status) {
      case "completed":
        return {
          border: "1px solid #22c55e",
          color: "#22c55e",
          backgroundColor: "transparent",
          cursor: "pointer"
        }
      case "in-progress":
        return {
          backgroundColor: "#22c55e",
          color: "#0a0a0a",
          fontWeight: 500,
          cursor: "pointer"
        }
      case "locked":
        return {
          backgroundColor: "#18181b",
          color: "#3f3f46",
          cursor: "not-allowed"
        }
      default:
        return {
          backgroundColor: "#18181b",
          color: "#3f3f46",
          cursor: "not-allowed"
        }
    }
  }

  const getActionButtonText = () => {
    switch (status) {
      case "completed":
        return "Review"
      case "in-progress":
        return "Continue →"
      case "locked":
        return "Locked"
      default:
        return "Locked"
    }
  }

  const isLocked = status === "locked"

  return (
    <div
      style={{
        backgroundColor: "#111111",
        border: "1px solid #1f1f1f",
        borderLeft: `3px solid ${getLeftBorderColor()}`,
        borderRadius: "8px",
        padding: "20px 24px",
        marginTop: "16px",
        opacity: isLocked ? 0.5 : 1,
        transition: "border-color 200ms, transform 200ms",
        cursor: isLocked ? "not-allowed" : "default",
        boxShadow: getLeftBorderShadow(),
      }}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.borderColor = "#2f2f2f"
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked) {
          e.currentTarget.style.borderColor = "#1f1f1f"
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
          }}
        >
          {/* Topic Number */}
          <div
            style={{
              width: "28px",
              flexShrink: 0,
              fontSize: "13px",
              fontWeight: 500,
              color: "#3f3f46",
            }}
          >
            {number}
          </div>

          {/* Topic Info */}
          <div
            style={{
              marginLeft: "16px",
              flex: 1,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#fafafa",
                marginBottom: "4px",
              }}
            >
              {title}
            </div>

            {/* Badges Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
              }}
            >
              {/* Difficulty Badge */}
              <div
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  ...getDifficultyBadgeStyles(),
                }}
              >
                {difficulty}
              </div>

              {/* Status Badge */}
              <div
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  ...getStatusBadgeStyles(),
                }}
              >
                {status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Locked"}
              </div>
            </div>

            {/* Problem Count */}
            <div
              style={{
                fontSize: "12px",
                color: "#52525b",
              }}
            >
              {problemCount} problems
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            marginLeft: "16px",
          }}
        >
          {/* Status Icon */}
          <div style={{ marginRight: "12px" }}>
            {getStatusIcon()}
          </div>

          {/* Action Button */}
          <button
            style={{
              height: "30px",
              padding: "0 12px",
              borderRadius: "6px",
              fontSize: "13px",
              border: "none",
              transition: "background-color 150ms",
              ...getActionButtonStyles(),
            }}
            onMouseEnter={(e) => {
              if (status === "completed") {
                e.currentTarget.style.backgroundColor = "rgba(34,197,94,0.1)"
              }
            }}
            onMouseLeave={(e) => {
              if (status === "completed") {
                e.currentTarget.style.backgroundColor = "transparent"
              }
            }}
            disabled={isLocked}
          >
            {getActionButtonText()}
          </button>
        </div>
      </div>
    </div>
  )
}
