'use client'

import { useState } from 'react'
import { Check, Copy, FileText, SpinnerGap, X } from '@phosphor-icons/react'

interface ConsultationSectionProps {
  studentId: string
  studentName: string
}

interface ConsultationResponse {
  content?: string
  error?: string
}

interface ParsedSection {
  title: string
  items: string[]
}

function parseSections(content: string): ParsedSection[] {
  const chunks = content
    .trim()
    .split(/(?=^##\s+)/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  const sections = chunks.map((chunk) => {
    const [headingLine = '', ...rest] = chunk.split('\n')
    const title = headingLine.replace(/^##\s*/, '').trim()
    const body = rest.join('\n').trim()
    const items: string[] = []
    const lines = body.split('\n')
    let current = ''

    for (const rawLine of lines) {
      const line = rawLine.trim()

      if (!line) {
        if (current) {
          items.push(current)
          current = ''
        }
        continue
      }

      if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        if (current) items.push(current)
        current = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim()
        continue
      }

      current = current ? `${current} ${line}` : line
    }

    if (current) items.push(current)

    return {
      title: title || '상담 자료',
      items: items.length > 0 ? items : body ? [body.replace(/\s+/g, ' ').trim()] : [],
    }
  })

  return sections.length > 0
    ? sections
    : [{
        title: '상담 자료',
        items: content.trim() ? [content.trim()] : [],
      }]
}

export default function ConsultationSection({ studentId, studentName }: ConsultationSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const sections = parseSections(content)

  async function handleGenerate() {
    if (isLoading) return

    setIsLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await fetch('/api/teacher/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      const data = await response.json().catch(() => null) as ConsultationResponse | null

      if (!response.ok || !data?.content) {
        throw new Error(data?.error || '상담 자료를 생성하지 못했습니다.')
      }

      setContent(data.content)
      setIsOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '상담 자료를 생성하지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
    } catch {
      setError('클립보드에 복사하지 못했습니다.')
    }
  }

  function handleClose() {
    setIsOpen(false)
    setCopied(false)
  }

  return (
    <>
      <section className="rounded-[20px] bg-white p-5" style={{ border: '1px solid #ECEAF6' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9EA0B4' }}>
              학부모 상담
            </p>
            <h2 className="mt-1 text-base font-extrabold" style={{ color: '#2D2F2F' }}>
              {studentName} 상담 자료
            </h2>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: '#4A4A6A' }}>
              최근 학습 리포트를 바탕으로 학부모 상담용 요약을 생성합니다.
            </p>
          </div>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: '#FBF5D9', color: '#1A1830' }}
          >
            <FileText size={22} weight="fill" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
        >
          {isLoading ? (
            <>
              <SpinnerGap size={18} className="animate-spin" />
              AI가 분석 중이에요...
            </>
          ) : (
            <>
              <FileText size={18} weight="fill" />
              학부모 상담 자료 생성
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm" style={{ color: '#D64545' }}>
            {error}
          </p>
        )}
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={handleClose}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[20px] bg-white p-6"
            style={{ border: '1px solid #ECEAF6' }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="학부모 상담 자료"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9EA0B4' }}>
                  학부모 상담 자료
                </p>
                <h3 className="mt-1 text-xl font-extrabold" style={{ color: '#2D2F2F' }}>
                  {studentName} 상담 메모
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: '#F5F4FA', color: '#4A4A6A' }}
                aria-label="닫기"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="mt-5 max-h-[calc(85vh-180px)] space-y-3 overflow-y-auto pr-1">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[20px] bg-white p-4"
                  style={{ border: '1px solid #ECEAF6' }}
                >
                  <h4 className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>
                    {section.title}
                  </h4>
                  <div className="mt-3 space-y-3">
                    {section.items.map((item, index) => (
                      <div key={`${section.title}-${index}`} className="flex items-start gap-3">
                        <div
                          className="mt-2 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: '#E8C547' }}
                        />
                        <p className="text-sm leading-6" style={{ color: '#4A4A6A' }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-bold"
                style={{ background: '#F5F4FA', color: '#4A4A6A' }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold"
                style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}
              >
                {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                {copied ? '복사됨' : '복사하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
