'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, CaretDown, GraduationCap, Plus } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import curriculumData from '../../../../../curriculum.json'

type Standard = { code: string; description: string }
type CurriculumUnit = { unit: string; standards: Standard[] }
type Domain = { domain: string; units: CurriculumUnit[] }
type GradeGroup = { grade_group: string; domains: Domain[] }

const gradeGroups: GradeGroup[] = (curriculumData as { grade_groups: GradeGroup[] }).grade_groups

export default function NewUnitPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [concept, setConcept] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 커리큘럼 피커 상태
  const [showPicker, setShowPicker] = useState(true)
  const [pickerGrade, setPickerGrade] = useState('')
  const [pickerDomain, setPickerDomain] = useState('')
  const [pickerUnit, setPickerUnit] = useState('')
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  // 커리큘럼 파생 데이터
  const domains: Domain[] = gradeGroups.find(g => g.grade_group === pickerGrade)?.domains ?? []
  const units: CurriculumUnit[] = domains.find(d => d.domain === pickerDomain)?.units ?? []
  const standards: Standard[] = units.find(u => u.unit === pickerUnit)?.standards ?? []

  function handleGradeChange(grade: string) {
    setPickerGrade(grade)
    setPickerDomain('')
    setPickerUnit('')
    setSelectedCodes([])
  }

  function handleDomainChange(domain: string) {
    setPickerDomain(domain)
    setPickerUnit('')
    setSelectedCodes([])
  }

  function handleUnitChange(unit: string) {
    setPickerUnit(unit)
    // 단원 변경 시 전체 성취기준 자동 선택
    const newStandards = units.find(u => u.unit === unit)?.standards ?? []
    setSelectedCodes(newStandards.map(s => s.code))
  }

  function toggleCode(code: string) {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  function applyFromCurriculum() {
    if (!pickerUnit) return
    const chosen = standards.filter(s => selectedCodes.includes(s.code))
    if (chosen.length === 0) return

    setTitle(pickerUnit)
    const conceptText = chosen.map(s => `[${s.code}] ${s.description}`).join('\n\n')
    setConcept(conceptText)
    setShowPicker(false)
  }

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
      .select('id, grade')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)

    if (!classes || classes.length === 0) {
      setError('클래스를 먼저 생성해야 해요.')
      setLoading(false)
      return
    }

    const gradeHint = pickerGrade || (classes[0].grade ? `${classes[0].grade}학년` : '초등')

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

  const selectClass = "w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all appearance-none"

  return (
    <div className="min-h-screen bg-[#F2F2F5] font-sans pb-24">
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
          <h1 className="text-xl font-bold text-[#1A1830]">새 단원 만들기</h1>
          <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>교육과정에서 성취기준을 선택하거나 직접 입력하세요</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── 좌측: 교육과정 피커 (3/5) ── */}
          <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(232,197,71,0.10)] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPicker(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={18} weight="bold" className="text-[#E8C547]" />
                <span className="text-sm font-semibold text-[#1A1830]">교육과정에서 가져오기</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(232,197,71,0.15)', color: '#B8920A' }}>
                  초등 수학 · NCIC 2022
                </span>
              </div>
              <CaretDown
                size={16}
                weight="bold"
                className="text-muted-foreground transition-transform"
                style={{ transform: showPicker ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {showPicker && (
              <div className="border-t border-border px-5 pb-5 space-y-4 pt-4">
                {/* 학년군 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">학년군</label>
                  <div className="relative">
                    <select value={pickerGrade} onChange={e => handleGradeChange(e.target.value)} className={selectClass}>
                      <option value="">선택하세요</option>
                      {gradeGroups.map(g => (
                        <option key={g.grade_group} value={g.grade_group}>{g.grade_group}</option>
                      ))}
                    </select>
                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* 영역 */}
                {pickerGrade && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">영역</label>
                    <div className="relative">
                      <select value={pickerDomain} onChange={e => handleDomainChange(e.target.value)} className={selectClass}>
                        <option value="">선택하세요</option>
                        {domains.map(d => (
                          <option key={d.domain} value={d.domain}>{d.domain}</option>
                        ))}
                      </select>
                      <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* 단원 */}
                {pickerDomain && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">단원</label>
                    <div className="relative">
                      <select value={pickerUnit} onChange={e => handleUnitChange(e.target.value)} className={selectClass}>
                        <option value="">선택하세요</option>
                        {units.map(u => (
                          <option key={u.unit} value={u.unit}>{u.unit}</option>
                        ))}
                      </select>
                      <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* 성취기준 체크박스 */}
                {standards.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">성취기준 선택</label>
                    <div className="space-y-2">
                      {standards.map(s => (
                        <label
                          key={s.code}
                          className="flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-colors"
                          style={{
                            background: selectedCodes.includes(s.code)
                              ? 'rgba(232,197,71,0.10)'
                              : 'rgba(242,242,245,0.8)',
                            border: selectedCodes.includes(s.code)
                              ? '1.5px solid rgba(232,197,71,0.40)'
                              : '1.5px solid transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCodes.includes(s.code)}
                            onChange={() => toggleCode(s.code)}
                            className="mt-0.5 w-4 h-4 accent-[#E8C547] shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#B8920A] block mb-0.5">{s.code}</span>
                            <span className="text-xs text-[#1A1830] leading-relaxed">{s.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 적용 버튼 */}
                {selectedCodes.length > 0 && (
                  <button
                    type="button"
                    onClick={applyFromCurriculum}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors"
                    style={{ background: '#E8C547', color: '#1A1830' }}
                  >
                    <Plus size={16} weight="bold" />
                    {selectedCodes.length}개 성취기준 적용하기
                  </button>
                )}
              </div>
            )}
          </div>
          </div>{/* end 좌측 */}

          {/* ── 우측: 폼 (2/5) ── */}
          <div className="lg:col-span-2 space-y-5">
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
              무니가 이 내용을 바탕으로 학생에게 꼬리 질문을 해요. 교육과정에서 가져온 뒤 추가 내용을 덧붙일 수 있어요.
            </p>
            <textarea
              id="concept"
              placeholder="예: 분모가 같은 분수의 덧셈은 분자끼리 더하고 분모는 그대로 유지한다. 분모가 다른 경우에는 통분 후 계산한다."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-border bg-[#F2F2F5] px-4 py-3 text-sm text-[#1A1830] placeholder:text-muted-foreground outline-none focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/20 transition-all resize-none"
              required
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
          </div>{/* end 우측 */}

          </div>{/* end grid */}
        </form>
      </div>
    </div>
  )
}
