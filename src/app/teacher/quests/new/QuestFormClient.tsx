'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, Users, Trophy, ChartBar,
} from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { Unit } from '@/types/database'

interface Student { id: string; name: string }

interface Props {
  profile: { name: string }
  currentClass: { id: string; name: string }
  units: Unit[]
  students: Student[]
}

const inputClass = "w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all"
const cardClass = "bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-3"

export default function QuestFormClient({ profile, currentClass, units, students }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [unitId, setUnitId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [targetAll, setTargetAll] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleStudent(sid: string) {
    setSelectedStudents(prev =>
      prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('퀘스트 제목을 입력해주세요.'); return }
    if (!targetAll && selectedStudents.length === 0) { setError('대상 학생을 한 명 이상 선택해주세요.'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()

    const base = {
      class_id: currentClass.id,
      unit_id: unitId || null,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      is_active: true,
    }

    const rows = targetAll
      ? [{ ...base, student_id: null }]
      : selectedStudents.map(sid => ({ ...base, student_id: sid }))

    const { error: insertError } = await supabase.from('quests').insert(rows)
    if (insertError) { setError('퀘스트 저장에 실패했어요. 다시 시도해주세요.'); setLoading(false); return }
    router.push('/teacher')
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>

      {/* ── Left Nav (220px) — 다크 네이비 ── */}
      <nav
        className="flex flex-col w-[220px] shrink-0 overflow-y-auto"
        style={{ background: '#13112A', borderRight: 'none' }}
      >
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-extrabold mb-5" style={{ color: '#E8C547', letterSpacing: '-0.01em' }}>🌙 무니에게 알려줘</p>
          <div className="flex items-center gap-2.5">
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

          {/* 퀘스트 — active */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547', borderLeft: '3px solid #E8C547' }}>
            <Trophy size={18} weight="fill" />
            <span className="font-bold text-sm">퀘스트</span>
          </div>

          <Link href="/teacher/summary"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <ChartBar size={18} weight="regular" />
            <span className="font-semibold text-sm">반 요약</span>
          </Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div
          className="px-6 py-4 shrink-0"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}
        >
          <h1 className="font-extrabold text-xl" style={{ color: '#2D2F2F' }}>새 퀘스트 만들기</h1>
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학생에게 학습 목표를 퀘스트로 부여하세요</p>
        </div>

        {/* 폼 (2컬럼) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">

              {/* 좌측: 퀘스트 기본 정보 */}
              <div className="space-y-4">
                {/* 제목 */}
                <div className={cardClass}>
                  <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-title">
                    퀘스트 제목 <span style={{ color: '#FF9600' }}>*</span>
                  </label>
                  <input id="quest-title" type="text"
                    placeholder="예: 분수의 덧셈 무니에게 가르치기"
                    value={title} onChange={e => setTitle(e.target.value)} required
                    className={inputClass} />
                </div>

                {/* 설명 */}
                <div className={cardClass}>
                  <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-desc">
                    설명 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
                  </label>
                  <textarea id="quest-desc" placeholder="퀘스트에 대한 추가 설명"
                    value={description} onChange={e => setDescription(e.target.value)} rows={3}
                    className={inputClass + ' resize-none'} />
                </div>

                {/* 연결 단원 */}
                <div className={cardClass}>
                  <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-unit">
                    연결 단원 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
                  </label>
                  <select id="quest-unit" value={unitId} onChange={e => setUnitId(e.target.value)}
                    className={inputClass}>
                    <option value="">없음</option>
                    {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                  </select>
                  {unitId && (
                    <p className="text-xs" style={{ color: '#9EA0B4' }}>
                      선택한 단원 학습을 완료하면 자동 달성돼요.
                    </p>
                  )}
                </div>

                {/* 마감일 */}
                <div className={cardClass}>
                  <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-due">
                    마감일 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
                  </label>
                  <input id="quest-due" type="date" value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className={inputClass} />
                </div>
              </div>

              {/* 우측: 대상 + 저장 */}
              <div className="space-y-4">
                {/* 대상 */}
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-4">
                  <p className="text-sm font-semibold text-[#1A1830]">대상</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="target" checked={targetAll}
                        onChange={() => setTargetAll(true)} className="accent-[#E8C547]" />
                      <span className="text-sm font-medium" style={{ color: '#2D2F2F' }}>반 전체</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="target" checked={!targetAll}
                        onChange={() => setTargetAll(false)} className="accent-[#E8C547]" />
                      <span className="text-sm font-medium" style={{ color: '#2D2F2F' }}>개별 학생</span>
                    </label>
                  </div>

                  {!targetAll && (
                    <div className="space-y-2 pt-1">
                      {students.length === 0 ? (
                        <p className="text-xs" style={{ color: '#9EA0B4' }}>반에 등록된 학생이 없어요.</p>
                      ) : (
                        students.map(s => (
                          <label
                            key={s.id}
                            className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-colors"
                            style={{
                              background: selectedStudents.includes(s.id)
                                ? 'rgba(232,197,71,0.10)'
                                : 'transparent',
                              border: selectedStudents.includes(s.id)
                                ? '1.5px solid rgba(232,197,71,0.35)'
                                : '1.5px solid transparent',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(s.id)}
                              onChange={() => toggleStudent(s.id)}
                              className="accent-[#E8C547] w-4 h-4 shrink-0"
                            />
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}
                            >
                              {s.name[0]}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#2D2F2F' }}>{s.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {error && <p className="text-sm font-medium px-1" style={{ color: '#FF9600' }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold rounded-full py-4 text-base transition-all disabled:opacity-60"
                  style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
                >
                  {loading ? '저장 중...' : '퀘스트 저장하기'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
