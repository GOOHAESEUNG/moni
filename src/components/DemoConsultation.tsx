'use client'

import { useState } from 'react'
import { FileText, X, Copy, Check } from '@phosphor-icons/react'

const DEMO_CONSULTATION = `## 김지민 학생 학부모 상담 자료

### 강점
김지민 학생은 수학적 개념을 논리적으로 설명하는 능력이 뛰어납니다. 특히 직사각형과 삼각형의 넓이를 구하는 원리를 정확히 이해하고 있으며, 무니와의 대화에서 "왜 곱하기를 해야 하는지"까지 스스로 설명하는 모습을 보였습니다. 자기관리역량(4/5)과 문제해결역량(5/5)이 높아 자기주도 학습 능력이 우수합니다.

### 개선이 필요한 부분
평행사변형의 넓이 공식에서 "왜 밑변 × 높이인지"에 대한 원리 이해가 부족합니다. 직사각형에서 평행사변형으로의 변환 과정을 시각적으로 연습하면 빠르게 개선될 것으로 보입니다.

### 가정에서의 실천 방안
1. 모눈종이에 평행사변형을 그리고 직사각형으로 변환해보는 활동을 해보세요
2. 일상생활에서 도형 찾기 놀이 (예: 창문=직사각형, 지붕=삼각형)
3. 무니에게 알려줘 앱에서 주 2회 복습을 권장합니다`

export default function DemoConsultation({ studentName }: { studentName: string }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    setLoading(true)
    setShowModal(true)
    setTimeout(() => {
      setContent(DEMO_CONSULTATION.replace('김지민', studentName))
      setLoading(false)
    }, 1800)
  }

  function handleCopy() {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleGenerate}
        className="w-full flex items-center justify-center gap-2 rounded-[20px] py-4 font-bold text-sm transition-opacity hover:opacity-90"
        style={{ background: '#7C6FBF', color: '#FFFFFF' }}
      >
        <FileText size={18} weight="bold" />
        학부모 상담 자료 생성
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.50)' }}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 max-h-[80vh] overflow-y-auto" role="dialog" aria-labelledby="consultation-title">
            <div className="flex items-center justify-between mb-4">
              <h3 id="consultation-title" className="font-extrabold text-base" style={{ color: '#2D2F2F' }}>
                학부모 상담 자료
              </h3>
              <button onClick={() => { setShowModal(false); setContent(null) }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="닫기">
                <X size={18} style={{ color: '#9EA0B4' }} />
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: '#E8C547', borderTopColor: 'transparent' }} />
                <p className="text-sm" style={{ color: '#9EA0B4' }}>GPT-4o가 상담 자료를 생성하고 있어요...</p>
              </div>
            ) : content ? (
              <>
                <div className="prose prose-sm max-w-none mb-4" style={{ color: '#2D2F2F' }}>
                  {content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-base font-extrabold mt-4 mb-2" style={{ color: '#2D2F2F' }}>{line.slice(3)}</h2>
                    if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold mt-3 mb-1" style={{ color: '#7C6FBF' }}>{line.slice(4)}</h3>
                    if (line.match(/^\d\./)) return <p key={i} className="text-sm leading-relaxed ml-2 mb-1">{line}</p>
                    if (line.trim()) return <p key={i} className="text-sm leading-relaxed mb-2">{line}</p>
                    return null
                  })}
                </div>
                <button onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3 font-bold text-sm transition-all"
                  style={{ background: copied ? '#4CAF50' : '#E8C547', color: copied ? '#FFF' : '#1A1830' }}>
                  {copied ? <><Check size={16} weight="bold" /> 복사 완료!</> : <><Copy size={16} weight="bold" /> 클립보드에 복사</>}
                </button>
              </>
            ) : null}

            <p className="text-xs text-center mt-3" style={{ color: '#C0C0D0' }}>
              체험 모드 · 실제 데이터 기반 상담 자료는 회원가입 후 이용 가능
            </p>
          </div>
        </div>
      )}
    </>
  )
}
