'use client'

import Link from 'next/link'
import {
  Users,
  BookOpen,
  ChartBar,
  Plus,
  Copy,
  Check,
  ArrowRight,
} from '@phosphor-icons/react'
import { useState } from 'react'
import type { Profile, Class, Unit } from '@/types/database'

interface Student {
  id: string
  name: string
  email: string
}

interface CompletedSession {
  id: string
  student_id: string
  unit_id: string
  understanding_score: number | null
  ended_at: string | null
}

interface Props {
  profile: Profile
  currentClass: Class
  students: Student[]
  units: Unit[]
  completedSessions: CompletedSession[]
  studentScores: Record<string, number | null>
  unitCompletions: Record<string, number>
  avgScore: number | null
}

const clayCard = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span
        className="text-xs font-bold px-3 py-1 rounded-full"
        style={{ background: '#F7F7F7', color: '#9EA0B4' }}
      >
        미완료
      </span>
    )
  }
  const color = score >= 90 ? '#4CAF50' : score >= 70 ? '#E8C547' : '#FF9600'
  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {score}점
    </span>
  )
}

function getToday() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export default function TeacherDashboard({
  profile,
  currentClass,
  students,
  units,
  completedSessions,
  studentScores,
  unitCompletions,
  avgScore,
}: Props) {
  const [copied, setCopied] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(currentClass.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalStudents = students.length
  const totalCompletedSessions = completedSessions.length
  const activeUnitsCount = units.length

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F7F7F7' }}>
      {/* 헤더 */}
      <div
        className="px-4 pt-10 pb-6"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
      >
        <p className="text-xs mb-1" style={{ color: '#9EA0B4' }}>{getToday()}</p>
        <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>
          안녕하세요, {profile.name} 선생님!
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>
          {currentClass.name} · 학생 {totalStudents}명
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 통계 그리드 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={22} weight="fill" style={{ color: '#E8C547' }} />}
            label="학생 수"
            value={totalStudents}
            unit="명"
          />
          <StatCard
            icon={<Check size={22} weight="fill" style={{ color: '#E8C547' }} />}
            label="완료 세션"
            value={totalCompletedSessions}
            unit="회"
          />
          <StatCard
            icon={<ChartBar size={22} weight="fill" style={{ color: '#E8C547' }} />}
            label="평균 점수"
            value={avgScore ?? '-'}
            unit={avgScore !== null ? '점' : ''}
          />
          <StatCard
            icon={<BookOpen size={22} weight="fill" style={{ color: '#E8C547' }} />}
            label="활성 단원"
            value={activeUnitsCount}
            unit="개"
          />
        </div>

        {/* 활성 단원 카드 */}
        {units.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-extrabold px-1" style={{ color: '#2D2F2F' }}>활성 단원</h2>
            {units.map((unit) => {
              const completed = unitCompletions[unit.id] ?? 0
              const total = totalStudents
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0
              return (
                <div key={unit.id} className="p-5" style={clayCard}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-bold" style={{ color: '#2D2F2F' }}>{unit.title}</p>
                      {unit.grade_hint && (
                        <span className="text-xs" style={{ color: '#9EA0B4' }}>{unit.grade_hint}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: '#E8C547' }}>
                      {completed}/{total}명 완료
                    </span>
                  </div>
                  {/* 프로그레스 바 */}
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F7F7F7' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: '#E8C547' }}
                    />
                  </div>
                  <p className="text-xs mt-1.5 text-right" style={{ color: '#9EA0B4' }}>{pct}%</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-6 text-center" style={clayCard}>
            <BookOpen size={36} style={{ color: '#E8C547' }} className="mx-auto mb-2" />
            <p className="font-bold" style={{ color: '#2D2F2F' }}>아직 단원이 없어요</p>
            <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>아래 + 버튼으로 첫 단원을 만들어보세요!</p>
          </div>
        )}

        {/* 학생 목록 */}
        {students.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-extrabold" style={{ color: '#2D2F2F' }}>학생 현황</h2>
              <Link
                href="/teacher/students"
                className="text-xs flex items-center gap-0.5 transition-opacity hover:opacity-70"
                style={{ color: '#9EA0B4' }}
              >
                전체보기 <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-hidden divide-y" style={{ ...clayCard, borderColor: '#F7F7F7' }}>
              {students.map((student) => {
                const score = studentScores[student.id] ?? null
                return (
                  <div key={student.id} className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-semibold text-sm" style={{ color: '#2D2F2F' }}>
                      {student.name}
                    </span>
                    <ScorePill score={score} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 초대 코드 */}
        <div className="p-5" style={clayCard}>
          <p className="text-xs mb-1" style={{ color: '#9EA0B4' }}>학생 초대 코드</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold tracking-widest" style={{ color: '#2D2F2F' }}>
              {currentClass.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all duration-150"
              style={{ background: '#F7F7F7', color: '#2D2F2F' }}
            >
              {copied ? <Check size={16} weight="bold" style={{ color: '#4CAF50' }} /> : <Copy size={16} />}
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>
      </div>

      {/* 우하단 FAB — Duolingo 3D 버튼 */}
      <div className="fixed bottom-6 right-4">
        <Link
          href="/teacher/units/new"
          className="flex items-center gap-2 font-extrabold text-sm transition-all duration-150"
          style={{
            background: '#E8C547',
            borderRadius: '9999px',
            padding: '14px 20px',
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
          <Plus size={20} weight="bold" />
          단원 추가
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  unit: string
}) {
  return (
    <div className="p-5 flex flex-col gap-2" style={{
      background: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
    }}>
      {icon}
      <div>
        <p className="text-2xl font-extrabold leading-none" style={{ color: '#E8C547' }}>
          {value}
          <span className="text-sm font-bold ml-0.5" style={{ color: '#9EA0B4' }}>{unit}</span>
        </p>
        <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>{label}</p>
      </div>
    </div>
  )
}
