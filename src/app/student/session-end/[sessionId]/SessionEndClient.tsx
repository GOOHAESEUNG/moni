'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, House, Lightbulb } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  sessionId: string
  reportId: string | null
  unitTitle: string
  understandingScore: number
  selfReflection: string
  summary: string | null
  weakPoints: string[]
  suggestions: string[]
}

export default function SessionEndClient({
  sessionId,
  reportId,
  unitTitle,
  understandingScore,
  selfReflection: initialReflection,
  summary,
  weakPoints,
  suggestions,
}: Props) {
  const [reflection, setReflection] = useState(initialReflection)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (understandingScore <= 0) { setDisplayScore(0); return }
    let current = 0
    const step = Math.ceil(understandingScore / 30)
    const interval = setInterval(() => {
      current = Math.min(current + step, understandingScore)
      setDisplayScore(current)
      if (current >= understandingScore) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [understandingScore])

  async function saveReflection() {
    if (!reflection.trim() || saving) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('sessions')
      .update({ self_reflection: reflection })
      .eq('id', sessionId)
    setSaving(false)
    setSaved(true)
  }

  const scoreColor =
    understandingScore >= 80
      ? '#22c55e'
      : understandingScore >= 60
      ? '#E8C547'
      : '#f97316'

  return (
    <div
      className="min-h-screen font-sans pb-12"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 60%, #1E1A35 100%)' }}
    >
      {/* confetti 이펙트 (80점 이상) */}
      {understandingScore >= 80 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl select-none"
              style={{ left: `${5 + i * 5}%`, top: -30 }}
              initial={{ y: -30, opacity: 1, rotate: 0 }}
              animate={{
                y: '115vh',
                opacity: [1, 1, 0.8, 0],
                rotate: (i % 2 === 0 ? 1 : -1) * (90 + (i % 4) * 45),
              }}
              transition={{
                duration: 2.5 + (i % 5) * 0.3,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {(['⭐', '✨', '🌙', '💫', '🎉'] as const)[i % 5]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-lg md:max-w-2xl mx-auto px-5 pt-12 flex flex-col items-center gap-6">
        {/* 무니 impressed 표정 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/mooni/impressed.png"
              alt="무니 - 완벽해요!"
              width={240}
              height={160}
              priority
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* 헤드 텍스트 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-black text-white">잘 가르쳐줬어요! 🌙</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {unitTitle}
          </p>
        </motion.div>

        {/* 이해도 점수 카드 */}
        <motion.div
          className="w-full rounded-3xl p-6"
          style={{
            background: 'rgba(232,197,71,0.18)',
            border: '1px solid rgba(232,197,71,0.25)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.50)' }}>
            무니 이해도
          </p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-black" style={{ color: scoreColor }}>
              {displayScore}
            </span>
            <span className="text-xl font-bold mb-1" style={{ color: scoreColor }}>
              점
            </span>
          </div>
          {/* 프로그레스 바 */}
          <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${understandingScore}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {summary && (
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
              {summary}
            </p>
          )}
        </motion.div>

        {/* 더 알아볼 부분 */}
        {weakPoints.length > 0 && (
          <motion.div
            className="w-full rounded-3xl p-5"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-bold mb-3 text-white">더 알아볼 부분</p>
            <ul className="space-y-2">
              {weakPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Lightbulb size={16} weight="fill" style={{ color: '#E8C547', marginTop: 2, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* 자기성찰 입력 */}
        <motion.div
          className="w-full rounded-3xl p-5"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <p className="text-sm font-bold mb-1 text-white">자기성찰</p>
          <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>
            오늘 가장 어려웠던 부분은?
          </p>
          <textarea
            value={reflection}
            onChange={(e) => { setReflection(e.target.value); setSaved(false) }}
            rows={3}
            placeholder="솔직하게 적어봐요. 선생님도 볼 수 있어요."
            className="w-full bg-transparent text-sm text-white resize-none outline-none placeholder:text-white/25 leading-relaxed"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={saveReflection}
              disabled={saving || !reflection.trim()}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-opacity disabled:opacity-40"
              style={{ background: '#E8C547', color: '#1A1830' }}
            >
              {saved ? '저장됨 ✓' : saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </motion.div>

        {/* 버튼 2개 */}
        <motion.div
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {reportId && (
            <Link
              href={`/student/report/${reportId}`}
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#E8C547', color: '#1A1830' }}
            >
              리포트 보기
              <ArrowRight size={18} weight="bold" />
            </Link>
          )}
          <Link
            href="/student"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.80)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <House size={18} weight="fill" />
            홈으로
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
