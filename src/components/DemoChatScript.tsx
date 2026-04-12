'use client'

import { motion } from 'framer-motion'
import { ClipboardText, X } from '@phosphor-icons/react'

export interface ScriptLine {
  text: string
  hint: string
}

interface DemoChatScriptProps {
  lines: ScriptLine[]
  currentStep: number
  onCopy: (text: string) => void
  onDismiss: () => void
}

export default function DemoChatScript({
  lines,
  currentStep,
  onCopy,
  onDismiss,
}: DemoChatScriptProps) {
  const isComplete = currentStep >= lines.length
  const currentLine = isComplete ? null : lines[currentStep]
  const currentLabel = lines.length === 0 ? 0 : Math.min(currentStep + 1, lines.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(232,197,71,0.30)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-extrabold" style={{ color: '#9B7E00' }}>
          {`📋 대본 (${currentLabel}/${lines.length})`}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ color: '#9EA0B4', background: 'rgba(244,242,255,0.85)' }}
          aria-label="대본 닫기"
        >
          <X size={16} weight="bold" />
        </button>
      </div>

      {isComplete ? (
        <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: '#2D2F2F' }}>
          대본 완료! 체험 완료 버튼을 눌러주세요
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: '#2D2F2F' }}>
            {currentLine?.text}
          </p>
          <p className="mt-2 text-xs font-medium" style={{ color: '#9EA0B4' }}>
            {currentLine?.hint}
          </p>

          <button
            type="button"
            onClick={() => currentLine && onCopy(currentLine.text)}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition-transform active:scale-95"
            style={{ background: '#E8C547', color: '#1A1830' }}
          >
            <ClipboardText size={16} weight="bold" />
            복사해서 입력하기
          </button>
        </>
      )}
    </motion.div>
  )
}
