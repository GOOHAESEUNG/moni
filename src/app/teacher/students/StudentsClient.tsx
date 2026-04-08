'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, User, ChartBar } from '@phosphor-icons/react'
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
}

interface Props {
  currentClass: Class
  students: Student[]
  reports: Report[]
}

export default function StudentsClient({ currentClass, students, reports }: Props) {
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
    <div className="min-h-screen bg-[#F2F2F5] font-sans pb-10">
      {/* 헤더 */}
      <div className="bg-white border-b border-border px-4 pt-10 pb-5 flex items-center gap-3">
        <Link
          href="/teacher"
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} weight="bold" className="text-[#1A1830]" />
        </Link>
        <h1 className="text-xl font-bold text-[#1A1830]">학생 관리</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 초대 코드 카드 */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5">
          <p className="text-xs text-muted-foreground mb-1">초대 코드로 학생을 추가하세요</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold tracking-widest text-[#1A1830]">
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

        {/* 학생 목록 */}
        <div>
          <p className="text-sm font-semibold text-[#1A1830] px-1 mb-3">
            학생 {students.length}명
          </p>

          {students.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-8 text-center">
              <User size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-[#1A1830]">아직 등록된 학생이 없어요</p>
              <p className="text-sm text-muted-foreground mt-1">
                위 초대 코드를 학생에게 공유해주세요!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => {
                const report = getLatestReport(student.id)
                return (
                  <div
                    key={student.id}
                    className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#E8C547]/20 flex items-center justify-center">
                          <User size={18} className="text-[#E8C547]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1830] text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="flex items-center gap-1 text-xs font-medium text-[#E8C547] hover:text-[#E8C547]/80 transition-colors"
                      >
                        <ChartBar size={14} />
                        리포트
                      </Link>
                    </div>

                    {report && (
                      <div className="bg-[#F2F2F5] rounded-2xl p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">최근 리포트</p>
                        <p className="text-xs text-[#1A1830] leading-relaxed line-clamp-2">
                          {report.summary}
                        </p>
                        {report.weak_points?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {report.weak_points.slice(0, 2).map((wp, i) => (
                              <span
                                key={i}
                                className="text-xs bg-[#E8C547]/20 text-[#1A1830] rounded-full px-2 py-0.5"
                              >
                                {wp}
                              </span>
                            ))}
                          </div>
                        )}
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
