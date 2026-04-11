import { Navbar } from "@/components/navbar"
import { CheckCircle, Target, Flame, TrendingUp, RefreshCw, ChevronRight, Clock, BookOpen, AlertCircle, Lock } from "lucide-react"
import { getUserProfile, getUserStats, getTopicsWithProgress, getRevisionDue } from "@/lib/data"

export default async function DashboardPage() {
  const profile = await getUserProfile()
  const stats = await getUserStats()
  const topics = await getTopicsWithProgress()
  const revisions = await getRevisionDue()

  // Find first in-progress topic for continue learning
  const inProgressTopic = topics?.find(t => t.status === 'in-progress')
  
  // Calculate interview readiness percentage
  const interviewReadiness = stats ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">
            Good morning, {profile?.first_name || 'User'} <span className="text-2xl">{"\ud83d\udc4b"}</span>
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
                <p className="text-[#fafafa] text-2xl font-semibold">
                  {stats?.completedTopics || 0}/{stats?.totalTopics || 10}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Problems Solved</p>
                <p className="text-[#fafafa] text-2xl font-semibold">
                  {stats?.solvedProblems || 0}/{stats?.totalProblems || 45}
                </p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Current Streak</p>
                <p className="text-[#fafafa] text-2xl font-semibold">
                  {profile?.current_streak || 0} days <span className="text-lg">{"\ud83d\udd25"}</span>
                </p>
              </div>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          {/* Interview Readiness */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#71717a] text-xs mb-1">Interview Readiness</p>
                <p className="text-[#fafafa] text-2xl font-semibold">{interviewReadiness}%</p>
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
            {inProgressTopic && (
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#fafafa] mb-4">Continue where you left off</h2>
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg text-[#fafafa]">{inProgressTopic.title}</h3>
                    <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs">
                      In Progress
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#71717a]">Progress</span>
                      <span className="text-[#fafafa]">
                        {inProgressTopic.problems_solved || 0}/{inProgressTopic.total_problems || 10} problems solved
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${((inProgressTopic.problems_solved || 0) / (inProgressTopic.total_problems || 10)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button className="bg-[#22c55e] text-[#0a0a0a] px-4 py-2 rounded-md font-medium hover:bg-[#22c55e]/90 transition-colors flex items-center gap-2">
                  Continue Topic
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Weak Areas Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-[#fafafa]">Weak Areas</h2>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>

              <div className="space-y-3">
                {topics?.filter(t => t.confidence === 'weak' || t.confidence === null).slice(0, 3).map((topic) => (
                  <div key={topic.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-[#fafafa]">{topic.title}</p>
                      <p className="text-[#71717a] text-sm">
                        {topic.confidence === 'weak' ? 'Weak confidence' : 'not started'}
                      </p>
                    </div>
                    <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm hover:bg-red-500/30 transition-colors">
                      Practice Now
                    </button>
                  </div>
                ))}
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
                  {revisions?.length || 0} due
                </span>
              </div>

              <div className="space-y-3">
                {revisions?.map((revision) => (
                  <div key={revision.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-[#fafafa]">{revision.topics?.title}</p>
                      <p className="text-[#71717a] text-sm">
                        Last studied {new Date(revision.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="bg-[#22c55e]/20 text-[#22c55e] px-3 py-1 rounded-md text-xs hover:bg-[#22c55e]/30 transition-colors">
                      Revise Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Roadmap Progress Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#fafafa] mb-4">Your Roadmap Progress</h2>

              <div className="space-y-2 mb-4">
                {topics?.slice(0, 5).map((topic) => (
                  <div key={topic.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      topic.status === 'completed' ? 'bg-[#22c55e]' :
                      topic.status === 'in-progress' ? 'bg-amber-500' :
                      'bg-[#3f3f46]'
                    }`}>
                      {topic.status === 'completed' && <div className="w-2 h-2 bg-[#0a0a0a] rounded-full"></div>}
                      {topic.status === 'in-progress' && <div className="w-2 h-2 bg-[#0a0a0a] rounded-full"></div>}
                      {topic.status === 'locked' && <Lock className="w-2 h-2 text-[#71717a]" />}
                    </div>
                    <span className="text-[#fafafa] text-sm">{topic.title}</span>
                  </div>
                ))}
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
                      index < (profile?.current_streak || 0) ? 'bg-[#22c55e]/20' : 'bg-[#1f1f1f]'
                    }`}>
                      {index < (profile?.current_streak || 0) && <div className="w-3 h-3 bg-[#22c55e] rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{"\ud83d\udd25"}</span>
                <span className="text-[#fafafa] font-semibold">{profile?.current_streak || 0} day streak!</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
