'use client'

import Link from 'next/link'
import { ArrowLeft, Users, BookOpen, ChartBar, CheckCircle } from '@phosphor-icons/react'

const DEMO_CLASS = { name: '3학년 2반', inviteCode: 'ABC123' }
const DEMO_UNIT = { title: '도형의 넓이', gradeHint: '3학년' }

interface DemoStudent {
  id: string
  name: string
  score: number | null
  status: '완료' | '진행 중' | '미시작'
  report: {
    summary: string
    weakPoints: string[]
    suggestions: string[]
  } | null
}

const DEMO_STUDENTS: DemoStudent[] = [
  {
    id: '1', name: '김지민', score: 88, status: '완료',
    report: {
      summary: '직사각형과 삼각형의 넓이 공식을 정확히 이해하고 설명했어요. 특히 삼각형에서 높이의 의미를 무니에게 잘 설명했어요.',
      weakPoints: ['평행사변형 넓이에서 "밑변×높이"의 의미를 혼동함', '사다리꼴 넓이 공식을 아직 연결짓지 못함'],
      suggestions: ['평행사변형을 직사각형으로 변환하는 시각화 연습', '사다리꼴을 두 삼각형으로 나누는 방법 탐구'],
    },
  },
  {
    id: '2', name: '박서연', score: 72, status: '완료',
    report: {
      summary: '기본 공식은 알고 있지만 왜 그 공식이 성립하는지 설명할 때 어려움을 겪었어요. 암기보다 이해가 더 필요해요.',
      weakPoints: ['넓이 공식의 이유를 설명하지 못함', '단위(cm²)의 의미를 정확히 이해하지 못함'],
      suggestions: ['격자 종이에 도형을 직접 그려보며 넓이 세기 연습', '단위 면적(1cm²)의 개념을 실생활과 연결'],
    },
  },
  {
    id: '3', name: '이준혁', score: 45, status: '완료',
    report: {
      summary: '직사각형 넓이는 구할 수 있지만 다른 도형으로 확장이 어려워요. 기초부터 차근차근 다시 접근이 필요해요.',
      weakPoints: ['삼각형 높이의 개념이 불명확함', '가로와 세로, 밑변과 높이의 차이를 혼동함'],
      suggestions: ['직사각형 → 삼각형 순서로 차근차근 복습', '실물 도형을 오려서 넓이 비교 활동 추천'],
    },
  },
  { id: '4', name: '최유나', score: null, status: '진행 중', report: null },
  { id: '5', name: '정하늘', score: null, status: '미시작', report: null },
]

const clayCard = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

function getScoreColor(score: number) {
  if (score >= 80) return '#4CAF50'
  if (score >= 60) return '#E8C547'
  return '#FF9600'
}

const completedStudents = DEMO_STUDENTS.filter((s) => s.score !== null)
const avgScore =
  completedStudents.length > 0
    ? Math.round(completedStudents.reduce((sum, s) => sum + (s.score ?? 0), 0) / completedStudents.length)
    : null

