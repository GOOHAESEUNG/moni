import Link from 'next/link'
import { ArrowLeft, ArrowSquareOut, BookOpen, Users, Trophy, ChartBar } from '@phosphor-icons/react/dist/ssr'
import DemoStudentDetailTutorial from '@/components/DemoStudentDetailTutorial'

interface Props {
  params: Promise<{ studentId: string }>
}

const DEMO_STUDENTS: Record<string, {
  name: string; email: string
  sessions: { date: string; unit: string; score: number; summary: string; weakPoints: string[]; suggestions: string[]; competency: { 자기관리역량: number; 대인관계역량: number; 시민역량: number; 문제해결역량: number; comment: string } | null }[]
}> = {
  s1: {
    name: '김지민', email: 'jimin@demo.com',
    sessions: [
      {
        date: '4월 10일', unit: '도형의 넓이', score: 88,
        summary: '직사각형과 삼각형의 넓이 공식을 정확히 이해하고 원리까지 설명함. 평행사변형에서 잠깐 막혔지만 스스로 찾아냈어요.',
        weakPoints: ['평행사변형 넓이 공식의 원리 설명'],
        suggestions: ['평행사변형 = 삼각형 2개 원리 그림으로 복습', '응용 문제로 확인'],
        competency: { 자기관리역량: 4, 대인관계역량: 5, 시민역량: 4, 문제해결역량: 5, comment: '스스로 오류를 인지하고 수정하는 자기조절 능력이 뛰어남. 무니의 피드백을 적극적으로 수용하는 태도를 보임.' },
      },
      {
        date: '4월 8일', unit: '분수의 덧셈', score: 82,
        summary: '통분 개념을 잘 이해하고 있어요. 분모가 다른 분수의 덧셈도 정확히 설명했어요.',
        weakPoints: ['대분수 변환 시 실수 가능성'],
        suggestions: ['대분수 ↔ 가분수 변환 연습'],
        competency: null,
      },
    ],
  },
  s2: {
    name: '박서연', email: 'seoyeon@demo.com',
    sessions: [
      {
        date: '4월 10일', unit: '도형의 넓이', score: 72,
        summary: '기본 공식은 알고 있지만 "왜 그 공식인지" 원리 설명에 어려움을 겪었어요.',
        weakPoints: ['단위(cm²) 의미 연결 부족', '삼각형 높이 개념'],
        suggestions: ['격자 그림으로 넓이 = 칸 수 개념 재확인', '높이는 항상 밑변에 수직임을 강조'],
        competency: { 자기관리역량: 3, 대인관계역량: 4, 시민역량: 3, 문제해결역량: 3, comment: '학습 의지는 높으나 개념 연결에 어려움이 있음. 구체적인 예시 제공 시 빠르게 이해하는 모습을 보임.' },
      },
    ],
  },
  s3: {
    name: '이준혁', email: 'junhyeok@demo.com',
    sessions: [
      {
        date: '4월 9일', unit: '도형의 넓이', score: 45,
        summary: '직사각형 넓이는 구할 수 있지만 삼각형, 평행사변형으로 확장이 어려웠어요.',
        weakPoints: ['삼각형 높이 개념', '공식 암기에만 의존'],
        suggestions: ['직사각형 → 삼각형 관계 시각적으로 다시 학습', '공식보다 원리 먼저 이해 접근'],
        competency: { 자기관리역량: 2, 대인관계역량: 3, 시민역량: 2, 문제해결역량: 2, comment: '개념 이해보다 암기에 의존하는 경향이 있음. 반복 학습과 격려가 필요함.' },
      },
    ],
  },
  s4: {
    name: '최수아', email: 'sua@demo.com',
    sessions: [
      {
        date: '4월 10일', unit: '도형의 넓이', score: 91,
        summary: '모든 도형의 넓이 원리를 명확히 이해하고 응용 문제까지 스스로 만들어 설명했어요!',
        weakPoints: [],
        suggestions: ['심화 문제로 확장 도전 추천'],
        competency: { 자기관리역량: 5, 대인관계역량: 5, 시민역량: 5, 문제해결역량: 5, comment: '모든 역량이 매우 우수. 자기주도 학습 능력이 탁월하며 무니를 통해 개념을 창의적으로 전달함.' },
      },
    ],
  },
  s5: {
    name: '정민준', email: 'minjun@demo.com',
    sessions: [],
  },
}

const COMPETENCY_LABELS = [
  { key: '자기관리역량' as const, label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량' as const, label: '대인관계', color: '#E8C547' },
  { key: '시민역량' as const, label: '시민', color: '#4CAF50' },
  { key: '문제해결역량' as const, label: '문제해결', color: '#FF9600' },
]

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const bg = score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020'
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: bg, color }}>{score}점</span>
  )
}

