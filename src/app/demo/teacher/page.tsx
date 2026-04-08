'use client'

import Link from 'next/link'
import { ArrowLeft, Student, ChartBar, CheckCircle, Clock } from '@phosphor-icons/react'

interface SampleStudent {
  id: string
  name: string
  score: number | null
  status: '완료' | '진행 중' | '미시작'
}

const SAMPLE_STUDENTS: SampleStudent[] = [
  { id: '1', name: '김지민', score: 88, status: '완료' },
  { id: '2', name: '박서연', score: 72, status: '완료' },
  { id: '3', name: '이준혁', score: 45, status: '완료' },
  { id: '4', name: '최유나', score: null, status: '진행 중' },
  { id: '5', name: '정하늘', score: null, status: '미시작' },
]

const SAMPLE_UNIT = {
  title: '분수의 덧셈',
  grade: '초등 4~5학년',
  completedCount: 3,
  totalCount: 5,
}

function scoreColor(score: number | null): string {
  if (score === null) return '#9EA0B4'
  if (score >= 80) return '#22C55E'
  if (score >= 60) return '#E8C547'
  return '#F87171'
}

function scoreLabel(score: number | null): string {
  if (score === null) return '—'
  if (score >= 80) return '잘 이해해요'
  if (score >= 60) return '보통이에요'
  return '복습 필요'
}

const completedStudents = SAMPLE_STUDENTS.filter((s) => s.score !== null)
const avgScore =
  completedStudents.length > 0
    ? Math.round(completedStudents.reduce((sum, s) => sum + (s.score ?? 0), 0) / completedStudents.length)
    : null

export default function DemoTeacherPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F2F2F5' }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 border-b"
        style={{ background: '#FFFFFF', borderColor: '#E4E4EA', height: 56 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: '#E8C547' }}>무니</span>
          <span className="text-sm font-medium" style={{ color: '#9EA0B4' }}>선생님 대시보드 (체험)</span>
        </div>
        <Link
          href="/demo"
          className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#9EA0B4' }}
        >
          <ArrowLeft size={14} />
          돌아가기
        </Link>
      </header>

      <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
        {/* 체험 배너 */}
        <div
          className="mb-6 rounded-2xl px-4 py-3 text-sm font-medium text-center"
          style={{ background: 'rgba(232,197,71,0.12)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.30)' }}
        >
          샘플 데이터로 보는 체험 모드예요. 실제 데이터가 아닙니다.
        </div>

        {/* 요약 카드 */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-3xl bg-white px-3 py-4 shadow-sm">
            <Student size={22} weight="fill" style={{ color: '#E8C547', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#1A1830' }}>{SAMPLE_STUDENTS.length}</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>전체 학생</span>
          </div>
          <div className="flex flex-col items-center rounded-3xl bg-white px-3 py-4 shadow-sm">
            <CheckCircle size={22} weight="fill" style={{ color: '#22C55E', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#1A1830' }}>{SAMPLE_UNIT.completedCount}</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>완료</span>
          </div>
          <div className="flex flex-col items-center rounded-3xl bg-white px-3 py-4 shadow-sm">
            <ChartBar size={22} weight="fill" style={{ color: '#E8C547', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#1A1830' }}>{avgScore ?? '—'}</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>평균 점수</span>
          </div>
        </div>

        {/* 활성 단원 */}
        <div className="mb-4">
          <h2 className="mb-3 text-sm font-bold" style={{ color: '#6B6B8D' }}>현재 단원</h2>
          <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-bold" style={{ color: '#1A1830' }}>{SAMPLE_UNIT.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{SAMPLE_UNIT.grade}</p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#16A34A' }}
              >
                진행 중
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: '#9EA0B4' }}>
                <span>완료 학생</span>
                <span>{SAMPLE_UNIT.completedCount} / {SAMPLE_UNIT.totalCount}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#F2F2F5' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(SAMPLE_UNIT.completedCount / SAMPLE_UNIT.totalCount) * 100}%`,
                    background: '#E8C547',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 학생 목록 */}
        <div>
          <h2 className="mb-3 text-sm font-bold" style={{ color: '#6B6B8D' }}>학생별 이해도</h2>
          <div className="flex flex-col gap-2">
            {SAMPLE_STUDENTS.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547' }}
                  >
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1830' }}>{student.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#9EA0B4' }}>
                      {student.status === '진행 중' ? (
                        <Clock size={11} style={{ color: '#E8C547' }} />
                      ) : student.status === '완료' ? (
                        <CheckCircle size={11} style={{ color: '#22C55E' }} />
                      ) : null}
                      {student.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {student.score !== null && (
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: `${scoreColor(student.score)}20`,
                        color: scoreColor(student.score),
                      }}
                    >
                      {scoreLabel(student.score)}
                    </span>
                  )}
                  <span
                    className="text-xl font-black"
                    style={{ color: scoreColor(student.score) }}
                  >
                    {student.score !== null ? student.score : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: '#C0C0D0' }}>
          실제 서비스에서는 AI가 대화 내용을 분석해 이해도를 자동 산출해요
        </p>
      </main>
    </div>
  )
}
