"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function Navbar() {
  return (
    <nav 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: '56px',
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #1f1f1f',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div 
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Logo */}
        <Link 
          href="/dashboard" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0a',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            A
          </div>
          <span 
            style={{
              color: '#fafafa',
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            AlgoPath
          </span>
        </Link>

        {/* Center Links */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: '#71717a',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fafafa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#71717a'
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/roadmap"
            style={{
              color: '#71717a',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fafafa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#71717a'
            }}
          >
            Roadmap
          </Link>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          style={{
            height: '32px',
            padding: '0 12px',
            borderRadius: '6px',
            border: '1px solid #dc2626',
            color: '#dc2626',
            backgroundColor: 'transparent',
            fontSize: '14px',
            transition: 'background-color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <LogOut style={{ width: '14px', height: '14px', marginRight: '6px' }} />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
