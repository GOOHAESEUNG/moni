'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { House, Trophy, User, Users } from '@phosphor-icons/react'
import { MoonWithClouds } from '@/components/icons/MoonWithClouds'
import { CarrotIcon, RabbitPawIcon, MoonStarIcon } from '@/components/icons'

const DEMO_PROFILE = { name: '김무니' }
const DEMO_CLASS = '3학년 2반'
const DEMO_UNITS = [
  { id: 'demo-1', title: '분수의 덧셈' },
  { id: 'demo-2', title: '도형의 넓이' },
  { id: 'demo-3', title: '소수의 개념' },
]
const DEMO_COMPLETED = ['demo-1']
const DEMO_SESSIONS = [
  {
    id: 'demo-s1',
    understanding_score: 82,
    ended_at: '2026-04-08T10:00:00Z',
    unitTitle: '분수의 덧셈',
  },
]

const MOONI_MESSAGES = [
  '오늘은 어떤 걸 배울까? 🌙',
  '무니한테 알려줘! 🐰',
  '같이 공부하자~! ⭐',
  '설명해 주면\n무니도 똑똑해져! 💛',
  '오늘도 최고야! 🌟',
  '무니가 기다리고 있었어! 🎉',
]

const STAR_PARTICLES = [
  { top: '8%', left: '30%', size: 7, opacity: 0.9 },
  { top: '14%', left: '44%', size: 5, opacity: 0.75 },
  { top: '6%', left: '57%', size: 8, opacity: 0.85 },
  { top: '18%', left: '67%', size: 6, opacity: 0.7 },
  { top: '12%', left: '76%', size: 5, opacity: 0.8 },
]

const clayCard = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(122,108,192,0.16), 0 2px 8px rgba(0,0,0,0.06)',
} as const

type NodeStatus = 'completed' | 'current' | 'locked'

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#F44336'
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-bold"
      style={{ background: `${color}20`, color }}
    >
      {score}점
    </span>
  )
}

function MooniSpeechBubble() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const intervalId = setInterval(() => {
      setVisible(false)
      timeoutId = setTimeout(() => {
        setIdx((prev) => (prev + 1) % MOONI_MESSAGES.length)
        setVisible(true)
      }, 350)
    }, 6400)

    return () => {
      clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        position: 'relative',
      }}
    >
      {[
        { width: 30, height: 30, top: -11, left: 16 },
        { width: 24, height: 24, top: -16, left: 44 },
        { width: 30, height: 30, top: -14, left: 70 },
        { width: 22, height: 22, top: -10, left: 104 },
        { width: 28, height: 28, top: -13, right: 16 },
      ].map((bubble, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: bubble.width,
            height: bubble.height,
            borderRadius: '9999px',
            background: '#FFFFFF',
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            boxShadow: '0 -2px 8px rgba(122,108,192,0.12)',
          }}
        />
      ))}

      <div
        style={{
          minWidth: 170,
          maxWidth: 210,
          padding: '14px 20px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 6px 24px rgba(122,108,192,0.22)',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <p
          className="whitespace-pre-line text-center text-sm font-extrabold leading-snug"
          style={{ color: '#5A4FA0', wordBreak: 'keep-all' }}
        >
          {MOONI_MESSAGES[idx]}
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 38,
          bottom: -13,
          width: 14,
          height: 14,
          borderRadius: '9999px',
          background: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(122,108,192,0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 48,
          bottom: -24,
          width: 9,
          height: 9,
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.82)',
        }}
      />
    </div>
  )
}

function CompletedNode() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cn-gold" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFDE0" />
          <stop offset="45%" stopColor="#F0CC3A" />
          <stop offset="100%" stopColor="#C8A020" />
        </radialGradient>
        <radialGradient id="cn-hi" cx="35%" cy="28%" r="45%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="cn-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="42" cy="42" r="41" fill="rgba(232,197,71,0.18)" />
      <circle cx="42" cy="42" r="36" fill="rgba(232,197,71,0.10)" />
      <circle cx="42" cy="42" r="30" fill="url(#cn-gold)" />
      <circle cx="42" cy="42" r="30" fill="url(#cn-hi)" />
      <circle cx="42" cy="42" r="30" stroke="#B8920A" strokeWidth="2" />
      <path
        d="M26 42 L37 53 L58 30"
        stroke="#3D2E00"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cn-glow)"
      />
      <path d="M9 18 L10.4 22.8 L15 24 L10.4 25.2 L9 30 L7.6 25.2 L3 24 L7.6 22.8Z" fill="#F0CC3A" />
      <path d="M73 12 L74.1 15.8 L78 17 L74.1 18.2 L73 22 L71.9 18.2 L68 17 L71.9 15.8Z" fill="#F0CC3A" />
      <circle cx="76" cy="54" r="3.5" fill="#F0CC3A" />
      <circle cx="10" cy="58" r="2.5" fill="#F0CC3A" />
    </svg>
  )
}

