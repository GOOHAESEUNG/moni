'use client'

import { useMemo, useState, type ReactNode } from 'react'
import DemoTeacherSidebar from '@/components/DemoTeacherSidebar'
import TeacherSidebar from '@/components/TeacherSidebar'
import Link from 'next/link'
import {
  BookOpen,
  ChartBar,
  Lightning,
  TrendUp,
  Users,
  Warning,
} from '@phosphor-icons/react'

export interface ClassSummaryData {
  className: string
  profileName: string
  totalStudents: number
  activeStudents: number
  avgScore: number | null
  avgCompetency: {
    자기관리역량: number
    대인관계역량: number
    시민역량: number
    문제해결역량: number
  }
  topWeakPoints: { text: string; count: number }[]
  students: {
    id: string
    name: string
    avgScore: number | null
    sessionCount: number
    latestScore: number | null
  }[]
}

interface Props {
  data: ClassSummaryData
  classId?: string
  demoMode?: boolean
}

const COMPETENCY_ITEMS = [
  { key: '자기관리역량' as const, label: '자기관리역량', color: '#7C6FBF' },
  { key: '대인관계역량' as const, label: '대인관계역량', color: '#E8C547' },
  { key: '시민역량' as const, label: '시민역량', color: '#4CAF50' },
  { key: '문제해결역량' as const, label: '문제해결역량', color: '#FF9600' },
]

const cardClassName = 'rounded-[20px] border p-5'
const cardStyle = { background: '#FFFFFF', borderColor: '#ECEAF6' }

function formatScore(score: number | null) {
  return score === null ? '-' : `${score}점`
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-xs font-bold"
        style={{ background: '#F6F5FB', color: '#9EA0B4' }}
      >
        미학습
      </span>
    )
  }

  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#E8C547' : '#FF9600'
  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ background: `${color}18`, color }}
    >
      {score}점
    </span>
  )
}

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode
  label: string
  value: string
  helper: string
}) {
  return (
    <div className={cardClassName} style={cardStyle}>
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: '#F6F1CF', color: '#2D2F2F' }}
        >
          {icon}
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color: '#9EA0B4' }}>{label}</p>
      <p className="mt-1 text-3xl font-extrabold leading-none" style={{ color: '#2D2F2F' }}>{value}</p>
      <p className="mt-2 text-xs" style={{ color: '#9EA0B4' }}>{helper}</p>
    </div>
  )
}

function EmptyCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className={`${cardClassName} flex min-h-[220px] flex-col items-center justify-center text-center`} style={cardStyle}>
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl"
        style={{ background: '#F7F5FD', color: '#9EA0B4' }}
      >
        {icon}
      </div>
      <p className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: '#9EA0B4' }}>{body}</p>
    </div>
  )
}


