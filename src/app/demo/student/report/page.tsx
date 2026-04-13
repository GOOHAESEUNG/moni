import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Lightbulb, House, Trophy, User } from '@phosphor-icons/react/dist/ssr'
import DemoReportTutorial from '@/components/DemoReportTutorial'

const DEMO_SCORE = 78
const DEMO_UNIT_TITLE = '도형의 넓이'
const DEMO_SUMMARY = '직사각형과 삼각형의 기본 공식은 잘 이해하고 있어요. 평행사변형의 넓이에서 잠깐 막혔지만 무니의 힌트로 스스로 찾아냈어요!'
const DEMO_SUGGESTIONS = [
  '평행사변형 넓이 = 삼각형 2개로 나누는 원리 그림으로 다시 설명해보기',
  '단위(cm²)가 "가로 × 세로 칸 수"를 의미한다는 것 복습하기',
]
const DEMO_WEAK_POINTS = [
  '평행사변형 넓이 공식의 원리 설명이 아직 어색해요',
  '단위(cm²) 의미와 넓이의 연결이 약해요',
]
const DEMO_PAIRS = [
  {
    student: '직사각형 넓이는 가로 곱하기 세로예요!',
    mooni: '오~ 그렇구나! 그러면 왜 곱하는 거야? 더하면 안 돼?',
    expression: 'curious',
  },
  {
    student: '더하면 그냥 테두리 길이잖아요. 곱해야 안에 있는 칸 수를 구할 수 있어요!',
    mooni: '와! 무니 이제 이해했어! 칸 수구나! 그럼 삼각형은?',
    expression: 'happy',
  },
  {
    student: '삼각형은 직사각형의 딱 절반이에요. 그래서 가로×세로÷2예요.',
    mooni: '완벽해요! 왜 절반인지도 설명할 수 있어요? 🌙',
    expression: 'impressed',
  },
]

const DEMO_COMPETENCY = {
  자기관리역량: 3,
  대인관계역량: 4,
  시민역량: 3,
  문제해결역량: 4,
  comment: '스스로 오류를 인지하고 수정하는 자기조절 능력이 보여요. 무니의 피드백을 적극적으로 수용하는 태도가 인상적이에요.',
}

