'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MoonWithClouds } from '@/components/icons/MoonWithClouds'
import {
  House,
  Trophy,
  User,
  SignOut,
  Users,
  DoorOpen,
  CheckCircle,
  Star,
  Fire,
  ChartLineUp,
} from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Unit, Quest, QuestCompletion } from '@/types/database'
import { CarrotIcon, RabbitPawIcon, MoonStarIcon } from '@/components/icons'

interface RecentSession {
  id: string
  unit_id: string
  understanding_score: number | null
  ended_at: string | null
  units: { title: string } | { title: string }[] | null
  reports: { id: string }[] | null
}

interface Props {
  profile: Profile
  activeUnits: Unit[]
  recentSessions: RecentSession[]
  hasEnrollment: boolean
  completedUnitIds: string[]
  className: string | null
  quests: Quest[]
  questCompletions: QuestCompletion[]
}

function getUnitTitle(session: RecentSession): string {
  if (!session.units) return '단원'
  if (Array.isArray(session.units)) return session.units[0]?.title ?? '단원'
  return session.units.title
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) return null
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#FF9600'
  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {score}점
    </span>
  )
}

const MOONI_MESSAGES = [
  '오늘은 어떤 걸 배울까? 🌙',
  '무니한테 알려줘! 🐰',
  '같이 공부하자~! ⭐',
  '설명해 주면\n무니도 똑똑해져! 💛',
  '오늘도 최고야! 🌟',
  '무니가 기다리고 있었어! 🎉',
  '오늘도 파이팅! ✨',
  '우주에서 제일 열심히\n하는 너! 🚀',
  '오늘도 무니 도와줄 거지? 🌸',
  '넌 진짜 대단해! 🥕',
]

function MooniSpeechBubble() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(p => (p + 1) % MOONI_MESSAGES.length)
        setVisible(true)
      }, 350)
    }, 6400)
    return () => clearInterval(iv)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        zIndex: 2,
      }}
    >
      {/* 몽글몽글 범프 */}
      {[
        { w: 30, h: 30, top: -12, left: 18 },
        { w: 24, h: 24, top: -16, left: 44 },
        { w: 32, h: 32, top: -14, left: 68 },
        { w: 26, h: 26, top: -12, left: 100 },
        { w: 22, h: 22, top: -10, left: 130 },
        { w: 28, h: 28, top: -13, right: 14 },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: b.w, height: b.h,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.93)',
          top: b.top,
          left: (b as any).left,
          right: (b as any).right,
          boxShadow: '0 -2px 8px rgba(130,110,200,0.12)',
        }} />
      ))}
      <div style={{
        background: 'rgba(255,255,255,0.93)',
        borderRadius: '22px',
        padding: '14px 20px',
        minWidth: 160,
        maxWidth: 200,
        boxShadow: '0 6px 24px rgba(130,110,200,0.28)',
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
      }}>
        <p className="font-extrabold text-sm leading-snug whitespace-pre-line text-center"
          style={{ color: '#5A4FA0', wordBreak: 'keep-all' }}>
          {MOONI_MESSAGES[idx]}
        </p>
      </div>
      <div style={{ position: 'absolute', bottom: -12, left: 36, width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.88)', boxShadow: '0 2px 6px rgba(130,110,200,0.18)' }} />
      <div style={{ position: 'absolute', bottom: -22, left: 46, width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />
    </div>
  )
}

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

// ──────────────────────────────────────────────
// Left Nav
// ──────────────────────────────────────────────
function LeftNav({ profile, className: cls }: { profile: Profile; className: string | null }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav
      className="hidden md:flex flex-col h-full"
      style={{
        width: 220,
        flexShrink: 0,
        background: '#FFFFFF',
        borderRight: '1px solid rgba(200,188,245,0.40)',
      }}
    >
      <div className="px-5 pt-6 pb-4">
        <p className="font-extrabold text-base" style={{ color: '#8575C4' }}>
          🌙 Moni
        </p>
      </div>
      <div style={{ height: 1, background: 'rgba(200,188,245,0.30)' }} />

      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ background: 'rgba(232,197,71,0.15)', color: '#5A4090' }}>
          <House size={20} weight="fill" style={{ color: '#E8C547' }} />
          <span className="font-extrabold text-sm">학습</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-full cursor-not-allowed"
          style={{ color: '#B8B5D0' }}>
          <Trophy size={20} weight="regular" />
          <span className="font-semibold text-sm">리더보드</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#F4F2FF', color: '#C0B8E0' }}>준비중</span>
        </div>

        <Link href="/student/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60"
          style={{ color: '#B8B5D0' }}>
          <User size={20} weight="regular" />
          <span className="font-semibold text-sm">프로필</span>
        </Link>

        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60 text-left w-full"
          style={{ color: '#B8B5D0' }}>
          <SignOut size={20} weight="regular" />
          <span className="font-semibold text-sm">로그아웃</span>
        </button>
      </div>

      <div style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }} className="px-5 py-4">
        <p className="font-extrabold text-sm" style={{ color: '#4A3E80' }}>{profile.name}</p>
        {cls && <p className="text-xs mt-0.5" style={{ color: '#A8A5C0' }}>{cls}</p>}
      </div>
    </nav>
  )
}

