'use client'

import Link from 'next/link'
import {
  BookOpen,
  Copy,
  PencilSimple,
  Trash,
  Trophy,
  Users,
  ChartBar,
  Plus,
  House,
} from '@phosphor-icons/react'
import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'
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
    competency: { 자기관리: 4, 대인관계: 5, 시민: 4, 문제해결: 5 },
  },
  {
    studentName: '박서연',
    score: 72,
    summary: '기본 공식은 알고 있지만 원리 설명에 어려움...',
    weakPoints: ['단위 의미 불명확'],
    competency: { 자기관리: 3, 대인관계: 4, 시민: 3, 문제해결: 3 },
  },
  {
    studentName: '이준혁',
    score: 45,
    summary: '직사각형 넓이는 구할 수 있지만 확장이 어려워...',
    weakPoints: ['삼각형 높이 개념 불명확'],
    competency: { 자기관리: 2, 대인관계: 3, 시민: 2, 문제해결: 2 },
  },
]

const TEACHER_TUTORIAL_STEPS = [
  {
    targetSelector: '[data-tutorial="add-unit"]',
    title: '단원을 추가할 수 있어요',
    description: '교육과정(NCIC 2022)에서 단원을 선택해 학생에게 배정해요. 체험 모드에서는 비활성화되어 있어요.',
    position: 'top' as const,
  },
  {
    targetSelector: '[data-tutorial="student-card"]',
    title: '최근 학습 리포트',
    description: '학생별 최신 이해도를 바로 확인할 수 있어요. 클릭하면 상세 리포트로 이동해요. 사이드바의 "학생 목록"에서 전체를 볼 수 있어요.',
    position: 'top' as const,
  },
]

const COMPETENCY_ITEMS = [
  { key: '자기관리' as const, color: '#7C6FBF' },
  { key: '대인관계' as const, color: '#E8C547' },
  { key: '시민' as const, color: '#4CAF50' },
  { key: '문제해결' as const, color: '#FF9600' },
]

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #ECEAF6',
} as const

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const bg = score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020'
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: bg, color }}>
      {score}점
    </span>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="px-5 py-4" style={{ ...cardStyle, borderTop: `3px solid ${accent}` }}>
      <p className="text-xs font-semibold" style={{ color: '#9EA0B4' }}>{label}</p>
      <p className="mt-1 text-2xl font-extrabold leading-tight" style={{ color: '#2D2F2F' }}>{value}</p>
    </div>
  )
}

function LeftNav() {
  return (
    <aside
      className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#13112A' }}
    >
      <div className="px-5 pt-8 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          
          <span className="text-lg text-white" style={{ fontFamily: "'Berkshire Swash', cursive" }}>Moni</span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold shrink-0"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547' }}
          >
            이
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-white truncate">{DEMO_TEACHER.name} 선생님</p>
            <p className="mt-0.5 text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{DEMO_CLASS.name}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>학생 초대 코드</p>
          <div
            className="flex items-center justify-between rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <span className="font-mono text-base font-extrabold tracking-widest text-white">
              {DEMO_CLASS.inviteCode}
            </span>
            <button
              type="button"
              onClick={() => alert('체험 모드에서는 복사가 제한됩니다')}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}
            >
              <Copy size={13} />복사
            </button>
          </div>
        </div>

        <span
          className="mt-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547' }}
        >
          체험 모드
        </span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        <div
          className="flex items-center gap-3 rounded-full px-3 py-2.5"
          style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}
        >
          <BookOpen size={18} weight="fill" />
          <span className="text-sm font-extrabold">단원 관리</span>
        </div>
        <Link href="/demo/teacher/students" className="flex items-center gap-3 rounded-full px-3 py-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <Users size={18} />
          <span className="text-sm font-semibold">학생 목록</span>
        </Link>
        <div className="flex items-center gap-3 rounded-full px-3 py-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <Trophy size={18} />
          <span className="text-sm font-semibold">퀘스트</span>
        </div>
        <Link href="/demo/teacher/summary" className="flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <ChartBar size={18} />
          <span className="text-sm font-semibold">반 요약</span>
        </Link>
      </div>

      {/* 하단: 체험 선택 */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/demo" className="flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <House size={18} />
          <span className="text-sm font-semibold">체험 선택으로</span>
        </Link>
      </div>
    </aside>
  )
}

function UnitCard({ title, gradeHint, completed, total }: {
  title: string; gradeHint: string; completed: number; total: number
}) {
  const percent = Math.round((completed / total) * 100)
  return (
    <div className="flex flex-col gap-4 p-5" style={cardStyle}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{title}</p>
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: '#F4F2FF', color: '#7C6FBF' }}
          >
            {gradeHint}
          </span>
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span style={{ color: '#9EA0B4' }}>학생 완료</span>
          <span className="font-extrabold" style={{ color: '#E8C547' }}>{completed}/{total}명</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: '#F0EFF8' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: percent === 100
                ? '#4CAF50'
                : 'linear-gradient(90deg, #7C6FBF 0%, #E8C547 100%)',
            }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" disabled title="체험 모드에서는 비활성화됩니다"
          className="flex-1 cursor-not-allowed rounded-xl py-2 text-xs font-bold opacity-50"
          style={{ background: '#F4F2FF', color: '#7C6FBF' }}>
          <span className="inline-flex items-center gap-1.5"><PencilSimple size={13} weight="bold" />수정</span>
        </button>
        <button type="button" disabled title="체험 모드에서는 비활성화됩니다"
          className="flex-1 cursor-not-allowed rounded-xl py-2 text-xs font-bold opacity-50"
          style={{ background: 'rgba(244,67,54,0.08)', color: '#F44336' }}>
          <span className="inline-flex items-center gap-1.5"><Trash size={13} weight="bold" />삭제</span>
        </button>
      </div>
    </div>
  )
}

