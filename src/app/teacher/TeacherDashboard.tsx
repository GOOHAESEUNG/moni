'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Copy, Check, Users, BookOpen,
  PencilSimple, Trash, Trophy, X,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Class, Unit, Quest, QuestCompletion } from '@/types/database'

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
  quests: Quest[]
  questCompletions: QuestCompletion[]
  totalStudents: number
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#F7F7F7', color: '#9EA0B4' }}>
        미완료
      </span>
    )
  }
  const color = score >= 90 ? '#4CAF50' : score >= 70 ? '#E8C547' : score >= 60 ? '#FF9600' : '#F44336'
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}20`, color }}>
      {score}점
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-5 py-4 rounded-2xl" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <p className="text-xs font-semibold" style={{ color: '#9EA0B4' }}>{label}</p>
      <p className="text-2xl font-extrabold leading-tight" style={{ color: '#2D2F2F' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: '#9EA0B4' }}>{sub}</p>}
    </div>
  )
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
  quests,
  questCompletions,
  totalStudents,
}: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [confirmDeleteUnit, setConfirmDeleteUnit] = useState<Unit | null>(null)
  const [deleting, setDeleting] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(currentClass.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDeleteUnit() {
    if (!confirmDeleteUnit) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('units').update({ is_active: false }).eq('id', confirmDeleteUnit.id)
    setConfirmDeleteUnit(null)
    setDeleting(false)
    router.refresh()
  }

  // 최근 리포트 + 학생 이름 매핑
  const studentMap = new Map(students.map((s) => [s.id, s.name]))
  const recentReports = reports.slice(0, 8).map((r) => {
    const sessionsData = Array.isArray(r.sessions) ? r.sessions[0] : r.sessions
    return { ...r, studentName: studentMap.get(r.student_id) ?? '학생', score: sessionsData?.understanding_score ?? null }
  })

  // 완료 세션 수
  const totalCompletedSessions = completedSessions.length

  // 단원별 완료율 평균
  const avgCompletion = units.length > 0 && totalStudents > 0
    ? Math.round(units.reduce((sum, u) => sum + (unitCompletions[u.id] ?? 0), 0) / (units.length * totalStudents) * 100)
    : 0

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F7F7F7' }}>

      {/* ── 삭제 확인 모달 ── */}
      {confirmDeleteUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.40)' }}>
          <div className="mx-4 w-full max-w-sm rounded-3xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.20)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,67,54,0.10)' }}>
                <Trash size={20} style={{ color: '#F44336' }} />
              </div>
              <button onClick={() => setConfirmDeleteUnit(null)} className="p-1 rounded-full hover:bg-black/5">
                <X size={18} style={{ color: '#9EA0B4' }} />
              </button>
            </div>
            <h3 className="font-extrabold text-base mb-1" style={{ color: '#2D2F2F' }}>단원을 삭제할까요?</h3>
            <p className="text-sm mb-1 font-semibold" style={{ color: '#5A4FA0' }}>"{confirmDeleteUnit.title}"</p>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: '#9EA0B4' }}>
              단원을 삭제하면 학생 화면에서 사라집니다. 기존 학습 기록은 보존됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteUnit(null)}
                className="flex-1 py-3 rounded-2xl font-bold text-sm"
                style={{ background: '#F7F7F7', color: '#9EA0B4' }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteUnit}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-60"
                style={{ background: 'rgba(244,67,54,0.12)', color: '#F44336' }}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Left Nav (220px) ── */}
      <nav
        className="flex flex-col w-[220px] shrink-0 overflow-y-auto"
        style={{ background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}
      >
        {/* 로고 + 선생님 정보 + 초대 코드 */}
        <div className="px-5 pt-8 pb-5" style={{ borderBottom: '1px solid #F7F7F7' }}>
          <p className="text-sm font-extrabold mb-4" style={{ color: '#E8C547' }}>🌙 무니에게 알려줘</p>
          <p className="font-extrabold text-sm leading-tight" style={{ color: '#2D2F2F' }}>{profile.name} 선생님</p>
          <p className="text-xs mt-0.5 mb-4" style={{ color: '#9EA0B4' }}>{currentClass.name}</p>

          {/* 초대 코드 */}
          <p className="text-xs mb-1.5 font-semibold" style={{ color: '#9EA0B4' }}>학생 초대 코드</p>
          <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: '#F7F7F7', border: '1px solid #EBEBEB' }}>
            <span className="text-base font-extrabold tracking-widest" style={{ color: '#2D2F2F' }}>
              {currentClass.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{ background: '#FFFFFF', color: '#2D2F2F', border: '1px solid #E8E8E8' }}
            >
              {copied ? <Check size={13} weight="bold" style={{ color: '#4CAF50' }} /> : <Copy size={13} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex-1 px-3 py-4 space-y-1">
          {/* 대시보드 (active) */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(232,197,71,0.12)', color: '#1A1830', borderLeft: '3px solid #E8C547' }}>
            <BookOpen size={18} weight="fill" />
            <span className="font-bold text-sm">단원 관리</span>
          </div>

          <Link href="/teacher/students"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-black/[0.04]"
            style={{ color: '#9EA0B4' }}>
            <Users size={18} weight="regular" />
            <span className="font-semibold text-sm">학생 목록</span>
            {totalStudents > 0 && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#9EA0B4' }}>
                {totalStudents}
              </span>
            )}
          </Link>

          <Link href="/teacher/quests/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-black/[0.04]"
            style={{ color: '#9EA0B4' }}>
            <Trophy size={18} weight="regular" />
            <span className="font-semibold text-sm">퀘스트</span>
            {quests.length > 0 && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#9EA0B4' }}>
                {quests.length}
              </span>
            )}
          </Link>
        </div>

      </nav>

      {/* ── Center (flex-1) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0" style={{ borderBottom: '1px solid #EBEBEB' }}>
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-extrabold text-xl" style={{ color: '#2D2F2F' }}>단원 관리</h1>
            <Link
              href="/teacher/units/new"
              className="flex items-center gap-2 font-extrabold text-sm transition-all duration-150 px-5 py-2.5 rounded-full"
              style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
              onMouseDown={(e) => { (e.currentTarget as HTMLAnchorElement).style.cssText += 'transform:translateY(2px);box-shadow:0 2px 0 #C8A020;' }}
              onMouseUp={(e) => { (e.currentTarget as HTMLAnchorElement).style.cssText += 'transform:translateY(0);box-shadow:0 4px 0 #C8A020;' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.cssText += 'transform:translateY(0);box-shadow:0 4px 0 #C8A020;' }}
            >
              <Plus size={16} weight="bold" />
              새 단원
            </Link>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="등록 학생" value={`${totalStudents}명`} />
            <StatCard label="활성 단원" value={`${units.length}개`} />
            <StatCard label="평균 이해도" value={completedSessions.length > 0 ? `${Math.round(completedSessions.reduce((s, c) => s + (c.understanding_score ?? 0), 0) / completedSessions.length)}점` : '-'} />
            <StatCard label="완료 세션" value={`${totalCompletedSessions}회`} />
          </div>
        </div>

        {/* 단원 목록 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {units.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(232,197,71,0.12)' }}>
                <BookOpen size={32} style={{ color: '#E8C547' }} />
              </div>
              <p className="font-extrabold text-base mb-2" style={{ color: '#2D2F2F' }}>아직 단원이 없어요</p>
              <p className="text-sm mb-5" style={{ color: '#9EA0B4' }}>오늘 학생들이 배운 개념을 추가해보세요</p>
              <Link
                href="/teacher/units/new"
                className="flex items-center gap-2 font-extrabold text-sm px-6 py-3 rounded-full"
                style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
              >
                <Plus size={16} weight="bold" />
                첫 단원 만들기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {units.map((unit) => {
                const completed = unitCompletions[unit.id] ?? 0
                const pct = totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0
                return (
                  <div
                    key={unit.id}
                    className="p-5 flex flex-col gap-3"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* 제목 + 학년 */}
                    <div>
                      <p className="font-extrabold text-sm leading-snug" style={{ color: '#2D2F2F' }}>{unit.title}</p>
                      {unit.grade_hint && (
                        <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{unit.grade_hint}</p>
                      )}
                    </div>

                    {/* 진행률 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: '#9EA0B4' }}>학생 완료</span>
                        <span className="text-xs font-extrabold" style={{ color: '#E8C547' }}>
                          {completed}/{totalStudents}명
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F0F0' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: pct === 100 ? '#4CAF50' : '#E8C547' }}
                        />
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-1">
                      <Link
                        href={`/teacher/units/${unit.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                        style={{ background: 'rgba(90,79,160,0.08)', color: '#5A4FA0' }}
                      >
                        <PencilSimple size={13} weight="bold" />
                        수정
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteUnit(unit)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                        style={{ background: 'rgba(244,67,54,0.07)', color: '#F44336' }}
                      >
                        <Trash size={13} weight="bold" />
                        삭제
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel (280px) ── */}
      <div
        className="w-[280px] shrink-0 flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', borderLeft: '1px solid #F0F0F0' }}
      >
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: '1px solid #F7F7F7' }}>
          <h2 className="font-extrabold text-base" style={{ color: '#2D2F2F' }}>최근 리포트</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentReports.length > 0 ? (
            recentReports.map((item) => (
              <div key={item.id} className="px-5 py-4 border-b last:border-0" style={{ borderColor: '#F7F7F7' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold" style={{ color: '#2D2F2F' }}>{item.studentName}</span>
                  <ScorePill score={item.score} />
                </div>
                {item.summary && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#6B6B8D' }}>
                    {item.summary}
                  </p>
                )}
                {item.weak_points?.[0] && (
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#FF9600' }}>
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
