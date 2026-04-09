'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  ChartBar,
  Microphone,
  Moon,
} from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

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
        {/* 우상단 달 글로우 */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: -80,
            right: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,197,71,0.18) 0%, rgba(232,197,71,0.06) 50%, transparent 70%)',
          }}
        />

        {/* 작은 별 파티클 */}
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star-particle absolute rounded-full bg-white pointer-events-none"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              '--dur': `${s.dur}s`,
              '--delay': `${s.delay}s`,
            } as CSSProperties}
          />
        ))}

        {/* 큰 별 파티클 */}
        {BIG_STARS.map((s) => (
          <div
            key={`big-${s.id}`}
            className="star-particle-slow absolute pointer-events-none"
            style={{
              top: s.top,
              left: s.left,
              '--dur': `${s.dur}s`,
              '--delay': `${s.delay}s`,
            } as CSSProperties}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24">
              <path
                d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
                fill="rgba(232,197,71,0.9)"
              />
            </svg>
          </div>
        ))}

        {/* ── 모바일: 단일 컬럼 ── */}
        <div className="flex flex-col items-center px-6 pt-16 pb-12 md:hidden">
          {/* 달 + 무니 (모바일) */}
          <div className="relative flex items-center justify-center mb-8" style={{ width: 280, height: 280 }}>
            <svg
              width={320}
              height={320}
              viewBox="0 0 380 380"
              className="absolute"
              style={{ filter: 'drop-shadow(0 0 50px rgba(232,197,71,0.40))' }}
            >
              <defs>
                <radialGradient id="mobileMoonGrad" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                  <stop offset="100%" stopColor="rgba(180,140,20,0.40)" />
                </radialGradient>
              </defs>
              <circle cx="190" cy="190" r="180" fill="#E8C547" />
              <circle cx="190" cy="190" r="180" fill="url(#mobileMoonGrad)" />
              <circle cx="120" cy="140" r="28" fill="rgba(180,140,20,0.35)" />
              <circle cx="260" cy="110" r="18" fill="rgba(180,140,20,0.28)" />
              <circle cx="240" cy="260" r="22" fill="rgba(180,140,20,0.30)" />
              <circle cx="100" cy="260" r="14" fill="rgba(180,140,20,0.25)" />
              <circle cx="310" cy="200" r="12" fill="rgba(180,140,20,0.22)" />
              <circle cx="170" cy="320" r="8" fill="rgba(180,140,20,0.20)" />
              <circle cx="300" cy="320" r="10" fill="rgba(180,140,20,0.20)" />
              <circle cx="80" cy="190" r="10" fill="rgba(180,140,20,0.20)" />
            </svg>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
              style={{ width: 330, height: 220 }}
            >
              <Image
                src="/mooni/happy.png"
                alt="무니 — 달에서 온 아기 토끼"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>

          {/* 텍스트 (모바일) */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: 'rgba(232,197,71,0.15)', border: '1px solid rgba(232,197,71,0.30)' }}
          >
            <span style={{ color: '#E8C547', fontSize: 13, fontWeight: 800 }}>🌙 무니에게 알려줘</span>
          </div>

          <h1 className="text-4xl font-black leading-tight text-white mb-4 text-center">
            학생이<br />
            <span style={{ color: '#E8C547' }}>AI를 가르치며</span><br />
            실력이 쌓여요
          </h1>

          <p
            className="text-base leading-relaxed mb-8 text-center max-w-xs"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            무니는 달에서 온 아기 토끼예요.<br />
            학생이 설명할수록 무니가 배우고,<br />
            선생님은 이해도 리포트를 받아요.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link
              href="/signup"
              className="flex items-center justify-center text-base font-black transition-opacity hover:opacity-90"
              style={{
                background: '#E8C547',
                color: '#1A1830',
                boxShadow: '0 4px 0 #C8A020',
                borderRadius: 9999,
                padding: '14px 32px',
              }}
            >
              시작하기
            </Link>
            <Link
              href="/demo"
              className="flex items-center justify-center text-base font-bold text-white transition-colors hover:bg-white/10 backdrop-blur-sm"
              style={{
                border: '1px solid rgba(232,197,71,0.40)',
                borderRadius: 9999,
                padding: '14px 32px',
              }}
            >
              체험해보기
            </Link>
          </div>
        </div>

        {/* ── 데스크탑: 2컬럼 ── */}
        <div className="hidden md:grid md:grid-cols-2 md:min-h-screen">
          {/* 왼쪽: 텍스트 */}
          <div className="flex flex-col justify-center px-12 lg:px-20 py-20">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 self-start"
              style={{ background: 'rgba(232,197,71,0.15)', border: '1px solid rgba(232,197,71,0.30)' }}
            >
              <span style={{ color: '#E8C547', fontSize: 13, fontWeight: 800 }}>🌙 무니에게 알려줘</span>
            </div>

            <h1 className="text-5xl font-black leading-tight text-white mb-4 lg:text-6xl">
              학생이<br />
              <span style={{ color: '#E8C547' }}>AI를 가르치며</span><br />
              실력이 쌓여요
            </h1>

            <p
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              무니는 달에서 온 아기 토끼예요.<br />
              학생이 설명할수록 무니가 배우고,<br />
              선생님은 이해도 리포트를 받아요.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="flex items-center justify-center text-base font-black transition-opacity hover:opacity-90"
                style={{
                  background: '#E8C547',
                  color: '#1A1830',
                  boxShadow: '0 4px 0 #C8A020',
                  borderRadius: 9999,
                  padding: '14px 32px',
                  fontWeight: 800,
                }}
              >
                시작하기
              </Link>
              <Link
                href="/demo"
                className="flex items-center justify-center text-base font-bold text-white transition-colors hover:bg-white/10 backdrop-blur-sm"
                style={{
                  border: '1px solid rgba(232,197,71,0.40)',
                  borderRadius: 9999,
                  padding: '14px 32px',
                }}
              >
                체험해보기
              </Link>
            </div>
          </div>

          {/* 오른쪽: 달 + 무니 */}
          <div className="relative flex items-center justify-center" style={{ minHeight: 580 }}>
            {/* 대형 달 SVG */}
            <svg
              width={520}
              height={520}
              viewBox="0 0 380 380"
              className="absolute"
              style={{ filter: 'drop-shadow(0 0 80px rgba(232,197,71,0.40))' }}
            >
              <defs>
                <radialGradient id="landingMoonGrad" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                  <stop offset="100%" stopColor="rgba(180,140,20,0.40)" />
                </radialGradient>
              </defs>
              <circle cx="190" cy="190" r="180" fill="#E8C547" />
              <circle cx="190" cy="190" r="180" fill="url(#landingMoonGrad)" />
              <circle cx="120" cy="140" r="28" fill="rgba(180,140,20,0.35)" />
              <circle cx="260" cy="110" r="18" fill="rgba(180,140,20,0.28)" />
              <circle cx="240" cy="260" r="22" fill="rgba(180,140,20,0.30)" />
              <circle cx="100" cy="260" r="14" fill="rgba(180,140,20,0.25)" />
              <circle cx="310" cy="200" r="12" fill="rgba(180,140,20,0.22)" />
              <circle cx="170" cy="320" r="8" fill="rgba(180,140,20,0.20)" />
              <circle cx="300" cy="320" r="10" fill="rgba(180,140,20,0.20)" />
              <circle cx="80" cy="190" r="10" fill="rgba(180,140,20,0.20)" />
            </svg>

            {/* 메인 무니 (float) */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
              style={{ width: 540, height: 360 }}
            >
              <Image
                src="/mooni/happy.png"
                alt="무니 — 달에서 온 아기 토끼"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* 우상단 작은 무니 */}
            <div
              className="absolute"
              style={{ top: 20, right: -10, opacity: 0.40, width: 135, height: 90 }}
            >
              <Image src="/mooni/curious.png" alt="" fill className="object-contain" aria-hidden="true" />
            </div>

            {/* 좌하단 작은 무니 */}
            <div
              className="absolute"
              style={{ bottom: 30, left: -10, opacity: 0.30, width: 120, height: 80 }}
            >
              <Image src="/mooni/oops.png" alt="" fill className="object-contain" aria-hidden="true" />
            </div>
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
            {FEATURES.map(({ icon: Icon, mooniImg, title, desc }) => (
              <div
                key={title}
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
              </div>
            ))}
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

          <div className="mb-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black leading-none" style={{ color: '#E8C547' }}>0.71</span>
              <span className="mt-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                효과 크기 (Effect Size)
              </span>
            </div>
            <div className="hidden h-20 w-px sm:block" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black leading-none" style={{ color: '#E8C547' }}>314+</span>
              <span className="mt-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                인용 횟수
              </span>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Chase et al. (2009) Stanford · CHI 2024
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
