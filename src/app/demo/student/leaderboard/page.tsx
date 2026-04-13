'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Lightning, ArrowSquareOut, Crown } from '@phosphor-icons/react'
import DemoStudentSidebar from '@/components/DemoStudentSidebar'

const LEADERBOARD = [
  { rank: 1, name: '최수아', score: 91, sessions: 3, avatar: '수', streak: 5 },
  { rank: 2, name: '김지민', score: 88, sessions: 2, avatar: '지', streak: 3 },
  { rank: 3, name: '박서연', score: 72, sessions: 1, avatar: '서', streak: 1 },
  { rank: 4, name: '김무니', score: 68, sessions: 3, avatar: '무', streak: 2, isMe: true },
  { rank: 5, name: '이준혁', score: 45, sessions: 1, avatar: '준', streak: 0 },
]

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

export default function DemoLeaderboardPage() {
  const winner = LEADERBOARD[0]
  const rest = LEADERBOARD.slice(1)

  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      <DemoStudentSidebar activeTab="leaderboard" />

      <main className="flex-1 overflow-y-auto">
        {/* 모바일 헤더 */}
        <div className="md:hidden px-4 pt-4 pb-2 flex items-center justify-between">
          <Link href="/demo/student" className="text-sm font-semibold" style={{ color: '#5A4090' }}>← 홈</Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="px-5 md:px-8 pt-6 pb-4 max-w-3xl mx-auto">
          <h1 className="text-xl font-extrabold" style={{ color: '#2D1F6E' }}>이번 주 랭킹</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(90,79,160,0.55)' }}>3학년 2반 · 평균 이해도 기준</p>
        </div>

        <div className="px-5 md:px-8 max-w-3xl mx-auto pb-20 space-y-4">

          {/* 1등 하이라이트 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-6 overflow-hidden"
            style={{ ...clayCard, background: 'linear-gradient(135deg, rgba(232,197,71,0.15) 0%, rgba(255,255,255,0.94) 60%)' }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black"
                  style={{ background: '#FFF8E1', color: '#C8A020', border: '3px solid #E8C547' }}>
                  {winner.avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: '#E8C547' }}>
                  <Crown size={14} weight="fill" color="#1A1830" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#E8C547' }}>1위</p>
                <p className="text-lg font-extrabold" style={{ color: '#2D1F6E' }}>{winner.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#FF9600' }}>
                    <Lightning size={12} weight="fill" />{winner.streak}일 연속
                  </span>
                  <span className="text-xs" style={{ color: '#C0C0D0' }}>· {winner.sessions}회 학습</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: '#E8C547' }}>{winner.score}</p>
                <p className="text-xs font-semibold" style={{ color: 'rgba(90,79,160,0.50)' }}>점</p>
              </div>
            </div>
          </motion.div>

          {/* 나머지 순위 */}
          <div style={clayCard} className="overflow-hidden">
            {rest.map((student, i) => (
              <motion.div
                key={student.rank}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderBottom: i < rest.length - 1 ? '1px solid rgba(200,188,245,0.15)' : 'none',
                  background: student.isMe ? 'rgba(232,197,71,0.06)' : 'transparent',
                }}
              >
                {/* 순위 */}
                <span className="w-8 text-center font-black text-sm" style={{ color: student.rank <= 3 ? '#C8A020' : '#C0C0D0' }}>
                  {student.rank}
                </span>

                {/* 아바타 */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: student.isMe ? 'rgba(232,197,71,0.15)' : '#F4F2FF',
                    color: student.isMe ? '#C8A020' : '#7C6FBF',
                    border: student.isMe ? '2px solid #E8C547' : '2px solid #E0DCF0',
                  }}>
                  {student.avatar}
                </div>

                {/* 이름 + 스트릭 */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: '#2D1F6E' }}>
                    {student.name}
                    {student.isMe && <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(232,197,71,0.15)', color: '#C8A020' }}>나</span>}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {student.streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs" style={{ color: '#FF9600' }}>
                        <Lightning size={11} weight="fill" />{student.streak}일
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#C0C0D0' }}>· {student.sessions}회</span>
                  </div>
                </div>

                {/* 점수 */}
                <div className="flex items-center gap-1.5">
                  <Star size={14} weight="fill" style={{ color: '#E8C547' }} />
                  <span className="font-black text-base" style={{ color: '#2D1F6E' }}>{student.score}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 내 리포트 링크 */}
          <Link href="/demo/student/report"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm transition-all hover:translate-y-[-1px]"
            style={{ ...clayCard, color: '#7C6FBF' }}>
            <ArrowSquareOut size={16} weight="bold" />
            내 학습 리포트 보기
          </Link>

          {/* 무니 격려 */}
          <div className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: 'rgba(232,197,71,0.12)', border: '1.5px solid rgba(232,197,71,0.25)' }}>
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
              <Image src="/mooni/face-happy.png" alt="무니" width={44} height={44} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#2D1F6E' }}>더 열심히 설명하면 순위가 올라가요!</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(90,79,160,0.50)' }}>무니에게 설명할수록 이해도 점수가 올라요</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
