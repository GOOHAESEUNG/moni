import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Lightbulb, BookOpen, Users, Trophy, ChartBar } from '@phosphor-icons/react/dist/ssr'

interface Props {
  params: Promise<{ studentId: string; sessionIndex: string }>
}

const DEMO_STUDENTS: Record<string, {
  name: string
  sessions: {
    date: string; unit: string; score: number
    summary: string; weakPoints: string[]; suggestions: string[]
    competency: { 자기관리역량: number; 대인관계역량: number; 시민역량: number; 문제해결역량: number; comment: string } | null
    selfReflection: string | null
    highlights: { student: string; mooni: string; expression: string }[]
  }[]
}> = {
  s1: {
    name: '김지민',
    sessions: [{
      date: '4월 10일', unit: '도형의 넓이', score: 88,
      summary: '직사각형과 삼각형의 넓이 공식을 정확히 이해하고 원리까지 설명함. 평행사변형에서 잠깐 막혔지만 스스로 찾아냈어요.',
      weakPoints: ['평행사변형 넓이 공식의 원리 설명'],
      suggestions: ['평행사변형 = 삼각형 2개 원리 그림으로 복습', '응용 문제로 확인'],
      competency: { 자기관리역량: 4, 대인관계역량: 5, 시민역량: 4, 문제해결역량: 5, comment: '스스로 오류를 인지하고 수정하는 자기조절 능력이 뛰어남. 무니의 피드백을 적극적으로 수용하는 태도를 보임.' },
      selfReflection: '평행사변형이 왜 밑변×높이인지 원리를 설명하기가 어려웠어요.',
      highlights: [
        { student: '직사각형 넓이는 가로 곱하기 세로예요!', mooni: '오~ 그렇구나! 그러면 왜 곱하는 거야? 더하면 안 돼?', expression: 'curious' },
        { student: '더하면 그냥 테두리 길이잖아요. 곱해야 안에 있는 칸 수를 구할 수 있어요!', mooni: '와! 무니 이제 이해했어! 칸 수구나! 그럼 삼각형은?', expression: 'happy' },
        { student: '삼각형은 직사각형의 딱 절반이에요. 그래서 가로×세로÷2예요.', mooni: '완벽해요! 왜 절반인지도 설명할 수 있어요? 🌙', expression: 'impressed' },
      ],
    }, {
      date: '4월 8일', unit: '분수의 덧셈', score: 82,
      summary: '통분 개념을 잘 이해하고 있어요. 분모가 다른 분수의 덧셈도 정확히 설명했어요.',
      weakPoints: ['대분수 변환 시 실수 가능성'],
      suggestions: ['대분수 ↔ 가분수 변환 연습'],
      competency: null,
      selfReflection: '통분할 때 최소공배수 찾는 게 느렸어요.',
      highlights: [
        { student: '분모가 다르면 먼저 통분을 해야 해요!', mooni: '통분이 뭔지 더 자세히 알려줄 수 있어요?', expression: 'curious' },
        { student: '분모를 같게 만드는 거예요. 공배수를 찾아서요!', mooni: '공배수 중에서도 제일 작은 걸 쓰는 게 좋은 건가요?', expression: 'thinking' },
      ],
    }],
  },
  s2: {
    name: '박서연',
    sessions: [{
      date: '4월 10일', unit: '도형의 넓이', score: 72,
      summary: '기본 공식은 알고 있지만 "왜 그 공식인지" 원리 설명에 어려움을 겪었어요.',
      weakPoints: ['단위(cm²) 의미 연결 부족', '삼각형 높이 개념'],
      suggestions: ['격자 그림으로 넓이 = 칸 수 개념 재확인', '높이는 항상 밑변에 수직임을 강조'],
      competency: { 자기관리역량: 3, 대인관계역량: 4, 시민역량: 3, 문제해결역량: 3, comment: '학습 의지는 높으나 개념 연결에 어려움이 있음. 구체적인 예시 제공 시 빠르게 이해하는 모습을 보임.' },
      selfReflection: 'cm²가 정확히 무슨 의미인지 설명하기가 힘들었어요.',
      highlights: [
        { student: '삼각형 넓이는 밑변 곱하기 높이 나누기 2예요.', mooni: '오, 그런데 높이가 정확히 어디를 말하는 거야?', expression: 'confused' },
        { student: '음... 제일 높은 곳이요?', mooni: '꼭 제일 높은 곳이어야 할까? 다른 방향으로도 재볼 수 있지 않을까?', expression: 'thinking' },
      ],
    }],
  },
  s3: {
    name: '이준혁',
    sessions: [{
      date: '4월 9일', unit: '도형의 넓이', score: 45,
      summary: '직사각형 넓이는 구할 수 있지만 삼각형, 평행사변형으로 확장이 어려웠어요.',
      weakPoints: ['삼각형 높이 개념', '공식 암기에만 의존'],
      suggestions: ['직사각형 → 삼각형 관계 시각적으로 다시 학습', '공식보다 원리 먼저 이해 접근'],
      competency: { 자기관리역량: 2, 대인관계역량: 3, 시민역량: 2, 문제해결역량: 2, comment: '개념 이해보다 암기에 의존하는 경향이 있음. 반복 학습과 격려가 필요함.' },
      selfReflection: '삼각형 공식을 외웠는데 왜 그런지 설명하려니 모르겠어요.',
      highlights: [
        { student: '직사각형은 가로 곱하기 세로예요.', mooni: '맞아요! 그럼 삼각형은 어떻게 될까요?', expression: 'curious' },
        { student: '밑변 곱하기 높이 나누기 2요.', mooni: '왜 2로 나누는 걸까요? 직사각형이랑 어떤 관계가 있을까?', expression: 'confused' },
        { student: '음... 잘 모르겠어요.', mooni: '괜찮아요! 직사각형을 대각선으로 잘라보면 어떻게 될까요? 🌙', expression: 'oops' },
      ],
    }],
  },
  s4: {
    name: '최수아',
    sessions: [{
      date: '4월 10일', unit: '도형의 넓이', score: 91,
      summary: '모든 도형의 넓이 원리를 명확히 이해하고 응용 문제까지 스스로 만들어 설명했어요!',
      weakPoints: [],
      suggestions: ['심화 문제로 확장 도전 추천'],
      competency: { 자기관리역량: 5, 대인관계역량: 5, 시민역량: 5, 문제해결역량: 5, comment: '모든 역량이 매우 우수. 자기주도 학습 능력이 탁월하며 무니를 통해 개념을 창의적으로 전달함.' },
      selfReflection: '어렵지 않았어요. 무니한테 설명하면서 제가 더 잘 알게 된 것 같아요!',
      highlights: [
        { student: '평행사변형은 직사각형으로 변환할 수 있어서 밑변×높이예요!', mooni: '오오! 어떻게 변환하는 거예요?', expression: 'curious' },
        { student: '한쪽 삼각형을 잘라서 반대편에 붙이면 직사각형이 돼요!', mooni: '완벽해요! 무니도 이제 이해했어! 🌙✨', expression: 'impressed' },
      ],
    }],
  },
}

