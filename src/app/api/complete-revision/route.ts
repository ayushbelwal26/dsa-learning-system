import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/*
  Spaced repetition intervals (in days):
  Revision 1 → 1 day
  Revision 2 → 3 days
  Revision 3 → 7 days
  Revision 4 → 14 days
  Revision 5+ → 30 days (max)
*/
const INTERVALS = [1, 3, 7, 14, 30]

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topicId } = await request.json()
    if (!topicId) return NextResponse.json({ error: 'topicId required' }, { status: 400 })

    // Fetch current progress row
    const { data: progress, error: fetchErr } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .single()

    if (fetchErr || !progress) {
      return NextResponse.json({ error: 'No progress found for this topic' }, { status: 404 })
    }

    const currentCount: number = (progress as { revision_count?: number }).revision_count ?? 0
    const intervalIdx = Math.min(currentCount, INTERVALS.length - 1)
    const nextIntervalDays = INTERVALS[intervalIdx]
    const nextRevisionAt = new Date(Date.now() + nextIntervalDays * 86_400_000).toISOString()

    const { error: updateErr } = await supabase
      .from('user_topic_progress')
      .update({
        revision_count:   currentCount + 1,
        next_revision_at: nextRevisionAt,
      })
      .eq('user_id', user.id)
      .eq('topic_id', topicId)

    if (updateErr) {
      console.error('[complete-revision] update error:', updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    console.log(
      `[complete-revision] user=${user.id} topic=${topicId} ` +
      `revision #${currentCount + 1} → next in ${nextIntervalDays}d (${nextRevisionAt})`
    )

    return NextResponse.json({
      success:        true,
      revisionsCount: currentCount + 1,
      nextRevisionAt,
      nextIntervalDays,
    })
  } catch (error) {
    console.error('[complete-revision] error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