function CompetencyMini({ data }: { data: { 자기관리: number; 대인관계: number; 시민: number; 문제해결: number } }) {
  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F0EFF8' }}>
      <p className="text-xs font-bold mb-2" style={{ color: '#7C6FBF' }}>📊 핵심역량</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {COMPETENCY_ITEMS.map(({ key, color }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs" style={{ color: '#9EA0B4' }}>{key}</span>
              <span className="text-xs font-bold" style={{ color }}>{data[key]}/5</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: '#F0EFF8' }}>
              <div className="h-full rounded-full" style={{ width: `${(data[key] / 5) * 100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RightSidebar() {
  return (
    <aside
      data-tutorial="sidebar-summary"
      className="hidden lg:flex w-[300px] shrink-0 flex-col overflow-y-auto p-4"
      style={{ background: '#FFFFFF', borderLeft: '1px solid #ECEAF6' }}
    >
      <div className="mb-4">
        <h2 className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>최근 리포트</h2>
        <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>GPT-4o + Gemma 4B 분석</p>
      </div>

      <div className="space-y-3">
        {DEMO_REPORTS.map((report, index) => (
          <div
            key={`${report.studentName}-${report.score}`}
            data-tutorial={index === 0 ? 'student-card' : undefined}
            className="rounded-2xl p-4"
            style={cardStyle}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold shrink-0"
                  style={{ background: '#F4F2FF', color: '#7C6FBF' }}
                >
                  {report.studentName[0]}
                </div>
                <p className="text-sm font-bold" style={{ color: '#2D2F2F' }}>{report.studentName}</p>
              </div>
              <ScoreBadge score={report.score} />
            </div>
            <p className="text-xs leading-relaxed" style={{
              color: '#6B6B8D',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {report.summary}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {report.weakPoints.map((point) => (
                <span key={point} className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(255,150,0,0.10)', color: '#CC7000' }}>
                  {point}
                </span>
              ))}
            </div>
            <CompetencyMini data={report.competency} />
          </div>
        ))}
      </div>
    </aside>
  )
}

export default function DemoTeacherPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      <LeftNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 흰색 헤더 */}
        <div className="px-6 py-4 shrink-0 flex items-center gap-4"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>단원 관리</h1>
            <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{DEMO_CLASS.name} · 5명 수강 중</p>
          </div>
          <Link href="/demo/teacher/units/new"
            data-tutorial="add-unit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
            <Plus size={15} weight="bold" /> 단원 추가
          </Link>
          <span className="rounded-full px-3 py-1 text-xs font-bold shrink-0"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">

          <div
            className="mb-5 w-full rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ background: 'rgba(232,197,71,0.16)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.30)' }}
          >
            샘플 데이터 · 실제 데이터는 회원가입 후 확인 가능
          </div>

          <div className="mb-5 grid grid-cols-4 gap-3">
            <StatCard label="학생 수" value="5명" accent="#7C6FBF" />
            <StatCard label="활성 단원" value="2개" accent="#E8C547" />
            <StatCard label="평균 이해도" value="68점" accent="#4CAF50" />
            <StatCard label="완료 세션" value="4회" accent="#FF9600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_UNITS.map((unit) => (
              <UnitCard key={unit.id} title={unit.title} gradeHint={unit.gradeHint}
                completed={unit.completed} total={unit.total} />
            ))}
          </div>

          {/* 최근 리포트 (컴팩트) */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>최근 학습 리포트</h2>
              <Link href="/demo/teacher/students" className="text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: '#7C6FBF' }}>
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-2" data-tutorial="student-card">
              {DEMO_REPORTS.slice(0, 3).map((report) => (
                <Link key={`${report.studentName}-${report.score}`}
                  href={`/demo/teacher/students/s1`}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:translate-y-[-1px]"
                  style={cardStyle}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold shrink-0"
                    style={{ background: '#F4F2FF', color: '#7C6FBF' }}>
                    {report.studentName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#2D2F2F' }}>{report.studentName}</p>
                    <p className="text-xs truncate" style={{ color: '#9EA0B4' }}>{report.summary}</p>
                  </div>
                  <ScoreBadge score={report.score} />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      </div>

      <DemoTutorialOverlay
        steps={TEACHER_TUTORIAL_STEPS}
        storageKey="demo-teacher-tutorial"
      />
    </div>
  )
}
