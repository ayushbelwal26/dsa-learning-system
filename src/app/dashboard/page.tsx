"use client"

import { Navbar } from "@/components/navbar"
import { CheckCircle, Target, Flame, TrendingUp, RefreshCw, ChevronRight, Clock, BookOpen, AlertCircle, Lock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">
            Good morning, Ayush <span className="text-2xl">{"\ud83d\udc4b"}</span>
          </h1>
          <p className="text-[#71717a] text-lg">
            Ready to continue your DSA journey?
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Topics Completed */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Topics Completed</p>
                <p className="text-[#fafafa] text-2xl font-semibold">1/10</p>
              </div>
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Problems Solved</p>
                <p className="text-[#fafafa] text-2xl font-semibold">3/45</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Current Streak</p>
                <p className="text-[#fafafa] text-2xl font-semibold">5 days <span className="text-lg">{"\ud83d\udd25"}</span></p>
              </div>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          {/* Interview Readiness */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Interview Readiness</p>
                <p className="text-[#fafafa] text-2xl font-semibold">15%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - 65% */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Plan Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#fafafa]">Today's Plan</h2>
                <button className="bg-[#22c55e] text-[#0a0a0a] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#22c55e]/90 transition-colors">
                  Generate Plan
                </button>
              </div>

              {/* Time Selector */}
              <div className="mb-6">
                <label className="text-[#71717a] text-sm mb-2 block">
                  I have
                  <select className="bg-[#1f1f1f] text-[#fafafa] border border-[#2f2f2f] rounded-md px-3 py-1 ml-2 mr-2">
                    <option>30min</option>
                    <option>1hr</option>
                    <option>2hrs</option>
                    <option>3hrs</option>
                  </select>
                  today
                </label>
              </div>

              {/* Placeholder State */}
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[#71717a]" />
                </div>
                <p className="text-[#fafafa] text-lg mb-2">No plan generated yet</p>
                <p className="text-[#71717a] text-sm mb-4">Select your available time and click Generate Plan</p>
                <button className="bg-[#22c55e] text-[#0a0a0a] px-6 py-2 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors">
                  Generate My Plan
                </button>
              </div>
            </div>

            {/* Continue Learning Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#fafafa] mb-4">Continue where you left off</h2>
              
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg text-[#fafafa]">Strings</h3>
                  <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs">
                    In Progress
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#71717a]">Progress</span>
                    <span className="text-[#fafafa]">2/10 problems solved</span>
                  </div>
                  <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <button className="bg-[#22c55e] text-[#0a0a0a] px-4 py-2 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors flex items-center gap-2">
                Continue Topic
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weak Areas Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-[#fafafa]">Weak Areas</h2>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>

              <div className="space-y-3">
                {/* Binary Search */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#fafafa]">Binary Search</p>
                    <p className="text-[#71717a] text-sm">0% confidence</p>
                  </div>
                  <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm hover:bg-red-500/30 transition-colors">
                    Practice Now
                  </button>
                </div>

                {/* Recursion */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#fafafa]">Recursion</p>
                    <p className="text-[#71717a] text-sm">not started</p>
                  </div>
                  <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm hover:bg-red-500/30 transition-colors">
                    Practice Now
                  </button>
                </div>

                {/* Trees */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#fafafa]">Trees</p>
                    <p className="text-[#71717a] text-sm">25% confidence</p>
                  </div>
                  <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm hover:bg-red-500/30 transition-colors">
                    Practice Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 35% */}
          <div className="lg:col-span-4 space-y-6">
            {/* Revision Due Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#fafafa]">Revision Due Today</h2>
                <span className="bg-[#22c55e]/20 text-[#22c55e] px-2 py-1 rounded-full text-xs">
                  1 due
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#fafafa]">Arrays</p>
                    <p className="text-[#71717a] text-sm">Last studied 3 days ago</p>
                  </div>
                  <button className="bg-[#22c55e]/20 text-[#22c55e] px-3 py-1 rounded-md text-xs hover:bg-[#22c55e]/30 transition-colors">
                    Revise Now
                  </button>
                </div>
              </div>
            </div>

            {/* Your Roadmap Progress Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#fafafa] mb-4">Your Roadmap Progress</h2>

              <div className="space-y-2 mb-4">
                {/* Arrays */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#22c55e] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0a0a0a] rounded-full"></div>
                  </div>
                  <span className="text-[#fafafa] text-sm">Arrays</span>
                </div>

                {/* Strings */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0a0a0a] rounded-full"></div>
                  </div>
                  <span className="text-[#fafafa] text-sm">Strings</span>
                </div>

                {/* Linked Lists */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3f3f46] rounded-full flex items-center justify-center">
                    <Lock className="w-2 h-2 text-[#71717a]" />
                  </div>
                  <span className="text-[#fafafa] text-sm">Linked Lists</span>
                </div>

                {/* Binary Search */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3f3f46] rounded-full flex items-center justify-center">
                    <Lock className="w-2 h-2 text-[#71717a]" />
                  </div>
                  <span className="text-[#fafafa] text-sm">Binary Search</span>
                </div>

                {/* Recursion */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3f3f46] rounded-full flex items-center justify-center">
                    <Lock className="w-2 h-2 text-[#71717a]" />
                  </div>
                  <span className="text-[#fafafa] text-sm">Recursion</span>
                </div>
              </div>

              <a href="/roadmap" className="text-[#22c55e] text-sm hover:underline flex items-center gap-1">
                View Full Roadmap
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* Study Streak Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#fafafa] mb-4">Study Streak</h2>

              {/* 7 Day Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-[#71717a] text-xs mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < 5 ? 'bg-[#22c55e]/20' : 'bg-[#1f1f1f]'
                    }`}>
                      {index < 5 && <div className="w-3 h-3 bg-[#22c55e] rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{"\ud83d\udd25"}</span>
                <span className="text-[#fafafa] font-semibold">5 day streak!</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
