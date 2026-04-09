import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import TeacherDashboard from './TeacherDashboard'

export default async function TeacherPage() {
  const supabase = await createClient()

  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 선생님 프로필
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') redirect('/student')

  // 서비스 롤로 데이터 조회 (RLS 우회 — auth는 위에서 이미 검증됨)
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 선생님 클래스 조회
  let { data: classes } = await admin
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: true })

  if (!classes || classes.length === 0) {
    redirect('/teacher/classes/new')
  }

  const currentClass = classes?.[0]
  if (!currentClass) {
    redirect('/teacher/classes/new')
  }

  // 학생 목록 (enrollments + profiles)
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('student_id, profiles!inner(id, name, email)')
    .eq('class_id', currentClass.id)

  const students = (enrollments ?? []).map((e: { student_id: string; profiles: { id: string; name: string; email: string } | { id: string; name: string; email: string }[] }) => {
    const p = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles
    return { id: e.student_id, name: p?.name ?? '학생', email: p?.email ?? '' }
  })

  // 활성 단원
  const { data: units } = await admin
    .from('units')
    .select('*')
    .eq('class_id', currentClass.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // 완료된 세션 (ended_at이 있는 것)
  const { data: allSessions } = await admin
    .from('sessions')
    .select('id, student_id, unit_id, understanding_score, ended_at')
    .in('unit_id', (units ?? []).map((u: { id: string }) => u.id))

  const completedSessions = (allSessions ?? []).filter((s: { ended_at: string | null }) => s.ended_at)

  // 각 학생의 최근 세션 점수
  const studentScores: Record<string, number | null> = {}
  for (const student of students) {
    const studentSessions = (allSessions ?? [])
      .filter((s: { student_id: string; ended_at: string | null; understanding_score: number | null }) => s.student_id === student.id && s.ended_at)
      .sort((a: { ended_at: string | null }, b: { ended_at: string | null }) =>
        new Date(b.ended_at!).getTime() - new Date(a.ended_at!).getTime()
      )
    studentScores[student.id] = studentSessions[0]?.understanding_score ?? null
  }

  // 활성 단원별 완료 학생 수
  const unitCompletions: Record<string, number> = {}
  for (const unit of (units ?? [])) {
    const completedStudentIds = new Set(
      completedSessions
        .filter((s: { unit_id: string }) => s.unit_id === unit.id)
        .map((s: { student_id: string }) => s.student_id)
    )
    unitCompletions[unit.id] = completedStudentIds.size
  }

  // 평균 점수 계산
  const scoredSessions = completedSessions.filter((s: { understanding_score: number | null }) => s.understanding_score !== null)
  const avgScore = scoredSessions.length > 0
    ? Math.round(scoredSessions.reduce((sum: number, s: { understanding_score: number | null }) => sum + (s.understanding_score ?? 0), 0) / scoredSessions.length)
    : null

  // 반의 활성 퀘스트
  const { data: quests } = await admin
    .from('quests')
    .select('*')
    .eq('class_id', currentClass.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // 퀘스트 완료 기록
  const questIds = (quests ?? []).map((q: { id: string }) => q.id)
  const { data: questCompletions } = questIds.length > 0
    ? await admin.from('quest_completions').select('*').in('quest_id', questIds)
    : { data: [] }

  // 최근 리포트 (우측 패널용)
  const { data: reports } = students.length > 0
    ? await admin
        .from('reports')
        .select('id, session_id, student_id, summary, weak_points, created_at, sessions!inner(understanding_score)')
        .in('student_id', students.map((s) => s.id))
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] }

  return (
    <TeacherDashboard
      profile={profile}
      currentClass={currentClass}
      students={students}
      units={units ?? []}
      completedSessions={completedSessions}
      studentScores={studentScores}
      unitCompletions={unitCompletions}
      avgScore={avgScore}
      reports={reports ?? []}
      quests={quests ?? []}
      questCompletions={questCompletions ?? []}
      totalStudents={students.length}
    />
  )
}
