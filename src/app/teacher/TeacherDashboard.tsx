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

function ScoreDot({ score }: { score: number | null }) {
  if (score === null) return <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
  if (score >= 90) return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
  if (score >= 70) return <span className="w-2.5 h-2.5 rounded-full bg-[#E8C547] inline-block" />
  return <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
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
  const firstUnit = units[0]

  return (
    <div className="min-h-screen bg-[#F2F2F5] font-sans pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b border-border px-4 pt-10 pb-6">
        <p className="text-xs text-muted-foreground mb-1">{getToday()}</p>
        <h1 className="text-2xl font-bold text-[#1A1830]">
          안녕하세요, {profile.name} 선생님!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentClass.name} &middot; 학생 {totalStudents}명
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 통계 그리드 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={22} weight="fill" className="text-[#E8C547]" />}
            label="학생 수"
            value={totalStudents}
            unit="명"
          />
          <StatCard
            icon={<Check size={22} weight="fill" className="text-[#E8C547]" />}
            label="완료 세션"
            value={totalCompletedSessions}
            unit="회"
          />
          <StatCard
            icon={<ChartBar size={22} weight="fill" className="text-[#E8C547]" />}
            label="평균 점수"
            value={avgScore ?? '-'}
            unit={avgScore !== null ? '점' : ''}
          />
          <StatCard
            icon={<BookOpen size={22} weight="fill" className="text-[#E8C547]" />}
            label="활성 단원"
            value={activeUnitsCount}
            unit="개"
          />
        </div>

        {/* 활성 단원 카드 */}
        {units.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-bold text-[#1A1830] px-1">활성 단원</h2>
            {units.map((unit) => {
              const completed = unitCompletions[unit.id] ?? 0
              const total = totalStudents
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0
              return (
                <div
                  key={unit.id}
                  className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-bold text-[#1A1830]">{unit.title}</p>
                      {unit.grade_hint && (
                        <span className="text-xs text-muted-foreground">{unit.grade_hint}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#E8C547] shrink-0">
                      {completed}/{total}명 완료
                    </span>
                  </div>
<<<<<<< Updated upstream
                  {/* 프로그레스 바 */}
=======
>>>>>>> Stashed changes
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E8C547] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 text-right">{pct}%</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-6 text-center">
            <BookOpen size={36} className="text-[#E8C547] mx-auto mb-2" />
            <p className="font-semibold text-[#1A1830]">아직 단원이 없어요</p>
            <p className="text-sm text-muted-foreground mt-1">아래 + 버튼으로 첫 단원을 만들어보세요!</p>
          </div>
        )}

        {/* 학생 목록 */}
        {students.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-[#1A1830]">학생 현황</h2>
              <Link
                href="/teacher/students"
                className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-[#E8C547] transition-colors"
              >
                전체보기 <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] divide-y divide-border overflow-hidden">
              {students.map((student) => {
                const score = studentScores[student.id]
                return (
                  <div key={student.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <ScoreDot score={score} />
                      <span className="font-medium text-[#1A1830] text-sm">{student.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#E8C547]">
                      {score !== null ? `${score}점` : '미완료'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 초대 코드 */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5">
          <p className="text-xs text-muted-foreground mb-1">학생 초대 코드</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tracking-widest text-[#1A1830]">
              {currentClass.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1.5 bg-[#F2F2F5] hover:bg-[#E8C547]/20 transition-colors rounded-full px-4 py-2 text-sm font-medium text-[#1A1830]"
            >
              {copied ? <Check size={16} weight="bold" className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
      {/* 하단 고정 버튼들 */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-3 items-end">
=======
{/* 하단 고정 단원 추가 버튼 */}
      <div className="fixed bottom-6 right-4">
>>>>>>> Stashed changes
        <Link
          href="/teacher/units/new"
          className="flex items-center gap-2 bg-[#E8C547] text-[#1A1830] font-bold rounded-full px-5 py-3.5 shadow-lg shadow-[#E8C547]/30 hover:bg-[#E8C547]/90 transition-colors"
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
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 flex flex-col gap-2">
      {icon}
      <div>
        <p className="text-2xl font-bold text-[#E8C547]">
          {value}
          <span className="text-sm font-semibold text-muted-foreground ml-0.5">{unit}</span>
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
