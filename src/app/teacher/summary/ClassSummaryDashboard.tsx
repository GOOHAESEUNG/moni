'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, Users, Trophy, ChartBar,
  Lightning, Warning, TrendUp,
} from '@phosphor-icons/react'
import type { CompetencyScores } from '@/types/database'

type CoreCompetencyScores = Omit<CompetencyScores, 'comment'>

export interface ClassSummaryData {
  className: string
  profileName: string
  totalStudents: number
  activeStudents: number
  avgScore: number | null
  avgCompetency: CoreCompetencyScores | null
  topWeakPoints: { text: string; count: number }[]
  students: {
    id: string
    name: string
    avgScore: number | null
    sessionCount: number
    latestScore: number | null
  }[]
}

export interface ClassSummaryDashboardProps {
  data: ClassSummaryData
}

const COMPETENCY_LABELS: { key: keyof CoreCompetencyScores; label: string; color: string }[] = [
  { key: '자기관리역량', label: '자기관리', color: '#7C6FBF' },
  { key: '대인관계역량', label: '대인관계', color: '#E8C547' },
  { key: '시민역량', label: '시민', color: '#4CAF50' },
  { key: '문제해결역량', label: '문제해결', color: '#FF9600' },
]

function scoreColor(score: number | null) {
  if (score === null) return '#9EA0B4'
  if (score >= 80) return '#4CAF50'
  if (score >= 60) return '#C8A020'
  return '#FF9600'
}

function scoreBg(score: number | null) {
  if (score === null) return 'rgba(158,160,180,0.08)'
  if (score >= 80) return 'rgba(76,175,80,0.08)'
  if (score >= 60) return 'rgba(232,197,71,0.08)'
  return 'rgba(255,150,0,0.08)'
}