const COMPETENCY_LABELS = [
  { key: '자기관리역량' as const, label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량' as const, label: '대인관계', color: '#E8C547' },
  { key: '시민역량' as const, label: '시민', color: '#4CAF50' },
  { key: '문제해결역량' as const, label: '문제해결', color: '#FF9600' },
]

export default async function DemoTeacherReportPage({ params }: Props) {
  const { studentId, sessionIndex } = await params
  const student = DEMO_STUDENTS[studentId] ?? DEMO_STUDENTS['s1']
  const idx = Math.min(parseInt(sessionIndex) || 0, student.sessions.length - 1)
  const s = student.sessions[idx]

  const scoreColor = s.score >= 80 ? '#4CAF50' : s.score >= 60 ? '#C8A020' : '#FF9600'
  const scoreBg = s.score >= 80 ? 'rgba(76,175,80,0.10)' : s.score >= 60 ? 'rgba(232,197,71,0.12)' : 'rgba(255,150,0,0.10)'
  const mooniImg = s.score >= 80 ? 'impressed' : s.score >= 60 ? 'happy' : 'thinking'

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      {/* 사이드바 */}
      <nav className="hidden md:flex flex-col w-[220px] shrink-0 overflow-y-auto" style={{ background: '#13112A' }}>
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm mb-5" style={{ color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>Moni</p>
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
          <Link href="/demo/teacher" className="flex items-center gap-3 px-3 py-2.5 rounded-full transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <BookOpen size={18} weight="regular" /><span className="font-semibold text-sm">단원 관리</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-full" style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}>
            <Users size={18} weight="fill" /><span className="font-bold text-sm">학생 목록</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Trophy size={18} weight="regular" /><span className="font-semibold text-sm">퀘스트</span>
          </div>
          <Link href="/demo/teacher/summary" className="flex items-center gap-3 px-3 py-2.5 rounded-full transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            <ChartBar size={18} weight="regular" /><span className="font-semibold text-sm">반 요약</span>
          </Link>
        </div>
      </nav>

      {/* 메인 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 shrink-0 flex items-center gap-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <Link href={`/demo/teacher/students/${studentId}`} className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: '#F5F4FA' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#2D2F2F' }} />
          </Link>
          <div>
            <h1 className="text-lg font-black" style={{ color: '#2D2F2F' }}>학습 리포트</h1>
            <p className="text-xs" style={{ color: '#9EA0B4' }}>{student.name} · {s.unit}</p>
          </div>
          <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold shrink-0"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
          {/* 이해도 점수 */}
          <div
            className="rounded-[20px] p-6 flex items-center gap-5"
            style={{ background: scoreBg, border: `1.5px solid ${scoreColor}30` }}
          >
            <Image src={`/mooni/${mooniImg}.png`} alt="무니" width={110} height={74} className="shrink-0 drop-shadow-md" />
            <div className="flex-1">
              <p className="text-xs font-bold mb-1" style={{ color: '#9EA0B4' }}>무니 이해도 점수</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black" style={{ color: scoreColor }}>{s.score}</span>
                <span className="text-lg font-bold mb-1" style={{ color: scoreColor }}>점</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          {/* 요약 */}
          <div
            className="rounded-[20px] p-5 bg-white"
            style={{ border: '1px solid #ECEAF6' }}
          >
            <p className="text-sm font-extrabold mb-2" style={{ color: '#2D2F2F' }}>전체 평가</p>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{s.summary}</p>
          </div>

          {/* 역량 분석 */}
          {s.competency && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(124,111,191,0.08)', border: '1.5px solid rgba(124,111,191,0.20)' }}
            >
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>
                📊 핵심역량 분석{' '}
                <span className="text-xs font-normal ml-1" style={{ color: '#9EA0B4' }}>Gemma 4B 분석</span>
              </p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {COMPETENCY_LABELS.map(({ key, label, color }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#6B6B8D' }}>{label}</span>
                      <span className="text-sm font-black" style={{ color }}>
                        {s.competency![key]}<span className="text-xs font-normal">/5</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(200,190,240,0.30)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(s.competency![key] / 5) * 100}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              {s.competency.comment && (
                <p className="text-xs mt-3 leading-relaxed italic" style={{ color: '#6B6B8D' }}>
                  &ldquo;{s.competency.comment}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* 학습 제안 */}
          {s.suggestions.length > 0 && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(76,175,80,0.07)', border: '1.5px solid rgba(76,175,80,0.18)' }}
            >
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>다음 학습 제안</p>
              <ul className="space-y-2">
                {s.suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={16} weight="fill" style={{ color: '#4CAF50', marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#4A4A6A' }}>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 더 알아볼 부분 */}
          {s.weakPoints.length > 0 && (
            <div
              className="rounded-[20px] p-5"
              style={{ background: 'rgba(232,197,71,0.09)', border: '1.5px solid rgba(232,197,71,0.28)' }}
            >
              <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>더 알아볼 부분</p>
              <ul className="space-y-2">
                {s.weakPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb size={16} weight="fill" style={{ color: '#C8A020', marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#4A4A6A' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 대화 하이라이트 */}
          {s.highlights.length > 0 && (
            <div
              className="rounded-[20px] p-5 bg-white"
              style={{ border: '1px solid #ECEAF6' }}
            >
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>대화 하이라이트</p>
              <div className="space-y-4">
                {s.highlights.map((pair, i) => (
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
                      <Image src={`/mooni/${pair.expression}.png`} alt="무니" width={44} height={30} className="shrink-0" />
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
          {s.selfReflection && (
            <div
              className="rounded-[20px] p-5 bg-white"
              style={{ border: '1px solid #ECEAF6' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: '#9EA0B4' }}>학생 자기성찰</p>
              <p className="text-sm leading-relaxed italic" style={{ color: '#4A4A6A' }}>
                &ldquo;{s.selfReflection}&rdquo;
              </p>
            </div>
          )}

          <Link
            href={`/demo/teacher/students/${studentId}`}
            className="flex items-center justify-center w-full rounded-2xl py-4 font-extrabold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
          >
            ← 학생 상세로 돌아가기
          </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
