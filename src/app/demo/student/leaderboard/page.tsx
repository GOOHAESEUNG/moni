'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Star, Lightning } from '@phosphor-icons/react'

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

export default function DemoLeaderboardPage() {
  return (
    <div
      className="min-h-screen font-sans pb-20"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}
    >
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <Link href="/demo/student" className="flex items-center justify-center w-11 h-11 rounded-full"
          style={{ background: 'rgba(255,255,255,0.60)' }}>
          <ArrowLeft size={18} weight="bold" style={{ color: '#5A4090' }} />
        </Link>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: '#2D1F6E' }}>리더보드</h1>
          <p className="text-xs" style={{ color: 'rgba(90,79,160,0.55)' }}>3학년 2반 이번 주 랭킹</p>
        </div>
        <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
      </div>

      <div className="px-5 max-w-lg mx-auto space-y-4">
        {/* 상위 3명 포디엄 */}
        <div className="flex items-end justify-center gap-4 py-6">
          {/* 2등 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mb-2"
              style={{ background: '#F5F5F5', color: '#888', border: '3px solid #CCC' }}>
              {LEADERBOARD[1].avatar}
            </div>
            <p className="text-xs font-bold" style={{ color: '#2D1F6E' }}>{LEADERBOARD[1].name}</p>
            <p className="text-xs font-extrabold" style={{ color: '#9EA0B4' }}>{LEADERBOARD[1].score}점</p>
            <div className="mt-2 w-16 rounded-t-xl flex items-center justify-center font-black text-lg"
              style={{ height: 60, background: 'rgba(200,200,200,0.3)', color: '#888' }}>2</div>
          </motion.div>

          {/* 1등 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-18 h-18 rounded-full flex items-center justify-center text-xl font-black mb-2"
                style={{ width: 72, height: 72, background: '#FFF8E1', color: '#C8A020', border: '3px solid #E8C547' }}>
                {LEADERBOARD[0].avatar}
              </div>
              <div className="absolute -top-2 -right-1">
                <Trophy size={20} weight="fill" style={{ color: '#E8C547' }} />
              </div>
            </div>
            <p className="text-xs font-bold" style={{ color: '#2D1F6E' }}>{LEADERBOARD[0].name}</p>
            <p className="text-xs font-extrabold" style={{ color: '#E8C547' }}>{LEADERBOARD[0].score}점</p>
            <div className="mt-2 w-16 rounded-t-xl flex items-center justify-center font-black text-lg"
              style={{ height: 80, background: 'rgba(232,197,71,0.2)', color: '#C8A020' }}>1</div>
          </motion.div>

          {/* 3등 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mb-2"
              style={{ background: '#FFF0EB', color: '#C87A50', border: '3px solid #E8A878' }}>
              {LEADERBOARD[2].avatar}
            </div>
            <p className="text-xs font-bold" style={{ color: '#2D1F6E' }}>{LEADERBOARD[2].name}</p>
            <p className="text-xs font-extrabold" style={{ color: '#C87A50' }}>{LEADERBOARD[2].score}점</p>
            <div className="mt-2 w-16 rounded-t-xl flex items-center justify-center font-black text-lg"
              style={{ height: 44, background: 'rgba(200,140,80,0.15)', color: '#C87A50' }}>3</div>
          </motion.div>
        </div>

        {/* 전체 랭킹 리스트 */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.94)', boxShadow: '0 8px 32px rgba(170,155,230,0.16)' }}>
          {LEADERBOARD.map((student, i) => (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-3 px-5 py-4"
              style={{
                borderBottom: i < LEADERBOARD.length - 1 ? '1px solid rgba(200,188,245,0.15)' : 'none',
                background: student.isMe ? 'rgba(232,197,71,0.08)' : 'transparent',
              }}
            >
              {/* 순위 */}
              <span className="w-7 text-center font-black text-sm"
                style={{ color: RANK_STYLES[student.rank]?.text ?? '#9EA0B4' }}>
                {student.rank}
              </span>

              {/* 아바타 */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: RANK_STYLES[student.rank]?.bg ?? '#F4F2FF',
                  color: RANK_STYLES[student.rank]?.text ?? '#7C6FBF',
                  border: `2px solid ${RANK_STYLES[student.rank]?.border ?? '#E0DCF0'}`,
                }}>
                {student.avatar}
              </div>

              {/* 이름 + 연속 학습 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm truncate" style={{ color: '#2D1F6E' }}>
                    {student.name}
                    {student.isMe && <span className="ml-1 text-xs font-normal" style={{ color: '#E8C547' }}>(나)</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {student.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs" style={{ color: '#FF9600' }}>
                      <Lightning size={11} weight="fill" />
                      {student.streak}일 연속
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#C0C0D0' }}>
                    · {student.sessions}회 학습
                  </span>
                </div>
              </div>

              {/* 점수 */}
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" style={{ color: '#E8C547' }} />
                <span className="font-black text-sm" style={{ color: '#2D1F6E' }}>{student.score}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 내 순위 카드 */}
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
    </div>
  )
}
