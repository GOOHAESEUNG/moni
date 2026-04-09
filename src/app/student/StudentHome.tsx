'use client'

import Link from 'next/link'
import Image from 'next/image'
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
} from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Unit, Quest, QuestCompletion } from '@/types/database'
import { FullMoonNode, CrescentMoonNode, StarBurstNode, CarrotIcon, RabbitPawIcon, MoonStarIcon } from '@/components/icons'
import { MoonSurfaceBg } from '@/components/icons/MoonSurface'

interface RecentSession {
  id: string
  unit_id: string
  understanding_score: number | null
  ended_at: string | null
  units: { title: string } | { title: string }[] | null
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

const clayCard = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(130,110,200,0.22), 0 2px 8px rgba(100,85,170,0.10)',
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
        background: 'rgba(255,255,255,0.88)',
        borderRight: '1px solid rgba(180,160,220,0.35)',
      }}
    >
      {/* 로고 */}
      <div className="px-5 pt-6 pb-4">
        <p className="font-extrabold text-base" style={{ color: '#5A4FA0' }}>
          🌙 무니에게 알려줘
        </p>
      </div>
      <div style={{ height: 1, background: '#F0F0F0' }} />

      {/* 네비 아이템 */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        {/* 학습 — active */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{
            background: 'rgba(232,197,71,0.12)',
            color: '#1A1830',
            borderLeft: '3px solid #E8C547',
          }}
        >
          <House size={20} weight="fill" />
          <span className="font-bold text-sm">학습</span>
        </div>

        {/* 리더보드 — disabled */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-not-allowed"
          style={{ color: '#9EA0B4' }}
        >
          <Trophy size={20} weight="regular" />
          <span className="font-semibold text-sm">리더보드</span>
          <span
            className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#F0F0F0', color: '#9EA0B4' }}
          >
            준비중
          </span>
        </div>

        {/* 프로필 */}
        <Link
          href="/student/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/[0.04]"
          style={{ color: '#9EA0B4' }}
        >
          <User size={20} weight="regular" />
          <span className="font-semibold text-sm">프로필</span>
        </Link>

        {/* 로그아웃 */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/[0.04] text-left w-full"
          style={{ color: '#9EA0B4' }}
        >
          <SignOut size={20} weight="regular" />
          <span className="font-semibold text-sm">로그아웃</span>
        </button>
      </div>

      {/* 하단 프로필 */}
      <div style={{ borderTop: '1px solid #F0F0F0' }} className="px-5 py-4">
        <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>{profile.name}</p>
        {cls && (
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{cls}</p>
        )}
      </div>
    </nav>
  )
}

// ──────────────────────────────────────────────
// Unit Path Node
// ──────────────────────────────────────────────
type NodeStatus = 'completed' | 'current' | 'locked'

function UnitNode({ unit, status }: { unit: Unit; status: NodeStatus }) {
  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 rounded-full text-xs font-extrabold mb-1"
          style={{ background: 'rgba(232,197,71,0.20)', color: '#C8A020' }}>
          다시 가르치기
        </div>
        <Link href={`/student/teach/${unit.id}`}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8C547',
            boxShadow: '0 4px 0 #C8A020', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', opacity: 0.85 }}>
            <CheckCircle size={36} weight="fill" color="#1A1830" />
          </div>
        </Link>
        <p className="font-bold text-sm text-center" style={{ color: '#2D2F2F' }}>
          {unit.title}
        </p>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className="flex flex-col items-center gap-2 relative">
        {/* 시작 레이블 */}
        <div
          className="px-3 py-1 rounded-full text-xs font-extrabold mb-1"
          style={{ background: '#E8C547', color: '#1A1830' }}
        >
          시작!
        </div>
        <div className="relative">
          <Link href={`/student/teach/${unit.id}`} className="current-node block cursor-pointer">
            <StarBurstNode size={80} />
          </Link>
          {/* 무니 캐릭터 */}
          <div
            className="absolute"
            style={{ right: -88, top: '50%', transform: 'translateY(-50%)' }}
          >
            <Image src="/mooni/curious.png" alt="무니" width={120} height={80} />
          </div>
        </div>
        <p className="font-bold text-sm text-center" style={{ color: '#2D2F2F' }}>
          {unit.title}
        </p>
      </div>
    )
  }

  // locked
  return (
    <div className="flex flex-col items-center gap-2">
      <CrescentMoonNode size={72} />
      <p className="text-xs text-center" style={{ color: '#9EA0B4' }}>
        {unit.title}
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────
// Center (Unit Map)
// ──────────────────────────────────────────────
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

  function getStatus(unit: Unit): NodeStatus {
    if (completedUnitIds.includes(unit.id)) return 'completed'
    if (unit.id === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    // 투명 배경 — 외부 wrapper의 그라디언트+달+구름이 비침
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
              <Link href="/student/join" className="inline-flex items-center gap-2 font-extrabold text-sm"
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
            {/* 헤더 바 */}
            <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3"
              style={{ background: 'linear-gradient(90deg, #8B7EC8, #9A8DD0)' }}>
              <span className="font-extrabold text-sm" style={{ color: 'white' }}>섹션 1</span>
              <span style={{ color: 'rgba(255,255,255,0.50)' }}>|</span>
              <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>오늘의 학습</span>
            </div>

            {/* Unit 노드 목록 */}
            <div className="flex flex-col items-center py-10 gap-0 pb-96">
              {activeUnits.map((unit, i) => {
                const status = getStatus(unit)
                return (
                  <div key={unit.id} className="flex flex-col items-center">
                    <UnitNode unit={unit} status={status} />
                    {i < activeUnits.length - 1 && (
                      <div style={{ width: 4, height: 48, background: 'rgba(255,255,255,0.30)', margin: '8px auto', borderRadius: 2 }} />
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
        background: 'rgba(255,255,255,0.88)',
        borderLeft: '1px solid rgba(180,160,220,0.35)',
      }}
    >
      <div className="px-5 pt-6 pb-4 space-y-4">
        {/* 반 정보 카드 */}
        <div
          className="flex items-center gap-3 p-4"
          style={clayCard}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(232,197,71,0.15)' }}
          >
            <Users size={20} weight="fill" style={{ color: '#E8C547' }} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: '#2D2F2F' }}>
              {profile.name}
            </p>
            {hasEnrollment && cls && (
              <p className="text-xs truncate" style={{ color: '#9EA0B4' }}>{cls}</p>
            )}
            {!hasEnrollment && (
              <p className="text-xs" style={{ color: '#9EA0B4' }}>반 미참여</p>
            )}
          </div>
        </div>

        {/* 오늘의 퀘스트 */}
        <div className="p-4" style={clayCard}>
          <div className="flex items-center gap-2 mb-3">
            <CarrotIcon size={16} color="#FF8C42" />
            <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>퀘스트</p>
          </div>
          {quests.length === 0 ? (
            <p className="text-xs" style={{ color: '#C0C0D0' }}>선생님이 퀘스트를 만들면 여기에 나타나요</p>
          ) : (
            <div className="space-y-3">
              {quests.map(q => {
                const done = questCompletions.some(c => c.quest_id === q.id)
                return (
                  <div key={q.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold" style={{ color: done ? '#4CAF50' : '#2D2F2F' }}>
                        {done ? '✓ ' : ''}{q.title}
                      </p>
                      {q.due_date && (
                        <span className="text-xs" style={{ color: '#9EA0B4' }}>
                          ~{new Date(q.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    {q.description && (
                      <p className="text-xs mb-1.5" style={{ color: '#9EA0B4' }}>{q.description}</p>
                    )}
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F7F7F7' }}>
                      <div className="h-full rounded-full" style={{ width: done ? '100%' : '0%', background: done ? '#4CAF50' : '#E8C547', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 학습 통계 */}
        <div className="p-4 space-y-3" style={clayCard}>
          <p className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>학습 통계</p>
          <div className="flex items-center gap-2">
            <RabbitPawIcon size={20} color="#FF9600" />
            <span className="text-sm" style={{ color: '#6B6C7E' }}>학습 횟수</span>
            <span className="ml-auto font-extrabold text-sm" style={{ color: '#2D2F2F' }}>
              {streak}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MoonStarIcon size={20} color="#E8C547" />
            <span className="text-sm" style={{ color: '#6B6C7E' }}>평균 점수</span>
            <span className="ml-auto font-extrabold text-sm" style={{ color: '#2D2F2F' }}>
              {avgScore !== null ? `${avgScore}점` : '-'}
            </span>
          </div>
        </div>

        {/* 지난 학습 */}
        {recentSessions.length > 0 && (
          <div>
            <p className="font-bold text-xs mb-2 uppercase tracking-wider px-1" style={{ color: '#9EA0B4' }}>
              지난 학습
            </p>
            <div className="overflow-hidden" style={{ ...clayCard, borderColor: '#F7F7F7' }}>
              {recentSessions.slice(0, 2).map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid #F7F7F7' }}
                >
                  <div className="min-w-0 mr-2">
                    <p className="font-semibold text-xs truncate" style={{ color: '#2D2F2F' }}>
                      {getUnitTitle(session)}
                    </p>
                    {session.ended_at && (
                      <p className="text-xs" style={{ color: '#9EA0B4' }}>
                        {new Date(session.ended_at).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  <ScorePill score={session.understanding_score} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ──────────────────────────────────────────────
// Mobile Layout (단일 컬럼 — 기존 유지)
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

  function getStatus(unit: Unit): NodeStatus {
    if (completedUnitIds.includes(unit.id)) return 'completed'
    if (unit.id === firstNonCompleted?.id) return 'current'
    return 'locked'
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(160deg, #7A6CC0 0%, #9485CF 25%, #B4A8DC 55%, #D4CEF0 100%)' }}>
      {/* 인사말 헤더 */}
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-extrabold" style={{ color: 'white' }}>
          안녕, {profile.name}!
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          오늘도 무니를 도와줄래요?
        </p>
      </div>

      <div className="px-5 space-y-5 max-w-lg mx-auto mt-4">
        {/* 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4" style={clayCard}>
            <RabbitPawIcon size={28} color="#FF9600" />
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>{streak}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학습 횟수</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4" style={clayCard}>
            <MoonStarIcon size={28} color="#E8C547" />
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>
                {avgScore !== null ? avgScore : '-'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>평균 점수</p>
            </div>
          </div>
        </div>

        {/* 오늘의 학습 */}
        <section>
          <h2 className="font-bold text-xs mb-3 px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
            오늘의 학습
          </h2>

          {!hasEnrollment ? (
            <div className="p-6 text-center" style={clayCard}>
              <div style={{ position: 'relative', width: 160, height: 106, margin: '0 auto 12px' }}>
                <Image src="/mooni/face-curious.png" alt="무니" fill className="object-contain" />
              </div>
              <p className="font-extrabold" style={{ color: '#2D2F2F' }}>안녕! 나는 무니야 🌙</p>
              <p className="text-sm mt-1 font-medium" style={{ color: '#2D2F2F' }}>달에서 왔는데 지구 공부를 배우고 싶어!</p>
              <p className="text-sm mt-1 mb-4" style={{ color: '#9EA0B4' }}>
                선생님께 받은 초대 코드로 반에 참여하면<br />오늘의 학습이 나타나요
              </p>
              <Link
                href="/student/join"
                className="inline-flex items-center gap-2 font-extrabold text-sm"
                style={{
                  background: '#E8C547',
                  borderRadius: '9999px',
                  padding: '12px 24px',
                  color: '#1A1830',
                  boxShadow: '0 4px 0 #C8A020',
                }}
              >
                <DoorOpen size={18} weight="fill" />
                반 참여하기
              </Link>
            </div>
          ) : activeUnits.length === 0 ? (
            <div className="p-6 text-center" style={clayCard}>
              <div style={{ width: 140, height: 92, position: 'relative', margin: '0 auto 12px' }}>
                <Image src="/mooni/face-thinking.png" alt="무니" fill className="object-contain" />
              </div>
              <p className="font-extrabold" style={{ color: '#2D2F2F' }}>무니가 기다리고 있어요 😴</p>
              <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>선생님이 오늘 배울 단원을 만들면<br />여기에 나타나요!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 gap-0">
              {activeUnits.map((unit, i) => {
                const status = getStatus(unit)
                return (
                  <div key={unit.id} className="flex flex-col items-center">
                    <UnitNode unit={unit} status={status} />
                    {i < activeUnits.length - 1 && (
                      <div style={{ width: 4, height: 40, background: '#E8E8E8', margin: '8px auto', borderRadius: 2 }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 퀘스트 (모바일) */}
        <section>
          <h2 className="font-bold text-xs mb-3 px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
            퀘스트
          </h2>
          <div className="p-4" style={clayCard}>
            <div className="flex items-center gap-2 mb-3">
              <CarrotIcon size={16} color="#FF8C42" />
              <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>퀘스트</p>
            </div>
            {quests.length === 0 ? (
              <p className="text-xs" style={{ color: '#C0C0D0' }}>선생님이 퀘스트를 만들면 여기에 나타나요</p>
            ) : (
              <div className="space-y-3">
                {quests.map(q => {
                  const done = questCompletions.some(c => c.quest_id === q.id)
                  return (
                    <div key={q.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold" style={{ color: done ? '#4CAF50' : '#2D2F2F' }}>
                          {done ? '✓ ' : ''}{q.title}
                        </p>
                        {q.due_date && (
                          <span className="text-xs" style={{ color: '#9EA0B4' }}>
                            ~{new Date(q.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      {q.description && (
                        <p className="text-xs mb-1.5" style={{ color: '#9EA0B4' }}>{q.description}</p>
                      )}
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F7F7F7' }}>
                        <div className="h-full rounded-full" style={{ width: done ? '100%' : '0%', background: done ? '#4CAF50' : '#E8C547', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* 지난 학습 */}
        {recentSessions.length > 0 && (
          <section>
            <h2 className="font-bold text-xs mb-3 px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
              지난 학습
            </h2>
            <div className="overflow-hidden divide-y" style={{ ...clayCard, borderColor: '#F7F7F7' }}>
              {recentSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <MoonStarIcon size={18} color="#E8C547" />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>{getUnitTitle(session)}</p>
                      {session.ended_at && (
                        <p className="text-xs" style={{ color: '#9EA0B4' }}>
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
      {/* 배경 + 3컬럼 래퍼 */}
      <div
        className="hidden md:flex flex-row h-screen overflow-hidden relative"
        style={{ background: 'linear-gradient(160deg, #7A6CC0 0%, #9485CF 25%, #B4A8DC 55%, #D4CEF0 100%)' }}
      >
        {/* ── 고정 배경 레이어 (스크롤 영향 없음) ── */}
        {/* 달 + 구름: 우측 하단에 고정 */}
        <MoonWithClouds
          className="absolute pointer-events-none"
          style={{ bottom: 0, right: 0, width: '65%', height: '60%', zIndex: 0 } as React.CSSProperties}
        />
        {/* 금색 별 파티클 */}
        {[
          { top: '8%',  left: '30%', size: 14, delay: 0.3, dur: 3.5 },
          { top: '5%',  left: '55%', size: 12, delay: 1.1, dur: 4.0 },
          { top: '15%', left: '75%', size: 16, delay: 0.5, dur: 3.2 },
          { top: '25%', left: '85%', size: 11, delay: 2.0, dur: 4.5 },
          { top: '12%', left: '40%', size: 13, delay: 0.8, dur: 3.8 },
          { top: '35%', left: '90%', size: 12, delay: 1.5, dur: 4.2 },
          { top: '3%',  left: '65%', size: 14, delay: 0.2, dur: 3.0 },
          { top: '20%', left: '48%', size: 11, delay: 1.8, dur: 4.8 },
        ].map((s, i) => (
          <div key={i} className="star-particle-slow absolute pointer-events-none"
            style={{ top: s.top, left: s.left, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, zIndex: 0 } as React.CSSProperties}>
            <svg width={s.size} height={s.size} viewBox="0 0 24 24">
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="rgba(232,197,71,0.85)" />
            </svg>
          </div>
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
