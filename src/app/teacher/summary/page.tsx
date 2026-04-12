import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { CompetencyScores } from '@/types/database'
import ClassSummaryDashboard, { type ClassSummaryData } from './ClassSummaryDashboard'

type SummaryEnrollmentRow = {
  student_id: string
  profiles: { id: string; name: string | null } | { id: string; name: string | null }[] | null
}

type SummarySessionRow = {
  student_id: string
  understanding_score: number | null
  ended_at: string | null
}

type SummaryReportRow = {
  student_id: string
  weak_points: string[] | null
  competency_scores: CompetencyScores | null
}

const COMPETENCY_KEYS = ['자기관리역량', '대인관계역량', '시민역량', '문제해결역량'] as const

function isCompetencyScores(raw: unknown): raw is CompetencyScores {
  if (!raw || typeof raw !== 'object') return false
  return COMPETENCY_KEYS.every((key) => typeof (raw as Record<string, unknown>)[key] === 'number')
}

export default async function TeacherSummaryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') redirect('/student')

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: classes } = await admin
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  const currentClass = classes?.[0]
  if (!currentClass) redirect('/teacher/classes/new')

  const { data: enrollments } = await admin
    .from('enrollments')
    .select('student_id, profiles!inner(id, name)')
    .eq('class_id', currentClass.id)

  const students = ((enrollments ?? []) as SummaryEnrollmentRow[]).map((enrollment) => {
    const profileData = Array.isArray(enrollment.profiles) ? enrollment.profiles[0] : enrollment.profiles
    return {
      id: enrollment.student_id,
      name: profileData?.name ?? '학생',
    }
  })

  const studentIds = students.map((student) => student.id)

  const { data: units } = await admin
    .from('units')
    .select('id')
    .eq('class_id', currentClass.id)

  const unitIds = (units ?? []).map((unit: { id: string }) => unit.id)

  const { data: sessions } = unitIds.length > 0 && studentIds.length > 0
    ? await admin
        .from('sessions')
        .select('student_id, understanding_score, ended_at')
        .in('unit_id', unitIds)
        .in('student_id', studentIds)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false })
    : { data: [] as SummarySessionRow[] }

  const { data: reports } = studentIds.length > 0
    ? await admin
        .from('reports')
        .select('student_id, weak_points, competency_scores')
        .in('student_id', studentIds)
    : { data: [] as SummaryReportRow[] }

  const sessionMap = new Map<string, { scores: number[]; sessionCount: number; latestScore: number | null }>()
  for (const student of students) {
    sessionMap.set(student.id, { scores: [], sessionCount: 0, latestScore: null })
  }

  const allScores: number[] = []

  for (const session of (sessions ?? []) as SummarySessionRow[]) {
    const current = sessionMap.get(session.student_id)
    if (!current) continue

    current.sessionCount += 1
    if (current.latestScore === null) {
      current.latestScore = session.understanding_score
    }

    if (typeof session.understanding_score === 'number') {
      current.scores.push(session.understanding_score)
      allScores.push(session.understanding_score)
    }
  }

  const competencySums = {
    자기관리역량: 0,
    대인관계역량: 0,
    시민역량: 0,
    문제해결역량: 0,
  }
  let competencyCount = 0
  const weakPointCounts = new Map<string, number>()

  for (const report of (reports ?? []) as SummaryReportRow[]) {
    for (const weakPoint of report.weak_points ?? []) {
      const normalized = weakPoint.trim()
      if (!normalized) continue
      weakPointCounts.set(normalized, (weakPointCounts.get(normalized) ?? 0) + 1)
    }

    if (!isCompetencyScores(report.competency_scores)) continue

    competencyCount += 1
    competencySums.자기관리역량 += report.competency_scores.자기관리역량
    competencySums.대인관계역량 += report.competency_scores.대인관계역량
    competencySums.시민역량 += report.competency_scores.시민역량
    competencySums.문제해결역량 += report.competency_scores.문제해결역량
  }

  const data: ClassSummaryData = {
    className: currentClass.name,
    profileName: profile.name,
    totalStudents: students.length,
    activeStudents: Array.from(sessionMap.values()).filter((student) => student.sessionCount > 0).length,
    avgScore: allScores.length > 0
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : null,
    avgCompetency: competencyCount > 0
      ? {
          자기관리역량: Number((competencySums.자기관리역량 / competencyCount).toFixed(1)),
          대인관계역량: Number((competencySums.대인관계역량 / competencyCount).toFixed(1)),
          시민역량: Number((competencySums.시민역량 / competencyCount).toFixed(1)),
          문제해결역량: Number((competencySums.문제해결역량 / competencyCount).toFixed(1)),
        }
      : {
          자기관리역량: 0,
          대인관계역량: 0,
          시민역량: 0,
          문제해결역량: 0,
        },
    topWeakPoints: Array.from(weakPointCounts.entries())
      .map(([text, count]) => ({ text, count }))
      .sort((left, right) => right.count - left.count || left.text.localeCompare(right.text, 'ko'))
      .slice(0, 5),
    students: students.map((student) => {
      const stats = sessionMap.get(student.id) ?? { scores: [], sessionCount: 0, latestScore: null }
      return {
        id: student.id,
        name: student.name,
        avgScore: stats.scores.length > 0
          ? Math.round(stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length)
          : null,
        sessionCount: stats.sessionCount,
        latestScore: stats.latestScore,
      }
    }),
  }

  return <ClassSummaryDashboard classId={currentClass.id} data={data} />
}
