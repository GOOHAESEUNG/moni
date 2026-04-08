import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { ChartBar, Star, BookOpen, TrendUp } from '@phosphor-icons/react/dist/ssr'

const clayStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

export default async function StudentProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: sessions } = await admin
    .from('sessions')
    .select('id, understanding_score, ended_at, units(title)')
    .eq('student_id', user.id)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })

  const { data: reports } = await admin
    .from('reports')
    .select('id, summary, weak_points, created_at, units(title)')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const validSessions = (sessions ?? []).filter(s => s.understanding_score !== null)
  const avgScore = validSessions.length
    ? Math.round(validSessions.reduce((a, s) => a + (s.understanding_score ?? 0), 0) / validSessions.length)
    : null
  const best = validSessions.length ? Math.max(...validSessions.map(s => s.understanding_score ?? 0)) : null

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F7F7F7' }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>학습 현황</h1>
        <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>지금까지의 학습 기록이에요</p>
      </div>

      <div className="px-5 space-y-4 max-w-lg mx-auto">
        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <BookOpen size={22} weight="fill" style={{ color: '#E8C547' }} />, value: sessions?.length ?? 0, label: '총 학습' },
            { icon: <Star size={22} weight="fill" style={{ color: '#E8C547' }} />, value: avgScore !== null ? `${avgScore}점` : '-', label: '평균 점수' },
            { icon: <TrendUp size={22} weight="fill" style={{ color: '#4CAF50' }} />, value: best !== null ? `${best}점` : '-', label: '최고 점수' },
          ].map((item, i) => (
            <div key={i} className="p-4 text-center" style={clayStyle}>
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* 최근 리포트 */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: '#9EA0B4' }}>최근 학습 리포트</h2>
          {reports && reports.length > 0 ? (
            <div style={{ ...clayStyle, padding: 0, overflow: 'hidden' }}>
              {reports.map((r: any, i: number) => (
                <a key={r.id} href={`/student/report/${r.id}`}
                  className="block px-5 py-4 hover:bg-[#F7F7F7] transition-colors"
                  style={{ borderTop: i > 0 ? '1px solid #F7F7F7' : 'none' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>
                        {Array.isArray(r.units) ? r.units[0]?.title : r.units?.title ?? '단원'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>
                        {new Date(r.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ color: '#E8C547', fontSize: 18 }}>→</span>
                  </div>
                  {r.summary && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#9EA0B4' }}>{r.summary}</p>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center" style={clayStyle}>
              <p className="text-4xl mb-2">📚</p>
              <p className="font-semibold" style={{ color: '#2D2F2F' }}>아직 학습 기록이 없어요</p>
              <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>무니에게 첫 번째 개념을 가르쳐보세요!</p>
            </div>
          )}
        </section>

        {/* 전체 세션 목록 */}
        {(sessions?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: '#9EA0B4' }}>전체 학습 기록</h2>
            <div style={{ ...clayStyle, padding: 0, overflow: 'hidden' }}>
              {sessions!.map((s: any, i: number) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3"
                  style={{ borderTop: i > 0 ? '1px solid #F7F7F7' : 'none' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>
                      {Array.isArray(s.units) ? s.units[0]?.title : s.units?.title ?? '단원'}
                    </p>
                    <p className="text-xs" style={{ color: '#9EA0B4' }}>
                      {s.ended_at ? new Date(s.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '진행 중'}
                    </p>
                  </div>
                  {s.understanding_score !== null && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: s.understanding_score >= 80 ? '#4CAF5020' : s.understanding_score >= 60 ? '#E8C54720' : '#FF960020',
                        color: s.understanding_score >= 80 ? '#4CAF50' : s.understanding_score >= 60 ? '#C8A020' : '#FF9600',
                      }}>
                      {s.understanding_score}점
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
