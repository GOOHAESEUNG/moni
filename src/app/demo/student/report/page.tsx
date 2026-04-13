'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Lightbulb, Star } from '@phosphor-icons/react'
import DemoStudentSidebar from '@/components/DemoStudentSidebar'
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
  { key: '자기관리역량' as const, label: '자기관리', color: '#7C6FBF', bg: 'rgba(124,111,191,0.12)' },
  { key: '대인관계역량' as const, label: '대인관계', color: '#E8C547', bg: 'rgba(232,197,71,0.12)' },
  { key: '시민역량' as const, label: '시민', color: '#4CAF50', bg: 'rgba(76,175,80,0.10)' },
  { key: '문제해결역량' as const, label: '문제해결', color: '#FF9600', bg: 'rgba(255,150,0,0.10)' },
]

const scoreColor = DEMO_SCORE >= 80 ? '#4CAF50' : DEMO_SCORE >= 60 ? '#C8A020' : '#FF9600'
const mooniImg = DEMO_SCORE >= 80 ? 'impressed' : DEMO_SCORE >= 60 ? 'happy' : 'thinking'
const scoreMessage = DEMO_SCORE >= 80 ? '완벽해요! 무니가 다 이해했어!' : DEMO_SCORE >= 60 ? '잘했어요! 조금만 더 설명하면 완벽!' : '괜찮아요, 같이 다시 해봐요!'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function DemoReportPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      <DemoStudentSidebar activeTab="home" />

      <main className="flex-1 overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 md:px-8 pt-5 pb-2">
          <Link href="/demo/student" className="flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.75)', boxShadow: '0 2px 8px rgba(130,110,200,0.12)' }}>
            <ArrowLeft size={18} weight="bold" style={{ color: '#5A4090' }} />
          </Link>
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: 'rgba(90,79,160,0.50)' }}>{DEMO_UNIT_TITLE}</p>
            <h1 className="text-lg font-black" style={{ color: '#2D1F6E' }}>학습 리포트</h1>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="max-w-2xl mx-auto px-5 md:px-8 pb-16">

          {/* ━━ 히어로: 점수 섹션 ━━ */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="relative mt-4 mb-8 rounded-[28px] overflow-hidden"
            data-tutorial="score-card"
            style={{
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 12px 48px rgba(130,110,200,0.18), 0 2px 8px rgba(150,135,210,0.10)',
            }}
          >
            {/* 점수 배경 장식 */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-40"
              style={{ background: `radial-gradient(circle, ${scoreColor}25 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

            <div className="relative flex items-center gap-5 p-6 md:p-8">
              {/* 무니 캐릭터 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="shrink-0"
              >
                <Image src={`/mooni/${mooniImg}.png`} alt="무니" width={120} height={80} className="drop-shadow-lg" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(90,79,160,0.55)' }}>무니 이해도</p>
                <div className="flex items-end gap-1.5">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4, type: 'spring', stiffness: 250 }}
                    className="text-5xl md:text-6xl font-black leading-none"
                    style={{ color: scoreColor }}
                  >
                    {DEMO_SCORE}
                  </motion.span>
                  <span className="text-lg font-bold mb-1" style={{ color: scoreColor }}>점</span>
                </div>

                {/* 프로그레스 바 */}
                <div className="mt-3 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(200,190,240,0.25)' }}>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${scoreColor}90, ${scoreColor})`, width: `${DEMO_SCORE}%`, transformOrigin: 'left' }}
                  />
                </div>

                <p className="text-sm font-semibold mt-2.5" style={{ color: '#5A4090' }}>
                  {scoreMessage}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ━━ 전체 평가 ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-4 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 20px rgba(150,135,210,0.10)' }}>
            <p className="text-sm font-extrabold mb-2" style={{ color: '#2D1F6E' }}>전체 평가</p>
            <p className="text-sm leading-[1.75]" style={{ color: '#4A4A6A' }}>{DEMO_SUMMARY}</p>
          </motion.div>

          {/* ━━ 핵심역량 분석 ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-4 p-5 rounded-2xl"
            data-tutorial="competency"
            style={{ background: 'rgba(124,111,191,0.06)', border: '1px solid rgba(124,111,191,0.12)' }}>
            <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>핵심역량 분석</p>

            <div className="grid grid-cols-2 gap-3">
              {COMPETENCY_LABELS.map(({ key, label, color, bg }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                  className="rounded-xl p-3"
                  style={{ background: bg }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold" style={{ color }}>{label}</span>
                    <span className="text-base font-black" style={{ color }}>
                      {DEMO_COMPETENCY[key]}<span className="text-xs font-normal opacity-60">/5</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.60)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(DEMO_COMPETENCY[key] / 5) * 100}%`, background: color }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {DEMO_COMPETENCY.comment && (
              <p className="text-xs mt-4 leading-relaxed italic px-1" style={{ color: '#6B6B8D' }}>
                &ldquo;{DEMO_COMPETENCY.comment}&rdquo;
              </p>
            )}
          </motion.div>

          {/* ━━ 제안 + 약점 (2컬럼) ━━ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <motion.div {...fadeUp} transition={{ delay: 0.35, duration: 0.5 }}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.12)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} weight="fill" style={{ color: '#4CAF50' }} />
                <p className="text-sm font-extrabold" style={{ color: '#2D6B30' }}>다음 학습 제안</p>
              </div>
              <ul className="space-y-2.5">
                {DEMO_SUGGESTIONS.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                      style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50' }}>{i + 1}</span>
                    <span className="text-xs leading-relaxed" style={{ color: '#4A4A6A' }}>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(232,197,71,0.06)', border: '1px solid rgba(232,197,71,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} weight="fill" style={{ color: '#C8A020' }} />
                <p className="text-sm font-extrabold" style={{ color: '#7A6200' }}>더 알아볼 부분</p>
              </div>
              <ul className="space-y-2.5">
                {DEMO_WEAK_POINTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                      style={{ background: 'rgba(232,197,71,0.12)', color: '#C8A020' }}>{i + 1}</span>
                    <span className="text-xs leading-relaxed" style={{ color: '#4A4A6A' }}>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ━━ 대화 하이라이트 ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.45, duration: 0.5 }}
            className="mb-4 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 20px rgba(150,135,210,0.10)' }}>
            <div className="px-5 pt-5 pb-3">
              <p className="text-sm font-extrabold" style={{ color: '#2D1F6E' }}>대화 하이라이트</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(90,79,160,0.45)' }}>무니와의 핵심 대화 3개</p>
            </div>

            <div className="px-5 pb-5 space-y-3">
              {DEMO_PAIRS.map((pair, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                  className="space-y-2"
                >
                  {/* 학생 메시지 */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5"
                      style={{ background: '#E8C547' }}>
                      <p className="text-sm font-semibold" style={{ color: '#1A1830' }}>{pair.student}</p>
                    </div>
                  </div>
                  {/* 무니 메시지 */}
                  <div className="flex items-end gap-2">
                    <Image src={`/mooni/${pair.expression}.png`} alt="무니" width={36} height={24}
                      className="shrink-0 drop-shadow-sm" />
                    <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5"
                      style={{ background: 'rgba(170,155,230,0.12)' }}>
                      <p className="text-sm" style={{ color: '#3D3060' }}>{pair.mooni}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ━━ 하단 CTA ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-3 mt-6">
            <Link
              href="/demo/student"
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-extrabold text-sm transition-all hover:translate-y-[-1px]"
              style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
            >
              <Star size={16} weight="fill" />
              홈으로 돌아가기
            </Link>
            <Link
              href="/demo/teacher"
              className="flex items-center justify-center w-full py-3 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'rgba(90,79,160,0.45)' }}
            >
              선생님 대시보드에서 이 리포트 보기 →
            </Link>
          </motion.div>
        </div>
      </main>

      <DemoReportTutorial />
    </div>
  )
}
