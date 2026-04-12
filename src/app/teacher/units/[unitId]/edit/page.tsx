'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, BookOpen } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

export default function EditUnitPage() {
  const router = useRouter()
  const { unitId } = useParams<{ unitId: string }>()

  const [title, setTitle] = useState('')
  const [concept, setConcept] = useState('')
  const [gradeHint, setGradeHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('units')
        .select('title, concept, grade_hint')
        .eq('id', unitId)
        .single()

      if (!data) { router.replace('/teacher'); return }
      setTitle(data.title)
      setConcept(data.concept)
      setGradeHint(data.grade_hint ?? '')
      setFetching(false)
    }
    load()
  }, [unitId, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !concept.trim()) {
      setError('단원 제목과 개념 설명을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('units')
      .update({
        title: title.trim(),
        concept: concept.trim(),
        grade_hint: gradeHint.trim() || null,
      })
      .eq('id', unitId)

    if (updateError) {
      setError('저장에 실패했어요. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    router.push('/teacher')
    router.refresh()
  }

  const previewText = concept.trim()
    ? `안녕! 나는 무니야 🌙 ${title || '이 단원'}에 대해 네가 설명해주길 기다리고 있어. "${concept.substring(0, 40)}${concept.length > 40 ? '...' : ''}" — 이게 뭔지 나한테 알려줄 수 있어?`
    : null

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F2F1FA' }}>
        <div className="text-2xl animate-pulse">🌙</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F2F1FA' }}>
      {/* 헤더 */}
      <div className="bg-white border-b border-border px-6 pt-10 pb-5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} weight="bold" className="text-[#1A1830]" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1A1830]">단원 수정</h1>
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>내용을 수정하면 이후 학생 세션에 즉시 반영됩니다</p>
        </div>
      </div>

      {/* 2컬럼 레이아웃 */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 좌측: 기본 정보 */}
            <div className="space-y-5">
              {/* 단원 제목 */}
              <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2">
                <label className="text-sm font-semibold text-[#1A1830]" htmlFor="title">
                  단원 제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-[#F2F1FA] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all"
                  required
                />
              </div>

              {/* 학년 힌트 */}
              <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2">
                <label className="text-sm font-semibold text-[#1A1830]" htmlFor="gradeHint">
                  학년 힌트 <span className="text-xs font-normal text-muted-foreground">(선택)</span>
                </label>
                <input
                  id="gradeHint"
                  type="text"
                  placeholder="예: 3~4학년"
                  value={gradeHint}
                  onChange={(e) => setGradeHint(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-[#F2F1FA] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all"
                />
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
            </div>

            {/* 우측: 개념 설명 + 저장 */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] p-5 space-y-2">
                <label className="text-sm font-semibold text-[#1A1830]" htmlFor="concept">
                  개념 설명
                </label>
                <p className="text-xs text-muted-foreground">
                  무니가 이 내용을 바탕으로 학생에게 꼬리 질문을 해요.
                </p>
                <textarea
                  id="concept"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  rows={12}
                  className="w-full rounded-2xl border border-border bg-[#F2F1FA] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all resize-none"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-orange-500 font-medium px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E8C547] text-[#1A1830] font-bold rounded-full py-4 text-base shadow-lg shadow-[#E8C547]/20 hover:bg-[#E8C547]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? '저장 중...' : '변경사항 저장'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
