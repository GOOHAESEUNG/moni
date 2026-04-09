'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  House, Trophy, User,
  Users, ArrowRight, BookOpen, CheckCircle,
} from '@phosphor-icons/react'
import { FullMoonNode, CrescentMoonNode, StarBurstNode, CarrotIcon, RabbitPawIcon, MoonStarIcon } from '@/components/icons'
import { MoonSurfaceBg } from '@/components/icons/MoonSurface'

// ─── Mock 데이터 ───────────────────────────────
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

// ─── 유틸 ──────────────────────────────────────
const clayCard = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

type NodeStatus = 'completed' | 'current' | 'locked'

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#FF9600'
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${color}20`, color }}>
      {score}점
    </span>
  )
}

// ─── Left Nav ──────────────────────────────────
function LeftNav() {
  return (
    <nav
      className="hidden md:flex flex-col h-full"
      style={{ width: 220, flexShrink: 0, background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}
    >
      <div className="px-5 pt-6 pb-4">
        <p className="font-extrabold text-base" style={{ color: '#2D2F2F' }}>🌙 무니에게 알려줘</p>
        <span
          className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}
        >
          체험 모드
        </span>
      </div>
      <div style={{ height: 1, background: '#F0F0F0' }} />

      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{ background: 'rgba(232,197,71,0.12)', color: '#1A1830', borderLeft: '3px solid #E8C547' }}
        >
          <House size={20} weight="fill" />
          <span className="font-bold text-sm">학습</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-not-allowed" style={{ color: '#9EA0B4' }}>
          <Trophy size={20} weight="regular" />
          <span className="font-semibold text-sm">리더보드</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#9EA0B4' }}>
            준비중
          </span>
        </div>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ color: '#9EA0B4' }}>
          <User size={20} weight="regular" />
          <span className="font-semibold text-sm">프로필</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #F0F0F0' }} className="px-5 py-4">
        <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>{DEMO_PROFILE.name}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{DEMO_CLASS}</p>
      </div>
    </nav>
  )
}

// ─── Unit Node ─────────────────────────────────
function UnitNode({ unit, status }: { unit: typeof DEMO_UNITS[0]; status: NodeStatus }) {
  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 rounded-full text-xs font-extrabold mb-1"
          style={{ background: 'rgba(232,197,71,0.20)', color: '#C8A020' }}>
          다시 가르치기
        </div>
        <Link href="/demo/student/teach">
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8C547',
            boxShadow: '0 4px 0 #C8A020', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', opacity: 0.85 }}>
            <CheckCircle size={36} weight="fill" color="#1A1830" />
          </div>
        </Link>
        <p className="font-bold text-sm text-center" style={{ color: '#2D2F2F' }}>{unit.title}</p>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 rounded-full text-xs font-extrabold mb-1" style={{ background: '#E8C547', color: '#1A1830' }}>
          시작!
        </div>
        <div className="relative">
          <Link href="/demo/student/teach" className="block cursor-pointer">
            <StarBurstNode size={80} />
          </Link>
          <div className="absolute" style={{ right: -88, top: '50%', transform: 'translateY(-50%)' }}>
            <Image src="/mooni/curious.png" alt="무니" width={120} height={80} />
          </div>
        </div>
        <p className="font-bold text-sm text-center" style={{ color: '#2D2F2F' }}>{unit.title}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <CrescentMoonNode size={72} />
      <p className="text-xs text-center" style={{ color: '#9EA0B4' }}>{unit.title}</p>
    </div>
  )
}

// ─── Center ────────────────────────────────────
function CenterContent() {
  const firstNonCompleted = DEMO_UNITS.find(u => !DEMO_COMPLETED.includes(u.id))

  function getStatus(unit: typeof DEMO_UNITS[0]): NodeStatus {
    if (DEMO_COMPLETED.includes(unit.id)) return 'completed'
    if (unit.id === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <div className="flex-1 overflow-y-auto relative" style={{ background: '#F7F7F7' }}>
      <MoonSurfaceBg />
      <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3" style={{ background: '#E8C547' }}>
        <span className="font-extrabold text-sm" style={{ color: '#1A1830' }}>섹션 1</span>
        <span style={{ color: 'rgba(26,24,48,0.40)' }}>|</span>
        <span className="font-bold text-sm" style={{ color: '#1A1830' }}>오늘의 학습</span>
      </div>

      <div className="flex flex-col items-center py-10 gap-0" style={{ position: 'relative', zIndex: 1 }}>
        {DEMO_UNITS.map((unit, i) => (
          <div key={unit.id} className="flex flex-col items-center">
            <UnitNode unit={unit} status={getStatus(unit)} />
            {i < DEMO_UNITS.length - 1 && (
              <div style={{ width: 4, height: 48, background: '#E8E8E8', margin: '8px auto', borderRadius: 2 }} />
            )}
          </div>
        ))}
      </div>

      {/* 모바일 시작 버튼 */}
      <div className="md:hidden px-6 pb-8">
        <Link
          href="/demo/student/teach"
          className="flex items-center justify-center gap-2 w-full font-extrabold text-sm rounded-full py-4"
          style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
        >
          <BookOpen size={18} weight="fill" />
          도형의 넓이 — 무니에게 알려줘
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  )
}

// ─── Right Sidebar ─────────────────────────────
function RightSidebar() {
  const questDone = DEMO_COMPLETED.length > 0
  const avgScore = 82

  return (
    <aside
      className="hidden md:flex flex-col gap-4 overflow-y-auto p-4"
      style={{ width: 280, flexShrink: 0, background: '#FFFFFF', borderLeft: '1px solid #F0F0F0' }}
    >
      {/* 반 정보 */}
      <div className="p-4" style={clayCard}>
        <div className="flex items-center gap-2 mb-1">
          <Users size={16} weight="fill" style={{ color: '#E8C547' }} />
          <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>나의 반</p>
        </div>
        <p className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>{DEMO_CLASS}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{DEMO_PROFILE.name}</p>
      </div>

      {/* 오늘의 퀘스트 */}
      <div className="p-4" style={clayCard}>
        <div className="flex items-center gap-2 mb-3">
          <CarrotIcon size={16} color="#FF8C42" />
          <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>오늘의 퀘스트</p>
        </div>
        <p className="text-sm font-bold mb-2" style={{ color: '#2D2F2F' }}>무니에게 한 번 가르쳐주기</p>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F7F7F7' }}>
          <div
            className="h-full rounded-full"
            style={{ width: questDone ? '100%' : '0%', background: '#E8C547', transition: 'width 0.5s ease' }}
          />
        </div>
        <p className="text-xs mt-1.5 text-right" style={{ color: '#9EA0B4' }}>
          {questDone ? '1/1 완료 ✓' : '0/1'}
        </p>
      </div>

      {/* 학습 통계 */}
      <div className="p-4" style={clayCard}>
        <p className="text-xs font-bold mb-3" style={{ color: '#9EA0B4' }}>학습 통계</p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <RabbitPawIcon size={20} color="#FF9600" />
            <div>
              <p className="text-xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>1</p>
              <p className="text-xs" style={{ color: '#9EA0B4' }}>학습 횟수</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MoonStarIcon size={20} color="#E8C547" />
            <div>
              <p className="text-xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>{avgScore}</p>
              <p className="text-xs" style={{ color: '#9EA0B4' }}>평균 점수</p>
            </div>
          </div>
        </div>
      </div>

      {/* 지난 학습 */}
      <div style={clayCard}>
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>지난 학습</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#F7F7F7' }}>
          {DEMO_SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <MoonStarIcon size={14} color="#E8C547" />
                <div>
                  <p className="font-semibold text-xs" style={{ color: '#2D2F2F' }}>{s.unitTitle}</p>
                  <p className="text-xs" style={{ color: '#9EA0B4' }}>
                    {new Date(s.ended_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <ScorePill score={s.understanding_score} />
            </div>
          ))}
        </div>
      </div>

      {/* 회원가입 CTA */}
      <div
        className="p-4 rounded-3xl"
        style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.25)' }}
      >
        <p className="font-extrabold text-sm mb-1" style={{ color: '#2D2F2F' }}>무니가 기다리고 있어요! 🌙</p>
        <p className="text-xs mb-3" style={{ color: '#9EA0B4' }}>
          회원가입하면 내 반에서 진짜 학습을 시작할 수 있어요
        </p>
        <Link
          href="/signup"
          className="flex items-center justify-center gap-1.5 w-full font-extrabold text-xs rounded-full py-3"
          style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 3px 0 #C8A020' }}
        >
          시작하기 <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </aside>
  )
}

// ─── Page ──────────────────────────────────────
export default function DemoStudentPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" style={{ background: '#F7F7F7' }}>
      {/* 모바일 헤더 */}
      <header className="md:hidden flex items-center justify-between px-4 py-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        <p className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>🌙 무니에게 알려줘</p>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}>
          체험 모드
        </span>
      </header>

      <LeftNav />
      <CenterContent />
      <RightSidebar />
    </div>
  )
}
