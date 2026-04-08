'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Star, Flame, DoorOpen } from '@phosphor-icons/react'
import MooniSprite from '@/components/mooni/MooniSprite'
import type { Profile, Unit } from '@/types/database'

interface RecentSession {
  id: string
  unit_id: string
  understanding_score: number | null
  ended_at: string | null
  units: { title: string } | { title: string }[] | null
}

interface Props {
  profile: Profile
  activeUnit: Unit | null
  recentSessions: RecentSession[]
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
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

export default function StudentHome({ profile, activeUnit, recentSessions }: Props) {
  const streak = recentSessions.length
  const avgScore = recentSessions.length > 0
    ? Math.round(
        recentSessions
          .filter((s) => s.understanding_score !== null)
          .reduce((acc, s) => acc + (s.understanding_score ?? 0), 0) /
          Math.max(recentSessions.filter((s) => s.understanding_score !== null).length, 1)
      )
    : null

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F7F7F7' }}>
      {/* 인사말 헤더 */}
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>
          안녕, {profile.name}!
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>
          오늘도 무니를 도와줄래요?
        </p>
      </div>

      {/* 무니 스프라이트 */}
      <div className="flex justify-center py-4">
        <MooniSprite size={220} />
      </div>

      <div className="px-5 space-y-5 max-w-lg mx-auto">
        {/* 스트릭 / 스코어 미니 카드 2개 가로 배치 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4" style={clayCard}>
            <Flame size={28} weight="fill" style={{ color: '#FF9600' }} />
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>{streak}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학습 횟수</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4" style={clayCard}>
            <Star size={28} weight="fill" style={{ color: '#E8C547' }} />
            <div>
              <p className="text-2xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>
                {avgScore !== null ? avgScore : '-'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>평균 점수</p>
            </div>
          </div>
        </div>

        {/* 오늘의 학습 섹션 */}
        <section>
          <h2
            className="font-bold text-xs mb-3 px-1 uppercase tracking-wider"
            style={{ color: '#9EA0B4' }}
          >
            오늘의 학습
          </h2>
          {activeUnit ? (
            <div className="p-5" style={clayCard}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#9EA0B4' }}>
                    오늘 배운 개념
                  </p>
                  <p className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>
                    {activeUnit.title}
                  </p>
                  {activeUnit.grade_hint && (
                    <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>
                      {activeUnit.grade_hint}
                    </p>
                  )}
                </div>
                <BookOpen size={28} weight="fill" style={{ color: '#E8C547' }} />
              </div>

              <p className="text-sm mt-3 mb-4 leading-relaxed" style={{ color: '#6B6C7E' }}>
                무니에게 이 개념을 가르쳐봐요!
                설명하면서 더 잘 이해할 수 있어요.
              </p>

              {/* Duolingo 3D 버튼 */}
              <Link
                href={`/student/teach/${activeUnit.id}`}
                className="flex items-center justify-center gap-2 w-full font-extrabold text-sm transition-all duration-150"
                style={{
                  background: '#E8C547',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  color: '#1A1830',
                  boxShadow: '0 4px 0 #C8A020',
                }}
                onMouseDown={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(2px)'
                  el.style.boxShadow = '0 2px 0 #C8A020'
                }}
                onMouseUp={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 4px 0 #C8A020'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 4px 0 #C8A020'
                }}
              >
                무니에게 알려줘
                <ArrowRight size={18} weight="bold" />
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center" style={clayCard}>
              <div className="text-4xl mb-3">🌙</div>
              <p className="font-extrabold" style={{ color: '#2D2F2F' }}>
                반에 참여해보세요!
              </p>
              <p className="text-sm mt-1 mb-4" style={{ color: '#9EA0B4' }}>
                선생님께 받은 초대 코드로 반에 참여하면<br/>오늘의 학습이 여기에 나타나요
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
          )}
        </section>

        {/* 지난 학습 목록 */}
        {recentSessions.length > 0 && (
          <section>
            <h2
              className="font-bold text-xs mb-3 px-1 uppercase tracking-wider"
              style={{ color: '#9EA0B4' }}
            >
              지난 학습
            </h2>
            <div
              className="overflow-hidden divide-y"
              style={{ ...clayCard, borderColor: '#F7F7F7' }}
            >
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Star size={18} weight="fill" style={{ color: '#E8C547' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>
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
