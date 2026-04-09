'use client'

import Link from 'next/link'
import {
  BookOpen,
  Copy,
  PencilSimple,
  Trash,
  Trophy,
  Users,
} from '@phosphor-icons/react'
import { MoonStarIcon } from '@/components/icons'

const DEMO_TEACHER = { name: '이선생' }
const DEMO_CLASS = { name: '3학년 2반', inviteCode: 'ABC123' }
const DEMO_UNITS = [
  { id: 'u1', title: '분수의 덧셈', gradeHint: '3~4학년', completed: 3, total: 5 },
  { id: 'u2', title: '도형의 넓이', gradeHint: '3~4학년', completed: 1, total: 5 },
]
const DEMO_REPORTS = [
  {
    studentName: '김지민',
    score: 88,
    summary: '직사각형과 삼각형의 넓이 공식을 정확히 이해...',
    weakPoints: ['평행사변형 넓이 혼동'],
  },
  {
    studentName: '박서연',
    score: 72,
    summary: '기본 공식은 알고 있지만 원리 설명에 어려움...',
    weakPoints: ['단위 의미 불명확'],
  },
  {
    studentName: '이준혁',
    score: 45,
    summary: '직사각형 넓이는 구할 수 있지만 확장이 어려워...',
    weakPoints: ['삼각형 높이 개념 불명확'],
  },
]

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
} as const

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#F44336'

  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ background: `${color}20`, color }}
    >
      {score}점
    </span>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4" style={cardStyle}>
      <p className="text-xs font-semibold" style={{ color: '#9EA0B4' }}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold leading-tight" style={{ color: '#2D2F2F' }}>
        {value}
      </p>
    </div>
  )
}

function LeftNav() {
  return (
    <aside
      className="flex w-[220px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}
    >
      <div className="px-5 pt-8 pb-5" style={{ borderBottom: '1px solid #F7F7F7' }}>
        <div className="flex items-center gap-2">
          <MoonStarIcon size={24} color="#7A6CC0" />
          <span className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>
            Moni
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>
            {DEMO_TEACHER.name} 선생님
          </p>
          <p className="mt-0.5 text-xs" style={{ color: '#9EA0B4' }}>
            {DEMO_CLASS.name}
          </p>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold" style={{ color: '#9EA0B4' }}>
            학생 초대 코드
          </p>
          <div
            className="flex items-center justify-between rounded-2xl p-3"
            style={{ background: '#F7F7F7', border: '1px solid #EBEBEB' }}
          >
            <span className="font-mono text-base font-extrabold tracking-widest" style={{ color: '#2D2F2F' }}>
              {DEMO_CLASS.inviteCode}
            </span>
            <button
              type="button"
              onClick={() => alert('체험 모드에서는 복사가 제한됩니다')}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: '#FFFFFF', color: '#2D2F2F', border: '1px solid #E8E8E8' }}
            >
              <Copy size={13} />
              복사
            </button>
          </div>
        </div>

        <span
          className="mt-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}
        >
          체험 모드
        </span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(122,108,192,0.12)', color: '#5A4FA0', borderLeft: '3px solid #7A6CC0' }}
        >
          <BookOpen size={18} weight="fill" />
          <span className="text-sm font-bold">단원 관리</span>
        </div>

        <Link
          href="/demo/teacher"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ color: '#9EA0B4' }}
        >
          <Users size={18} />
          <span className="text-sm font-semibold">학생 목록</span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ color: '#9EA0B4' }}>
          <Trophy size={18} />
          <span className="text-sm font-semibold">퀘스트</span>
        </div>
      </div>
    </aside>
  )
}

function UnitCard({
  title,
  gradeHint,
  completed,
  total,
}: {
  title: string
  gradeHint: string
  completed: number
  total: number
}) {
  const percent = Math.round((completed / total) * 100)

  return (
    <div className="flex flex-col gap-4 p-5" style={cardStyle}>
      <div>
        <p className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>
          {title}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: '#9EA0B4' }}>
          {gradeHint}
        </p>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span style={{ color: '#9EA0B4' }}>학생 완료</span>
          <span className="font-extrabold" style={{ color: '#E8C547' }}>
            {completed}/{total}명
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: '#F0F0F0' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: percent === 100 ? '#4CAF50' : '#E8C547' }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled
          title="체험 모드에서는 비활성화됩니다"
          className="flex-1 cursor-not-allowed rounded-xl py-2 text-xs font-bold opacity-50"
          style={{ background: 'rgba(90,79,160,0.10)', color: '#5A4FA0' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <PencilSimple size={13} weight="bold" />
            수정
          </span>
        </button>
        <button
          type="button"
          disabled
          title="체험 모드에서는 비활성화됩니다"
          className="flex-1 cursor-not-allowed rounded-xl py-2 text-xs font-bold opacity-50"
          style={{ background: 'rgba(244,67,54,0.10)', color: '#F44336' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Trash size={13} weight="bold" />
            삭제
          </span>
        </button>
      </div>
    </div>
  )
}

function RightSidebar() {
  return (
    <aside
      className="flex w-[280px] shrink-0 flex-col overflow-y-auto p-4"
      style={{ background: '#FFFFFF', borderLeft: '1px solid #F0F0F0' }}
    >
      <div className="mb-4">
        <h2 className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>
          최근 리포트
        </h2>
      </div>

      <div className="space-y-3">
        {DEMO_REPORTS.map((report) => (
          <div
            key={`${report.studentName}-${report.score}`}
            className="rounded-2xl border p-4"
            style={{ borderColor: '#F3F3F3', background: '#FFFFFF' }}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-bold" style={{ color: '#2D2F2F' }}>
                {report.studentName}
              </p>
              <ScoreBadge score={report.score} />
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: '#6B6B8D',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {report.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.weakPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: 'rgba(244,67,54,0.08)', color: '#C24A4A' }}
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default function DemoTeacherPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F7F7F7' }}>
      <LeftNav />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>
              단원 관리
            </h1>
          </div>

          <div
            className="mb-5 w-full rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ background: 'rgba(232,197,71,0.16)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.30)' }}
          >
            샘플 데이터 · 실제 데이터는 회원가입 후 확인 가능
          </div>

          <div className="mb-5 grid grid-cols-4 gap-3">
            <StatCard label="학생 수" value="5명" />
            <StatCard label="활성 단원" value="2개" />
            <StatCard label="평균 이해도" value="68점" />
            <StatCard label="완료 세션" value="4회" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {DEMO_UNITS.map((unit) => (
              <UnitCard
                key={unit.id}
                title={unit.title}
                gradeHint={unit.gradeHint}
                completed={unit.completed}
                total={unit.total}
              />
            ))}
          </div>

          <button
            type="button"
            disabled
            title="체험 모드에서는 비활성화됩니다"
            className="mt-6 cursor-not-allowed rounded-full px-5 py-3 text-sm font-extrabold opacity-50"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
          >
            단원 추가
          </button>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}
