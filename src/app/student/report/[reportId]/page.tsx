import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Lightbulb } from '@phosphor-icons/react/dist/ssr'

interface Props {
  params: Promise<{ reportId: string }>
}

export default async function ReportPage({ params }: Props) {
  const { reportId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 리포트 조회
  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('student_id', user.id)
    .single()

  if (!report) redirect('/student')

  // 세션 조회 (자기성찰 + 이해도)
  const { data: session } = await supabase
    .from('sessions')
    .select('understanding_score, self_reflection, units(title)')
    .eq('id', report.session_id)
    .single()

  // 대화 하이라이트 (핵심 exchange 최대 3개)
  const { data: messages } = await supabase
    .from('messages')
    .select('role, content, expression')
    .eq('session_id', report.session_id)
    .order('created_at', { ascending: true })
    .limit(20)

  // user-assistant pair로 묶기 (최대 3쌍)
  const pairs: { student: string; mooni: string; expression: string | null }[] = []
  const msgs = messages ?? []
  for (let i = 0; i < msgs.length - 1 && pairs.length < 3; i++) {
    if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
      pairs.push({
        student: msgs[i].content,
        mooni: msgs[i + 1].content,
        expression: msgs[i + 1].expression,
      })
    }
  }

  const score = session?.understanding_score ?? 50
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#E8C547' : '#f97316'

  const unitTitle = (() => {
    if (!session?.units) return '단원'
    if (Array.isArray(session.units)) return session.units[0]?.title ?? '단원'
    return (session.units as { title: string }).title
  })()

  return (
    <div
      className="min-h-screen font-sans pb-12"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 60%, #1E1A35 100%)' }}
    >
      <div className="max-w-lg mx-auto px-5">
        {/* 헤더 */}
        <div className="flex items-center gap-3 pt-12 pb-6">
          <Link
            href="/student"
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ArrowLeft size={20} weight="bold" color="white" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white">학습 리포트</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {unitTitle}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* 이해도 점수 카드 */}
          <div
            className="rounded-3xl p-6 flex items-center gap-5"
            style={{
              background: 'rgba(232,197,71,0.10)',
              border: '1px solid rgba(232,197,71,0.25)',
            }}
          >
            <Image
              src="/mooni/impressed.png"
              alt="무니"
              width={120}
              height={80}
              className="shrink-0"
            />
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
                무니 이해도 점수
              </p>
              <span className="text-5xl font-black" style={{ color: scoreColor }}>
                {score}
              </span>
              <span className="text-lg font-bold ml-1" style={{ color: scoreColor }}>
                점
              </span>
              <div className="mt-3 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${score}%`, background: scoreColor }}
                />
              </div>
            </div>
          </div>

          {/* 요약 */}
          {report.summary && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <p className="text-sm font-bold mb-2 text-white">전체 평가</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                {report.summary}
              </p>
            </div>
          )}

          {/* 잘한 부분 (suggestions를 잘한 부분으로 활용) */}
          {(report.suggestions ?? []).length > 0 && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.20)',
              }}
            >
              <p className="text-sm font-bold mb-3 text-white">다음 학습 제안</p>
              <ul className="space-y-2">
                {(report.suggestions as string[]).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      weight="fill"
                      style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }}
                    />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 더 알아볼 부분 */}
          {(report.weak_points ?? []).length > 0 && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: 'rgba(232,197,71,0.06)',
                border: '1px solid rgba(232,197,71,0.20)',
              }}
            >
              <p className="text-sm font-bold mb-3 text-white">더 알아볼 부분</p>
              <ul className="space-y-2">
                {(report.weak_points as string[]).map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb
                      size={16}
                      weight="fill"
                      style={{ color: '#E8C547', marginTop: 2, flexShrink: 0 }}
                    />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 대화 하이라이트 */}
          {pairs.length > 0 && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-sm font-bold mb-4 text-white">대화 하이라이트</p>
              <div className="space-y-4">
                {pairs.map((pair, i) => (
                  <div key={i} className="space-y-2">
                    {/* 학생 말 */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm"
                        style={{ background: '#E8C547', color: '#1A1830' }}
                      >
                        {pair.student}
                      </div>
                    </div>
                    {/* 무니 말 */}
                    <div className="flex items-end gap-2">
                      <Image
                        src={`/mooni/${pair.expression ?? 'curious'}.png`}
                        alt="무니"
                        width={48}
                        height={32}
                        className="shrink-0"
                      />
                      <div
                        className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.80)',
                        }}
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
              className="rounded-3xl p-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                오늘 가장 어려웠던 부분
              </p>
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: 'rgba(255,255,255,0.70)' }}
              >
                &ldquo;{session.self_reflection}&rdquo;
              </p>
            </div>
          )}

          {/* 홈으로 */}
          <Link
            href="/student"
            className="flex items-center justify-center w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830' }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
