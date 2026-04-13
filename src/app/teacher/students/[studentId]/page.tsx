import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, ArrowSquareOut, BookOpen, Users, Trophy, ChartBar } from '@phosphor-icons/react/dist/ssr'
import ConsultationSection from './ConsultationSection'

interface Props {
  params: Promise<{ studentId: string }>
}

interface CompetencyScores {
  자기관리역량: number
  대인관계역량: number
  시민역량: number
  문제해결역량: number
  comment?: string
}

interface ReportEntry {
  id: string
  summary: string | null
  weak_points: string[]
  suggestions: string[]
  competency_scores: CompetencyScores | null
}

interface SessionRow {
  id: string
  unit_id: string | null
  understanding_score: number | null
  ended_at: string | null
  units: { title: string } | { title: string }[] | null
}

interface ReportRow {
  id: string
  session_id: string
  summary: string | null
  weak_points: string[]
  suggestions: string[]
  competency_scores: CompetencyScores | null
  created_at: string
}

const COMPETENCY_LABELS: { key: keyof Omit<CompetencyScores, 'comment'>; label: string; color: string }[] = [
  { key: '자기관리역량', label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량', label: '대인관계', color: '#E8C547' },
  { key: '시민역량', label: '시민', color: '#4CAF50' },
  { key: '문제해결역량', label: '문제해결', color: '#FF9600' },
]

function CompetencyBar({ scores }: { scores: CompetencyScores }) {
  return (
    <div>
      <p className="text-xs font-bold mb-2" style={{ color: '#7C6FBF' }}>
        📊 핵심역량 분석
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {COMPETENCY_LABELS.map(({ key, label, color }) => {
          const val = scores[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs" style={{ color: '#9EA0B4' }}>{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{val}/5</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(val / 5) * 100}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
      {scores.comment && (
        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6B6B8D', fontStyle: 'italic' }}>
          &ldquo;{scores.comment}&rdquo;
        </p>
      )}
    </div>
  )
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) return null
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const bg = score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020'
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: bg, color }}>
      {score}점
    </span>
  )
}

export default async function StudentDetailPage({ params }: Props) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 현재 선생님의 반에 해당 학생이 있는지 확인
  const { data: ownership } = await admin
    .from('enrollments')
    .select('class_id, classes!inner(teacher_id)')
    .eq('student_id', studentId)
    .eq('classes.teacher_id', user.id)
    .single()

  if (!ownership) redirect('/teacher')

  const classId = (ownership as { class_id: string }).class_id
  const [{ data: teacher }, { data: currentClass }, { data: student }] = await Promise.all([
    admin.from('profiles').select('name').eq('id', user.id).single(),
    admin.from('classes').select('name').eq('id', classId).single(),
    admin.from('profiles').select('name, email').eq('id', studentId).single(),
  ])

  const { data: reports } = await admin
    .from('reports')
    .select('id, session_id, summary, weak_points, suggestions, competency_scores, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  const { data: sessions } = await admin
    .from('sessions')
    .select('id, unit_id, understanding_score, ended_at, units(title)')
    .eq('student_id', studentId)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })

  // session_id → report 매핑
  const reportBySessionId = new Map<string, ReportEntry>(
    ((reports ?? []) as ReportRow[]).map((r) => [
      r.session_id,
      {
        id: r.id,
        summary: r.summary,
        weak_points: r.weak_points ?? [],
        suggestions: r.suggestions ?? [],
        competency_scores: r.competency_scores ?? null,
      }
    ])
  )

  // 단원별 그룹화
  const unitMap = new Map<string, { unitTitle: string; sessions: SessionRow[] }>()
  for (const s of ((sessions ?? []) as SessionRow[])) {
    const title = Array.isArray(s.units) ? s.units[0]?.title : s.units?.title ?? '단원'
    const key = s.unit_id ?? title
    const existing = unitMap.get(key)
    if (existing) {
      existing.sessions.push(s)
    } else {
      unitMap.set(key, { unitTitle: title, sessions: [s] })
    }
  }

  const clayCard = 'rounded-[20px] p-5 bg-white'
  const clayStyle = { border: '1px solid #ECEAF6' }

  const totalSessions = sessions?.length ?? 0
  const scoredList = (sessions ?? []).filter((s) => s.understanding_score !== null)
  const avgScore = scoredList.length > 0
    ? Math.round(scoredList.reduce((a, s) => a + (s.understanding_score ?? 0), 0) / scoredList.length)
    : null

  const teacherName = teacher?.name ?? '선생님'
  const className = currentClass?.name ?? '반'

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      {/* 사이드바 */}
      <nav className="hidden md:flex flex-col w-[220px] shrink-0 overflow-y-auto" style={{ background: '#13112A' }}>
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-extrabold mb-5" style={{ color: '#E8C547' }}>🌙 Moni</p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(232,197,71,0.18)' }}>
              <span className="text-sm font-extrabold" style={{ color: '#E8C547' }}>{teacherName.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{teacherName} 선생님</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>{className}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 py-4 space-y-1">
          <Link href="/teacher" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <BookOpen size={18} weight="regular" /><span className="font-semibold text-sm">단원 관리</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}>
            <Users size={18} weight="fill" /><span className="font-bold text-sm">학생 목록</span>
          </div>
          <Link href="/teacher/quests/new" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Trophy size={18} weight="regular" /><span className="font-semibold text-sm">퀘스트</span>
          </Link>
          <Link href="/teacher/summary" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <ChartBar size={18} weight="regular" /><span className="font-semibold text-sm">반 요약</span>
          </Link>
        </div>
      </nav>

      {/* 메인 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 shrink-0 flex items-center gap-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <Link href="/teacher/students" className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: '#F5F4FA' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#2D2F2F' }} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>{student?.name ?? '학생'}</h1>
            <p className="text-xs" style={{ color: '#9EA0B4' }}>{student?.email}</p>
          </div>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4 max-w-2xl mx-auto">
        <ConsultationSection studentId={studentId} studentName={student?.name ?? '학생'} />

        {/* 학습 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className={clayCard} style={clayStyle}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>{totalSessions}</p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>총 학습 횟수</p>
          </div>
          <div className={clayCard} style={clayStyle}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>
              {avgScore ?? '-'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>평균 이해도</p>
          </div>
        </div>

        {/* 단원별 리포트 */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: '#9EA0B4' }}>단원별 학습 리포트</h2>

          {unitMap.size > 0 ? (
            <div className="space-y-5">
              {Array.from(unitMap.entries()).map(([key, { unitTitle, sessions: unitSessions }]) => {
                const unitScored = unitSessions.filter((s) => s.understanding_score !== null)
                const unitAvg = unitScored.length > 0
                  ? Math.round(unitScored.reduce((a, s) => a + (s.understanding_score ?? 0), 0) / unitScored.length)
                  : null

                return (
                  <div key={key}>
                    {/* 단원 헤더 */}
                    <div className="flex items-center justify-between px-1 mb-2">
                      <h3 className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>{unitTitle}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#9EA0B4' }}>{unitSessions.length}회 학습</span>
                        {unitAvg !== null && <ScorePill score={unitAvg} />}
                      </div>
                    </div>

                    {/* 세션 목록 */}
                    <div className="space-y-2">
                      {unitSessions.map((s) => {
                        const report = reportBySessionId.get(s.id)
                        const dateStr = s.ended_at
                          ? new Date(s.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                          : ''

                        if (report) {
                          return (
                            <div key={s.id} className="rounded-[20px] overflow-hidden bg-white"
                              style={{ border: '1px solid #ECEAF6' }}>

                              <div className="flex items-center justify-between px-5 py-4"
                                style={{ borderBottom: '1px solid #F7F7F7' }}>
                                <p className="text-xs" style={{ color: '#9EA0B4' }}>{dateStr}</p>
                                <div className="flex items-center gap-2">
                                  <ScorePill score={s.understanding_score} />
                                  <Link
                                    href={`/teacher/students/${studentId}/report/${report.id}`}
                                    className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                                    style={{ background: '#F4F2FF', color: '#7C6FBF' }}
                                  >
                                    <ArrowSquareOut size={12} weight="bold" />
                                    전체 보기
                                  </Link>
                                </div>
                              </div>

                              <div className="px-5 py-4 space-y-3">
                                {report.summary && (
                                  <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>
                                    {report.summary}
                                  </p>
                                )}

                                {report.competency_scores && (
                                  <>
                                    <div style={{ borderTop: '1px solid #F0EFF8' }} />
                                    <CompetencyBar scores={report.competency_scores} />
                                  </>
                                )}

                                {report.weak_points.length > 0 && (
                                  <div>
                                    <p className="text-xs font-bold mb-2" style={{ color: '#FF9600' }}>
                                      💡 더 알아볼 부분
                                    </p>
                                    <ul className="space-y-1">
                                      {report.weak_points.map((point, i) => (
                                        <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#6B6B8D' }}>
                                          <span style={{ color: '#FF9600', flexShrink: 0 }}>•</span>
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {report.suggestions.length > 0 && (
                                  <div>
                                    <p className="text-xs font-bold mb-2" style={{ color: '#4CAF50' }}>
                                      ✓ 다음 학습 제안
                                    </p>
                                    <ul className="space-y-1">
                                      {report.suggestions.map((suggestion, i) => (
                                        <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#6B6B8D' }}>
                                          <span style={{ color: '#4CAF50', flexShrink: 0 }}>•</span>
                                          {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }

                        // 리포트 없는 세션 — compact row
                        return (
                          <div key={s.id} className="flex items-center justify-between px-5 py-3 bg-white rounded-[16px]"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <p className="text-xs" style={{ color: '#9EA0B4' }}>{dateStr}</p>
                            <ScorePill score={s.understanding_score} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={clayCard} style={{ ...clayStyle, textAlign: 'center' }}>
              <p style={{ color: '#9EA0B4', fontSize: 14 }}>아직 학습 기록이 없어요</p>
            </div>
          )}
        </section>
          </div>
        </div>
      </div>
    </div>
  )
}
