'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GraduationCap, Student, ArrowRight } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const STARS = [
  { id: 0, top: '5%', left: '10%', size: 1.8, delay: 0.3, dur: 2.8 },
  { id: 1, top: '18%', left: '82%', size: 2.3, delay: 1.1, dur: 3.5 },
  { id: 2, top: '30%', left: '55%', size: 1.5, delay: 0.7, dur: 2.2 },
  { id: 3, top: '70%', left: '25%', size: 2.0, delay: 2.0, dur: 4.1 },
  { id: 4, top: '85%', left: '70%', size: 1.6, delay: 0.4, dur: 3.0 },
  { id: 5, top: '45%', left: '90%', size: 2.1, delay: 1.8, dur: 2.5 },
  { id: 6, top: '60%', left: '8%', size: 1.9, delay: 0.9, dur: 3.8 },
  { id: 7, top: '90%', left: '45%', size: 2.5, delay: 1.5, dur: 2.9 },
]

export default function DemoPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #0A0818 0%, #0D0B1E 40%, #12103A 70%, #1E1A35 100%)' }}
    >
      {/* 별 */}
      {STARS.map((s) => (
        <div key={s.id} className="star-particle absolute rounded-full bg-white pointer-events-none"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as CSSProperties} />
      ))}

      {/* 달 글로우 */}
      <div className="pointer-events-none absolute" style={{ top: '-10%', right: '-8%', width: '45vw', height: '45vw', maxWidth: 500, maxHeight: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,197,71,0.12) 0%, transparent 65%)' }} />

      {/* 상단 내비 */}
      <nav className="flex items-center justify-between px-6 md:px-12 pt-8 pb-4 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 100 100"><circle cx="42" cy="50" r="38" fill="#E8C547"/><circle cx="62" cy="50" r="34" fill="#0D0B1E"/></svg>
          <span className="text-base" style={{ color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>Moni</span>
        </Link>
        <Link href="/" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.45)' }}>
          ← 홈으로
        </Link>
      </nav>

      {/* 메인 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 pb-16 relative z-10">

        {/* 무니 + 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-4"
            style={{ width: 120, height: 80 }}
          >
            <Image src="/mooni/curious.png" alt="무니" fill className="object-contain drop-shadow-xl" priority />
          </motion.div>

          <h1 className="text-center mb-2" style={{ fontFamily: "'Berkshire Swash', cursive", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#E8C547' }}>
            Moni
          </h1>
          <p className="text-lg font-bold text-center" style={{ color: 'rgba(255,255,255,0.85)' }}>
            어떤 역할로 체험할까요?
          </p>
          <p className="text-sm text-center mt-2 max-w-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
            로그인 없이 샘플 데이터로 바로 체험할 수 있어요
          </p>
        </motion.div>

        {/* 역할 선택 카드 */}
        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">

          {/* 학생 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1"
          >
            <Link href="/demo/student"
              className="group flex flex-col h-full rounded-2xl p-6 sm:p-8 transition-all hover:translate-y-[-2px]"
              style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,197,71,0.15)' }}>
                  <Student size={22} weight="fill" style={{ color: '#E8C547' }} />
                </div>
                <div>
                  <p className="text-base font-extrabold text-white">학생으로 체험</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>약 3분 소요</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                무니에게 &ldquo;도형의 넓이&rdquo;를 직접 설명해보세요. 무니가 꼬리 질문을 던지고, 학습이 끝나면 이해도 리포트가 자동 생성돼요.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3" style={{ color: '#E8C547' }}>
                학생 체험 시작 <ArrowRight size={16} weight="bold" />
              </div>
            </Link>
          </motion.div>

          {/* 선생님 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex-1"
          >
            <Link href="/demo/teacher"
              className="group flex flex-col h-full rounded-2xl p-6 sm:p-8 transition-all hover:translate-y-[-2px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <GraduationCap size={22} weight="fill" style={{ color: 'rgba(255,255,255,0.70)' }} />
                </div>
                <div>
                  <p className="text-base font-extrabold text-white">선생님으로 체험</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>약 2분 소요</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                학생별 이해도 리포트, 역량 분석, 반 전체 요약 대시보드를 확인하고 AI 수업 추천까지 받아보세요.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
                대시보드 체험 <ArrowRight size={16} weight="bold" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 추천 경로 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-center px-4"
          style={{ color: 'rgba(255,255,255,0.30)' }}
        >
          추천: 학생 체험 → 무니와 대화 → 리포트 확인 → 선생님 대시보드
        </motion.p>

        {/* 하단 링크 */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              const keys = Object.keys(localStorage).filter(k => k.startsWith('demo-'))
              keys.forEach(k => localStorage.removeItem(k))
              alert('튜토리얼이 초기화되었어요! 다시 체험하면 튜토리얼이 표시됩니다.')
            }}
            className="text-xs font-semibold transition-opacity hover:opacity-70 px-4 py-2 rounded-full"
            style={{ color: 'rgba(232,197,71,0.60)', border: '1px solid rgba(232,197,71,0.15)' }}
          >
            튜토리얼 다시 보기
          </button>
        </div>
      </div>
    </div>
  )
}