export default async function DemoStudentDetailPage({ params }: Props) {
  const { studentId } = await params
  const student = DEMO_STUDENTS[studentId] ?? DEMO_STUDENTS['s1']

  const scoredSessions = student.sessions.filter((s) => s.score != null)
  const avgScore = scoredSessions.length > 0
    ? Math.round(scoredSessions.reduce((a, s) => a + s.score, 0) / scoredSessions.length)
    : null

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      {/* 사이드바 */}
      <nav className="hidden md:flex flex-col w-[220px] shrink-0 overflow-y-auto" style={{ background: '#13112A' }}>
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-extrabold mb-5" style={{ color: '#E8C547' }}>🌙 무니에게 알려줘</p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(232,197,71,0.18)' }}>
              <span className="text-sm font-extrabold" style={{ color: '#E8C547' }}>이</span>
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>이선생 선생님</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>3학년 2반</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 py-4 space-y-1">
          <Link href="/demo/teacher" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <BookOpen size={18} weight="regular" /><span className="font-semibold text-sm">단원 관리</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547', borderLeft: '3px solid #E8C547' }}>
            <Users size={18} weight="fill" /><span className="font-bold text-sm">학생 목록</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Trophy size={18} weight="regular" /><span className="font-semibold text-sm">퀘스트</span>
          </div>
          <Link href="/demo/teacher/summary" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <ChartBar size={18} weight="regular" /><span className="font-semibold text-sm">반 요약</span>
          </Link>
        </div>
      </nav>

      {/* 메인 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 shrink-0 flex items-center gap-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <Link href="/demo/teacher/students" className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: '#F5F4FA' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#2D2F2F' }} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>{student.name}</h1>
            <p className="text-xs" style={{ color: '#9EA0B4' }}>{student.email}</p>
          </div>
          <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold shrink-0"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4 max-w-2xl mx-auto">
        {/* 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[20px] p-5 bg-white" style={{ border: '1px solid #ECEAF6' }}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>{student.sessions.length}</p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>총 학습 횟수</p>
          </div>
          <div className="rounded-[20px] p-5 bg-white" style={{ border: '1px solid #ECEAF6' }}>
            <p className="text-2xl font-extrabold" style={{ color: '#E8C547' }}>{avgScore ?? '-'}</p>
            <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>평균 이해도</p>
          </div>
        </div>

        {student.sessions.length === 0 ? (
          <div className="rounded-[20px] p-5 bg-white text-center" style={{ border: '1px solid #ECEAF6' }}>
            <p style={{ color: '#9EA0B4', fontSize: 14 }}>아직 학습 기록이 없어요</p>
          </div>
        ) : (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: '#9EA0B4' }}>
              단원별 학습 리포트
            </h2>
            <div className="space-y-3">
              {student.sessions.map((s, i) => (
                <div key={i} className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ECEAF6' }} {...(i === 0 ? { 'data-tutorial': 'report-card' } : {})}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F7F7F7' }}>
                    <div>
                      <p className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{s.unit}</p>
                      <p className="text-xs" style={{ color: '#9EA0B4' }}>{s.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ScorePill score={s.score} />
                      <Link
                        href={`/demo/teacher/students/${studentId}/report/${i}`}
                        className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                        style={{ background: '#F4F2FF', color: '#7C6FBF' }}
                      >
                        <ArrowSquareOut size={12} weight="bold" />
                        전체 보기
                      </Link>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{s.summary}</p>

                    {s.competency && (
                      <>
                        <div style={{ borderTop: '1px solid #F0EFF8' }} />
                        <div>
                          <p className="text-xs font-bold mb-2" style={{ color: '#7C6FBF' }}>📊 핵심역량 분석</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {COMPETENCY_LABELS.map(({ key, label, color }) => (
                              <div key={key}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs" style={{ color: '#9EA0B4' }}>{label}</span>
                                  <span className="text-xs font-bold" style={{ color }}>{s.competency![key]}/5</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${(s.competency![key] / 5) * 100}%`, background: color }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          {s.competency.comment && (
                            <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6B6B8D', fontStyle: 'italic' }}>
                              &ldquo;{s.competency.comment}&rdquo;
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {s.weakPoints.length > 0 && (
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: '#FF9600' }}>💡 더 알아볼 부분</p>
                        <ul className="space-y-1">
                          {s.weakPoints.map((point, j) => (
                            <li key={j} className="text-xs flex items-start gap-1.5" style={{ color: '#6B6B8D' }}>
                              <span style={{ color: '#FF9600', flexShrink: 0 }}>•</span>{point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: '#4CAF50' }}>✓ 다음 학습 제안</p>
                        <ul className="space-y-1">
                          {s.suggestions.map((sug, j) => (
                            <li key={j} className="text-xs flex items-start gap-1.5" style={{ color: '#6B6B8D' }}>
                              <span style={{ color: '#4CAF50', flexShrink: 0 }}>•</span>{sug}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
          </div>
        </div>
      </div>
      <DemoStudentDetailTutorial />
    </div>
  )
}
