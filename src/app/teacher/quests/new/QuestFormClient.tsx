'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Plus, Trash, CalendarBlank, UsersThree, User, X } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import TeacherSidebar from '@/components/TeacherSidebar'
import type { Unit, Quest } from '@/types/database'

interface Student { id: string; name: string }

interface Props {
  profile: { name: string }
  currentClass: { id: string; name: string; inviteCode: string }
  units: Unit[]
  students: Student[]
  existingQuests: Quest[]
}

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #ECEAF6',
} as const

export default function QuestFormClient({ profile, currentClass, units, students, existingQuests }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [unitId, setUnitId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [targetAll, setTargetAll] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

    setTitle('')
    setDescription('')
    setUnitId('')
    setDueDate('')
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(questId: string) {
    setDeletingId(questId)
    const supabase = createClient()
    await supabase.from('quests').update({ is_active: false }).eq('id', questId)
    setDeletingId(null)
    router.refresh()
  }

  // 학생 이름 매핑
  const studentMap = new Map(students.map(s => [s.id, s.name]))

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      <TeacherSidebar activeTab="quests" teacherName={profile.name} className={currentClass.name} inviteCode={currentClass.inviteCode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 shrink-0 flex items-center gap-4"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>퀘스트</h1>
            <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>학생에게 학습 목표를 부여하세요</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
            <Plus size={15} weight="bold" /> 새 퀘스트
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-3xl mx-auto">

            {/* 새 퀘스트 폼 */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-5 p-5 rounded-2xl" style={{ ...cardStyle, border: '1.5px solid rgba(124,111,191,0.30)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} weight="fill" style={{ color: '#7C6FBF' }} />
                    <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>새 퀘스트</h2>
                  </div>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
                    <X size={16} style={{ color: '#9EA0B4' }} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }} htmlFor="quest-title">
                      퀘스트 제목 <span style={{ color: '#FF9600' }}>*</span>
                    </label>
                    <input id="quest-title" type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: 무니에게 분수의 덧셈 설명하기"
                      required
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                      style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }} htmlFor="quest-desc">설명 (선택)</label>
                    <textarea id="quest-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="학생에게 전달할 설명"
                      rows={2}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                      style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }} htmlFor="quest-unit">연결 단원 (선택)</label>
                      <select id="quest-unit" value={unitId} onChange={e => setUnitId(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                        style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}>
                        <option value="">없음</option>
                        {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }} htmlFor="quest-due">마감일 (선택)</label>
                      <input id="quest-due" type="date" value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                        style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                      />
                    </div>
                  </div>

                  {/* 대상 */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B8D' }}>대상</p>
                    <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="target" checked={targetAll}
                          onChange={() => setTargetAll(true)} className="accent-[#7C6FBF]" />
                        <span className="text-sm font-medium" style={{ color: '#2D2F2F' }}>반 전체</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="target" checked={!targetAll}
                          onChange={() => setTargetAll(false)} className="accent-[#7C6FBF]" />
                        <span className="text-sm font-medium" style={{ color: '#2D2F2F' }}>개별 학생</span>
                      </label>
                    </div>

                    {!targetAll && (
                      <div className="flex flex-wrap gap-2">
                        {students.length === 0 ? (
                          <p className="text-xs" style={{ color: '#9EA0B4' }}>반에 등록된 학생이 없어요.</p>
                        ) : (
                          students.map(s => (
                            <button key={s.id} type="button"
                              onClick={() => toggleStudent(s.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                              style={{
                                background: selectedStudents.includes(s.id) ? 'rgba(124,111,191,0.12)' : '#F7F7FB',
                                color: selectedStudents.includes(s.id) ? '#7C6FBF' : '#6B6B8D',
                                border: selectedStudents.includes(s.id) ? '1.5px solid rgba(124,111,191,0.30)' : '1.5px solid transparent',
                              }}>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{ background: selectedStudents.includes(s.id) ? 'rgba(124,111,191,0.20)' : '#ECEAF6' }}>
                                {s.name[0]}
                              </div>
                              {s.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {error && <p className="text-xs font-medium" style={{ color: '#FF9600' }}>{error}</p>}

                  <div className="flex gap-3 pt-1">
                    <button type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 rounded-full py-2.5 text-sm font-bold transition-colors hover:bg-gray-50"
                      style={{ border: '1px solid #ECEAF6', color: '#9EA0B4' }}>
                      취소
                    </button>
                    <button type="submit"
                      disabled={loading}
                      className="flex-1 rounded-full py-2.5 text-sm font-bold transition-all disabled:opacity-40"
                      style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
                      {loading ? '저장 중...' : '퀘스트 저장'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 퀘스트 목록 */}
            {existingQuests.length === 0 && !showForm ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(232,197,71,0.12)' }}>
                  <Trophy size={32} style={{ color: '#E8C547' }} />
                </div>
                <p className="font-extrabold text-base mb-1" style={{ color: '#2D2F2F' }}>아직 퀘스트가 없어요</p>
                <p className="text-sm mb-5" style={{ color: '#9EA0B4' }}>
                  &ldquo;새 퀘스트&rdquo; 버튼으로 학생에게 학습 목표를 부여해보세요
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
                  <Plus size={15} weight="bold" /> 첫 퀘스트 만들기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {existingQuests.map((quest) => {
                  const unitTitle = units.find(u => u.id === quest.unit_id)?.title
                  const targetName = quest.student_id ? (studentMap.get(quest.student_id) ?? '학생') : null
                  return (
                    <div key={quest.id} className="group p-5 transition-all hover:translate-y-[-1px]" style={cardStyle}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(124,111,191,0.10)' }}>
                          <Trophy size={20} weight="fill" style={{ color: '#7C6FBF' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold mb-0.5" style={{ color: '#2D2F2F' }}>{quest.title}</p>
                          {quest.description && (
                            <p className="text-xs leading-relaxed mb-2" style={{ color: '#6B6B8D' }}>{quest.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {unitTitle && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: '#F4F2FF', color: '#7C6FBF' }}>
                                {unitTitle}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                              style={{ background: '#F7F7FB', color: '#6B6B8D' }}>
                              {targetName
                                ? <><User size={12} weight="bold" /> {targetName}</>
                                : <><UsersThree size={12} weight="bold" /> 반 전체</>
                              }
                            </span>
                            {quest.due_date && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                                style={{ background: '#F7F7FB', color: '#6B6B8D' }}>
                                <CalendarBlank size={12} weight="bold" />
                                {quest.due_date.replace(/-/g, '.')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(quest.id)}
                          disabled={deletingId === quest.id}
                          className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 disabled:opacity-30"
                          title="삭제">
                          <Trash size={16} style={{ color: '#F44336' }} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