function CurrentNode() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="curr-orb" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFF176" />
          <stop offset="80%" stopColor="#E8C547" />
          <stop offset="100%" stopColor="#C8A020" />
        </radialGradient>
        <radialGradient id="curr-hi" cx="32%" cy="26%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill="rgba(232,197,71,0.12)" className="node-pulse-outer" />
      <circle cx="48" cy="48" r="40" fill="rgba(232,197,71,0.20)" className="node-pulse-inner" />
      <circle cx="48" cy="48" r="34" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="3" />
      <circle cx="48" cy="48" r="32" fill="url(#curr-orb)" />
      <circle cx="48" cy="48" r="32" fill="url(#curr-hi)" />
      <path d="M40 33 L66 48 L40 63Z" fill="#1A1830" />
      <circle cx="22" cy="28" r="3" fill="rgba(255,255,255,0.90)" />
      <circle cx="76" cy="22" r="2.2" fill="rgba(255,255,255,0.80)" />
    </svg>
  )
}

function LockedNode() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lock-grad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(200,195,220,0.55)" />
          <stop offset="100%" stopColor="rgba(170,163,200,0.40)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#lock-grad)" stroke="rgba(255,255,255,0.25)" />
      <path d="M22 28 C22 20 42 20 42 28 L42 32 L22 32 Z" fill="rgba(95,89,123,0.50)" />
      <rect x="19" y="32" width="26" height="18" rx="4" fill="rgba(95,89,123,0.58)" />
      <circle cx="32" cy="40" r="3" fill="rgba(255,255,255,0.55)" />
      <rect x="31" y="43" width="2" height="4" rx="1" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

function LeftNav() {
  return (
    <nav
      className="flex w-[220px] shrink-0 flex-col overflow-y-auto p-4"
      style={{ background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}
    >
      <div className="flex items-center gap-2 px-2 pt-2">
        <MoonStarIcon size={24} color="#7A6CC0" />
        <span className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>
          Moni
        </span>
      </div>

      <span
        className="mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
        style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}
      >
        체험 모드
      </span>

      <div className="mt-6 flex flex-1 flex-col gap-1">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{ background: 'rgba(122,108,192,0.12)', color: '#5A4FA0', borderLeft: '3px solid #7A6CC0' }}
        >
          <House size={20} weight="fill" />
          <span className="text-sm font-bold">학습</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ color: '#9EA0B4' }}>
          <Trophy size={20} />
          <span className="text-sm font-semibold">리더보드</span>
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: '#F3F3F7', color: '#9EA0B4' }}
          >
            준비중
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ color: '#9EA0B4' }}>
          <User size={20} />
          <span className="text-sm font-semibold">프로필</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: '#F7F7FB' }}>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold"
          style={{ background: 'rgba(122,108,192,0.18)', color: '#5A4FA0' }}
        >
          김
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold" style={{ color: '#2D2F2F' }}>
            {DEMO_PROFILE.name}
          </p>
          <p className="truncate text-xs" style={{ color: '#9EA0B4' }}>
            {DEMO_CLASS}
          </p>
        </div>
      </div>
    </nav>
  )
}

