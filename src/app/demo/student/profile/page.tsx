'use client'

import Link from 'next/link'
import { House, Trophy, User, SignOut } from '@phosphor-icons/react'

export default function DemoProfilePage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>

      {/* 사이드바 */}
      <nav className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
        style={{ background: '#FFFFFF', borderRight: '1px solid rgba(200,188,245,0.40)' }}>
        <div className="px-5 pt-6 pb-4 text-center">
          <p style={{ color: '#8575C4', fontFamily: "'Berkshire Swash', cursive", fontSize: 24 }}>Moni</p>
          <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
        </div>
        <div style={{ height: 1, background: 'rgba(200,188,245,0.30)' }} />
        <div className="flex-1 flex flex-col gap-1 px-3 py-4">
          <Link href="/demo/student" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
            <House size={20} weight="regular" /><span className="font-semibold text-sm">학습</span>
          </Link>
          <Link href="/demo/student/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60" style={{ color: '#B8B5D0' }}>
            <Trophy size={20} weight="regular" /><span className="font-semibold text-sm">리더보드</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-full" style={{ background: 'rgba(232,197,71,0.15)', color: '#5A4090' }}>
            <User size={20} weight="fill" style={{ color: '#E8C547' }} /><span className="font-extrabold text-sm">프로필</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }} className="px-5 py-4">
          <p className="font-extrabold text-sm" style={{ color: '#4A3E80' }}>김무니</p>
          <p className="text-xs" style={{ color: '#A8A5C0' }}>3학년 2반</p>
          <Link href="/demo" className="mt-3 flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#B8B5D0' }}>← 체험 선택</Link>
        </div>
      </nav>

      {/* 메인 */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden px-4 pt-4 pb-2 flex items-center justify-between">
          <Link href="/demo/student" className="text-sm font-semibold" style={{ color: '#5A4090' }}>← 홈</Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="px-5 md:px-8 pt-6 pb-4">
          <h1 className="text-xl font-extrabold" style={{ color: '#2D1F6E' }}>프로필</h1>
        </div>

        <div className="px-5 md:px-8 max-w-lg pb-20 space-y-4">
          {/* 프로필 카드 */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: '1px solid rgba(200,188,245,0.30)' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black"
                style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}>김</div>
              <div>
                <p className="text-lg font-extrabold" style={{ color: '#2D1F6E' }}>김무니</p>
                <p className="text-sm" style={{ color: '#9EA0B4' }}>student@demo.com</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F5F4FA' }}>
                <span className="text-sm" style={{ color: '#9EA0B4' }}>소속 반</span>
                <span className="text-sm font-bold" style={{ color: '#2D1F6E' }}>3학년 2반</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F5F4FA' }}>
                <span className="text-sm" style={{ color: '#9EA0B4' }}>역할</span>
                <span className="text-sm font-bold" style={{ color: '#2D1F6E' }}>학생</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm" style={{ color: '#9EA0B4' }}>학습 횟수</span>
                <span className="text-sm font-bold" style={{ color: '#E8C547' }}>3회</span>
              </div>
            </div>
          </div>

          {/* 로그아웃 */}
          <Link href="/demo"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#9EA0B4', border: '1px solid rgba(200,188,245,0.30)' }}>
            <SignOut size={16} /> 체험 종료
          </Link>
        </div>
      </main>
    </div>
  )
}
