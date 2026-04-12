import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { CompetencyScores } from '@/types/database'
import ClassSummaryDashboard, { type ClassSummaryData } from './ClassSummaryDashboard'

interface ProfileRow {
  id: string
  name: string
  role: 'teacher' | 'student'
}

interface ClassRow {
  id: string
  name: string
}

interface EnrollmentRow {
  student_id: string
  profiles: { id: string; name: string | null } | { id: string; name: string | null }[] | null
}

interface SessionRow {
  id: string
  student_id: string
  understanding_score: number | null
  ended_at: string | null
}

interface ReportRow {
  student_id: string
  competency_scores: CompetencyScores | null
  weak_points: string[] | null
  suggestions: string[] | null
}

type CoreCompetencyScores = Omit<CompetencyScores, 'comment'>

const COMPETENCY_KEYS = ['자기관리역량', '대인관계역량', '시민역량', '문제해결역량'] as const

function isCompetencyScores(value: unknown): value is CompetencyScores {
  if (!value || typeof value !== 'object') return false

  const obj = value as Record<string, unknown>
  return COMPETENCY_KEYS.every((key) => typeof obj[key] === 'number')
}

export default async function TeacherSummaryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await admin
    .from('profiles')
    .select('id, name, role')
    .eq('id', user.id)
    .single<ProfileRow>()

  if (!profile || profile.role !== 'teacher') redirect('/student')

  const { data: classes } = await admin
    .from('classes')
    .select('id, name')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .returns<ClassRow[]>()

  const currentClass = classes?.[0]
  if (!currentClass) redirect('/teacher/classes/new')

  const { data: enrollments } = await admin
    .from('enrollments')
    .select('student_id, profiles!inner(id, name)')
    .eq('class_id', currentClass.id)
    .returns<EnrollmentRow[]>()

  const students = (enrollments ?? []).map((enrollment) => {
    const profileData = Array.isArray(enrollment.profiles)
      ? enrollment.profiles[0]
      : enrollment.profiles

    return {
      id: enrollment.student_id,
      name: profileData?.name ?? '학생',
    }
  })

  const studentIds = students.map((student) => student.id)

  const { data: sessions } = studentIds.length > 0
    ? await admin
        .from('sessions')
        .select('id, student_id, understanding_score, ended_at')
        .in('student_id', studentIds)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false })
        .returns<SessionRow[]>()
    : { data: [] as SessionRow[] }

  const { data: reports } = studentIds.length > 0
    ? await admin
        .from('reports')
        .select('student_id, competency_scores, weak_points, suggestions')
        .in('student_id', studentIds)
        .returns<ReportRow[]>()
    : { data: [] as ReportRow[] }

  const sessionStats = new Map<string, { scores: number[]; sessionCount: number; latestScore: number | null }>()
  const allScores: number[] = []

  for (const student of students) {
    sessionStats.set(student.id, { scores: [], sessionCount: 0, latestScore: null })
  }

  for (const session of sessions ?? []) {
    const stats = sessionStats.get(session.student_id) ?? { scores: [], sessionCount: 0, latestScore: null }

    stats.sessionCount += 1
    if (stats.latestScore === null) {
      stats.latestScore = session.understanding_score
    }

    if (typeof session.understanding_score === 'number') {
      stats.scores.push(session.understanding_score)
      allScores.push(session.understanding_score)
    }

    sessionStats.set(session.student_id, stats)
  }

  const competencySums: Record<keyof CoreCompetencyScores, number> = {
    자기관리역량: 0,
    대인관계역량: 0,
    시민역량: 0,
    문제해결역량: 0,
  }
  let competencyCount = 0
  const weakPointCounts = new Map<string, number>()

  for (const report of reports ?? []) {
    for (const weakPoint of report.weak_points ?? []) {
      const text = weakPoint.trim()
      if (!text) continue
      weakPointCounts.set(text, (weakPointCounts.get(text) ?? 0) + 1)
    }

    if (!isCompetencyScores(report.competency_scores)) continue

    competencyCount += 1
    for (const key of COMPETENCY_KEYS) {
      competencySums[key] += report.competency_scores[key]
    }
  }

  const summaryData: ClassSummaryData = {
    className: currentClass.name,
    profileName: profile.name,
    totalStudents: students.length,
    activeStudents: Array.from(sessionStats.values()).filter((stats) => stats.sessionCount > 0).length,
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
      : null,
    topWeakPoints: Array.from(weakPointCounts.entries())
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return a.text.localeCompare(b.text, 'ko')
      })
      .slice(0, 5),
    students: students
      .map((student) => {
        const stats = sessionStats.get(student.id) ?? { scores: [], sessionCount: 0, latestScore: null }

        return {
          id: student.id,
          name: student.name,
          avgScore: stats.scores.length > 0
            ? Math.round(stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length)
            : null,
          sessionCount: stats.sessionCount,
          latestScore: stats.latestScore,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ko')),
  }

  return <ClassSummaryDashboard data={summaryData} />
}