export default function ClassSummaryDashboard({ data, classId, demoMode = false }: Props) {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)

  const sortedStudents = useMemo(() => {
    return [...data.students].sort((left, right) => {
      if (left.avgScore === null && right.avgScore === null) {
        return left.name.localeCompare(right.name, 'ko')
      }
      if (left.avgScore === null) return 1
      if (right.avgScore === null) return -1
      return right.avgScore - left.avgScore || left.name.localeCompare(right.name, 'ko')
    })
  }, [data.students])

  const participationRate = data.totalStudents > 0
    ? Math.round((data.activeStudents / data.totalStudents) * 100)
    : 0

  const totalLearningCount = data.students.reduce((sum, student) => sum + student.sessionCount, 0)
  const hasSessionData = totalLearningCount > 0
  const hasWeakPoints = data.topWeakPoints.length > 0
  const hasCompetencyData = COMPETENCY_ITEMS.some(({ key }) => data.avgCompetency[key] > 0)


  async function requestSuggestion() {
    if (demoMode) {
      setLoadingSuggestion(true)
      setTimeout(() => {
        setSuggestion(
          '## 이번 주 수업 추천\n\n' +
          '**1. 평행사변형 넓이 복습 (15분)**\n' +
          '반 전체적으로 "평행사변형 넓이 공식의 원리"에서 약점이 발견되었습니다. 직사각형에서 평행사변형으로의 변환 과정을 시각적으로 보여주는 활동을 추천합니다.\n\n' +
          '**2. 단위 연결 심화 (10분)**\n' +
          'cm²의 실제 의미를 모눈종이로 체험하는 활동이 효과적입니다. "1cm²가 실제로 얼마나 큰지" 손가락으로 비교하게 해보세요.\n\n' +
          '**3. 무니 복습 퀘스트 배정**\n' +
          '김하은, 박서윤 학생에게 "도형의 넓이" 단원 재학습을 퀘스트로 배정하면 이해도 향상이 기대됩니다.'
        )
        setLoadingSuggestion(false)
      }, 1500)
      return
    }
    if (!classId) {
      setSuggestionError('반 정보를 찾지 못했어요.')
      return
    }

    setLoadingSuggestion(true)
    setSuggestionError(null)

    try {
      const response = await fetch('/api/teacher/class-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          weakPoints: data.topWeakPoints,
          avgCompetency: data.avgCompetency,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : '추천 생성에 실패했어요.')
      }

      setSuggestion(typeof payload?.suggestion === 'string' ? payload.suggestion : '추천 결과가 비어 있어요.')
    } catch (error) {
      setSuggestionError(error instanceof Error ? error.message : '추천 생성 중 오류가 발생했어요.')
    } finally {
      setLoadingSuggestion(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      {demoMode
        ? <DemoTeacherSidebar activeTab="summary" />
        : <TeacherSidebar activeTab="summary" teacherName={data.profileName} className={data.className} inviteCode="" />
      }

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-[#ECEAF6] bg-white px-5 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9EA0B4' }}>{data.className}</p>
              <h1 className="mt-1 text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>반 요약</h1>
              <p className="mt-1 text-sm" style={{ color: '#9EA0B4' }}>
                이해도, 핵심역량, 주요 약점을 한 번에 확인해요
              </p>
            </div>
            {demoMode && (
              <span
                className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: 'rgba(232,197,71,0.16)', color: '#9B7E00' }}
              >
                샘플 데이터
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 px-5 py-5 md:px-8 md:py-6">
          <section className="grid gap-4 md:grid-cols-3" data-tutorial="stats-cards">
            <StatCard
              icon={<TrendUp size={22} weight="bold" />}
              label="반 평균 이해도"
              value={formatScore(data.avgScore)}
              helper={hasSessionData ? `${data.activeStudents}명이 학습에 참여했어요` : '아직 집계할 학습 기록이 없어요'}
            />
            <StatCard
              icon={<Users size={22} weight="bold" />}
              label="학습 참여율"
              value={`${participationRate}%`}
              helper={`${data.activeStudents}/${data.totalStudents}명 참여`}
            />
            <StatCard
              icon={<BookOpen size={22} weight="bold" />}
              label="총 학습 횟수"
              value={`${totalLearningCount}회`}
              helper="종료된 세션 기준으로 집계했어요"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className={`${cardClassName}`} style={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <ChartBar size={18} weight="bold" style={{ color: '#2D2F2F' }} />
                <h2 className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>역량 분석</h2>
              </div>

              {hasCompetencyData ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {COMPETENCY_ITEMS.map(({ key, label, color }) => {
                    const value = data.avgCompetency[key]
                    return (
                      <div key={key} className="rounded-[18px] p-4" style={{ background: '#F8F7FC' }}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: '#2D2F2F' }}>{label}</span>
                          <span className="text-sm font-extrabold" style={{ color }}>{value.toFixed(1)}/5</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, (value / 5) * 100)}%`, background: color }}
                          />
                        </div>
                        <p className="mt-2 text-xs" style={{ color: '#9EA0B4' }}>
                          반 전체 리포트 평균값이에요
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyCard
                  icon={<ChartBar size={28} weight="bold" />}
                  title="역량 데이터가 아직 없어요"
                  body="리포트가 쌓이면 자기관리, 대인관계, 시민, 문제해결 역량 평균을 보여드려요."
                />
              )}
            </div>

            <div className={`${cardClassName}`} style={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Warning size={18} weight="bold" style={{ color: '#FF9600' }} />
                <h2 className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>약점 TOP 순위</h2>
              </div>

              {hasWeakPoints ? (
                <div className="space-y-3">
                  {data.topWeakPoints.map((item, index) => (
                    <div
                      key={`${item.text}-${index}`}
                      className="flex items-center gap-3 rounded-[18px] border px-4 py-3"
                      style={{ borderColor: '#ECEAF6', background: index === 0 ? '#FFF9E5' : '#FAF9FD' }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold"
                        style={{ background: index === 0 ? '#E8C547' : '#F0EEF8', color: index === 0 ? '#2D2F2F' : '#7C6FBF' }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: '#2D2F2F' }}>{item.text}</p>
                        <p className="text-xs" style={{ color: '#9EA0B4' }}>{item.count}회 언급</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCard
                  icon={<Warning size={28} weight="bold" />}
                  title="집계된 약점이 없어요"
                  body="학생 리포트의 weak_points가 쌓이면 가장 자주 나온 개념을 순위로 보여드려요."
                />
              )}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className={`${cardClassName}`} style={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Users size={18} weight="bold" style={{ color: '#2D2F2F' }} />
                <h2 className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>학생별 이해도</h2>
              </div>

              {sortedStudents.length > 0 ? (
                <div className="space-y-3">
                  {sortedStudents.map((student, index) => (
                    <Link
                      key={student.id}
                      href={demoMode ? `/demo/teacher/students/${student.id}` : `/teacher/students/${student.id}`}
                      className="block rounded-[18px] border px-4 py-4 transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#ECEAF6', background: '#FFFFFF' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold"
                          style={{ background: index === 0 ? '#FFF0B0' : '#F3F1FB', color: index === 0 ? '#8A6A00' : '#7C6FBF' }}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{student.name}</p>
                            {index === 0 && student.avgScore !== null && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                                style={{ background: '#FFF3C8', color: '#8A6A00' }}
                              >
                                상위
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs" style={{ color: '#9EA0B4' }}>
                            평균 {formatScore(student.avgScore)} · 최근 {formatScore(student.latestScore)} · {student.sessionCount}회 학습
                          </p>
                        </div>
                        <ScorePill score={student.avgScore} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyCard
                  icon={<Users size={28} weight="bold" />}
                  title="등록된 학생이 없어요"
                  body="학생이 반에 참여하면 여기에서 개인별 평균 이해도와 최근 점수를 확인할 수 있어요."
                />
              )}
            </div>

            <div className={`${cardClassName}`} style={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Lightning size={18} weight="fill" style={{ color: '#E8C547' }} />
                <h2 className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>AI 수업 추천</h2>
              </div>

              {(
                <>
                  <button
                    type="button"
                    onClick={requestSuggestion}
                    disabled={loadingSuggestion || !hasWeakPoints}
                    className="inline-flex items-center gap-2 justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: '#7C6FBF', color: '#FFFFFF' }}
                    data-tutorial="ai-suggestion"
                  >
                    {loadingSuggestion ? '추천 생성 중...' : 'AI 수업 추천 받기'}
                  </button>

                  <div className="mt-4 rounded-[18px] border px-5 py-5" style={{ borderColor: '#ECEAF6', background: '#FAF9FD' }}>
                    {suggestionError ? (
                      <p className="text-sm leading-relaxed" style={{ color: '#FF9600' }}>{suggestionError}</p>
                    ) : suggestion ? (
                      <div className="space-y-3">
                        {suggestion.split('\n').map((line, i) => {
                          const trimmed = line.trim()
                          if (!trimmed) return null
                          if (trimmed.startsWith('## ')) return <h3 key={i} className="text-base font-extrabold mt-2" style={{ color: '#2D2F2F' }}>{trimmed.slice(3)}</h3>
                          if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <h4 key={i} className="text-sm font-extrabold mt-3" style={{ color: '#7C6FBF' }}>{trimmed.slice(2, -2)}</h4>
                          if (trimmed.match(/^\*\*\d+\./)) {
                            const content = trimmed.replace(/\*\*/g, '')
                            return <h4 key={i} className="text-sm font-bold mt-3" style={{ color: '#2D2F2F' }}>{content}</h4>
                          }
                          return <p key={i} className="text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>{trimmed.replace(/\*\*/g, '')}</p>
                        })}
                      </div>
                    ) : hasWeakPoints ? (
                      <p className="text-sm leading-relaxed" style={{ color: '#9EA0B4' }}>
                        버튼을 눌러 AI가 분석한 맞춤 수업 전략을 확인해보세요.
                      </p>
                    ) : (
                      <p className="text-sm leading-relaxed" style={{ color: '#9EA0B4' }}>
                        집계된 약점이 없어서 아직 추천을 만들 수 없어요.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
