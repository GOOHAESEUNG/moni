'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Star } from '@phosphor-icons/react'
import MooniCharacter from '@/components/mooni/MooniCharacter'
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
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#E8C547' : '#f97316'
  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {score}점
    </span>
  )
}

export default function StudentHome({ profile, activeUnit, recentSessions }: Props) {
  return (
    <div className="min-h-screen font-sans pb-12" style={{ background: '#F2F2F5' }}>
      {/* 상단 인사 */}
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: '#1A1830' }}>
          안녕, {profile.name}! 🌙
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>
          오늘도 무니를 도와줄래요?
        </p>
      </div>

      {/* 무니 히어로 */}
      <div className="flex justify-center py-4">
        <MooniCharacter expression="happy" size={220} animate />
      </div>

      <div className="px-5 space-y-5 max-w-lg mx-auto">
        {/* 오늘의 학습 */}
        <section>
          <h2 className="font-bold text-sm mb-3 px-1" style={{ color: '#9EA0B4' }}>
            오늘의 학습
          </h2>
          {activeUnit ? (
            <div
              className="bg-white rounded-3xl p-5"
              style={{ boxShadow: '0 8px 32px rgba(232,197,71,0.12)' }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#9EA0B4' }}>
                    오늘 배운 개념
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1A1830' }}>
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
                설명하면서 더 잘 이해할 수 있어요. ✨
              </p>

              <Link
                href={`/student/teach/${activeUnit.id}`}
                className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#E8C547', color: '#1A1830' }}
              >
                무니에게 알려줘
                <ArrowRight size={18} weight="bold" />
              </Link>
            </div>
          ) : (
            <div
              className="bg-white rounded-3xl p-6 text-center"
              style={{ boxShadow: '0 8px 32px rgba(232,197,71,0.12)' }}
            >
              <div className="text-4xl mb-2">😴</div>
              <p className="font-semibold" style={{ color: '#1A1830' }}>
                아직 배정된 단원이 없어요
              </p>
              <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>
                선생님이 단원을 배정하면 여기에 나타나요
              </p>
            </div>
          )}
        </section>

        {/* 지난 학습 */}
        {recentSessions.length > 0 && (
          <section>
            <h2 className="font-bold text-sm mb-3 px-1" style={{ color: '#9EA0B4' }}>
              지난 학습
            </h2>
            <div
              className="bg-white rounded-3xl overflow-hidden divide-y"
              style={{
                boxShadow: '0 8px 32px rgba(232,197,71,0.12)',
                borderColor: '#F2F2F5',
              }}
            >
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Star size={18} weight="fill" style={{ color: '#E8C547' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1A1830' }}>
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
