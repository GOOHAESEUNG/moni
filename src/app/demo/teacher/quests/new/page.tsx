'use client'

import { useState } from 'react'
import { Trophy, Plus, Trash, CalendarBlank, UsersThree, User, X } from '@phosphor-icons/react'
import DemoTeacherSidebar from '@/components/DemoTeacherSidebar'
import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'

interface DemoQuest {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  target: 'all' | string
  unitTitle: string | null
}

const INITIAL_QUESTS: DemoQuest[] = [
  {
    id: 'q1',
    title: '무니에게 분수의 덧셈 설명하기',
    description: '통분 개념을 무니에게 알기 쉽게 설명해보세요.',
    dueDate: '2026-04-18',
    target: 'all',
    unitTitle: '분수의 덧셈',
  },
  {
    id: 'q2',
    title: '도형의 넓이 복습 퀘스트',
    description: null,
    dueDate: '2026-04-20',
    target: '김지민',
    unitTitle: '도형의 넓이',
  },
]

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #ECEAF6',
} as const

export default function DemoQuestPage() {
  const [quests, setQuests] = useState<DemoQuest[]>(INITIAL_QUESTS)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleAdd() {
    if (!title.trim()) return
    const newQuest: DemoQuest = {
      id: `q${Date.now()}`,
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      target: 'all',
      unitTitle: null,
    }
    setQuests(prev => [newQuest, ...prev])
    setTitle('')
    setDescription('')
    setDueDate('')
    setShowForm(false)
  }

  function handleDelete(id: string) {
    setQuests(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      <DemoTeacherSidebar activeTab="quests" />

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
            data-tutorial="add-quest"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
            <Plus size={15} weight="bold" /> 새 퀘스트
          </button>
          <span className="rounded-full px-3 py-1 text-xs font-bold shrink-0"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-3xl mx-auto">

            <div className="mb-5 w-full rounded-2xl px-4 py-3 text-sm font-medium"
              style={{ background: 'rgba(232,197,71,0.16)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.30)' }}>
              샘플 데이터 · 체험 모드에서도 퀘스트를 추가/삭제해볼 수 있어요
            </div>

            {/* 새 퀘스트 폼 */}
            {showForm && (
              <div className="mb-5 p-5 rounded-2xl" style={{ ...cardStyle, border: '1.5px solid rgba(124,111,191,0.30)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} weight="fill" style={{ color: '#7C6FBF' }} />
                    <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>새 퀘스트</h2>
                  </div>
                  <button onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
                    <X size={16} style={{ color: '#9EA0B4' }} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="demo-quest-title" className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }}>
                      퀘스트 제목 <span style={{ color: '#FF9600' }}>*</span>
                    </label>
                    <input
                      id="demo-quest-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: 무니에게 분수의 덧셈 설명하기"
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                      style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="demo-quest-desc" className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }}>설명 (선택)</label>
                    <textarea
                      id="demo-quest-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="학생에게 전달할 설명"
                      rows={2}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                      style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="demo-quest-due" className="text-xs font-semibold mb-1 block" style={{ color: '#6B6B8D' }}>마감일 (선택)</label>
                    <input
                      id="demo-quest-due"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/20"
                      style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 rounded-full py-2.5 text-sm font-bold transition-colors hover:bg-gray-50"
                      style={{ border: '1px solid #ECEAF6', color: '#9EA0B4' }}>
                      취소
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={!title.trim()}
                      className="flex-1 rounded-full py-2.5 text-sm font-bold transition-all disabled:opacity-40"
                      style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
                      추가
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 퀘스트 목록 */}
            {quests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(232,197,71,0.12)' }}>
                  <Trophy size={32} style={{ color: '#E8C547' }} />
                </div>
                <p className="font-extrabold text-base mb-1" style={{ color: '#2D2F2F' }}>아직 퀘스트가 없어요</p>
                <p className="text-sm" style={{ color: '#9EA0B4' }}>
                  &ldquo;새 퀘스트&rdquo; 버튼으로 학생에게 학습 목표를 부여해보세요
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-tutorial="quest-list">
                {quests.map((quest) => (
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
                          {quest.unitTitle && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: '#F4F2FF', color: '#7C6FBF' }}>
                              {quest.unitTitle}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#F7F7FB', color: '#6B6B8D' }}>
                            {quest.target === 'all'
                              ? <><UsersThree size={12} weight="bold" /> 반 전체</>
                              : <><User size={12} weight="bold" /> {quest.target}</>
                            }
                          </span>
                          {quest.dueDate && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                              style={{ background: '#F7F7FB', color: '#6B6B8D' }}>
                              <CalendarBlank size={12} weight="bold" />
                              {quest.dueDate.replace(/-/g, '.')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(quest.id)}
                        className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                        title="삭제">
                        <Trash size={16} style={{ color: '#F44336' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DemoTutorialOverlay
        storageKey="demo-teacher-quest-tutorial"
        steps={[
          {
            targetSelector: '[data-tutorial="add-quest"]',
            title: '퀘스트를 만들어보세요',
            description: '학생에게 학습 목표를 퀘스트로 부여할 수 있어요. 체험 모드에서도 추가/삭제를 직접 해볼 수 있어요!',
            position: 'bottom',
          },
        ]}
      />
    </div>
  )
}