// ──────────────────────────────────────────────
// Unit Node SVGs
// ──────────────────────────────────────────────
type NodeStatus = 'completed' | 'current' | 'locked'

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
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="42" cy="42" r="41" fill="rgba(232,197,71,0.18)" />
      <circle cx="42" cy="42" r="36" fill="rgba(232,197,71,0.10)" />
      <circle cx="42" cy="42" r="30" fill="url(#cn-gold)" />
      <circle cx="42" cy="42" r="30" fill="url(#cn-hi)" />
      <circle cx="42" cy="42" r="30" stroke="#B8920A" strokeWidth="2" fill="none" />
      <path d="M26 42 L37 53 L58 30" stroke="#3D2E00" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#cn-glow)" />
      <path d="M9 18 L10.4 22.8 L15 24 L10.4 25.2 L9 30 L7.6 25.2 L3 24 L7.6 22.8Z" fill="#F0CC3A" opacity="0.95" />
      <path d="M73 12 L74.1 15.8 L78 17 L74.1 18.2 L73 22 L71.9 18.2 L68 17 L71.9 15.8Z" fill="#F0CC3A" opacity="0.85" />
      <circle cx="76" cy="54" r="3.5" fill="#F0CC3A" opacity="0.70" />
      <circle cx="10" cy="58" r="2.5" fill="#F0CC3A" opacity="0.60" />
      <circle cx="68" cy="72" r="2" fill="#F0CC3A" opacity="0.50" />
      <circle cx="18" cy="72" r="1.8" fill="#F0CC3A" opacity="0.45" />
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
      <circle cx="80" cy="68" r="2.8" fill="rgba(255,255,255,0.70)" />
    </svg>
  )
}

function LockedNode() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lock-moon" cx="60%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C8C5DC" />
          <stop offset="100%" stopColor="#9A97B8" />
        </radialGradient>
      </defs>
      <path d="M46 32 C46 19.8 37.6 10 27 10 C23.6 10 20.4 11 17.6 12.8 C24.4 16.4 29 23.6 29 32 C29 40.4 24.4 47.6 17.6 51.2 C20.4 53 23.6 54 27 54 C37.6 54 46 44.2 46 32Z"
        fill="url(#lock-moon)" opacity="0.55" />
      <rect x="26" y="36" width="14" height="11" rx="2.5" fill="#9A97B8" opacity="0.75" />
      <path d="M29 36 V31.5 C29 27.4 37 27.4 37 31.5 V36" stroke="#9A97B8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.75" />
      <circle cx="33" cy="41.5" r="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

