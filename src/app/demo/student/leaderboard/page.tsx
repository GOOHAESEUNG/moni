'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { House, Trophy, User, Star, Lightning, ArrowSquareOut } from '@phosphor-icons/react'

const LEADERBOARD = [
  { rank: 1, name: '최수아', score: 91, sessions: 3, avatar: '수', streak: 5 },
  { rank: 2, name: '김지민', score: 88, sessions: 2, avatar: '지', streak: 3 },
  { rank: 3, name: '박서연', score: 72, sessions: 1, avatar: '서', streak: 1 },
  { rank: 4, name: '김무니', score: 68, sessions: 3, avatar: '무', streak: 2, isMe: true },
  { rank: 5, name: '이준혁', score: 45, sessions: 1, avatar: '준', streak: 0 },
]

const RANK_STYLES: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#FFF8E1', text: '#C8A020', border: '#E8C547' },
  2: { bg: '#F5F5F5', text: '#888', border: '#CCC' },
  3: { bg: '#FFF0EB', text: '#C87A50', border: '#E8A878' },
}

function LeftNav() {
  return (
    <nav className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#FFFFFF', borderRight: '1px solid rgba(200,188,245,0.40)' }}>
      <div className="px-5 pt-6 pb-4">
        <p style={{ color: '#8575C4', fontFamily: "'Berkshire Swash', cursive", fontSize: 24 }}>Moni</p>
        <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
      </div>
      <div style={{ height: 1, background: 'rgba(200,188,245,0.30)' }} />
      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        <Link href="/demo/student" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
          <House size={20} weight="regular" />
          <span className="font-semibold text-sm">학습</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ background: 'rgba(232,197,71,0.15)', color: '#5A4090' }}>
          <Trophy size={20} weight="fill" style={{ color: '#E8C547' }} />
          <span className="font-extrabold text-sm">리더보드</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-full" style={{ color: '#B8B5D0' }}>
          <User size={20} weight="regular" />
          <span className="font-semibold text-sm">프로필</span>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }} className="px-5 py-4">
        <p className="font-extrabold text-sm" style={{ color: '#4A3E80' }}>김무니</p>
        <p className="text-xs" style={{ color: '#A8A5C0' }}>3학년 2반</p>
        <Link href="/demo" className="mt-3 flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#B8B5D0' }}>← 체험 선택</Link>
      </div>
    </nav>
  )
}

export default function DemoLeaderboardPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      <LeftNav />

      <main className="flex-1 overflow-y-auto">
        {/* 모바일 헤더 */}
        <div className="md:hidden px-4 pt-4 pb-2 flex items-center justify-between">
          <Link href="/demo/student" className="text-sm font-semibold" style={{ color: '#5A4090' }}>← 홈</Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="px-5 pt-6 pb-4">
          <h1 className="text-xl font-extrabold" style={{ color: '#2D1F6E' }}>🏆 리더보드</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(90,79,160,0.55)' }}>3학년 2반 이번 주 랭킹</p>
        </div>

        <div className="px-5 max-w-lg mx-auto space-y-4 pb-20">
          {/* 상위 3명 포디엄 */}
          <div className="flex items-end justify-center gap-4 py-4">
            {[1, 0, 2].map((idx, i) => {
              const s = LEADERBOARD[idx]
              const heights = [60, 80, 44]
              const sizes = [56, 72, 56]
              const rankStyle = RANK_STYLES[s.rank] ?? { bg: '#F4F2FF', text: '#7C6FBF', border: '#E0DCF0' }
              return (
                <motion.div key={s.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="rounded-full flex items-center justify-center font-black mb-2"
                      style={{ width: sizes[i], height: sizes[i], background: rankStyle.bg, color: rankStyle.text, border: `3px solid ${rankStyle.border}`, fontSize: sizes[i] > 60 ? 20 : 16 }}>
                      {s.avatar}
                    </div>
                    {s.rank === 1 && <Trophy size={18} weight="fill" className="absolute -top-1 -right-1" style={{ color: '#E8C547' }} />}
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#2D1F6E' }}>{s.name}</p>
                  <p className="text-xs font-extrabold" style={{ color: rankStyle.text }}>{s.score}점</p>
                  <div className="mt-2 w-14 rounded-t-xl flex items-center justify-center font-black"
                    style={{ height: heights[i], background: `${rankStyle.border}30`, color: rankStyle.text }}>
                    {s.rank}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 전체 랭킹 */}
          <div className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.94)', boxShadow: '0 8px 32px rgba(170,155,230,0.16)' }}>
            {LEADERBOARD.map((student, i) => (
              <motion.div key={student.rank}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderBottom: i < LEADERBOARD.length - 1 ? '1px solid rgba(200,188,245,0.15)' : 'none',
                  background: student.isMe ? 'rgba(232,197,71,0.08)' : 'transparent',
                }}
              >
                <span className="w-7 text-center font-black text-sm"
                  style={{ color: RANK_STYLES[student.rank]?.text ?? '#9EA0B4' }}>
                  {student.rank}
                </span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: RANK_STYLES[student.rank]?.bg ?? '#F4F2FF',
                    color: RANK_STYLES[student.rank]?.text ?? '#7C6FBF',
                    border: `2px solid ${RANK_STYLES[student.rank]?.border ?? '#E0DCF0'}`,
                  }}>
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: '#2D1F6E' }}>
                    {student.name}
                    {student.isMe && <span className="ml-1 text-xs font-normal" style={{ color: '#E8C547' }}>(나)</span>}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {student.streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs" style={{ color: '#FF9600' }}>
                        <Lightning size={11} weight="fill" />{student.streak}일 연속
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#C0C0D0' }}>· {student.sessions}회 학습</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} weight="fill" style={{ color: '#E8C547' }} />
                  <span className="font-black text-sm" style={{ color: '#2D1F6E' }}>{student.score}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 내 리포트 보기 */}
          <Link href="/demo/student/report"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.94)', color: '#7C6FBF', boxShadow: '0 4px 16px rgba(170,155,230,0.16)' }}>
            <ArrowSquareOut size={16} weight="bold" />
            내 학습 리포트 보기
          </Link>

          {/* 무니 격려 */}
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(232,197,71,0.15)', border: '1.5px solid rgba(232,197,71,0.30)' }}>
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <Image src="/mooni/face-happy.png" alt="무니" width={48} height={48} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#2D1F6E' }}>더 열심히 설명하면 순위가 올라가요!</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(90,79,160,0.55)' }}>무니에게 설명할수록 이해도 점수가 오릅니다</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