export default function DemoTeacherPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7F7F7' }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 border-b"
        style={{ background: '#FFFFFF', borderColor: '#EBEBEB', height: 56 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-black" style={{ color: '#E8C547' }}>무니에게 알려줘</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,197,71,0.12)', color: '#9B7E00' }}>
            선생님 대시보드 체험
          </span>
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
          style={{ background: 'rgba(232,197,71,0.10)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.25)' }}
        >
          샘플 데이터로 보는 체험 모드
        </div>

        {/* 2x2 통계 그리드 */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center py-5" style={clayCard}>
            <Users size={22} weight="fill" style={{ color: '#E8C547', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#2D2F2F' }}>{DEMO_STUDENTS.length}명</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학생 수</span>
          </div>
          <div className="flex flex-col items-center py-5" style={clayCard}>
            <CheckCircle size={22} weight="fill" style={{ color: '#4CAF50', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#2D2F2F' }}>{completedStudents.length}명</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>완료</span>
          </div>
          <div className="flex flex-col items-center py-5" style={clayCard}>
            <ChartBar size={22} weight="fill" style={{ color: '#E8C547', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#2D2F2F' }}>{avgScore ?? '—'}</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>평균 점수</span>
          </div>
          <div className="flex flex-col items-center py-5" style={clayCard}>
            <BookOpen size={22} weight="fill" style={{ color: '#E8C547', marginBottom: 6 }} />
            <span className="text-2xl font-black" style={{ color: '#2D2F2F' }}>1개</span>
            <span className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>활성 단원</span>
          </div>
        </div>

        {/* 활성 단원 카드 */}
        <div className="mb-5 p-5" style={clayCard}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-base font-bold" style={{ color: '#2D2F2F' }}>{DEMO_UNIT.title}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{DEMO_UNIT.gradeHint}</p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'rgba(76,175,80,0.12)', color: '#4CAF50' }}
            >
              진행 중
            </span>
          </div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#9EA0B4' }}>
            <span>완료 학생</span>
            <span>{completedStudents.length} / {DEMO_STUDENTS.length}명 완료 (
              {Math.round((completedStudents.length / DEMO_STUDENTS.length) * 100)}%)
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#F7F7F7' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(completedStudents.length / DEMO_STUDENTS.length) * 100}%`,
                background: '#E8C547',
              }}
            />
          </div>
        </div>

        {/* 학생 리포트 섹션 */}
        <div className="mb-5">
          <h2 className="mb-3 text-sm font-bold" style={{ color: '#6B6B8D' }}>학생 리포트</h2>

          {/* 완료 학생 — 확장 카드 */}
          {DEMO_STUDENTS.filter((s) => s.status === '완료' && s.report).map((s) => (
            <div key={s.id} className="overflow-hidden" style={{ ...clayCard, padding: 0, marginBottom: 12 }}>
              {/* 헤더 */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #F7F7F7' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547' }}
                  >
                    {s.name[0]}
                  </div>
                  <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>{s.name}</p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: `${getScoreColor(s.score!)}20`, color: getScoreColor(s.score!) }}
                >
                  {s.score}점
                </span>
              </div>

              {/* 리포트 본문 */}
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{s.report!.summary}</p>

                {s.report!.weakPoints.length > 0 && (
                  <div>
                    <p className="text-xs font-bold mb-1.5" style={{ color: '#FF9600' }}>💡 더 알아볼 부분</p>
                    {s.report!.weakPoints.map((p, i) => (
                      <p key={i} className="text-xs flex gap-1.5 mb-1" style={{ color: '#6B6B8D' }}>
                        <span style={{ color: '#FF9600' }}>•</span>{p}
                      </p>
                    ))}
                  </div>
                )}

                {s.report!.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold mb-1.5" style={{ color: '#4CAF50' }}>✓ 다음 학습 제안</p>
                    {s.report!.suggestions.map((sg, i) => (
                      <p key={i} className="text-xs flex gap-1.5 mb-1" style={{ color: '#6B6B8D' }}>
                        <span style={{ color: '#4CAF50' }}>•</span>{sg}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 미완료 학생 — compact row */}
          {DEMO_STUDENTS.filter((s) => s.status !== '완료').map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-5 py-3.5 bg-white rounded-[16px] mb-2"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#F7F7F7', color: '#9EA0B4' }}
                >
                  {s.name[0]}
                </div>
                <span className="font-semibold text-sm" style={{ color: '#9EA0B4' }}>{s.name}</span>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: '#F7F7F7', color: '#9EA0B4' }}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>

        {/* 초대 코드 카드 */}
        <div className="p-5" style={clayCard}>
          <p className="text-xs mb-1" style={{ color: '#9EA0B4' }}>학생 초대 코드 (샘플)</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold tracking-widest" style={{ color: '#2D2F2F' }}>
              {DEMO_CLASS.inviteCode}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: '#F7F7F7', color: '#9EA0B4' }}>
              체험 모드
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
