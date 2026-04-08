import { createClient } from '@/lib/supabase/server'
import SessionEndClient from './SessionEndClient'

interface Props {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ reportId?: string }>
}

export default async function SessionEndPage({ params, searchParams }: Props) {
  const { sessionId } = await params
  const { reportId } = await searchParams

  const supabase = await createClient()

  // 세션 정보
  const { data: session } = await supabase
    .from('sessions')
    .select('id, unit_id, understanding_score, self_reflection, units(title)')
    .eq('id', sessionId)
    .single()

  // 리포트 정보 (reportId가 있으면)
  let report = null
  if (reportId) {
    const { data } = await supabase
      .from('reports')
      .select('id, summary, weak_points, suggestions')
      .eq('id', reportId)
      .single()
    report = data
  }

  const unitTitle = (() => {
    if (!session?.units) return '단원'
    if (Array.isArray(session.units)) return session.units[0]?.title ?? '단원'
    return (session.units as { title: string }).title
  })()

  return (
    <SessionEndClient
      sessionId={sessionId}
      reportId={reportId ?? null}
      unitTitle={unitTitle}
      understandingScore={session?.understanding_score ?? 0}
      selfReflection={session?.self_reflection ?? ''}
      summary={report?.summary ?? null}
      weakPoints={report?.weak_points ?? []}
      suggestions={report?.suggestions ?? []}
    />
  )
}
