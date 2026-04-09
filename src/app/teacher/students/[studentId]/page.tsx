import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

interface Props {
  params: Promise<{ studentId: string }>
}

interface ReportEntry {
  id: string
  summary: string | null
  weak_points: string[]
  suggestions: string[]
  unitTitle: string
}

interface SessionRow {
  id: string
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
  created_at: string
  units: { title: string } | { title: string }[] | null
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

  const { data: student } = await admin.from('profiles').select('name, email').eq('id', studentId).single()

  const { data: reports } = await admin
    .from('reports')
    .select('id, session_id, summary, weak_points, suggestions, created_at, units(title)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  const { data: sessions } = await admin
    .from('sessions')
    .select('id, understanding_score, ended_at, units(title)')
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
        unitTitle: Array.isArray(r.units) ? r.units[0]?.title : r.units?.title ?? '단원',
      }
    ])
  )

  const clayCard = 'rounded-[20px] p-5 bg-white'
  const clayStyle = { boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)' }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F7F7' }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link href="/teacher/students" className="flex items-center justify-center w-10 h-10 rounded-full bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ArrowLeft size={20} weight="bold" style={{ color: '#2D2F2F' }} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>{student?.name ?? '학생'}</h1>
          <p className="text-xs" style={{ color: '#9EA0B4' }}>{student?.email}</p>
        </div>
      </div>

      <div className="px-5 space-y-4 max-w-lg mx-auto">
        {/* 학습 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className={clayCard} style={clayStyle}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>{sessions?.length ?? 0}</p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>총 학습 횟수</p>
          </div>
          <div className={clayCard} style={clayStyle}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>
              {sessions?.length
                ? Math.round(sessions.filter(s => s.understanding_score).reduce((a, s) => a + (s.understanding_score ?? 0), 0) / sessions.filter(s => s.understanding_score).length)
                : '-'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>평균 이해도</p>
          </div>
        </div>

        {/* 학습 리포트 */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: '#9EA0B4' }}>학습 리포트</h2>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-0">
              {(sessions as SessionRow[]).map((s) => {
                const report = reportBySessionId.get(s.id)
                const unitTitle = Array.isArray(s.units) ? s.units[0]?.title : s.units?.title ?? '단원'
                const dateStr = s.ended_at
                  ? new Date(s.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                  : ''
                const score = s.understanding_score

                if (report) {
                  return (
                    <div key={s.id} className="rounded-[20px] overflow-hidden bg-white"
                      style={{ boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)', marginBottom: 12 }}>

                      {/* 카드 헤더 */}
                      <div className="flex items-center justify-between px-5 py-4"
                        style={{ borderBottom: '1px solid #F7F7F7' }}>
                        <div>
                          <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>
                            {unitTitle}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>
                            {dateStr}
                          </p>
                        </div>
                        {score !== null && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                              background: score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020',
                              color: score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600',
                            }}>
                            {score}점
                          </span>
                        )}
                      </div>

                      {/* 리포트 내용 */}
                      <div className="px-5 py-4 space-y-3">
                        {report.summary && (
                          <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>
                            {report.summary}
                          </p>
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
                  <div key={s.id} className="flex items-center justify-between px-5 py-3 bg-white rounded-[16px] mb-2"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>{unitTitle}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{dateStr}</p>
                    </div>
                    {score !== null && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020',
                          color: score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600',
                        }}>
                        {score}점
                      </span>
                    )}
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
  )
}
