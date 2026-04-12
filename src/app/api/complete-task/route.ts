import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/complete-task
 * Toggles a task's completion status in today's daily_plan.
 * Completion state is stored as `completedTaskIds[]` inside the plan JSON.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { taskId } = await request.json()
    if (!taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })

    const today = new Date().toISOString().split('T')[0]

    // Fetch today's plan
    const { data: existing, error: fetchErr } = await supabase
      .from('daily_plans')
      .select('tasks')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (fetchErr || !existing?.tasks) {
      return NextResponse.json({ error: 'No plan found for today' }, { status: 404 })
    }

    const plan = existing.tasks as {
      tasks: Array<{ id: string }>
      completedTaskIds?: string[]
      [key: string]: unknown
    }

    // Toggle: add if missing, remove if present
    const ids: string[] = plan.completedTaskIds ?? []
    const idx = ids.indexOf(taskId)
    if (idx === -1) ids.push(taskId)
    else ids.splice(idx, 1)

    plan.completedTaskIds = ids

    // Persist updated plan
    const { error: updateErr } = await supabase
      .from('daily_plans')
      .update({ tasks: plan })
      .eq('user_id', user.id)
      .eq('date', today)

    if (updateErr) {
      console.error('[complete-task] Update error:', updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({
      completedTaskIds: ids,
      completedCount: ids.length,
      totalCount: plan.tasks?.length ?? 0,
    })
  } catch (error) {
    console.error('[complete-task] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
