'use client'

import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Copy,
  Check,
  ArrowRight,
  Users,
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

interface ReportItem {
  id: string
  session_id: string
  student_id: string
  summary: string | null
  weak_points: string[] | null
  created_at: string
  sessions: { understanding_score: number | null } | { understanding_score: number | null }[] | null
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
  reports: ReportItem[]
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
  reports,
}: Props) {
  const [copied, setCopied] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(currentClass.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalStudents = students.length

  // 최근 리포트 5개 + 학생 이름 매핑
  const studentMap = new Map(students.map((s) => [s.id, s.name]))
  const recentReports = reports.slice(0, 5).map((r) => {
    const sessionsData = Array.isArray(r.sessions) ? r.sessions[0] : r.sessions
    return {
      ...r,
      studentName: studentMap.get(r.student_id) ?? '학생',
      score: sessionsData?.understanding_score ?? null,
    }
  })

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F7F7F7' }}>

      {/* ── Left Panel (240px) ── */}
      <div
        className="flex flex-col w-[240px] shrink-0 overflow-y-auto"
        style={{ background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}
      >
        {/* 로고 + 선생님 정보 */}
        <div className="px-5 pt-8 pb-5" style={{ borderBottom: '1px solid #F7F7F7' }}>
          <p className="text-sm font-extrabold mb-4" style={{ color: '#E8C547' }}>🌙 무니에게 알려줘</p>
          <p className="font-extrabold text-base leading-tight" style={{ color: '#2D2F2F' }}>
            {profile.name} 선생님
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{currentClass.name}</p>
          <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>{getToday()}</p>
        </div>

        {/* 단원 추가 버튼 */}
        <div className="px-4 pt-5">
          <Link
            href="/teacher/units/new"
            className="flex items-center justify-center gap-2 font-extrabold text-sm w-full transition-all duration-150"
            style={{
              background: '#E8C547',
              borderRadius: '9999px',
              padding: '12px 16px',
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
            <Plus size={18} weight="bold" />
            단원 추가
          </Link>
        </div>

        {/* 활성 단원 목록 */}
        <div className="px-4 pt-5 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9EA0B4' }}>
            활성 단원
          </p>

          {units.length > 0 ? (
            <div className="space-y-3">
              {units.map((unit) => {
                const completed = unitCompletions[unit.id] ?? 0
                const total = totalStudents
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                return (
                  <div key={unit.id} className="p-3" style={{
                    background: '#FAFAFA',
                    borderRadius: '12px',
                    border: '1px solid #F0F0F0',
                  }}>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="font-bold text-xs leading-tight" style={{ color: '#2D2F2F' }}>{unit.title}</p>
                      <span className="text-xs font-bold shrink-0" style={{ color: '#E8C547' }}>
                        {completed}/{total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EBEBEB' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: '#E8C547' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <BookOpen size={28} style={{ color: '#E8C547' }} className="mx-auto mb-2" />
              <p className="text-xs" style={{ color: '#9EA0B4' }}>단원이 없어요</p>
            </div>
          )}
        </div>

        {/* 초대 코드 */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid #F7F7F7' }}>
          <p className="text-xs mb-2" style={{ color: '#9EA0B4' }}>학생 초대 코드</p>
          <div
            className="p-3 flex items-center justify-between"
            style={{ background: '#FAFAFA', borderRadius: '12px', border: '1px solid #F0F0F0' }}
          >
            <span className="text-lg font-extrabold tracking-widest" style={{ color: '#2D2F2F' }}>
              {currentClass.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-150"
              style={{ background: '#FFFFFF', color: '#2D2F2F', border: '1px solid #E8E8E8' }}
            >
              {copied
                ? <Check size={13} weight="bold" style={{ color: '#4CAF50' }} />
                : <Copy size={13} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Center Panel (flex-1) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 센터 헤더 바 */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-lg" style={{ color: '#2D2F2F' }}>학생 현황</h2>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}
            >
              {totalStudents}명
            </span>
          </div>
          <Link
            href="/teacher/students"
            className="text-xs flex items-center gap-0.5 transition-opacity hover:opacity-70"
            style={{ color: '#9EA0B4' }}
          >
            전체보기 <ArrowRight size={12} />
          </Link>
        </div>

        {/* 학생 카드 목록 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="p-5" style={clayCard}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547' }}
                    >
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>{student.name}</p>
                      <p className="text-xs" style={{ color: '#9EA0B4' }}>{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScorePill score={studentScores[student.id] ?? null} />
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold transition-opacity hover:opacity-70"
                      style={{ background: '#F7F7F7', color: '#9EA0B4' }}
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center" style={clayCard}>
              <Users size={36} style={{ color: '#E8C547' }} className="mx-auto mb-3" />
              <p className="font-bold" style={{ color: '#2D2F2F' }}>아직 학생이 없어요</p>
              <p className="text-sm mt-1" style={{ color: '#9EA0B4' }}>
                초대 코드 <strong style={{ color: '#E8C547' }}>{currentClass.invite_code}</strong>를 학생에게 알려주세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel (280px) ── */}
      <div
        className="w-[280px] shrink-0 flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', borderLeft: '1px solid #F0F0F0' }}
      >
        <div
          className="px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid #F7F7F7' }}
        >
          <h2 className="font-extrabold text-base" style={{ color: '#2D2F2F' }}>최근 리포트</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentReports.length > 0 ? (
            recentReports.map((item) => (
              <div
                key={item.id}
                className="px-5 py-4 border-b last:border-0"
                style={{ borderColor: '#F7F7F7' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: '#2D2F2F' }}>{item.studentName}</span>
                  <ScorePill score={item.score} />
                </div>
                {item.summary && (
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: '#6B6B8D' }}
                  >
                    {item.summary}
                  </p>
                )}
                {item.weak_points?.[0] && (
                  <p className="text-xs mt-1.5" style={{ color: '#FF9600' }}>
                    💡 {item.weak_points[0]}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-5 text-center">
              <p className="text-sm font-bold" style={{ color: '#2D2F2F' }}>리포트가 없어요</p>
              <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>학생이 세션을 완료하면 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
