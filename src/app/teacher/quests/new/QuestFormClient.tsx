'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { Unit } from '@/types/database'

interface Student { id: string; name: string }

interface Props {
  classId: string
  units: Unit[]
  students: Student[]
}

export default function QuestFormClient({ classId, units, students }: Props) {
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
      class_id: classId,
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

  const clayCard = 'bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2'

  return (
    <div className="min-h-screen bg-[#F2F2F5] font-sans pb-24">
      <div className="bg-white border-b border-border px-4 pt-10 pb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-muted" aria-label="뒤로가기">
          <ArrowLeft size={22} weight="bold" className="text-[#1A1830]" />
        </button>
        <h1 className="text-xl font-bold text-[#1A1830]">새 퀘스트 만들기</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 제목 */}
          <div className={clayCard}>
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-title">
              퀘스트 제목 <span style={{ color: '#FF9600' }}>*</span>
            </label>
            <input id="quest-title" type="text" placeholder="예: 분수의 덧셈 무니에게 가르치기"
              value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all" />
          </div>

          {/* 설명 */}
          <div className={clayCard}>
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-desc">
              설명 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
            </label>
            <textarea id="quest-desc" placeholder="퀘스트에 대한 추가 설명" value={description}
              onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all resize-none" />
          </div>

          {/* 단원 선택 */}
          <div className={clayCard}>
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-unit">
              연결 단원 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
            </label>
            <select id="quest-unit" value={unitId} onChange={e => setUnitId(e.target.value)}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] outline-none focus:border-[#E8C547] transition-all">
              <option value="">없음</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
            {unitId && <p className="text-xs" style={{ color: '#9EA0B4' }}>선택한 단원 학습을 완료하면 자동 달성돼요.</p>}
          </div>

          {/* 마감일 */}
          <div className={clayCard}>
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="quest-due">
              마감일 <span className="text-xs font-normal" style={{ color: '#9EA0B4' }}>(선택)</span>
            </label>
            <input id="quest-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] outline-none focus:border-[#E8C547] transition-all" />
          </div>

          {/* 대상 */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-3">
            <p className="text-sm font-semibold text-[#1A1830]">대상</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="target" checked={targetAll} onChange={() => setTargetAll(true)} className="accent-[#E8C547]" />
                <span className="text-sm" style={{ color: '#2D2F2F' }}>반 전체</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="target" checked={!targetAll} onChange={() => setTargetAll(false)} className="accent-[#E8C547]" />
                <span className="text-sm" style={{ color: '#2D2F2F' }}>개별 학생</span>
              </label>
            </div>

            {!targetAll && (
              <div className="pt-2 space-y-2">
                {students.length === 0 ? (
                  <p className="text-xs" style={{ color: '#9EA0B4' }}>반에 등록된 학생이 없어요.</p>
                ) : (
                  students.map(s => (
                    <label key={s.id} className="flex items-center gap-3 cursor-pointer py-1">
                      <input type="checkbox" checked={selectedStudents.includes(s.id)}
                        onChange={() => toggleStudent(s.id)} className="accent-[#E8C547] w-4 h-4" />
                      <span className="text-sm" style={{ color: '#2D2F2F' }}>{s.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-orange-500 font-medium px-1">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full font-bold rounded-full py-4 text-base transition-all disabled:opacity-60"
            style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}>
            {loading ? '저장 중...' : '퀘스트 저장하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
