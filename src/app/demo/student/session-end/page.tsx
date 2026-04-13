'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, House, Lightbulb } from '@phosphor-icons/react'

const DEMO_SCORE = 78
const DEMO_UNIT_TITLE = '도형의 넓이'
const DEMO_SUMMARY = '직사각형과 삼각형의 기본 공식은 잘 이해하고 있어요. 평행사변형의 넓이에서 잠깐 막혔지만 무니의 힌트로 스스로 찾아냈어요!'
const DEMO_WEAK_POINTS = ['평행사변형 넓이 공식의 원리 설명', '단위(cm²) 의미 연결']

const scoreColor = DEMO_SCORE >= 80 ? '#22c55e' : DEMO_SCORE >= 60 ? '#E8C547' : '#f97316'

export default function DemoSessionEndPage() {
  const [displayScore, setDisplayScore] = useState(0)
  const [reflection, setReflection] = useState('')

  useEffect(() => {
    let current = 0
    const step = Math.ceil(DEMO_SCORE / 30)
    const interval = setInterval(() => {
      current = Math.min(current + step, DEMO_SCORE)
      setDisplayScore(current)
      if (current >= DEMO_SCORE) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen font-sans pb-12"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 60%, #1E1A35 100%)' }}
    >
      {/* confetti */}
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
            transition={{ duration: 2.5 + (i % 5) * 0.3, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {(['⭐', '✨', '🌙', '💫', '🎉'] as const)[i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-lg md:max-w-2xl mx-auto px-5 pt-12 flex flex-col items-center gap-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: 'backOut' }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Image src="/mooni/impressed.png" alt="무니 - 완벽해요!" width={240} height={160} priority className="drop-shadow-2xl" />
          </motion.div>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-2xl font-black text-white">잘 가르쳐줬어요! 🌙</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{DEMO_UNIT_TITLE}</p>
        </motion.div>

        {/* 이해도 점수 */}
        <motion.div
          className="w-full rounded-3xl p-6"
          style={{ background: 'rgba(232,197,71,0.18)', border: '1px solid rgba(232,197,71,0.25)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.50)' }}>무니 이해도</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-black" style={{ color: scoreColor }}>{displayScore}</span>
            <span className="text-xl font-bold mb-1" style={{ color: scoreColor }}>점</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${DEMO_SCORE}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>{DEMO_SUMMARY}</p>
        </motion.div>

        {/* 더 알아볼 부분 */}
        <motion.div
          className="w-full rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-bold mb-3 text-white">더 알아볼 부분</p>
          <ul className="space-y-2">
            {DEMO_WEAK_POINTS.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb size={16} weight="fill" style={{ color: '#E8C547', marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 자기성찰 */}
        <motion.div
          className="w-full rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        >
          <p className="text-sm font-bold mb-1 text-white">자기성찰</p>
          <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>오늘 가장 어려웠던 부분은?</p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
            placeholder="솔직하게 적어봐요. (체험 모드에서는 저장되지 않아요)"
            className="w-full bg-transparent text-sm text-white resize-none outline-none placeholder:text-white/25 leading-relaxed"
          />
        </motion.div>

        {/* 버튼 */}
        <motion.div
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        >
          <Link
            href="/demo/student/report"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830' }}
          >
            리포트 보기 <ArrowRight size={18} weight="bold" />
          </Link>
          <Link
            href="/demo/student"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <House size={18} weight="fill" /> 홈으로
          </Link>
          <Link
            href="/demo/teacher"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            선생님 대시보드도 체험해보기 →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