function CenterContent() {
  const firstNonCompleted = DEMO_UNITS.find((unit) => !DEMO_COMPLETED.includes(unit.id))

  function getStatus(unitId: string): NodeStatus {
    if (DEMO_COMPLETED.includes(unitId)) return 'completed'
    if (unitId === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <main className="relative flex-1" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 overflow-y-auto" style={{ zIndex: 1 }}>
        <div
          className="sticky top-0 z-10 px-6 py-3 text-sm font-extrabold"
          style={{ background: '#E8C547', color: '#1A1830' }}
        >
          {DEMO_CLASS} · 단원 경로
        </div>

        <div className="flex flex-col items-center gap-0 py-10 pb-80">
          {DEMO_UNITS.map((unit, index) => {
            const status = getStatus(unit.id)

            return (
              <div key={unit.id} className="flex flex-col items-center">
                {status === 'completed' && (
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-extrabold"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#5A4FA0' }}
                    >
                      다시 가르치기
                    </span>
                    <Link href="/demo/student/teach" className="transition-transform hover:scale-105 active:scale-95">
                      <CompletedNode />
                    </Link>
                    <p className="text-center text-sm font-bold" style={{ color: '#2D2F2F' }}>
                      {unit.title}
                    </p>
                  </div>
                )}

                {status === 'current' && (
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-extrabold"
                      style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 2px 8px rgba(232,197,71,0.50)' }}
                    >
                      시작!
                    </span>
                    <Link href="/demo/student/teach" className="transition-transform hover:scale-105 active:scale-95">
                      <CurrentNode />
                    </Link>
                    <p className="text-center text-sm font-bold" style={{ color: '#2D2F2F' }}>
                      {unit.title}
                    </p>
                  </div>
                )}

                {status === 'locked' && (
                  <div className="flex flex-col items-center gap-2">
                    <LockedNode />
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: 'rgba(255,255,255,0.55)', color: '#7B7793' }}
                    >
                      잠겨 있어요
                    </span>
                    <p className="text-center text-xs font-semibold" style={{ color: '#F6F3FF' }}>
                      {unit.title}
                    </p>
                  </div>
                )}

                {index < DEMO_UNITS.length - 1 && (
                  <div
                    style={{
                      width: 4,
                      height: 48,
                      background: '#E8E8E8',
                      borderRadius: 9999,
                      margin: '10px 0',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function RightSidebar() {
  const lastSession = DEMO_SESSIONS[0]

  return (
    <aside
      className="flex w-[280px] shrink-0 flex-col overflow-y-auto p-4"
      style={{ background: '#FFFFFF', borderLeft: '1px solid #F0F0F0' }}
    >
      <div className="space-y-4">
        <div className="p-4" style={clayCard}>
          <div className="mb-2 flex items-center gap-2">
            <Users size={16} weight="fill" style={{ color: '#7A6CC0' }} />
            <span className="text-xs font-bold" style={{ color: '#9EA0B4' }}>
              나의 반
            </span>
          </div>
          <p className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>
            {DEMO_CLASS}
          </p>
        </div>

        <div className="p-4" style={clayCard}>
          <div className="mb-3 flex items-center gap-2">
            <CarrotIcon size={16} color="#FF8C42" />
            <span className="text-xs font-bold" style={{ color: '#9EA0B4' }}>
              오늘의 퀘스트
            </span>
          </div>
          <p className="text-sm font-bold" style={{ color: '#2D2F2F' }}>
            무니에게 1번 설명해 주기
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: '#F2F1F8' }}>
            <div className="h-full rounded-full" style={{ width: '60%', background: '#E8C547' }} />
          </div>
          <p className="mt-2 text-right text-xs" style={{ color: '#9EA0B4' }}>
            60%
          </p>
        </div>

        <div className="space-y-3 p-4" style={clayCard}>
          <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>
            학습 통계
          </p>
          <div className="flex items-center gap-3">
            <RabbitPawIcon size={20} color="#FF9600" />
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: '#2D2F2F' }}>
                3일
              </p>
              <p className="text-xs" style={{ color: '#9EA0B4' }}>
                연속 학습
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MoonStarIcon size={20} color="#E8C547" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold" style={{ color: '#2D2F2F' }}>
                분수의 덧셈
              </p>
              <p className="text-xs" style={{ color: '#9EA0B4' }}>
                최근 완료 단원
              </p>
            </div>
          </div>
        </div>

        <div style={clayCard}>
          <div className="px-4 pt-4">
            <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>
              지난 학습
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold" style={{ color: '#2D2F2F' }}>
                  {lastSession.unitTitle}
                </p>
                <p className="text-xs" style={{ color: '#9EA0B4' }}>
                  {new Date(lastSession.ended_at).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <ScorePill score={lastSession.understanding_score} />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-2xl py-3 text-sm font-extrabold text-white"
          style={{ background: '#7A6CC0', boxShadow: '0 8px 18px rgba(122,108,192,0.28)' }}
        >
          회원가입하고 계속하기
        </button>
      </div>
    </aside>
  )
}

export default function DemoStudentPage() {
  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #7A6CC0 0%, #9485CF 25%, #B4A8DC 55%, #D4CEF0 100%)' }}
    >
      {STAR_PARTICLES.map((star, index) => (
        <div
          key={index}
          className="star-particle-slow absolute pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: '9999px',
            background: `rgba(255,255,255,${star.opacity})`,
            filter: 'blur(0.5px)',
            zIndex: 0,
          }}
        />
      ))}

      <div
        className="absolute pointer-events-none"
        style={{ left: 220, right: 280, bottom: 0, height: '95%', overflow: 'hidden', zIndex: 0 }}
      >
        <MoonWithClouds className="w-full h-full" />
      </div>

      <div
        className="absolute pointer-events-none mooni-float"
        style={{ left: 220, bottom: '26%', zIndex: 2 }}
      >
        <div style={{ position: 'absolute', bottom: '100%', left: 60, marginBottom: 8 }}>
          <MooniSpeechBubble />
        </div>
        <Image src="/mooni/happy.png" width={480} height={480} alt="Mooni" />
      </div>

      <LeftNav />
      <CenterContent />
      <RightSidebar />

      <style jsx global>{`
        .mooni-float {
          animation: mooniFloat 4.8s ease-in-out infinite;
        }

        .star-particle-slow {
          animation: starTwinkle 4.6s ease-in-out infinite;
        }

        .node-pulse-outer {
          animation: nodePulseOuter 2.2s ease-in-out infinite;
          transform-origin: center;
        }

        .node-pulse-inner {
          animation: nodePulseInner 1.8s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes mooniFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes starTwinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes nodePulseOuter {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }

        @keyframes nodePulseInner {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
