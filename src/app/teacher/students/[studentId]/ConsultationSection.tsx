'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Lightning, Warning, X } from '@phosphor-icons/react'

interface Props {
  studentId: string
  studentName: string
}

interface ParsedSection {
  title: string
  lines: string[]
}

function parseSections(content: string): ParsedSection[] {
  const matches = content.matchAll(/##\s+(.+)\n([\s\S]*?)(?=\n##\s+.+|\s*$)/g)
  const sections = Array.from(matches).map((match) => ({
    title: match[1].trim(),
    lines: match[2]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  }))

  return sections.length > 0
    ? sections
    : [{ title: '상담 요약', lines: content.split('\n').map((line) => line.trim()).filter(Boolean) }]
}

export default function ConsultationSection({ studentId, studentName }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const sections = useMemo(() => parseSections(content), [content])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setCopied(false)

    try {
      const response = await fetch('/api/teacher/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : '상담 자료 생성에 실패했어요.')
      }

      setContent(typeof payload?.content === 'string' ? payload.content : '')
      setOpen(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '알 수 없는 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="rounded-[20px] border bg-white p-5" style={{ borderColor: '#ECEAF6' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>학부모 상담 자료</h2>
            <p className="mt-1 text-sm" style={{ color: '#9EA0B4' }}>
              {studentName} 학생의 리포트를 바탕으로 상담용 요약을 생성해요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: '#E8C547', color: '#2D2F2F' }}
          >
            <Lightning size={16} weight="fill" />
            {loading ? '생성 중...' : '학부모상담자료생성'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm font-semibold" style={{ color: '#FF9600' }}>
            {error}
          </p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
            className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(19,17,42,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b px-6 py-5" style={{ borderColor: '#ECEAF6' }}>
              <div>
                <h3 id="consultation-modal-title" className="text-lg font-extrabold" style={{ color: '#2D2F2F' }}>
                  {studentName} 상담 자료
                </h3>
                <p className="mt-1 text-sm" style={{ color: '#9EA0B4' }}>학부모 상담 전에 바로 활용할 수 있어요.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-black/5"
                aria-label="닫기"
              >
                <X size={18} style={{ color: '#9EA0B4' }} />
              </button>
            </div>

            <div className="max-h-[calc(80vh-84px)] overflow-y-auto px-6 py-5">
              {content ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                      style={{ background: '#F4F2FF', color: '#7C6FBF' }}
                    >
                      <Copy size={15} weight="bold" />
                      {copied ? '복사됨' : '복사'}
                    </button>
                  </div>

                  {sections.map((section) => (
                    <section key={section.title} className="rounded-[20px] border p-5" style={{ borderColor: '#ECEAF6', background: '#FAF9FD' }}>
                      <h4 className="text-base font-extrabold" style={{ color: '#2D2F2F' }}>{section.title}</h4>
                      <div className="mt-3 space-y-2">
                        {section.lines.map((line, index) => {
                          const text = line.replace(/^[-*]\s*/, '')
                          const isBullet = /^[-*]\s*/.test(line)
                          return (
                            <div key={`${section.title}-${index}`} className="flex gap-2 text-sm leading-6" style={{ color: '#4A4A6A' }}>
                              {isBullet ? (
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#E8C547' }} />
                              ) : (
                                <Warning size={14} className="mt-1 shrink-0" style={{ color: '#9EA0B4' }} />
                              )}
                              <p>{text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#9EA0B4' }}>생성된 내용이 없어요.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
