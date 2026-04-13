'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy } from '@phosphor-icons/react'

export default function DemoQuestPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F2F1FA' }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        <Link href="/demo/teacher" className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: '#F5F4FA' }}>
          <ArrowLeft size={18} weight="bold" style={{ color: '#2D2F2F' }} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>새 퀘스트 만들기</h1>
          <p className="text-xs" style={{ color: '#9EA0B4' }}>학생에게 학습 목표를 퀘스트로 부여하세요</p>
        </div>
        <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #ECEAF6' }}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={20} weight="fill" style={{ color: '#E8C547' }} />
            <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>퀘스트 정보</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#2D2F2F' }}>퀘스트 제목</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 무니에게 분수의 덧셈 설명하기"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/30"
                style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#2D2F2F' }}>설명 (선택)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="학생에게 전달할 퀘스트 설명을 적어주세요"
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/30"
                style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#2D2F2F' }}>마감일 (선택)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#7C6FBF]/30"
                style={{ background: '#F7F7FB', color: '#2D2F2F', border: '1px solid #ECEAF6' }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Link href="/demo/teacher"
              className="flex-1 flex items-center justify-center rounded-full py-3 text-sm font-bold"
              style={{ border: '1px solid #ECEAF6', color: '#9EA0B4' }}>
              취소
            </Link>
            <button disabled
              className="flex-1 rounded-full py-3 text-sm font-bold opacity-50 cursor-not-allowed"
              style={{ background: '#7C6FBF', color: '#FFFFFF' }}>
              저장 (체험 모드)
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#C0C0D0' }}>
          체험 모드에서는 입력까지 체험할 수 있어요. 실제 저장은 회원가입 후 가능합니다.
        </p>
      </div>
    </div>
  )
}
