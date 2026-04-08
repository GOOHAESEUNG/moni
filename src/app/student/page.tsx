import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentHome from './StudentHome'

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

  // 학생이 속한 반 조회
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', user.id)
    .single()

  // 오늘의 활성 단원 조회
  let activeUnit = null
  if (enrollment?.class_id) {
    const { data: units } = await supabase
      .from('units')
      .select('*')
      .eq('class_id', enrollment.class_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)

    activeUnit = units?.[0] ?? null
  }

  // 최근 세션 2개 조회
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, unit_id, understanding_score, ended_at, units(title)')
    .eq('student_id', user.id)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })
    .limit(2)

  return (
    <StudentHome
      profile={profile}
      activeUnit={activeUnit}
      recentSessions={recentSessions ?? []}
    />
  )
}
