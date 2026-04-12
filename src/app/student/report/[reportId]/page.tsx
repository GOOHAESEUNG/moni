import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Lightbulb } from '@phosphor-icons/react/dist/ssr'
import type { CompetencyScores } from '@/types/database'

interface Props {
  params: Promise<{ reportId: string }>
}

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

export default async function ReportPage({ params }: Props) {
  const { reportId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('student_id', user.id)
    .single()

  if (!report) redirect('/student')

  const { data: session } = await supabase
    .from('sessions')
    .select('understanding_score, self_reflection, units(title)')
    .eq('id', report.session_id)
    .single()

  const { data: messages } = await supabase
    .from('messages')
    .select('role, content, expression')
    .eq('session_id', report.session_id)
    .order('created_at', { ascending: true })
    .limit(20)

  const pairs: { student: string; mooni: string; expression: string | null }[] = []
  const msgs = messages ?? []
  for (let i = 0; i < msgs.length - 1 && pairs.length < 3; i++) {
    if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
      pairs.push({ student: msgs[i].content, mooni: msgs[i + 1].content, expression: msgs[i + 1].expression })
    }
  }

  const score = session?.understanding_score ?? 50
  const scoreColor = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const scoreBg   = score >= 80 ? 'rgba(76,175,80,0.10)' : score >= 60 ? 'rgba(232,197,71,0.12)' : 'rgba(255,150,0,0.10)'
  const mooniImg  = score >= 80 ? 'impressed' : score >= 60 ? 'happy' : 'thinking'

  const unitTitle = (() => {
    if (!session?.units) return '단원'
    if (Array.isArray(session.units)) return session.units[0]?.title ?? '단원'
    return (session.units as { title: string }).title
  })()

  const competency = report.competency_scores as CompetencyScores | null

  const COMPETENCY_LABELS = [
    { key: '자기관리역량' as keyof Omit<CompetencyScores, 'comment'>, label: '자기관리', color: '#7C6FBF' },
    { key: '대인관계역량' as keyof Omit<CompetencyScores, 'comment'>, label: '대인관계', color: '#E8C547' },
    { key: '시민역량' as keyof Omit<CompetencyScores, 'comment'>, label: '시민', color: '#4CAF50' },
    { key: '문제해결역량' as keyof Omit<CompetencyScores, 'comment'>, label: '문제해결', color: '#FF9600' },
  ]

  return (
    <div
      className="min-h-screen font-sans pb-12"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}
    >
      <div className="max-w-lg mx-auto px-5">
        {/* 헤더 */}
        <div className="flex items-center gap-3 pt-12 pb-6">
          <Link
            href="/student"
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(150,135,210,0.18)' }}
          >
            <ArrowLeft size={20} weight="bold" style={{ color: '#5A4FA0' }} />
          </Link>
          <div>
            <h1 className="text-lg font-black" style={{ color: '#2D1F6E' }}>학습 리포트</h1>
            <p className="text-xs" style={{ color: 'rgba(90,79,160,0.65)' }}>{unitTitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* 이해도 점수 카드 */}
          <div
            className="rounded-3xl p-6 flex items-center gap-5"
            style={{ ...clayCard, background: scoreBg, boxShadow: 'none', border: `1.5px solid ${scoreColor}30` }}
          >
            <Image src={`/mooni/${mooniImg}.png`} alt="무니" width={110} height={74} className="shrink-0 drop-shadow-md" />
            <div className="flex-1">
              <p className="text-xs font-bold mb-1" style={{ color: 'rgba(90,79,160,0.65)' }}>무니 이해도 점수</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black" style={{ color: scoreColor }}>{score}</span>
                <span className="text-lg font-bold mb-1" style={{ color: scoreColor }}>점</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.60)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          {/* 요약 */}
          {report.summary && (
            <div className="p-5" style={clayCard}>
              <p className="text-sm font-extrabold mb-2" style={{ color: '#2D1F6E' }}>전체 평가</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{report.summary}</p>
            </div>
          )}

          {/* 역량 분석 */}
          {competency && (
            <div className="p-5" style={{ ...clayCard, background: 'rgba(124,111,191,0.08)', boxShadow: 'none', border: '1.5px solid rgba(124,111,191,0.20)' }}>
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>📊 핵심역량 분석</p>
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
            <div className="p-5" style={{ ...clayCard, background: 'rgba(76,175,80,0.07)', boxShadow: 'none', border: '1.5px solid rgba(76,175,80,0.18)' }}>
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D1F6E' }}>다음 학습 제안</p>
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
            <div className="p-5" style={{ ...clayCard, background: 'rgba(232,197,71,0.09)', boxShadow: 'none', border: '1.5px solid rgba(232,197,71,0.28)' }}>
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D1F6E' }}>더 알아볼 부분</p>
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
            <div className="p-5" style={clayCard}>
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>대화 하이라이트</p>
              <div className="space-y-4">
                {pairs.map((pair, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm font-semibold"
                        style={{ background: '#E8C547', color: '#1A1830' }}>
                        {pair.student}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <Image src={`/mooni/${pair.expression ?? 'curious'}.png`} alt="무니" width={44} height={30} className="shrink-0" />
                      <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm"
                        style={{ background: 'rgba(170,155,230,0.15)', color: '#3D3060' }}>
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
            <div className="p-5" style={{ ...clayCard, background: 'rgba(255,255,255,0.70)', boxShadow: 'none', border: '1.5px solid rgba(170,155,230,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(90,79,160,0.60)' }}>
                나의 자기성찰
              </p>
              <p className="text-sm leading-relaxed italic" style={{ color: '#4A4A6A' }}>
                &ldquo;{session.self_reflection}&rdquo;
              </p>
            </div>
          )}

          <Link
            href="/student"
            className="flex items-center justify-center w-full rounded-2xl py-4 font-extrabold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