export default function ClassSummaryDashboard({ data }: ClassSummaryDashboardProps) {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(false)

  const totalSessions = data.students.reduce((sum, s) => sum + s.sessionCount, 0)
  const participationRate = data.totalStudents > 0
    ? Math.round((data.activeStudents / data.totalStudents) * 100)
    : 0

  async function generateSuggestion() {
    setAiLoading(true)
    setAiError(false)
    try {
      const res = await fetch('/api/teacher/class-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: data.className,
          weakPoints: data.topWeakPoints.map(w => w.text),
          avgCompetency: data.avgCompetency,
        }),
      })
      const json = await res.json()
      if (json.suggestion) {
        setAiSuggestion(json.suggestion)
      } else {
        setAiError(true)
      }
    } catch {
      setAiError(true)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>

      {/* ── 사이드바 (220px) ── */}
      <nav
        className="hidden md:flex flex-col w-[220px] shrink-0 overflow-y-auto"
        style={{ background: '#13112A' }}
      >
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-extrabold mb-5" style={{ color: '#E8C547', letterSpacing: '-0.01em' }}>🌙 무니에게 알려줘</p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(232,197,71,0.18)' }}>
              <span className="text-sm font-extrabold" style={{ color: '#E8C547' }}>
                {data.profileName.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{data.profileName} 선생님</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>{data.className}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1">
          <Link href="/teacher"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <BookOpen size={18} weight="regular" />
            <span className="font-semibold text-sm">단원 관리</span>
          </Link>

          <Link href="/teacher/students"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Users size={18} weight="regular" />
            <span className="font-semibold text-sm">학생 목록</span>
          </Link>

          <Link href="/teacher/quests/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <Trophy size={18} weight="regular" />
            <span className="font-semibold text-sm">퀘스트</span>
          </Link>

          {/* 반 요약 — active */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547', borderLeft: '3px solid #E8C547' }}>
            <ChartBar size={18} weight="fill" />
            <span className="font-bold text-sm">반 요약</span>
          </div>
        </div>
      </nav>

      {/* ── 메인 콘텐츠 ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 shrink-0" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <div className="flex items-center gap-3">
            <h1 className="font-extrabold text-xl" style={{ color: '#2D2F2F' }}>반 전체 현황</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(124,111,191,0.12)', color: '#7C6FBF' }}>
              {data.className}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학생들의 학습 현황을 한눈에 확인하세요</p>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* 전체 빈 상태 */}
            {data.totalStudents === 0 && (
              <div className="rounded-[20px] bg-white p-8 text-center" style={{ border: '1px solid #ECEAF6' }}>
                <p className="text-3xl mb-3">🌙</p>
                <p className="text-base font-extrabold mb-1" style={{ color: '#2D2F2F' }}>아직 학생이 없어요</p>
                <p className="text-sm mb-4" style={{ color: '#9EA0B4' }}>학생들이 초대 코드로 반에 참여하면 학습 현황이 여기에 표시돼요.</p>
                <Link href="/teacher" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold"
                  style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 3px 0 #C8A020' }}>
                  대시보드로 돌아가기
                </Link>
              </div>
            )}

            {data.totalStudents > 0 && data.activeStudents === 0 && (
              <div className="rounded-[20px] p-6 text-center" style={{ background: 'rgba(232,197,71,0.08)', border: '1.5px solid rgba(232,197,71,0.25)' }}>
                <p className="text-2xl mb-2">📚</p>
                <p className="text-sm font-extrabold mb-1" style={{ color: '#2D2F2F' }}>학습 데이터를 기다리는 중이에요</p>
                <p className="text-xs" style={{ color: '#9EA0B4' }}>학생들이 무니와 대화를 시작하면 반 전체 현황이 자동으로 업데이트돼요.</p>
              </div>
            )}

            {/* 통계 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 반 평균 이해도 */}
              <div className="rounded-[20px] bg-white overflow-hidden" style={{ border: '1px solid #ECEAF6' }}>
                <div style={{ height: 4, background: data.avgScore !== null ? scoreColor(data.avgScore) : '#9EA0B4' }} />
                <div className="p-5">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#9EA0B4' }}>반 평균 이해도</p>
                  <p className="text-3xl font-extrabold" style={{ color: data.avgScore !== null ? scoreColor(data.avgScore) : '#9EA0B4' }}>
                    {data.avgScore ?? '-'}<span className="text-base font-bold ml-0.5">점</span>
                  </p>
                </div>
              </div>

              {/* 학습 참여율 */}
              <div className="rounded-[20px] bg-white overflow-hidden" style={{ border: '1px solid #ECEAF6' }}>
                <div style={{ height: 4, background: '#7C6FBF' }} />
                <div className="p-5">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#9EA0B4' }}>학습 참여율</p>
                  <p className="text-3xl font-extrabold" style={{ color: '#7C6FBF' }}>
                    {data.activeStudents}<span className="text-base font-bold ml-0.5">/{data.totalStudents}명</span>
                  </p>
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: 'rgba(124,111,191,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${participationRate}%`, background: '#7C6FBF' }} />
                  </div>
                </div>
              </div>

              {/* 총 학습 횟수 */}
              <div className="rounded-[20px] bg-white overflow-hidden" style={{ border: '1px solid #ECEAF6' }}>
                <div style={{ height: 4, background: '#E8C547' }} />
                <div className="p-5">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#9EA0B4' }}>총 학습 횟수</p>
                  <p className="text-3xl font-extrabold" style={{ color: '#E8C547' }}>
                    {totalSessions}<span className="text-base font-bold ml-0.5">회</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2컬럼: 역량+약점 | AI추천 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

              {/* 좌측 */}
              <div className="space-y-5">
                {/* 역량 분석 */}
                {data.avgCompetency && (
                  <div className="rounded-[20px] bg-white p-5" style={{ border: '1px solid #ECEAF6' }}>
                    <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>📊 반 평균 역량 분석</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {COMPETENCY_LABELS.map(({ key, label, color }) => {
                        const val = data.avgCompetency![key]
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold" style={{ color: '#6B6B8D' }}>{label}</span>
                              <span className="text-sm font-extrabold" style={{ color }}>{val}<span className="text-xs font-normal">/5</span></span>
                            </div>
                            <div className="h-2.5 rounded-full" style={{ background: 'rgba(200,190,240,0.25)' }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${(val / 5) * 100}%`, background: color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 약점 TOP */}
                {data.topWeakPoints.length > 0 && (
                  <div className="rounded-[20px] p-5" style={{ background: 'rgba(255,150,0,0.06)', border: '1.5px solid rgba(255,150,0,0.18)' }}>
                    <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>
                      <Warning size={16} weight="fill" className="inline-block mr-1.5 -mt-0.5" style={{ color: '#FF9600' }} />
                      반 전체 약점 TOP {data.topWeakPoints.length}
                    </p>
                    <div className="space-y-2.5">
                      {data.topWeakPoints.map((wp, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold"
                            style={{ background: 'rgba(255,150,0,0.15)', color: '#FF9600' }}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: '#2D2F2F' }}>{wp.text}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{wp.count}명의 학생에게서 발견</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 학생별 이해도 */}
                <div className="rounded-[20px] bg-white p-5" style={{ border: '1px solid #ECEAF6' }}>
                  <p className="text-sm font-extrabold mb-4" style={{ color: '#2D2F2F' }}>
                    <Users size={16} weight="fill" className="inline-block mr-1.5 -mt-0.5" style={{ color: '#7C6FBF' }} />
                    학생별 이해도
                  </p>

                  {data.students.length === 0 ? (
                    <p className="text-sm text-center py-6" style={{ color: '#9EA0B4' }}>아직 등록된 학생이 없어요</p>
                  ) : (
                    <div className="space-y-3">
                      {[...data.students]
                        .sort((a, b) => (b.avgScore ?? -1) - (a.avgScore ?? -1))
                        .map((student) => (
                          <Link
                            key={student.id}
                            href={`/teacher/students/${student.id}`}
                            className="flex items-center gap-3 p-3 rounded-2xl transition-colors hover:bg-[#F5F4FA]"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                              style={{ background: scoreBg(student.avgScore), color: scoreColor(student.avgScore) }}>
                              {student.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold truncate" style={{ color: '#2D2F2F' }}>{student.name}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs" style={{ color: '#9EA0B4' }}>{student.sessionCount}회</span>
                                  {student.avgScore !== null && (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                                      style={{ background: scoreBg(student.avgScore), color: scoreColor(student.avgScore) }}>
                                      {student.avgScore}점
                                    </span>
                                  )}
                                  {student.avgScore !== null && student.avgScore < 60 && (
                                    <Warning size={14} weight="fill" style={{ color: '#FF9600' }} />
                                  )}
                                </div>
                              </div>
                              <div className="h-1.5 rounded-full" style={{ background: 'rgba(200,190,240,0.20)' }}>
                                <div className="h-full rounded-full transition-all"
                                  style={{ width: `${student.avgScore ?? 0}%`, background: scoreColor(student.avgScore) }} />
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 우측: AI 수업 추천 */}
              <div className="lg:sticky lg:top-6 self-start">
                <div className="rounded-[20px] p-5" style={{ background: 'rgba(232,197,71,0.08)', border: '1.5px solid rgba(232,197,71,0.25)' }}>
                  <p className="text-sm font-extrabold mb-3" style={{ color: '#2D2F2F' }}>
                    <Lightning size={16} weight="fill" className="inline-block mr-1.5 -mt-0.5" style={{ color: '#E8C547' }} />
                    AI 수업 추천
                  </p>

                  {!aiSuggestion && !aiLoading && (
                    <>
                      <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B6B8D' }}>
                        학생들의 약점과 역량 데이터를 분석하여 다음 수업 방향을 제안해드려요.
                      </p>
                      <button
                        onClick={generateSuggestion}
                        disabled={data.topWeakPoints.length === 0}
                        className="w-full font-extrabold text-sm rounded-full py-3 transition-all disabled:opacity-40"
                        style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 3px 0 #C8A020' }}
                      >
                        AI 추천 생성하기
                      </button>
                      {data.topWeakPoints.length === 0 && (
                        <p className="text-xs text-center mt-2" style={{ color: '#9EA0B4' }}>학습 데이터가 쌓이면 사용할 수 있어요</p>
                      )}
                    </>
                  )}

                  {aiLoading && (
                    <div className="text-center py-6">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8C547', borderTopColor: 'transparent' }} />
                      <p className="text-xs font-medium" style={{ color: '#9EA0B4' }}>AI가 분석 중이에요...</p>
                    </div>
                  )}

                  {aiError && (
                    <div className="text-center py-4">
                      <p className="text-xs mb-3" style={{ color: '#FF9600' }}>추천 생성에 실패했어요</p>
                      <button onClick={generateSuggestion}
                        className="text-xs font-bold px-4 py-2 rounded-full"
                        style={{ background: 'rgba(232,197,71,0.20)', color: '#C8A020' }}>
                        다시 시도
                      </button>
                    </div>
                  )}

                  {aiSuggestion && (
                    <div>
                      <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.80)' }}>
                        <p className="text-sm leading-relaxed" style={{ color: '#2D2F2F' }}>{aiSuggestion}</p>
                      </div>
                      <button onClick={() => { setAiSuggestion(null); generateSuggestion() }}
                        className="w-full text-xs font-bold py-2 rounded-full transition-colors"
                        style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}>
                        <TrendUp size={14} weight="bold" className="inline-block mr-1 -mt-0.5" />
                        다시 생성
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
