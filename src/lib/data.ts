import { createClient } from "@/lib/supabase/server"

// Get current user profile
export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

// Get all topics with user progress
export async function getTopicsWithProgress() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .is('parent_id', null)
    .order('order_index')
  
  if (!user || !topics) return topics || []
  
  const { data: progress } = await supabase
    .from('user_topic_progress')
    .select('*')
    .eq('user_id', user.id)
  
  return topics.map(topic => ({
    ...topic,
    status: getTopicStatus(topic.id, progress || []),
    confidence: getTopicConfidence(topic.id, progress || [])
  }))
}

// Get user stats
export async function getUserStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: progress } = await supabase
    .from('user_topic_progress')
    .select('*')
    .eq('user_id', user.id)

  const { data: attempts } = await supabase
    .from('problem_attempts')
    .select('*')
    .eq('user_id', user.id)

  const completedTopics = progress?.filter(p => 
    p.confidence === 'strong').length || 0
  const solvedProblems = attempts?.filter(a => 
    a.status === 'solved').length || 0

  return {
    completedTopics,
    solvedProblems,
    totalTopics: 10,
    totalProblems: 45
  }
}

// Get topics due for revision
export async function getRevisionDue() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const now = new Date().toISOString()
  
  const { data } = await supabase
    .from('user_topic_progress')
    .select('*, topics(*)')
    .eq('user_id', user.id)
    .lte('next_revision_at', now)
    .not('next_revision_at', 'is', null)
  
  return data || []
}

// Helper functions
function getTopicStatus(topicId: string, progress: any[]) {
  const p = progress.find(p => p.topic_id === topicId)
  if (!p) return 'locked'
  if (p.confidence === 'strong') return 'completed'
  return 'in-progress'
}

function getTopicConfidence(topicId: string, progress: any[]) {
  const p = progress.find(p => p.topic_id === topicId)
  return p?.confidence || null
}