const COMPETENCY_LABELS = [
  { key: '자기관리역량' as const, label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량' as const, label: '대인관계', color: '#E8C547' },
  { key: '시민역량' as const, label: '시민', color: '#4CAF50' },
  { key: '문제해결역량' as const, label: '문제해결', color: '#FF9600' },
]

const scoreColor = DEMO_SCORE >= 80 ? '#4CAF50' : DEMO_SCORE >= 60 ? '#C8A020' : '#FF9600'
const scoreBg = DEMO_SCORE >= 80 ? 'rgba(76,175,80,0.10)' : DEMO_SCORE >= 60 ? 'rgba(232,197,71,0.12)' : 'rgba(255,150,0,0.10)'
const mooniImg = DEMO_SCORE >= 80 ? 'impressed' : DEMO_SCORE >= 60 ? 'happy' : 'thinking'

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

export default function DemoReportPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      {/* 좌측 네비 */}
      <nav className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
        style={{ background: '#FFFFFF', borderRight: '1px solid rgba(200,188,245,0.40)' }}>
        <div className="px-5 pt-6 pb-4">
          <p className="font-extrabold text-base" style={{ color: '#8575C4' }}>🌙 Moni</p>
          <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
        </div>
        <div style={{ height: 1, background: 'rgba(200,188,245,0.30)' }} />
        <div className="flex-1 flex flex-col gap-1 px-3 py-4">
          <Link href="/demo/student" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
            <House size={20} weight="regular" />
            <span className="font-semibold text-sm">학습</span>
          </Link>
          <Link href="/demo/student/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
            <Trophy size={20} weight="regular" />
            <span className="font-semibold text-sm">리더보드</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-full" style={{ color: '#B8B5D0' }}>
            <User size={20} weight="regular" />
            <span className="font-semibold text-sm">프로필</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }} className="px-5 py-4">
          <p className="font-extrabold text-sm" style={{ color: '#4A3E80' }}>김무니</p>
          <p className="text-xs" style={{ color: '#A8A5C0' }}>3학년 2반</p>
          <Link href="/demo" className="mt-2 block text-xs transition-opacity hover:opacity-70" style={{ color: '#B8B5D0' }}>← 체험 선택으로</Link>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto pb-12">
        {/* 모바일 헤더 */}
        <div className="md:hidden px-4 pt-4 pb-2 flex items-center gap-3">
          <Link href="/demo/student" className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#5A4FA0' }} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black" style={{ color: '#2D1F6E' }}>학습 리포트</h1>
            <p className="text-xs" style={{ color: 'rgba(90,79,160,0.65)' }}>{DEMO_UNIT_TITLE}</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        {/* 데스크탑 헤더 */}
        <div className="hidden md:flex items-center gap-3 px-8 pt-8 pb-4">
          <Link href="/demo/student" className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: 'rgba(255,255,255,0.85)' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#5A4FA0' }} />
          </Link>
          <div>
            <h1 className="text-xl font-black" style={{ color: '#2D1F6E' }}>학습 리포트</h1>
            <p className="text-xs" style={{ color: 'rgba(90,79,160,0.65)' }}>{DEMO_UNIT_TITLE}</p>
          </div>
          <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="max-w-lg mx-auto px-5 space-y-4">
          {/* 이해도 점수 카드 */}
          <div
            className="rounded-3xl p-6 flex items-center gap-5"
            data-tutorial="score-card"
            style={{ ...clayCard, background: scoreBg, boxShadow: 'none', border: `1.5px solid ${scoreColor}30` }}
          >
            <Image src={`/mooni/${mooniImg}.png`} alt="무니" width={110} height={74} className="shrink-0 drop-shadow-md" />
            <div className="flex-1">
              <p className="text-xs font-bold mb-1" style={{ color: 'rgba(90,79,160,0.65)' }}>무니 이해도 점수</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black" style={{ color: scoreColor }}>{DEMO_SCORE}</span>
                <span className="text-lg font-bold mb-1" style={{ color: scoreColor }}>점</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.60)' }}>
                <div className="h-full rounded-full" style={{ width: `${DEMO_SCORE}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          {/* 전체 평가 */}
          <div className="p-5" style={clayCard}>
            <p className="text-sm font-extrabold mb-2" style={{ color: '#2D1F6E' }}>전체 평가</p>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{DEMO_SUMMARY}</p>
          </div>

          {/* 역량 분석 */}
          <div className="p-5" data-tutorial="competency" style={{ ...clayCard, background: 'rgba(124,111,191,0.08)', boxShadow: 'none', border: '1.5px solid rgba(124,111,191,0.20)' }}>
            <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>📊 핵심역량 분석</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {COMPETENCY_LABELS.map(({ key, label, color }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#6B6B8D' }}>{label}</span>
                    <span className="text-sm font-black" style={{ color }}>{DEMO_COMPETENCY[key]}<span className="text-xs font-normal">/5</span></span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(200,190,240,0.30)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(DEMO_COMPETENCY[key] / 5) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 leading-relaxed italic" style={{ color: '#6B6B8D' }}>
              &ldquo;{DEMO_COMPETENCY.comment}&rdquo;
            </p>
          </div>

          {/* 학습 제안 */}
          <div className="p-5" style={{ ...clayCard, background: 'rgba(76,175,80,0.07)', boxShadow: 'none', border: '1.5px solid rgba(76,175,80,0.18)' }}>
            <p className="text-sm font-extrabold mb-3" style={{ color: '#2D1F6E' }}>다음 학습 제안</p>
            <ul className="space-y-2">
              {DEMO_SUGGESTIONS.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" style={{ color: '#4CAF50', marginTop: 2, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: '#4A4A6A' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 더 알아볼 부분 */}
          <div className="p-5" style={{ ...clayCard, background: 'rgba(232,197,71,0.09)', boxShadow: 'none', border: '1.5px solid rgba(232,197,71,0.28)' }}>
            <p className="text-sm font-extrabold mb-3" style={{ color: '#2D1F6E' }}>더 알아볼 부분</p>
            <ul className="space-y-2">
              {DEMO_WEAK_POINTS.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Lightbulb size={16} weight="fill" style={{ color: '#C8A020', marginTop: 2, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: '#4A4A6A' }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 대화 하이라이트 */}
          <div className="p-5" style={clayCard}>
            <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>대화 하이라이트</p>
            <div className="space-y-4">
              {DEMO_PAIRS.map((pair, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]"
                      style={{ background: 'rgba(124,111,191,0.12)' }}>
                      <p className="text-sm" style={{ color: '#2D1F6E' }}>{pair.student}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Image src={`/mooni/face-${pair.expression}.png`} alt="무니" width={28} height={28}
                      className="rounded-full shrink-0 mt-0.5" style={{ background: 'rgba(232,197,71,0.15)' }} />
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]"
                      style={{ background: 'rgba(232,197,71,0.10)' }}>
                      <p className="text-sm" style={{ color: '#4A4A6A' }}>{pair.mooni}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <Link
            href="/demo/student"
            className="flex items-center justify-center w-full rounded-2xl py-4 font-extrabold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/demo/teacher"
            className="flex items-center justify-center w-full rounded-2xl py-3 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'rgba(90,79,160,0.50)' }}
          >
            이 리포트가 선생님 대시보드에 어떻게 보이는지 확인하기 →
          </Link>
        </div>
      </main>

      <DemoReportTutorial />
    </div>
  )
}