// ──────────────────────────────────────────────
// Path Connector (지그재그 곡선 연결선)
// ──────────────────────────────────────────────
function PathConnector({ fromOffset, toOffset, completed }: { fromOffset: number; toOffset: number; completed: boolean }) {
  const H = 68
  const CX = 100
  const x1 = CX + fromOffset
  const x2 = CX + toOffset

  return (
    <div style={{ height: H, position: 'relative', width: '100%' }}>
      <svg
        width="200" height={H}
        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}
      >
        <path
          d={`M ${x1} 0 C ${x1} ${H * 0.55} ${x2} ${H * 0.45} ${x2} ${H}`}
          stroke={completed ? 'rgba(232,197,71,0.55)' : 'rgba(255,255,255,0.30)'}
          strokeWidth="5"
          fill="none"
          strokeDasharray="10,8"
          strokeLinecap="round"
        />
        {/* 완료된 구간엔 작은 별 파티클 */}
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

// ──────────────────────────────────────────────
// Unit Node (with label)
// ──────────────────────────────────────────────
function UnitNode({ unit, status }: { unit: Unit; status: NodeStatus }) {
  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 rounded-full text-xs font-extrabold"
          style={{ background: 'rgba(255,255,255,0.90)', color: '#5A4FA0' }}>
          다시 가르치기
        </div>
        <Link href={`/student/teach/${unit.id}`} className="block transition-transform hover:scale-105 active:scale-95">
          <CompletedNode />
        </Link>
        <p className="font-bold text-sm text-center max-w-[120px]" style={{ color: 'rgba(255,255,255,0.90)' }}>
          {unit.title}
        </p>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className="flex flex-col items-center gap-2 relative">
        <div className="px-4 py-1.5 rounded-full text-xs font-extrabold"
          style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 3px 12px rgba(232,197,71,0.55)' }}>
          시작!
        </div>
        <div className="relative">
          <Link href={`/student/teach/${unit.id}`} className="block transition-transform hover:scale-105 active:scale-95">
            <CurrentNode />
          </Link>
          {/* 무니 (현재 단원 옆) */}
          <div className="absolute pointer-events-none" style={{ right: -100, top: '50%', transform: 'translateY(-50%)' }}>
            <Image src="/mooni/curious.png" alt="무니" width={110} height={73} />
          </div>
        </div>
        <p className="font-extrabold text-sm text-center max-w-[120px]" style={{ color: 'white' }}>
          {unit.title}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <LockedNode />
      <p className="text-xs text-center max-w-[100px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
        {unit.title}
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────
// Center Content (지그재그 퀘스트맵)
// ──────────────────────────────────────────────
// 노드 X 오프셋: 좌(-65px) → 중(0) → 우(+65px) 반복
const ZIGZAG_OFFSETS = [-65, 0, 65, 0, -65, 0]

function CenterContent({
  activeUnits,
  completedUnitIds,
  hasEnrollment,
}: {
  activeUnits: Unit[]
  completedUnitIds: string[]
  hasEnrollment: boolean
}) {
  const firstNonCompleted = activeUnits.find(u => !completedUnitIds.includes(u.id))
  const completedCount = activeUnits.filter(u => completedUnitIds.includes(u.id)).length
  const totalCount = activeUnits.length

  function getStatus(unit: Unit): NodeStatus {
    if (completedUnitIds.includes(unit.id)) return 'completed'
    if (unit.id === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <div className="flex-1 h-full overflow-y-auto relative" style={{ background: 'transparent', zIndex: 1 }}>

      {!hasEnrollment ? (
        <div className="flex items-center justify-center min-h-full px-6">
          <div className="p-8 text-center" style={{ ...clayCard, maxWidth: 360, width: '100%' }}>
            <div style={{ position: 'relative', width: 180, height: 120, margin: '0 auto 16px' }}>
              <Image src="/mooni/face-curious.png" alt="무니" fill className="object-contain" />
            </div>
            <p className="font-extrabold text-lg mb-2" style={{ color: '#2D2F2F' }}>안녕! 나는 무니야 🌙</p>
            <p className="text-sm mb-1 font-medium" style={{ color: '#2D2F2F' }}>달에서 왔는데 지구 공부를 배우고 싶어!</p>
            <p className="text-sm mb-5" style={{ color: '#9EA0B4' }}>선생님께 받은 초대 코드로 반에 참여하면<br />오늘의 학습이 나타나요</p>
            <Link href="/student/join"
              className="inline-flex items-center gap-2 font-extrabold text-sm"
              style={{ background: '#E8C547', borderRadius: '9999px', padding: '12px 24px', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}>
              <DoorOpen size={18} weight="fill" />
              반 참여하기
            </Link>
          </div>
        </div>
      ) : activeUnits.length === 0 ? (
        <div className="flex items-center justify-center min-h-full px-6">
          <div className="p-8 text-center" style={{ ...clayCard, maxWidth: 360, width: '100%' }}>
            <div style={{ width: 150, height: 100, position: 'relative', margin: '0 auto 16px' }}>
              <Image src="/mooni/face-thinking.png" alt="무니" fill className="object-contain" />
            </div>
            <p className="font-extrabold text-lg mb-2" style={{ color: '#2D2F2F' }}>무니가 기다리고 있어요 😴</p>
            <p className="text-sm" style={{ color: '#9EA0B4' }}>선생님이 오늘 배울 단원을 만들면<br />여기에 나타나요!</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── 섹션 헤더 ── */}
          <div className="mx-5 mt-5 mb-1">
            <div
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
              style={{ background: 'rgba(148,135,208,0.50)', backdropFilter: 'blur(12px)' }}
            >
              <div>
                <p className="font-extrabold text-sm" style={{ color: 'white' }}>섹션 1 · 오늘의 학습</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  {completedCount > 0 ? `${completedCount}/${totalCount} 단원 완료` : `${totalCount}개 단원이 기다리고 있어요`}
                </p>
              </div>
              {/* 진행도 바 */}
              <div className="flex flex-col items-end gap-1">
                <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                </p>
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.22)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, #E8C547, #FFF176)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── 지그재그 퀘스트맵 ── */}
          <div className="flex flex-col items-center py-10 pb-96">
            {activeUnits.map((unit, i) => {
              const status = getStatus(unit)
              const offset = ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length]
              const nextOffset = ZIGZAG_OFFSETS[(i + 1) % ZIGZAG_OFFSETS.length]
              const isCompleted = status === 'completed'
              const nextIsCompleted = i + 1 < activeUnits.length && completedUnitIds.includes(activeUnits[i + 1].id)

              return (
                <div key={unit.id} className="flex flex-col items-center w-full">
                  {/* 노드 (x 오프셋 적용) */}
                  <div style={{ transform: `translateX(${offset}px)` }}>
                    <UnitNode unit={unit} status={status} />
                  </div>

                  {/* 연결선 */}
                  {i < activeUnits.length - 1 && (
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
        </>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Right Sidebar
// ──────────────────────────────────────────────
function RightSidebar({
  profile,
  className: cls,
  hasEnrollment,
  recentSessions,
  quests,
  questCompletions,
}: {
  profile: Profile
  className: string | null
  hasEnrollment: boolean
  recentSessions: RecentSession[]
  quests: Quest[]
  questCompletions: QuestCompletion[]
}) {
  const streak = recentSessions.length
  const avgScore =
    recentSessions.length > 0
      ? Math.round(
          recentSessions
            .filter(s => s.understanding_score !== null)
            .reduce((acc, s) => acc + (s.understanding_score ?? 0), 0) /
            Math.max(recentSessions.filter(s => s.understanding_score !== null).length, 1)
        )
      : null

  return (
    <aside
      className="hidden md:flex flex-col h-full overflow-y-auto"
      style={{
        width: 280,
        flexShrink: 0,
        background: '#FFFFFF',
        borderLeft: '1px solid rgba(200,188,245,0.40)',
      }}
    >
      <div className="px-5 pt-6 pb-4 space-y-4">

        {/* 학생 인사 카드 */}
        <div className="p-4 flex items-center gap-3" style={clayCard}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-extrabold text-base"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}>
            {profile.name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm truncate" style={{ color: '#2D1F6E' }}>
              {profile.name}
            </p>
            {hasEnrollment && cls ? (
              <p className="text-xs truncate mt-0.5" style={{ color: '#A8A5C0' }}>{cls}</p>
            ) : (
              <p className="text-xs mt-0.5" style={{ color: '#C0B8E0' }}>반 미참여</p>
            )}
          </div>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 학습 횟수 */}
          <div className="p-3.5 rounded-2xl text-center"
            style={{ background: 'rgba(255,150,0,0.08)', border: '1.5px solid rgba(255,150,0,0.18)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Fire size={14} weight="fill" style={{ color: '#FF9600' }} />
              <span className="text-xs font-semibold" style={{ color: '#FF9600' }}>학습 횟수</span>
            </div>
            <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>{streak}</p>
          </div>

          {/* 평균 점수 */}
          <div className="p-3.5 rounded-2xl text-center"
            style={{ background: 'rgba(232,197,71,0.10)', border: '1.5px solid rgba(232,197,71,0.25)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} weight="fill" style={{ color: '#C8A020' }} />
              <span className="text-xs font-semibold" style={{ color: '#C8A020' }}>평균 점수</span>
            </div>
            <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>
              {avgScore !== null ? avgScore : '–'}
            </p>
          </div>
        </div>

        {/* 퀘스트 */}
        <div className="p-4" style={clayCard}>
          <div className="flex items-center gap-2 mb-3">
            <CarrotIcon size={16} color="#FF8C42" />
            <p className="text-xs font-extrabold" style={{ color: '#2D1F6E' }}>퀘스트</p>
          </div>
          {quests.length === 0 ? (
            <p className="text-xs" style={{ color: '#C0C0D0' }}>선생님이 퀘스트를 만들면 여기에 나타나요</p>
          ) : (
            <div className="space-y-3">
              {quests.map(q => {
                const done = questCompletions.some(c => c.quest_id === q.id)
                return (
                  <div key={q.id} className="p-3 rounded-xl"
                    style={{ background: done ? 'rgba(76,175,80,0.08)' : 'rgba(170,155,230,0.08)', border: `1px solid ${done ? 'rgba(76,175,80,0.20)' : 'rgba(170,155,230,0.20)'}` }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2">
                        {done ? (
                          <CheckCircle size={14} weight="fill" style={{ color: '#4CAF50', marginTop: 1, flexShrink: 0 }} />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0" style={{ borderColor: '#A89ED0' }} />
                        )}
                        <p className="text-xs font-bold leading-snug" style={{ color: done ? '#4CAF50' : '#2D1F6E' }}>
                          {q.title}
                        </p>
                      </div>
                      {q.due_date && (
                        <span className="text-xs shrink-0" style={{ color: '#9EA0B4' }}>
                          ~{new Date(q.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(200,190,240,0.30)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: done ? '100%' : '0%', background: done ? '#4CAF50' : '#E8C547' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 지난 학습 */}
        {recentSessions.length > 0 && (
          <div>
            <p className="font-extrabold text-xs mb-2.5 uppercase tracking-wider px-1"
              style={{ color: 'rgba(90,79,160,0.50)' }}>지난 학습</p>
            <div className="overflow-hidden" style={clayCard}>
              {recentSessions.slice(0, 2).map((session, i) => (
                <Link
                  key={session.id}
                  href={session.reports?.[0]?.id ? `/student/report/${session.reports[0].id}` : `/student/progress`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-purple-50/30"
                  style={{ borderBottom: i < recentSessions.length - 1 ? '1px solid rgba(200,188,245,0.20)' : 'none' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 mr-2">
                    <MoonStarIcon size={16} color="#E8C547" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs truncate" style={{ color: '#2D1F6E' }}>
                        {getUnitTitle(session)}
                      </p>
                      {session.ended_at && (
                        <p className="text-xs" style={{ color: '#A8A5C0' }}>
                          {new Date(session.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <ScorePill score={session.understanding_score} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ──────────────────────────────────────────────
// Mobile Layout
// ──────────────────────────────────────────────
function MobileLayout({
  profile,
  activeUnits,
  recentSessions,
  hasEnrollment,
  completedUnitIds,
  quests,
  questCompletions,
}: {
  profile: Profile
  activeUnits: Unit[]
  recentSessions: RecentSession[]
  hasEnrollment: boolean
  completedUnitIds: string[]
  quests: Quest[]
  questCompletions: QuestCompletion[]
}) {
  const streak = recentSessions.length
  const avgScore =
    recentSessions.length > 0
      ? Math.round(
          recentSessions
            .filter(s => s.understanding_score !== null)
            .reduce((acc, s) => acc + (s.understanding_score ?? 0), 0) /
            Math.max(recentSessions.filter(s => s.understanding_score !== null).length, 1)
        )
      : null

  const firstNonCompleted = activeUnits.find(u => !completedUnitIds.includes(u.id))
  const completedCount = activeUnits.filter(u => completedUnitIds.includes(u.id)).length

  function getStatus(unit: Unit): NodeStatus {
    if (completedUnitIds.includes(unit.id)) return 'completed'
    if (unit.id === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <div className="min-h-screen pb-12"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      {/* 인사 헤더 */}
      <div className="px-5 pt-12 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'white' }}>
            안녕, {profile.name}! 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.70)' }}>
            오늘도 무니를 도와줄래요?
          </p>
        </div>
        <Link href="/student/profile">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-base shrink-0"
            style={{ background: 'rgba(255,255,255,0.88)', color: '#7A6CC0' }}>
            {profile.name[0]}
          </div>
        </Link>
      </div>

      <div className="px-5 space-y-4 max-w-lg mx-auto mt-4">

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 flex items-center gap-3" style={clayCard}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,150,0,0.12)' }}>
              <Fire size={22} weight="fill" style={{ color: '#FF9600' }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>{streak}</p>
              <p className="text-xs mt-0.5" style={{ color: '#A8A5C0' }}>학습 횟수</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3" style={clayCard}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(232,197,71,0.15)' }}>
              <ChartLineUp size={22} weight="fill" style={{ color: '#C8A020' }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D1F6E' }}>
                {avgScore !== null ? avgScore : '–'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#A8A5C0' }}>평균 점수</p>
            </div>
          </div>
        </div>

        {/* 오늘의 학습 */}
        <section>
          {/* 섹션 헤더 */}
          {activeUnits.length > 0 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="font-extrabold text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.75)' }}>
                오늘의 학습
              </p>
              {completedCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.85)', color: '#5A4FA0' }}>
                  {completedCount}/{activeUnits.length} 완료
                </span>
              )}
            </div>
          )}

          {!hasEnrollment ? (
            <div className="p-6 text-center" style={clayCard}>
              <div style={{ position: 'relative', width: 160, height: 106, margin: '0 auto 12px' }}>
                <Image src="/mooni/face-curious.png" alt="무니" fill className="object-contain" />
              </div>
              <p className="font-extrabold" style={{ color: '#2D1F6E' }}>안녕! 나는 무니야 🌙</p>
              <p className="text-sm mt-1 font-medium" style={{ color: '#4A4A6A' }}>달에서 왔는데 지구 공부를 배우고 싶어!</p>
              <p className="text-sm mt-1 mb-4" style={{ color: '#9EA0B4' }}>
                선생님께 받은 초대 코드로 반에 참여하면<br />오늘의 학습이 나타나요
              </p>
              <Link href="/student/join"
                className="inline-flex items-center gap-2 font-extrabold text-sm"
                style={{ background: '#E8C547', borderRadius: '9999px', padding: '12px 24px', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}>
                <DoorOpen size={18} weight="fill" />
                반 참여하기
              </Link>
            </div>
          ) : activeUnits.length === 0 ? (
            <div className="p-6 text-center" style={clayCard}>
              <div style={{ width: 140, height: 92, position: 'relative', margin: '0 auto 12px' }}>
                <Image src="/mooni/face-thinking.png" alt="무니" fill className="object-contain" />
              </div>
              <p className="font-extrabold" style={{ color: '#2D1F6E' }}>무니가 기다리고 있어요 😴</p>
              <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>선생님이 오늘 배울 단원을 만들면<br />여기에 나타나요!</p>
            </div>
          ) : (
            /* 모바일 단원 카드 리스트 */
            <div className="space-y-2.5">
              {activeUnits.map((unit) => {
                const status = getStatus(unit)
                const isCompleted = status === 'completed'
                const isCurrent = status === 'current'
                const isLocked = status === 'locked'

                if (isCurrent) {
                  return (
                    <Link key={unit.id} href={`/student/teach/${unit.id}`}
                      className="block transition-transform active:scale-98"
                      style={{ borderRadius: 20 }}>
                      <div className="p-4 flex items-center gap-4"
                        style={{ ...clayCard, border: '2px solid rgba(232,197,71,0.50)', background: 'rgba(255,255,255,0.97)' }}>
                        <div className="shrink-0">
                          <CurrentNode />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block"
                            style={{ background: '#E8C547', color: '#1A1830' }}>지금 학습!</span>
                          <p className="font-extrabold text-sm" style={{ color: '#2D1F6E' }}>{unit.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>무니가 기다리고 있어요</p>
                        </div>
                        <Image src="/mooni/curious.png" alt="무니" width={60} height={40} className="shrink-0" />
                      </div>
                    </Link>
                  )
                }

                if (isCompleted) {
                  return (
                    <Link key={unit.id} href={`/student/teach/${unit.id}`}
                      className="block"
                      style={{ borderRadius: 20 }}>
                      <div className="px-5 py-3.5 flex items-center justify-between"
                        style={{ ...clayCard, border: '1.5px solid rgba(232,197,71,0.30)' }}>
                        <div className="flex items-center gap-3">
                          <CheckCircle size={22} weight="fill" style={{ color: '#E8C547', flexShrink: 0 }} />
                          <div>
                            <p className="font-bold text-sm" style={{ color: '#2D1F6E' }}>{unit.title}</p>
                            <p className="text-xs" style={{ color: '#A8A5C0' }}>다시 가르치기</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(232,197,71,0.15)', color: '#B8920A' }}>완료</span>
                      </div>
                    </Link>
                  )
                }

                // locked
                return (
                  <div key={unit.id} className="px-5 py-3.5 flex items-center gap-3"
                    style={{ ...clayCard, opacity: 0.55 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(200,190,240,0.30)' }}>
                      <span className="text-sm">🔒</span>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#6B6B8D' }}>{unit.title}</p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 퀘스트 */}
        {quests.length > 0 && (
          <section>
            <p className="font-extrabold text-xs mb-3 px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.70)' }}>
              퀘스트
            </p>
            <div className="p-4" style={clayCard}>
              <div className="space-y-3">
                {quests.map(q => {
                  const done = questCompletions.some(c => c.quest_id === q.id)
                  return (
                    <div key={q.id} className="p-3 rounded-xl"
                      style={{ background: done ? 'rgba(76,175,80,0.08)' : 'rgba(170,155,230,0.08)', border: `1px solid ${done ? 'rgba(76,175,80,0.20)' : 'rgba(170,155,230,0.20)'}` }}>
                      <div className="flex items-start gap-2 mb-2">
                        {done ? (
                          <CheckCircle size={14} weight="fill" style={{ color: '#4CAF50', marginTop: 1, flexShrink: 0 }} />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0" style={{ borderColor: '#A89ED0' }} />
                        )}
                        <p className="text-sm font-bold leading-snug" style={{ color: done ? '#4CAF50' : '#2D1F6E' }}>{q.title}</p>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(200,190,240,0.30)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: done ? '100%' : '0%', background: done ? '#4CAF50' : '#E8C547' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* 지난 학습 */}
        {recentSessions.length > 0 && (
          <section>
            <p className="font-extrabold text-xs mb-3 px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.70)' }}>
              지난 학습
            </p>
            <div className="overflow-hidden divide-y" style={{ ...clayCard, borderColor: 'rgba(200,188,245,0.20)' }}>
              {recentSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <MoonStarIcon size={18} color="#E8C547" />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2D1F6E' }}>{getUnitTitle(session)}</p>
                      {session.ended_at && (
                        <p className="text-xs" style={{ color: '#A8A5C0' }}>
                          {new Date(session.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <ScorePill score={session.understanding_score} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Main Export
// ──────────────────────────────────────────────
export default function StudentHome({
  profile,
  activeUnits,
  recentSessions,
  hasEnrollment,
  completedUnitIds,
  className,
  quests,
  questCompletions,
}: Props) {
  return (
    <>
      {/* 태블릿/데스크탑: 3컬럼 */}
      <div
        className="hidden md:flex flex-row h-screen overflow-hidden relative"
        style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}
      >
        {/* ── 달+구름 배경 (중앙 영역) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 220,
            right: 280,
            bottom: 0,
            height: '95%',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <MoonWithClouds className="w-full h-full" />
        </div>

        {/* 무니 캐릭터 + 말풍선 */}
        <div
          className="absolute pointer-events-none mooni-float"
          style={{ left: 220, bottom: '26%', zIndex: 2 }}
        >
          <div style={{ position: 'absolute', bottom: '100%', left: 60, marginBottom: 8 }}>
            <MooniSpeechBubble />
          </div>
          <Image src="/mooni/happy.png" alt="무니" width={480} height={480} />
        </div>

        {/* 별 파티클 — 사각 */}
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

        {/* 별 파티클 — 동그란 빤짝이 */}
        {[
          { top: '10%', left: '28%', size: 5,  delay: 0.0, dur: 2.2 },
          { top: '18%', left: '55%', size: 4,  delay: 0.7, dur: 2.8 },
          { top: '6%',  left: '70%', size: 6,  delay: 1.3, dur: 2.0 },
          { top: '28%', left: '38%', size: 3,  delay: 0.4, dur: 3.1 },
          { top: '35%', left: '62%', size: 5,  delay: 1.9, dur: 2.5 },
          { top: '14%', left: '48%', size: 4,  delay: 0.9, dur: 2.3 },
          { top: '22%', left: '72%', size: 3,  delay: 1.5, dur: 3.4 },
          { top: '40%', left: '30%', size: 5,  delay: 0.2, dur: 2.7 },
          { top: '8%',  left: '58%', size: 3,  delay: 2.1, dur: 2.1 },
          { top: '32%', left: '50%', size: 4,  delay: 0.6, dur: 3.0 },
          { top: '45%', left: '65%', size: 5,  delay: 1.1, dur: 2.6 },
          { top: '2%',  left: '42%', size: 6,  delay: 1.7, dur: 2.4 },
        ].map((s, i) => (
          <div key={`dot-${i}`} className="star-bg"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, zIndex: 0 } as React.CSSProperties}
          />
        ))}

        {/* ── 콘텐츠 레이어 ── */}
        <LeftNav profile={profile} className={className} />
        <CenterContent
          activeUnits={activeUnits}
          completedUnitIds={completedUnitIds}
          hasEnrollment={hasEnrollment}
        />
        <RightSidebar
          profile={profile}
          className={className}
          hasEnrollment={hasEnrollment}
          recentSessions={recentSessions}
          quests={quests}
          questCompletions={questCompletions}
        />
      </div>

      {/* 모바일: 단일 컬럼 */}
      <div className="md:hidden">
        <MobileLayout
          profile={profile}
          activeUnits={activeUnits}
          recentSessions={recentSessions}
          hasEnrollment={hasEnrollment}
          completedUnitIds={completedUnitIds}
          quests={quests}
          questCompletions={questCompletions}
        />
      </div>
    </>
  )
}
