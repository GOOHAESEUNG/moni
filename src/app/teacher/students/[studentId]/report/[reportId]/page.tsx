import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Lightbulb } from '@phosphor-icons/react/dist/ssr'
import type { CompetencyScores } from '@/types/database'

interface Props {
  params: Promise<{ studentId: string; reportId: string }>
}

const COMPETENCY_LABELS: { key: keyof Omit<CompetencyScores, 'comment'>; label: string; color: string }[] = [
  { key: '자기관리역량', label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량', label: '대인관계', color: '#E8C547' },
  { key: '시민역량', label: '시민', color: '#4CAF50' },
  { key: '문제해결역량', label: '문제해결', color: '#FF9600' },
]

export default async function TeacherReportViewPage({ params }: Props) {
  const { studentId, reportId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 교사 소유권 확인
  const { data: ownership } = await admin
    .from('enrollments')
    .select('class_id, classes!inner(teacher_id)')
    .eq('student_id', studentId)
    .eq('classes.teacher_id', user.id)
    .single()

  if (!ownership) redirect('/teacher')

  const [{ data: report }, { data: student }] = await Promise.all([
    admin.from('reports').select('*').eq('id', reportId).eq('student_id', studentId).single(),
    admin.from('profiles').select('name').eq('id', studentId).single(),
  ])

  if (!report) redirect(`/teacher/students/${studentId}`)

  const [{ data: session }, { data: messages }] = await Promise.all([
    admin.from('sessions')
      .select('understanding_score, self_reflection, units(title)')
      .eq('id', report.session_id)
      .single(),
    admin.from('messages')
      .select('role, content, expression')
      .eq('session_id', report.session_id)
      .order('created_at', { ascending: true })
      .limit(20),
  ])

  // 대화 하이라이트 (최대 3쌍)
  const pairs: { student: string; mooni: string; expression: string | null }[] = []
  const msgs = messages ?? []
  for (let i = 0; i < msgs.length - 1 && pairs.length < 3; i++) {
    if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
      pairs.push({ student: msgs[i].content, mooni: msgs[i + 1].content, expression: msgs[i + 1].expression })
    }
  }

  const score = session?.understanding_score ?? 0
  const scoreColor = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const scoreBg = score >= 80 ? 'rgba(76,175,80,0.10)' : score >= 60 ? 'rgba(232,197,71,0.12)' : 'rgba(255,150,0,0.10)'
  const unitTitle = (() => {
    if (!session?.units) return '단원'
    if (Array.isArray(session.units)) return session.units[0]?.title ?? '단원'
    return (session.units as { title: string }).title
  })()

  const competency = report.competency_scores as CompetencyScores | null

  return (
    <div
      className="min-h-screen font-sans pb-12"
      style={{ background: '#F2F1FA' }}
    >
      <div className="max-w-lg mx-auto px-5">
        {/* 헤더 */}
        <div className="flex items-center gap-3 pt-12 pb-6">
          <Link
            href={`/teacher/students/${studentId}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <ArrowLeft size={20} weight="bold" style={{ color: '#2D2F2F' }} />
          </Link>
          <div>
            <h1 className="text-lg font-black" style={{ color: '#2D2F2F' }}>학습 리포트</h1>
            <p className="text-xs" style={{ color: '#9EA0B4' }}>
              {student?.name} · {unitTitle}
            </p>
          </div>
          <span
            className="ml-auto rounded-full px-3 py-1 text-xs font-bold shrink-0"
            style={{ background: 'rgba(124,111,191,0.12)', color: '#7C6FBF' }}
          >
            교사 뷰
          </span>
        </div>

        <div className="space-y-4">
          {/* 이해도 점수 */}
          <div
            className="rounded-[20px] p-6 flex items-center gap-5"
            style={{ background: scoreBg, border: `1.5px solid ${scoreColor}30` }}
          >
            <Image
              src={score >= 80 ? '/mooni/impressed.png' : score >= 60 ? '/mooni/happy.png' : '/mooni/thinking.png'}
              alt="무니" width={110} height={74} className="shrink-0 drop-shadow-md"
            />
            <div className="flex-1">
              <p className="text-xs font-bold mb-1" style={{ color: '#9EA0B4' }}>무니 이해도 점수</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black" style={{ color: scoreColor }}>{score}</span>
                <span className="text-lg font-bold mb-1" style={{ color: scoreColor }}>점</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          {/* 요약 */}
          {report.summary && (
            <div
              className="rounded-[20px] p-5 bg-white"
              style={{ border: '1px solid #ECEAF6' }}
            >
              <p className="text-sm font-extrabold mb-2" style={{ color: '#2D2F2F' }}>전체 평가</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{report.summary}</p>
            </div>
          )}

          {/* 역량 분석 */}
          {competency && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(124,111,191,0.08)', border: '1.5px solid rgba(124,111,191,0.20)' }}
            >
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>📊 핵심역량 분석 <span className="text-xs font-normal ml-1" style={{ color: '#9EA0B4' }}>Gemma 4B 분석</span></p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {COMPETENCY_LABELS.map(({ key, label, color }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#6B6B8D' }}>{label}</span>
                      <span className="text-sm font-black" style={{ color }}>{competency[key]}<span className="text-xs font-normal">/5</span></span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(200,190,240,0.30)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(competency[key] / 5) * 100}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              {competency.comment && (
                <p className="text-xs mt-3 leading-relaxed italic" style={{ color: '#6B6B8D' }}>
                  &ldquo;{competency.comment}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* 학습 제안 */}
          {(report.suggestions ?? []).length > 0 && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(76,175,80,0.07)', border: '1.5px solid rgba(76,175,80,0.18)' }}
            >
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>다음 학습 제안</p>
              <ul className="space-y-2">
                {(report.suggestions as string[]).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={16} weight="fill" style={{ color: '#4CAF50', marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#4A4A6A' }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 더 알아볼 부분 */}
          {(report.weak_points ?? []).length > 0 && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(232,197,71,0.09)', border: '1.5px solid rgba(232,197,71,0.28)' }}
            >
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>더 알아볼 부분</p>
              <ul className="space-y-2">
                {(report.weak_points as string[]).map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb size={16} weight="fill" style={{ color: '#C8A020', marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#4A4A6A' }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 대화 하이라이트 */}
          {pairs.length > 0 && (
            <div
              className="rounded-[20px] p-5 bg-white"
              style={{ border: '1px solid #ECEAF6' }}
            >
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>대화 하이라이트</p>
              <div className="space-y-4">
                {pairs.map((pair, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-end">
                      <div
                        className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm font-semibold"
                        style={{ background: '#E8C547', color: '#1A1830' }}
                      >
                        {pair.student}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <Image src={`/mooni/${pair.expression ?? 'curious'}.png`} alt="무니" width={44} height={30} className="shrink-0" />
                      <div
                        className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm"
                        style={{ background: 'rgba(170,155,230,0.15)', color: '#3D3060' }}
                      >
                        {pair.mooni}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 자기성찰 */}
          {session?.self_reflection && (
            <div
              className="rounded-[20px] p-5 bg-white"
              style={{ border: '1px solid #ECEAF6' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: '#9EA0B4' }}>
                학생 자기성찰
              </p>
              <p className="text-sm leading-relaxed italic" style={{ color: '#4A4A6A' }}>
                &ldquo;{session.self_reflection}&rdquo;
              </p>
            </div>
          )}

          <Link
            href={`/teacher/students/${studentId}`}
            className="flex items-center justify-center w-full rounded-2xl py-4 font-extrabold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
          >
            ← 학생 상세로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
