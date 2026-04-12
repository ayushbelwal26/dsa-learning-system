'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markProblemAttempted(problemId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('problem_attempts').upsert(
    {
      user_id:      user.id,
      problem_id:   problemId,
      status:       'attempted',
      attempted_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,problem_id' },
  )

  revalidatePath(`/topic/${slug}`)
  revalidatePath('/dashboard')
}

export async function markProblemSolved(problemId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('problem_attempts').upsert(
    {
      user_id:      user.id,
      problem_id:   problemId,
      status:       'solved',
      attempted_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,problem_id' },
  )

  revalidatePath(`/topic/${slug}`)
  revalidatePath('/dashboard')
}
