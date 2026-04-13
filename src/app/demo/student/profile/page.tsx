'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Lightning, Star, BookOpen, SignOut } from '@phosphor-icons/react'
import DemoStudentSidebar from '@/components/DemoStudentSidebar'

const STATS = [
  { label: '총 학습', value: '3회', icon: BookOpen, color: '#7C6FBF', bg: 'rgba(124,111,191,0.10)' },
  { label: '연속 학습', value: '2일', icon: Lightning, color: '#FF9600', bg: 'rgba(255,150,0,0.10)' },
  { label: '평균 점수', value: '78점', icon: Star, color: '#E8C547', bg: 'rgba(232,197,71,0.12)' },
  { label: '반 순위', value: '4위', icon: Trophy, color: '#4CAF50', bg: 'rgba(76,175,80,0.10)' },
]

const BADGES = [
  { emoji: '🌟', label: '첫 학습 완료', earned: true },
  { emoji: '🔥', label: '3일 연속', earned: false },
  { emoji: '💎', label: '90점 달성', earned: false },
  { emoji: '🏆', label: '1등 달성', earned: false },
]

const COMPETENCY = [
  { label: '자기관리', value: 3, color: '#7C6FBF' },
  { label: '대인관계', value: 4, color: '#E8C547' },
  { label: '시민', value: 3, color: '#4CAF50' },
  { label: '문제해결', value: 4, color: '#FF9600' },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export default function DemoProfilePage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      <DemoStudentSidebar activeTab="profile" />

      <main className="flex-1 overflow-y-auto">
        {/* 헤더 */}
        <div className="px-5 md:px-8 pt-6 pb-2 flex items-center justify-between">
          <h1 className="text-xl font-extrabold" style={{ color: '#2D1F6E' }}>내 프로필</h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="max-w-2xl mx-auto px-5 md:px-8 pb-16">

          {/* ━━ 프로필 히어로 카드 ━━ */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="relative mt-4 mb-6 rounded-[28px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 12px 48px rgba(130,110,200,0.18), 0 2px 8px rgba(150,135,210,0.10)',
            }}
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.30) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />

            <div className="relative p-6 md:p-8 flex items-center gap-5">
              {/* 무니 + 아바타 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="relative shrink-0"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020', border: '3px solid #E8C547' }}>
                  김
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Image src="/mooni/face-happy.png" alt="무니" width={32} height={32}
                    className="rounded-full" style={{ background: 'rgba(232,197,71,0.20)' }} />
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-xl font-black" style={{ color: '#2D1F6E' }}>김무니</p>
                <p className="text-sm mt-0.5" style={{ color: '#9EA0B4' }}>student@demo.com</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: '#F4F2FF', color: '#7C6FBF' }}>3학년 2반</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(232,197,71,0.12)', color: '#C8A020' }}>Lv.2 학습자</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ━━ 학습 통계 4칸 ━━ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {STATS.map(({ label, value, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 16px rgba(150,135,210,0.08)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: bg }}>
                  <Icon size={20} weight="fill" style={{ color }} />
                </div>
                <p className="text-lg font-black" style={{ color: '#2D1F6E' }}>{value}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#9EA0B4' }}>{label}</p>
              </motion.div>
            ))}
          </div>

          {/* ━━ 역량 레이더 + 배지 (2컬럼) ━━ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

            {/* 역량 요약 */}
            <motion.div {...fadeUp} transition={{ delay: 0.35, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 16px rgba(150,135,210,0.08)' }}>
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>핵심역량</p>
              <div className="space-y-3">
                {COMPETENCY.map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold" style={{ color }}>{label}</span>
                      <span className="text-sm font-black" style={{ color }}>
                        {value}<span className="text-xs font-normal opacity-50">/5</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(200,190,240,0.20)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(value / 5) * 100}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 배지 컬렉션 */}
            <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 16px rgba(150,135,210,0.08)' }}>
              <p className="text-sm font-extrabold mb-4" style={{ color: '#2D1F6E' }}>배지 컬렉션</p>
              <div className="grid grid-cols-2 gap-2.5">
                {BADGES.map(({ emoji, label, earned }) => (
                  <div key={label}
                    className="rounded-xl p-3 text-center transition-all"
                    style={{
                      background: earned ? 'rgba(232,197,71,0.10)' : 'rgba(200,190,240,0.08)',
                      border: earned ? '1.5px solid rgba(232,197,71,0.25)' : '1.5px solid transparent',
                      opacity: earned ? 1 : 0.45,
                    }}>
                    <span className="text-2xl block mb-1" style={{ filter: earned ? 'none' : 'grayscale(1)' }}>{emoji}</span>
                    <p className="text-xs font-bold" style={{ color: earned ? '#7A6200' : '#B8B5D0' }}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: '#B8B5D0' }}>
                1/4 달성
              </p>
            </motion.div>
          </div>

          {/* ━━ 무니와의 추억 ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl p-5 mb-6"
            style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <div className="flex items-center gap-3">
              <Image src="/mooni/impressed.png" alt="무니" width={48} height={32} className="shrink-0 drop-shadow-sm" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#2D1F6E' }}>무니가 가장 감동받았던 순간</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B6B8D' }}>
                  &ldquo;삼각형은 직사각형의 딱 절반이에요!&rdquo; — 도형의 넓이 세션에서
                </p>
              </div>
            </div>
          </motion.div>

          {/* ━━ 체험 종료 ━━ */}
          <motion.div {...fadeUp} transition={{ delay: 0.55, duration: 0.5 }}>
            <Link href="/demo"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-70"
              style={{ color: '#9EA0B4', border: '1px solid rgba(200,188,245,0.30)', background: 'rgba(255,255,255,0.50)' }}>
              <SignOut size={16} /> 체험 종료
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
