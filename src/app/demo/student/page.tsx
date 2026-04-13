'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { House, Trophy, User, Fire, Star, CheckCircle } from '@phosphor-icons/react'
import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'
import { MoonWithClouds } from '@/components/icons/MoonWithClouds'
import { CarrotIcon, MoonStarIcon } from '@/components/icons'

const DEMO_PROFILE = { name: '김무니' }
const DEMO_CLASS = '3학년 2반'
const DEMO_UNITS = [
  { id: 'demo-1', title: '분수의 덧셈' },
  { id: 'demo-2', title: '도형의 넓이' },
  { id: 'demo-3', title: '소수의 개념' },
]
const DEMO_COMPLETED = ['demo-1']
const DEMO_SESSIONS = [
  { id: 'demo-s1', understanding_score: 82, ended_at: '2026-04-08T10:00:00Z', unitTitle: '분수의 덧셈' },
]
const DEMO_QUESTS = [
  { id: 'q1', title: '무니에게 1번 설명해 주기', done: true },
  { id: 'q2', title: '도형의 넓이 학습 완료하기', done: false },
]

const MOONI_MESSAGES = [
  '오늘은 어떤 걸 배울까? 🌙',
  '무니한테 알려줘! 🐰',
  '같이 공부하자~! ⭐',
  '설명해 주면\n무니도 똑똑해져! 💛',
  '오늘도 최고야! 🌟',
  '무니가 기다리고 있었어! 🎉',
]

const STUDENT_TUTORIAL_STEPS = [
  {
    targetSelector: '[data-tutorial="mooni-character"]',
    title: '무니를 만나보세요!',
    description: '무니가 오늘 학습을 기다리고 있어요. 말풍선을 보고 분위기를 먼저 느껴보세요.',
    position: 'top' as const,
  },
  {
    targetSelector: '[data-tutorial="first-unit"]',
    title: '학습을 시작해요',
    description: '현재 열려 있는 단원을 눌러 무니에게 설명을 시작해보세요. ▶ 버튼을 클릭!',
  },
  {
    targetSelector: '[data-tutorial="profile-nav"]',
    title: '프로필도 확인해보세요',
    description: '프로필에서 초대 코드 입력, 학습 통계 확인, 로그아웃을 할 수 있어요.',
  },
]

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

type NodeStatus = 'completed' | 'current' | 'locked'

