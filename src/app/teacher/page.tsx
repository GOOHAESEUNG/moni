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

  // 클래스가 없으면 자동 생성
  if (!classes || classes.length === 0) {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data: newClass } = await admin
      .from('classes')
      .insert({
        teacher_id: user.id,
        name: `${profile.name}의 반`,
        invite_code: inviteCode,
      })
      .select()
      .single()
    classes = newClass ? [newClass] : []
  }

  const currentClass = classes?.[0]
  if (!currentClass) {
    // 클래스 생성 재시도 (RLS 우회: service role 불가하므로 안내 UI)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: '#F7F7F7' }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🌙</div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: '#2D2F2F' }}>반을 만들어볼까요?</h2>
          <p className="text-sm mb-6" style={{ color: '#9EA0B4' }}>처음 오셨군요! 아래 버튼을 눌러 첫 번째 반을 만들어보세요.</p>
          <a
            href="/teacher/classes/new"
            className="inline-block font-extrabold text-sm"
            style={{
              background: '#E8C547',
              borderRadius: '9999px',
              padding: '14px 32px',
              color: '#1A1830',
              boxShadow: '0 4px 0 #C8A020',
            }}
          >
            반 만들기
          </a>
        </div>
      </div>
    )
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
    />
  )
}
