'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Brain,
  ChartBar,
  Microphone,
  Moon,
} from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

function CountUp({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{decimals > 0 ? value.toFixed(decimals) : Math.round(value)}{suffix}</span>
}

const STARS = [
  { id: 0, top: '8%', left: '12%', size: 1.8, delay: 0.3, dur: 2.8 },
  { id: 1, top: '15%', left: '78%', size: 2.3, delay: 1.1, dur: 3.5 },
  { id: 2, top: '3%', left: '45%', size: 1.5, delay: 0.7, dur: 2.2 },
  { id: 3, top: '22%', left: '91%', size: 2.8, delay: 2.0, dur: 4.1 },
  { id: 4, top: '35%', left: '5%', size: 1.6, delay: 0.4, dur: 3.0 },
  { id: 5, top: '48%', left: '87%', size: 2.1, delay: 1.8, dur: 2.5 },
  { id: 6, top: '62%', left: '33%', size: 1.9, delay: 0.9, dur: 3.8 },
  { id: 7, top: '75%', left: '67%', size: 2.5, delay: 1.5, dur: 2.9 },
  { id: 8, top: '88%', left: '20%', size: 1.7, delay: 2.3, dur: 3.3 },
  { id: 9, top: '6%', left: '58%', size: 2.2, delay: 0.2, dur: 4.0 },
  { id: 10, top: '19%', left: '25%', size: 1.4, delay: 1.6, dur: 2.7 },
  { id: 11, top: '31%', left: '71%', size: 2.6, delay: 0.8, dur: 3.6 },
  { id: 12, top: '44%', left: '48%', size: 1.8, delay: 2.1, dur: 2.4 },
  { id: 13, top: '57%', left: '14%', size: 2.0, delay: 1.3, dur: 4.2 },
  { id: 14, top: '70%', left: '83%', size: 1.5, delay: 0.6, dur: 3.1 },
  { id: 15, top: '83%', left: '39%', size: 2.4, delay: 1.9, dur: 2.6 },
  { id: 16, top: '12%', left: '93%', size: 1.7, delay: 0.5, dur: 3.9 },
  { id: 17, top: '27%', left: '3%', size: 2.1, delay: 2.4, dur: 2.3 },
  { id: 18, top: '52%', left: '56%', size: 1.6, delay: 1.0, dur: 4.4 },
  { id: 19, top: '93%', left: '74%', size: 2.7, delay: 0.1, dur: 3.2 },
]

const BIG_STARS = [
  { id: 0, top: '8%', left: '15%', size: 14, delay: 0.5, dur: 3.5 },
  { id: 1, top: '4%', left: '55%', size: 12, delay: 1.2, dur: 4.0 },
  { id: 2, top: '15%', left: '88%', size: 16, delay: 0.3, dur: 3.2 },
  { id: 3, top: '25%', left: '35%', size: 11, delay: 2.0, dur: 4.5 },
  { id: 4, top: '6%', left: '72%', size: 13, delay: 0.8, dur: 3.8 },
  { id: 5, top: '20%', left: '5%', size: 12, delay: 1.5, dur: 4.2 },
  { id: 6, top: '12%', left: '45%', size: 15, delay: 0.2, dur: 3.0 },
  { id: 7, top: '30%', left: '65%', size: 11, delay: 1.8, dur: 4.8 },
]

const FEATURES = [
  {
    icon: Brain,
    mooniImg: '/mooni/face-curious.png',
    title: '설명하면서 배워요',
    desc: '가르치는 사람이 가장 많이 배웁니다. 프로테제 효과를 AI로 구현했어요.',
  },
  {
    icon: ChartBar,
    mooniImg: '/mooni/face-thinking.png',
    title: '리포트 자동 생성',
    desc: '무니가 대화를 분석해 학생별 이해도 리포트를 선생님에게 바로 전달해요.',
  },
  {
    icon: Microphone,
    mooniImg: '/mooni/face-happy.png',
    title: '음성으로 설명해요',
    desc: '초등 저학년도 타이핑 없이 말로 설명할 수 있어요.',
  },
  {
    icon: Moon,
    mooniImg: '/mooni/face-impressed.png',
    title: '모든 과목 지원',
    desc: '수학, 영어, 과학 등 어떤 개념이든 무니가 배울 준비가 됐어요.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col font-sans">
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0A0818 0%, #0D0B1E 40%, #12103A 70%, #1E1A35 100%)',
          minHeight: '100svh',
        }}
      >
        {/* 별 파티클 */}
        {STARS.map((s) => (
          <div key={s.id} className="star-particle absolute rounded-full bg-white pointer-events-none"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as CSSProperties} />
        ))}
        {BIG_STARS.map((s) => (
          <div key={`big-${s.id}`} className="star-particle-slow absolute pointer-events-none"
            style={{ top: s.top, left: s.left, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as CSSProperties}>
            <svg width={s.size} height={s.size} viewBox="0 0 24 24">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="rgba(232,197,71,0.9)" />
            </svg>
          </div>
        ))}

        {/* 달 글로우 — 우측 상단 */}
        <div className="pointer-events-none absolute" style={{ top: '-15%', right: '-5%', width: '50vw', height: '50vw', maxWidth: 600, maxHeight: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,197,71,0.14) 0%, transparent 65%)' }} />

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* 상단 내비 */}
          <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-8 pb-4">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="42" cy="50" r="38" fill="#E8C547" />
                <circle cx="62" cy="50" r="34" fill="#0D0B1E" />
              </svg>
              <span className="text-lg tracking-tight" style={{ color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>Moni</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.55)' }}>
                로그인
              </Link>
              <Link href="/demo" className="text-sm font-bold px-4 py-2 rounded-full transition-all hover:opacity-90"
                style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.25)' }}>
                체험하기
              </Link>
            </div>
          </nav>

          {/* 메인 히어로 — 비대칭 레이아웃 */}
          <div className="flex-1 flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-20 pb-16">

            {/* 왼쪽: 타이포그래피 */}
            <div className="flex-1 flex flex-col justify-center py-12 md:py-0">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-semibold mb-6 tracking-wide"
                style={{ color: 'rgba(232,197,71,0.70)' }}
              >
                프로테제 효과 기반 AI 학습 앱
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mb-6"
              >
                <span className="block leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>
                  Moni
                </span>
                <span className="block text-2xl md:text-3xl font-extrabold mt-3 leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
                  학생이 AI를 가르치며<br />실력이 쌓여요
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base leading-relaxed mb-10 max-w-md"
                style={{ color: 'rgba(255,255,255,0.50)' }}
              >
                달에서 온 아기 토끼 무니에게 오늘 배운 개념을 설명해보세요.
                무니가 질문하고, AI가 이해도를 분석하고, 선생님에게 리포트가 전달돼요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link href="/signup"
                  className="flex items-center justify-center text-base font-black transition-all hover:translate-y-[-1px]"
                  style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020', borderRadius: 9999, padding: '14px 36px' }}>
                  회원가입
                </Link>
                <Link href="/demo"
                  className="flex items-center justify-center text-sm font-semibold transition-all hover:opacity-70"
                  style={{ color: 'rgba(232,197,71,0.65)', padding: '14px 20px' }}>
                  체험해보기
                </Link>
              </motion.div>
            </div>

            {/* 오른쪽: 달 + 무니 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center mt-8 md:mt-0"
              style={{ width: 'clamp(300px, 40vw, 560px)', aspectRatio: '1' }}
            >
              {/* 달 */}
              <svg viewBox="0 0 380 380" className="absolute w-full h-full" style={{ filter: 'drop-shadow(0 0 60px rgba(232,197,71,0.30))' }}>
                <defs>
                  <radialGradient id="heroMoonGrad" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
                    <stop offset="100%" stopColor="rgba(180,140,20,0.35)" />
                  </radialGradient>
                </defs>
                <circle cx="190" cy="190" r="175" fill="#E8C547" />
                <circle cx="190" cy="190" r="175" fill="url(#heroMoonGrad)" />
                <circle cx="125" cy="145" r="24" fill="rgba(180,140,20,0.30)" />
                <circle cx="255" cy="115" r="16" fill="rgba(180,140,20,0.25)" />
                <circle cx="235" cy="255" r="20" fill="rgba(180,140,20,0.25)" />
                <circle cx="105" cy="255" r="12" fill="rgba(180,140,20,0.20)" />
              </svg>
              {/* 무니 */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-[85%] aspect-[3/2]"
              >
                <Image src="/mooni/happy.png" alt="무니 — 달에서 온 아기 토끼" fill className="object-contain drop-shadow-2xl" priority />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20" style={{ background: '#F2F2F5' }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-2xl font-black" style={{ color: '#1A1830' }}>
            왜 무니인가요?
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, mooniImg, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col gap-3 rounded-3xl bg-white p-6"
                style={{ boxShadow: '0 8px 24px rgba(232,197,71,0.10), 0 2px 8px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(232,197,71,0.15)' }}
                  >
                    <Icon size={22} weight="fill" style={{ color: '#E8C547' }} />
                  </div>
                  <div style={{ width: 72, height: 48, position: 'relative', opacity: 0.9 }}>
                    <Image src={mooniImg} alt="무니 캐릭터" fill className="object-contain" />
                  </div>
                </div>
                <p className="text-base font-bold" style={{ color: '#1A1830' }}>{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENS ── */}
      <section className="px-6 py-20" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-2xl font-black" style={{ color: '#1A1830' }}
          >
            학습자와 교육자, 각자의 화면
          </motion.h2>
          <p className="mb-12 text-center text-sm" style={{ color: '#9EA0B4' }}>
            학생이 무니와 대화하면, 선생님 대시보드에 이해도 리포트가 자동으로 전달됩니다
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 학생 화면 */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #ECEAF6', boxShadow: '0 8px 24px rgba(170,155,230,0.12)' }}>
                <Image src="/screenshots/07-demo-chat.png" alt="학생 채팅 화면" width={600} height={400} className="w-full" />
              </div>
              <h3 className="font-extrabold text-base mb-1" style={{ color: '#1A1830' }}>🐇 학생: 무니에게 설명하기</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>
                오늘 배운 개념을 무니에게 설명해요. 음성, 텍스트, 그림으로 설명하면 무니가 꼬리 질문을 던져 진짜 이해했는지 확인해요.
              </p>
            </motion.div>

            {/* 선생님 화면 */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #ECEAF6', boxShadow: '0 8px 24px rgba(170,155,230,0.12)' }}>
                <Image src="/screenshots/04-demo-teacher-dashboard.png" alt="선생님 대시보드" width={600} height={400} className="w-full" />
              </div>
              <h3 className="font-extrabold text-base mb-1" style={{ color: '#1A1830' }}>📊 선생님: 이해도 대시보드</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>
                학생별 이해도 점수, 4대 핵심역량 분석, 약점 TOP 랭킹을 한눈에 확인하고 AI 수업 추천까지 받을 수 있어요.
              </p>
            </motion.div>
          </div>

          {/* 리포트 + 반 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #ECEAF6', boxShadow: '0 8px 24px rgba(170,155,230,0.12)' }}>
                <Image src="/screenshots/09-demo-report.png" alt="학습 리포트" width={600} height={400} className="w-full" />
              </div>
              <h3 className="font-extrabold text-base mb-1" style={{ color: '#1A1830' }}>📝 자동 생성 리포트</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>
                GPT-4o가 이해도 점수, 취약점, 학습 제안을 자동 생성하고, 자체 파인튜닝 모델이 4대 핵심역량을 분석해요.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid #ECEAF6', boxShadow: '0 8px 24px rgba(170,155,230,0.12)' }}>
                <Image src="/screenshots/06-demo-teacher-summary.png" alt="반 전체 요약" width={600} height={400} className="w-full" />
              </div>
              <h3 className="font-extrabold text-base mb-1" style={{ color: '#1A1830' }}>🏫 반 전체 요약</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>
                반 평균 이해도, 역량 분석, 약점 TOP 랭킹, 학생 히트맵을 한 화면에서 파악하고 AI 수업 추천을 받을 수 있어요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RESEARCH ── */}
      <section
        className="px-6 py-20"
        style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #0A0818 100%)' }}
      >
        <div className="mx-auto max-w-2xl text-center">
          {/* 달 위 무니 */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width={80} height={80} viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" fill="#E8C547" opacity="0.9" />
                <circle cx="28" cy="30" r="8" fill="rgba(180,140,20,0.3)" />
                <circle cx="55" cy="25" r="5" fill="rgba(180,140,20,0.25)" />
              </svg>
              <div
                className="absolute"
                style={{ bottom: -10, left: '50%', transform: 'translateX(-50%)', width: 90, height: 60 }}
              >
                <Image
                  src="/mooni/thinking.png"
                  alt="무니"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          <p className="mb-10 text-sm font-semibold uppercase tracking-widest" style={{ color: '#E8C547' }}>
            Stanford 연구팀이 증명한 학습법
          </p>

          <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black leading-none" style={{ color: '#E8C547' }}>
                <CountUp target={0.71} decimals={2} />
              </span>
              <span className="mt-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                학습 효과 크기
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>CHI 2024</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black leading-none" style={{ color: '#E8C547' }}>
                <CountUp target={72} suffix="%" />
              </span>
              <span className="mt-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                실패율 감소
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>BEA 2025</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black leading-none" style={{ color: '#E8C547' }}>
                <CountUp target={66.2} decimals={1} suffix="%" />
              </span>
              <span className="mt-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                AI 튜터 성공률
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>Google 2025</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black leading-none" style={{ color: '#E8C547' }}>
                <CountUp target={2003} />
              </span>
              <span className="mt-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                RCT 참여 학생
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>MathSpring 2025</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Stanford(2009), KAIST·Stanford(CHI 2024), CHI 2025, Google DeepMind(2025), ACL(BEA 2025) 등 20편+ 논문 기반
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="flex flex-col items-center px-6 py-24"
        style={{ background: '#0D0B1E' }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 420, height: 280, position: 'relative', marginBottom: 24 }}
        >
          <Image
            src="/mooni/impressed.png"
            alt="무니"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>

        <h2 className="mb-2 text-3xl font-black text-white">지금 무니를 만나보세요</h2>
        <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
          달에서 온 아기 토끼가 여러분의 설명을 기다리고 있어요 🌙
        </p>
        <Link
          href="/signup"
          className="flex items-center justify-center text-lg font-black transition-opacity hover:opacity-90"
          style={{
            background: '#E8C547',
            color: '#1A1830',
            boxShadow: '0 4px 0 #C8A020',
            borderRadius: 9999,
            padding: '16px 48px',
            fontWeight: 800,
          }}
        >
          시작하기
        </Link>
      </section>
    </div>
  )
}
