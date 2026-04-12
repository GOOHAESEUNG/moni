'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Copy, Check, Users, BookOpen, Trophy,
  ChartBar, User,
} from '@phosphor-icons/react'
import type { Class } from '@/types/database'

interface Student {
  id: string
  name: string
  email: string
}

interface Report {
  id: string
  student_id: string
  unit_id: string
  summary: string
  weak_points: string[]
  created_at: string
  understanding_score?: number | null
}

interface Props {
  profile: { name: string }
  currentClass: Class
  students: Student[]
  reports: Report[]
}

function ScorePill({ score }: { score: number | null | undefined }) {
  if (score == null) return null
  const color = score >= 90 ? '#4CAF50' : score >= 70 ? '#E8C547' : score >= 60 ? '#FF9600' : '#F44336'
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}20`, color }}>
      {score}점
    </span>
  )
}

export default function StudentsClient({ profile, currentClass, students, reports }: Props) {
  const [copied, setCopied] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(currentClass.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function getLatestReport(studentId: string) {
    return reports.find((r) => r.student_id === studentId)
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>

      {/* ── Left Nav (220px) — 다크 네이비 ── */}
      <nav
        className="flex flex-col w-[220px] shrink-0 overflow-y-auto"
        style={{ background: '#13112A', borderRight: 'none' }}
      >
        {/* 로고 + 선생님 정보 + 초대 코드 */}
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-extrabold mb-5" style={{ color: '#E8C547', letterSpacing: '-0.01em' }}>🌙 무니에게 알려줘</p>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(232,197,71,0.18)' }}>
              <span className="text-sm font-extrabold" style={{ color: '#E8C547' }}>
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{profile.name} 선생님</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>{currentClass.name}</p>
            </div>
          </div>

          <p className="text-xs mb-1.5 font-semibold" style={{ color: 'rgba(255,255,255,0.40)' }}>학생 초대 코드</p>
          <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <span className="text-base font-extrabold tracking-widest" style={{ color: 'rgba(255,255,255,0.90)' }}>
              {currentClass.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {copied ? <Check size={13} weight="bold" style={{ color: '#4CAF50' }} /> : <Copy size={13} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex-1 px-3 py-4 space-y-1">
          <Link href="/teacher"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <BookOpen size={18} weight="regular" />
            <span className="font-semibold text-sm">단원 관리</span>
          </Link>

          {/* 학생 목록 — active */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547', borderLeft: '3px solid #E8C547' }}>
            <Users size={18} weight="fill" />
            <span className="font-bold text-sm">학생 목록</span>
            {students.length > 0 && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,197,71,0.25)', color: '#E8C547' }}>
                {students.length}
              </span>
            )}
          </div>

          <Link href="/teacher/quests/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Trophy size={18} weight="regular" />
            <span className="font-semibold text-sm">퀘스트</span>
          </Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div
          className="px-6 py-4 flex items-center gap-3 shrink-0"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
        >
          <h1 className="font-extrabold text-xl" style={{ color: '#2D2F2F' }}>학생 목록</h1>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}
          >
            {students.length}명
          </span>
        </div>

        {/* 학생 카드 그리드 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(232,197,71,0.12)' }}>
                <Users size={32} style={{ color: '#E8C547' }} />
              </div>
              <p className="font-extrabold text-base mb-1" style={{ color: '#2D2F2F' }}>아직 학생이 없어요</p>
              <p className="text-sm" style={{ color: '#9EA0B4' }}>
                초대 코드 <span className="font-extrabold" style={{ color: '#2D2F2F' }}>{currentClass.invite_code}</span>를 학생들에게 공유해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {students.map((student) => {
                const report = getLatestReport(student.id)
                return (
                  <div
                    key={student.id}
                    className="p-5"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* 상단: 이름 + 점수 + 리포트 링크 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                          style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}
                        >
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>{student.name}</p>
                          <p className="text-xs" style={{ color: '#9EA0B4' }}>{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ScorePill score={report?.understanding_score} />
                        <Link
                          href={`/teacher/students/${student.id}`}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                          style={{ background: 'rgba(90,79,160,0.08)', color: '#5A4FA0' }}
                        >
                          <ChartBar size={13} weight="bold" />
                          리포트
                        </Link>
                      </div>
                    </div>

                    {/* 최근 리포트 요약 */}
                    {report ? (
                      <div className="rounded-2xl p-3" style={{ background: '#F7F7F7' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#9EA0B4' }}>최근 리포트</p>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#2D2F2F' }}>
                          {report.summary}
                        </p>
                        {report.weak_points?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {report.weak_points.slice(0, 2).map((wp, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: 'rgba(255,150,0,0.12)', color: '#FF9600' }}
                              >
                                {wp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl p-3" style={{ background: '#F7F7F7' }}>
                        <p className="text-xs" style={{ color: '#C0C0D0' }}>아직 세션 기록이 없어요</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
