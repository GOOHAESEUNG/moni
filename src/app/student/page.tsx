import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentHome from './StudentHome'
import type { Unit } from '@/types/database'


export default async function StudentPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'student') redirect('/teacher')

  // 학생이 속한 반 조회 (반 이름 포함)
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('class_id, classes(name, grade, class_number)')
    .eq('student_id', user.id)
    .single()

  // 오늘의 활성 단원 조회
  let activeUnits: Unit[] = []
  if (enrollment?.class_id) {
    const { data: units } = await supabase
      .from('units')
      .select('*')
      .eq('class_id', enrollment.class_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    activeUnits = units ?? []
  }

  // 최근 세션 2개 조회 (리포트 ID 포함)
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, unit_id, understanding_score, ended_at, units(title), reports(id)')
    .eq('student_id', user.id)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })
    .limit(2)

  // 완료한 unit ID 목록
  let completedUnitIds: string[] = []
  if (enrollment?.class_id && activeUnits.length > 0) {
    const { data: completedSessions } = await supabase
      .from('sessions')
      .select('unit_id')
      .eq('student_id', user.id)
      .not('ended_at', 'is', null)
      .gte('understanding_score', 60)
      .in('unit_id', activeUnits.map(u => u.id))
    completedUnitIds = [...new Set((completedSessions ?? []).map(s => s.unit_id))]
  }

  // 내 퀘스트 (RLS가 본인 반 + 본인 대상만 반환)
  const { data: quests } = enrollment
    ? await supabase.from('quests').select('*').eq('is_active', true)
    : { data: [] }

  // 내 완료 기록
  const questIds = (quests ?? []).map((q: { id: string }) => q.id)
  const { data: questCompletions } = questIds.length > 0
    ? await supabase.from('quest_completions').select('*').eq('student_id', user.id).in('quest_id', questIds)
    : { data: [] }

  // 반 이름 추출
  type ClassInfo = { name: string; grade: number | null; class_number: number | null } | null
  const classInfo = enrollment?.classes as ClassInfo | ClassInfo[] | undefined
  const resolvedClass = Array.isArray(classInfo) ? classInfo[0] : classInfo
  const className = resolvedClass?.name ?? null

  return (
    <StudentHome
      profile={profile}
      activeUnits={activeUnits}
      recentSessions={recentSessions ?? []}
      hasEnrollment={!!enrollment?.class_id}
      completedUnitIds={completedUnitIds}
      className={className}
      quests={quests ?? []}
      questCompletions={questCompletions ?? []}
    />
  )
}