// ── 지그재그 오프셋 ──
const ZIGZAG_OFFSETS = [-65, 0, 65, 0, -65, 0]

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#FF9600'
  return (
    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${color}20`, color }}>
      {score}점
    </span>
  )
}

function MooniSpeechBubble() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible(false)
      const t = setTimeout(() => { setIdx((p) => (p + 1) % MOONI_MESSAGES.length); setVisible(true) }, 350)
      return () => clearTimeout(t)
    }, 6400)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.35s ease, transform 0.35s ease', position: 'relative' }}>
      {[
        { width: 30, height: 30, top: -11, left: 16 },
        { width: 24, height: 24, top: -16, left: 44 },
        { width: 30, height: 30, top: -14, left: 70 },
        { width: 22, height: 22, top: -10, left: 104 },
        { width: 28, height: 28, top: -13, right: 16 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', width: b.width, height: b.height, borderRadius: '9999px', background: '#FFFFFF', top: b.top, left: (b as any).left, right: (b as any).right, boxShadow: '0 -2px 8px rgba(122,108,192,0.12)' }} />
      ))}
      <div style={{ minWidth: 170, maxWidth: 210, padding: '14px 20px', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 6px 24px rgba(122,108,192,0.22)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p className="whitespace-pre-line text-center text-sm font-extrabold leading-snug" style={{ color: '#5A4FA0', wordBreak: 'keep-all' }}>
          {MOONI_MESSAGES[idx]}
        </p>
      </div>
      <div style={{ position: 'absolute', left: 38, bottom: -13, width: 14, height: 14, borderRadius: '9999px', background: '#FFFFFF', boxShadow: '0 2px 6px rgba(122,108,192,0.14)' }} />
      <div style={{ position: 'absolute', left: 48, bottom: -24, width: 9, height: 9, borderRadius: '9999px', background: 'rgba(255,255,255,0.82)' }} />
    </div>
  )
}

// ── Node SVGs ──
function CompletedNode() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
      <defs>
        <radialGradient id="d-cn-gold" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFDE0" /><stop offset="45%" stopColor="#F0CC3A" /><stop offset="100%" stopColor="#C8A020" />
        </radialGradient>
        <radialGradient id="d-cn-hi" cx="35%" cy="28%" r="45%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="d-cn-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="42" cy="42" r="41" fill="rgba(232,197,71,0.18)" />
      <circle cx="42" cy="42" r="36" fill="rgba(232,197,71,0.10)" />
      <circle cx="42" cy="42" r="30" fill="url(#d-cn-gold)" />
      <circle cx="42" cy="42" r="30" fill="url(#d-cn-hi)" />
      <circle cx="42" cy="42" r="30" stroke="#B8920A" strokeWidth="2" fill="none" />
      <path d="M26 42 L37 53 L58 30" stroke="#3D2E00" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#d-cn-glow)" />
      <path d="M9 18 L10.4 22.8 L15 24 L10.4 25.2 L9 30 L7.6 25.2 L3 24 L7.6 22.8Z" fill="#F0CC3A" opacity="0.95" />
      <path d="M73 12 L74.1 15.8 L78 17 L74.1 18.2 L73 22 L71.9 18.2 L68 17 L71.9 15.8Z" fill="#F0CC3A" opacity="0.85" />
      <circle cx="76" cy="54" r="3.5" fill="#F0CC3A" opacity="0.70" />
      <circle cx="10" cy="58" r="2.5" fill="#F0CC3A" opacity="0.60" />
    </svg>
  )
}

function CurrentNode() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <defs>
        <radialGradient id="d-curr-orb" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" /><stop offset="40%" stopColor="#FFF176" /><stop offset="80%" stopColor="#E8C547" /><stop offset="100%" stopColor="#C8A020" />
        </radialGradient>
        <radialGradient id="d-curr-hi" cx="32%" cy="26%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.70)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill="rgba(232,197,71,0.12)" className="node-pulse-outer" />
      <circle cx="48" cy="48" r="40" fill="rgba(232,197,71,0.20)" className="node-pulse-inner" />
      <circle cx="48" cy="48" r="34" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="3" />
      <circle cx="48" cy="48" r="32" fill="url(#d-curr-orb)" />
      <circle cx="48" cy="48" r="32" fill="url(#d-curr-hi)" />
      <path d="M40 33 L66 48 L40 63Z" fill="#1A1830" />
      <circle cx="22" cy="28" r="3" fill="rgba(255,255,255,0.90)" />
      <circle cx="76" cy="22" r="2.2" fill="rgba(255,255,255,0.80)" />
      <circle cx="80" cy="68" r="2.8" fill="rgba(255,255,255,0.70)" />
    </svg>
  )
}

function LockedNode() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="d-lock" cx="60%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C8C5DC" /><stop offset="100%" stopColor="#9A97B8" />
        </radialGradient>
      </defs>
      <path d="M46 32 C46 19.8 37.6 10 27 10 C23.6 10 20.4 11 17.6 12.8 C24.4 16.4 29 23.6 29 32 C29 40.4 24.4 47.6 17.6 51.2 C20.4 53 23.6 54 27 54 C37.6 54 46 44.2 46 32Z" fill="url(#d-lock)" opacity="0.55" />
      <rect x="26" y="36" width="14" height="11" rx="2.5" fill="#9A97B8" opacity="0.75" />
      <path d="M29 36 V31.5 C29 27.4 37 27.4 37 31.5 V36" stroke="#9A97B8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.75" />
      <circle cx="33" cy="41.5" r="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

// ── Path Connector (베지어 곡선 점선) ──
function PathConnector({ fromOffset, toOffset, completed }: { fromOffset: number; toOffset: number; completed: boolean }) {
  const H = 68
  const CX = 100
  const x1 = CX + fromOffset
  const x2 = CX + toOffset
  return (
    <div style={{ height: H, position: 'relative', width: '100%' }}>
      <svg width="200" height={H} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
        <path
          d={`M ${x1} 0 C ${x1} ${H * 0.55} ${x2} ${H * 0.45} ${x2} ${H}`}
          stroke={completed ? 'rgba(232,197,71,0.55)' : 'rgba(255,255,255,0.30)'}
          strokeWidth="5" fill="none" strokeDasharray="10,8" strokeLinecap="round"
        />
        {completed && (
          <>
            <circle cx={(x1 + x2) / 2 - 4} cy={H / 2 - 8} r="3" fill="rgba(232,197,71,0.70)" />
            <circle cx={(x1 + x2) / 2 + 10} cy={H / 2 + 4} r="2" fill="rgba(232,197,71,0.50)" />
          </>
        )}
      </svg>
    </div>
  )
}

// ── Left Nav ──
function LeftNav() {
  return (
    <nav className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#FFFFFF', borderRight: '1px solid rgba(200,188,245,0.40)' }}>
      <div className="px-5 pt-6 pb-4">
        <p className="font-extrabold text-base" style={{ color: '#8575C4' }}>🌙 Moni</p>
        <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
      </div>
      <div style={{ height: 1, background: 'rgba(200,188,245,0.30)' }} />

      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ background: 'rgba(232,197,71,0.15)', color: '#5A4090' }}>
          <House size={20} weight="fill" style={{ color: '#E8C547' }} />
          <span className="font-extrabold text-sm">학습</span>
        </div>
        <Link href="/demo/student/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
          <Trophy size={20} weight="regular" />
          <span className="font-semibold text-sm">리더보드</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 rounded-full" data-tutorial="profile-nav" style={{ color: '#B8B5D0' }}>
          <User size={20} weight="regular" />
          <span className="font-semibold text-sm">프로필</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }} className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}>김</div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm truncate" style={{ color: '#4A3E80' }}>{DEMO_PROFILE.name}</p>
            <p className="text-xs truncate" style={{ color: '#A8A5C0' }}>{DEMO_CLASS}</p>
          </div>
        </div>
        <Link href="/demo" className="mt-3 block text-xs transition-opacity hover:opacity-70" style={{ color: '#B8B5D0' }}>
          ← 체험 선택으로
        </Link>
      </div>
    </nav>
  )
}

// ── Center Content (지그재그 퀘스트맵) ──
function CenterContent() {
  const firstNonCompleted = DEMO_UNITS.find((u) => !DEMO_COMPLETED.includes(u.id))
  const completedCount = DEMO_COMPLETED.length
  const totalCount = DEMO_UNITS.length

  function getStatus(unitId: string): NodeStatus {
    if (DEMO_COMPLETED.includes(unitId)) return 'completed'
    if (unitId === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <main className="relative flex-1" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 overflow-y-auto" style={{ zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <div className="mx-5 mt-5 mb-1">
          <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
            style={{ background: 'rgba(148,135,208,0.50)', backdropFilter: 'blur(12px)' }}>
            <div>
              <p className="font-extrabold text-sm" style={{ color: 'white' }}>섹션 1 · 오늘의 학습</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                {completedCount}/{totalCount} 단원 완료
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {Math.round((completedCount / totalCount) * 100)}%
              </p>
              <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.22)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${(completedCount / totalCount) * 100}%`, background: 'linear-gradient(90deg, #E8C547, #FFF176)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 지그재그 퀘스트맵 */}
        <div className="flex flex-col items-center py-10 pb-80">
          {DEMO_UNITS.map((unit, i) => {
            const status = getStatus(unit.id)
            const offset = ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length]
            const nextOffset = ZIGZAG_OFFSETS[(i + 1) % ZIGZAG_OFFSETS.length]
            const isCompleted = status === 'completed'
            const nextIsCompleted = i + 1 < DEMO_UNITS.length && DEMO_COMPLETED.includes(DEMO_UNITS[i + 1].id)

            return (
              <div key={unit.id} className="flex flex-col items-center w-full">
                <div style={{ transform: `translateX(${offset}px)` }}>
                  {status === 'completed' && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="px-3 py-1 rounded-full text-xs font-extrabold"
                        style={{ background: 'rgba(255,255,255,0.90)', color: '#5A4FA0' }}>
                        다시 가르치기
                      </div>
                      <Link href="/demo/student/teach" className="block transition-transform hover:scale-105 active:scale-95">
                        <CompletedNode />
                      </Link>
                      <p className="font-bold text-sm text-center max-w-[120px]" style={{ color: 'rgba(255,255,255,0.90)' }}>
                        {unit.title}
                      </p>
                    </div>
                  )}
                  {status === 'current' && (
                    <div className="flex flex-col items-center gap-2 relative" data-tutorial="first-unit">
                      <div className="px-4 py-1.5 rounded-full text-xs font-extrabold"
                        style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 3px 12px rgba(232,197,71,0.55)' }}>
                        시작!
                      </div>
                      <div className="relative">
                        <Link href="/demo/student/teach" className="block transition-transform hover:scale-105 active:scale-95">
                          <CurrentNode />
                        </Link>
                        <div className="absolute pointer-events-none" style={{ right: -100, top: '50%', transform: 'translateY(-50%)' }}>
                          <Image src="/mooni/curious.png" alt="무니" width={110} height={73} />
                        </div>
                      </div>
                      <p className="font-extrabold text-sm text-center max-w-[120px]" style={{ color: 'white' }}>
                        {unit.title}
                      </p>
                    </div>
                  )}
                  {status === 'locked' && (
                    <div className="flex flex-col items-center gap-2">
                      <LockedNode />
                      <p className="text-xs text-center max-w-[100px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                        {unit.title}
                      </p>
                    </div>
                  )}
                </div>

                {i < DEMO_UNITS.length - 1 && (
                  <PathConnector
                    fromOffset={offset}
                    toOffset={nextOffset}
                    completed={isCompleted && nextIsCompleted}
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

// ── Right Sidebar ──
function RightSidebar() {
  const lastSession = DEMO_SESSIONS[0]

  return (
    <aside className="hidden md:flex w-[280px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#FFFFFF', borderLeft: '1px solid rgba(200,188,245,0.40)' }}>
      <div className="px-5 pt-6 pb-4 space-y-4">

        {/* 학생 카드 */}
        <div className="p-4 flex items-center gap-3" style={clayCard}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-extrabold text-base"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}>
            김
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm truncate" style={{ color: '#2D1F6E' }}>{DEMO_PROFILE.name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: '#A8A5C0' }}>{DEMO_CLASS}</p>
          </div>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl text-center"
            style={{ background: 'rgba(255,150,0,0.08)', border: '1.5px solid rgba(255,150,0,0.18)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Fire size={14} weight="fill" style={{ color: '#FF9600' }} />
              <span className="text-xs font-semibold" style={{ color: '#FF9600' }}>학습 횟수</span>
            </div>
            <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>3</p>
          </div>
          <div className="p-3.5 rounded-2xl text-center"
            style={{ background: 'rgba(232,197,71,0.10)', border: '1.5px solid rgba(232,197,71,0.25)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} weight="fill" style={{ color: '#C8A020' }} />
              <span className="text-xs font-semibold" style={{ color: '#C8A020' }}>평균 점수</span>
            </div>
            <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>82</p>
          </div>
        </div>

        {/* 퀘스트 */}
        <div className="p-4" style={clayCard}>
          <div className="flex items-center gap-2 mb-3">
            <CarrotIcon size={16} color="#FF8C42" />
            <p className="text-xs font-extrabold" style={{ color: '#2D1F6E' }}>퀘스트</p>
          </div>
          <div className="space-y-2.5">
            {DEMO_QUESTS.map((q) => (
              <div key={q.id} className="p-3 rounded-xl"
                style={{ background: q.done ? 'rgba(76,175,80,0.08)' : 'rgba(170,155,230,0.08)', border: `1px solid ${q.done ? 'rgba(76,175,80,0.20)' : 'rgba(170,155,230,0.20)'}` }}>
                <div className="flex items-start gap-2 mb-2">
                  {q.done ? (
                    <CheckCircle size={14} weight="fill" style={{ color: '#4CAF50', marginTop: 1, flexShrink: 0 }} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0" style={{ borderColor: '#A89ED0' }} />
                  )}
                  <p className="text-xs font-bold leading-snug" style={{ color: q.done ? '#4CAF50' : '#2D1F6E' }}>{q.title}</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(200,190,240,0.30)' }}>
                  <div className="h-full rounded-full" style={{ width: q.done ? '100%' : '0%', background: q.done ? '#4CAF50' : '#E8C547' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 지난 학습 */}
        <div>
          <p className="font-extrabold text-xs mb-2.5 uppercase tracking-wider px-1"
            style={{ color: 'rgba(90,79,160,0.50)' }}>지난 학습</p>
          <div className="overflow-hidden" style={clayCard}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0 mr-2">
                <MoonStarIcon size={16} color="#E8C547" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs truncate" style={{ color: '#2D1F6E' }}>{lastSession.unitTitle}</p>
                  <p className="text-xs" style={{ color: '#A8A5C0' }}>
                    {new Date(lastSession.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <ScorePill score={lastSession.understanding_score} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href="/signup"
          className="flex items-center justify-center w-full rounded-2xl py-3.5 text-sm font-extrabold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7A6CC0, #9485CF)', color: 'white', boxShadow: '0 4px 16px rgba(122,108,192,0.35)' }}>
          회원가입하고 계속하기
        </Link>
      </div>
    </aside>
  )
}

// ── Main ──
export default function DemoStudentPage() {
  return (
    <div className="flex h-screen overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      {/* 별 파티클 */}
      {[
        { top: '8%',  left: '32%', size: 14, delay: 0.3, dur: 3.5 },
        { top: '5%',  left: '52%', size: 12, delay: 1.1, dur: 4.0 },
        { top: '15%', left: '66%', size: 16, delay: 0.5, dur: 3.2 },
        { top: '12%', left: '40%', size: 13, delay: 0.8, dur: 3.8 },
        { top: '3%',  left: '60%', size: 14, delay: 0.2, dur: 3.0 },
        { top: '20%', left: '45%', size: 11, delay: 1.8, dur: 4.8 },
      ].map((s, i) => (
        <div key={i} className="star-particle-slow absolute pointer-events-none"
          style={{ top: s.top, left: s.left, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, zIndex: 0 } as React.CSSProperties}>
          <svg width={s.size} height={s.size} viewBox="0 0 24 24">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="rgba(232,197,71,0.85)" />
          </svg>
        </div>
      ))}

      {[
        { top: '10%', left: '28%', size: 5, delay: 0.0, dur: 2.2 },
        { top: '18%', left: '55%', size: 4, delay: 0.7, dur: 2.8 },
        { top: '6%',  left: '70%', size: 6, delay: 1.3, dur: 2.0 },
        { top: '28%', left: '38%', size: 3, delay: 0.4, dur: 3.1 },
        { top: '35%', left: '62%', size: 5, delay: 1.9, dur: 2.5 },
        { top: '14%', left: '48%', size: 4, delay: 0.9, dur: 2.3 },
      ].map((s, i) => (
        <div key={`dot-${i}`} className="star-bg"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, zIndex: 0 } as React.CSSProperties}
        />
      ))}

      {/* 달+구름 배경 */}
      <div className="hidden md:block absolute pointer-events-none"
        style={{ left: 220, right: 280, bottom: 0, height: '95%', overflow: 'hidden', zIndex: 0 }}>
        <MoonWithClouds className="w-full h-full" />
      </div>

      {/* 무니 + 말풍선 */}
      <div className="hidden md:block absolute pointer-events-none mooni-float" data-tutorial="mooni-character" style={{ left: 220, bottom: '26%', zIndex: 2 }}>
        <div style={{ position: 'absolute', bottom: '100%', left: 60, marginBottom: 8 }}>
          <MooniSpeechBubble />
        </div>
        <Image src="/mooni/happy.png" width={480} height={480} alt="무니" />
      </div>

      {/* 모바일 헤더 */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-10 px-4 pt-4 pb-2 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(169,157,214,0.95) 0%, transparent 100%)' }}>
        <p className="font-extrabold text-sm" style={{ color: '#2D1F6E' }}>🌙 Moni</p>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
      </div>

      <LeftNav />
      <CenterContent />
      <RightSidebar />
      <DemoTutorialOverlay
        steps={STUDENT_TUTORIAL_STEPS}
        storageKey="demo-student-home-tutorial"
      />
    </div>
  )
}
