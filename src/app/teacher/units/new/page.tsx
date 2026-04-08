'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

const GRADE_HINTS = [
  { value: '초등 저학년', label: '초등 저학년' },
  { value: '초등 고학년', label: '초등 고학년' },
  { value: '중학생', label: '중학생' },
  { value: '고등학생', label: '고등학생' },
]

export default function NewUnitPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [concept, setConcept] = useState('')
  const [gradeHint, setGradeHint] = useState('초등 고학년')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !concept.trim()) {
      setError('단원 제목과 개념 설명을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('로그인이 필요해요.')
      setLoading(false)
      return
    }

    const { data: classes } = await supabase
      .from('classes')
      .select('id')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)

    if (!classes || classes.length === 0) {
      setError('클래스를 먼저 생성해야 해요.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('units')
      .insert({
        class_id: classes[0].id,
        title: title.trim(),
        concept: concept.trim(),
        grade_hint: gradeHint,
        is_active: true,
      })

    if (insertError) {
      setError('단원 저장에 실패했어요. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    router.push('/teacher')
  }

  const previewText = concept.trim()
    ? `안녕! 나는 무니야 🌙 ${title || '이 단원'}에 대해 네가 설명해주길 기다리고 있어. "${concept.substring(0, 40)}${concept.length > 40 ? '...' : ''}" — 이게 뭔지 나한테 알려줄 수 있어?`
    : null

  return (
    <div className="min-h-screen bg-[#F2F2F5] font-sans pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b border-border px-4 pt-10 pb-5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} weight="bold" className="text-[#1A1830]" />
        </button>
        <h1 className="text-xl font-bold text-[#1A1830]">새 단원 만들기</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 단원 제목 */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2">
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="title">
              단원 제목
            </label>
            <input
              id="title"
              type="text"
              placeholder="예: 분수의 덧셈과 뺄셈"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all"
              required
            />
          </div>

          {/* 개념 설명 */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2">
            <label className="text-sm font-semibold text-[#1A1830]" htmlFor="concept">
              개념 설명
            </label>
            <p className="text-xs text-muted-foreground">
              무니가 이 내용을 바탕으로 학생에게 꼬리 질문을 해요.
            </p>
            <textarea
              id="concept"
              placeholder="예: 분모가 같은 분수의 덧셈은 분자끼리 더하고 분모는 그대로 유지한다. 분모가 다른 경우에는 통분 후 계산한다."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all resize-none"
              required
            />
          </div>

          {/* 학년 힌트 */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-3">
            <p className="text-sm font-semibold text-[#1A1830]">학년 수준</p>
            <div className="flex flex-wrap gap-2">
              {GRADE_HINTS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGradeHint(g.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    gradeHint === g.value
                      ? 'bg-[#E8C547] text-[#1A1830] shadow-sm'
                      : 'bg-[#F2F2F5] text-muted-foreground hover:bg-[#E8C547]/10'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 무니 미리보기 */}
          {previewText && (
            <div className="rounded-3xl bg-[#FDF8E1] border border-[#E8C547]/30 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#E8C547]" />
                <p className="text-xs font-semibold text-[#1A1830]">무니가 이렇게 시작해요</p>
              </div>
              <p className="text-sm text-[#1A1830] leading-relaxed">{previewText}</p>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <p className="text-sm text-orange-500 font-medium px-1">{error}</p>
          )}

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8C547] text-[#1A1830] font-bold rounded-full py-4 text-base shadow-lg shadow-[#E8C547]/20 hover:bg-[#E8C547]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '단원 저장하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
