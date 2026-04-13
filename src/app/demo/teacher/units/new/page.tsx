'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CaretDown, GraduationCap } from '@phosphor-icons/react'
import curriculumData from '../../../../../../curriculum.json'

type Standard = { code: string; description: string }
type CurriculumUnit = { unit: string; standards: Standard[] }
type Domain = { domain: string; units: CurriculumUnit[] }
type GradeGroup = { grade_group: string; domains: Domain[] }

const gradeGroups: GradeGroup[] = (curriculumData as { grade_groups: GradeGroup[] }).grade_groups

export default function DemoNewUnitPage() {
  const [pickerGrade, setPickerGrade] = useState('')
  const [pickerDomain, setPickerDomain] = useState('')
  const [pickerUnit, setPickerUnit] = useState('')
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [concept, setConcept] = useState('')
  const [showPicker, setShowPicker] = useState(true)

  const domains: Domain[] = gradeGroups.find(g => g.grade_group === pickerGrade)?.domains ?? []
  const units: CurriculumUnit[] = domains.find(d => d.domain === pickerDomain)?.units ?? []
  const standards: Standard[] = units.find(u => u.unit === pickerUnit)?.standards ?? []

  function handleGradeChange(grade: string) {
    setPickerGrade(grade); setPickerDomain(''); setPickerUnit(''); setSelectedCodes([])
  }
  function handleDomainChange(domain: string) {
    setPickerDomain(domain); setPickerUnit(''); setSelectedCodes([])
  }
  function handleUnitChange(unit: string) {
    setPickerUnit(unit)
    const newStandards = units.find(u => u.unit === unit)?.standards ?? []
    setSelectedCodes(newStandards.map(s => s.code))
  }
  function toggleCode(code: string) {
    setSelectedCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }
  function applyFromCurriculum() {
    if (!pickerUnit) return
    const chosen = standards.filter(s => selectedCodes.includes(s.code))
    if (chosen.length === 0) return
    setTitle(pickerUnit)
    setConcept(chosen.map(s => `[${s.code}] ${s.description}`).join('\n\n'))
    setShowPicker(false)
  }

  const selectStyle = {
    background: '#F7F7FB',
    border: '1px solid #ECEAF6',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    color: '#2D2F2F',
    width: '100%',
    appearance: 'none' as const,
    cursor: 'pointer',
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F2F1FA' }}>
      {/* 헤더 */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        <Link href="/demo/teacher" className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: '#F5F4FA' }}>
          <ArrowLeft size={18} weight="bold" style={{ color: '#2D2F2F' }} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>새 단원 만들기</h1>
          <p className="text-xs" style={{ color: '#9EA0B4' }}>교육과정에서 단원을 선택해보세요</p>
        </div>
        <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {showPicker && (
          <div className="rounded-[20px] p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #ECEAF6' }}>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={20} weight="fill" style={{ color: '#7C6FBF' }} />
              <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>NCIC 2022 교육과정에서 선택</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* 학년군 */}
              <div className="relative">
                <select value={pickerGrade} onChange={(e) => handleGradeChange(e.target.value)} style={selectStyle}>
                  <option value="">학년군 선택</option>
                  {gradeGroups.map(g => <option key={g.grade_group} value={g.grade_group}>{g.grade_group}</option>)}
                </select>
                <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9EA0B4' }} />
              </div>

              {/* 영역 */}
              <div className="relative">
                <select value={pickerDomain} onChange={(e) => handleDomainChange(e.target.value)} disabled={!pickerGrade} style={{ ...selectStyle, opacity: pickerGrade ? 1 : 0.5 }}>
                  <option value="">영역 선택</option>
                  {domains.map(d => <option key={d.domain} value={d.domain}>{d.domain}</option>)}
                </select>
                <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9EA0B4' }} />
              </div>

              {/* 단원 */}
              <div className="relative">
                <select value={pickerUnit} onChange={(e) => handleUnitChange(e.target.value)} disabled={!pickerDomain} style={{ ...selectStyle, opacity: pickerDomain ? 1 : 0.5 }}>
                  <option value="">단원 선택</option>
                  {units.map(u => <option key={u.unit} value={u.unit}>{u.unit}</option>)}
                </select>
                <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9EA0B4' }} />
              </div>
            </div>

            {/* 성취기준 */}
            {standards.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold" style={{ color: '#9EA0B4' }}>성취기준 ({selectedCodes.length}/{standards.length}개 선택)</p>
                {standards.map(s => (
                  <label key={s.code} className="flex items-start gap-2 cursor-pointer rounded-xl p-3 transition-colors hover:bg-purple-50/30"
                    style={{ background: selectedCodes.includes(s.code) ? 'rgba(124,111,191,0.06)' : 'transparent' }}>
                    <input type="checkbox" checked={selectedCodes.includes(s.code)} onChange={() => toggleCode(s.code)}
                      className="mt-0.5 accent-[#7C6FBF]" />
                    <div>
                      <span className="text-xs font-bold" style={{ color: '#7C6FBF' }}>{s.code}</span>
                      <p className="text-xs leading-relaxed" style={{ color: '#4A4A6A' }}>{s.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button onClick={applyFromCurriculum} disabled={!pickerUnit || selectedCodes.length === 0}
              className="w-full rounded-full py-3 text-sm font-extrabold transition-opacity disabled:opacity-40"
              style={{ background: '#7C6FBF', color: '#FFF' }}>
              선택한 단원 적용하기
            </button>
          </div>
        )}

        {/* 단원 정보 미리보기 */}
        {!showPicker && title && (
          <div className="rounded-[20px] p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #ECEAF6' }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} weight="fill" style={{ color: '#E8C547' }} />
              <h2 className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{title}</h2>
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#6B6B8D' }}>{concept}</p>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowPicker(true)}
                className="flex-1 rounded-full py-3 text-sm font-bold"
                style={{ border: '1px solid #ECEAF6', color: '#9EA0B4' }}>
                다시 선택
              </button>
              <button disabled
                className="flex-1 rounded-full py-3 text-sm font-extrabold opacity-50 cursor-not-allowed"
                style={{ background: '#E8C547', color: '#1A1830' }}>
                저장 (체험 모드)
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs" style={{ color: '#C0C0D0' }}>
          체험 모드에서는 단원이 실제로 저장되지 않아요. 교육과정 피커만 체험할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
