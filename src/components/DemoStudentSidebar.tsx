'use client'

import Link from 'next/link'
import { House, Trophy, User } from '@phosphor-icons/react'

type ActiveTab = 'home' | 'leaderboard' | 'profile'

interface Props {
  activeTab: ActiveTab
}

const NAV_ITEMS: { key: ActiveTab; label: string; href: string; icon: typeof House }[] = [
  { key: 'home', label: '학습', href: '/demo/student', icon: House },
  { key: 'leaderboard', label: '리더보드', href: '/demo/student/leaderboard', icon: Trophy },
  { key: 'profile', label: '프로필', href: '/demo/student/profile', icon: User },
]

export default function DemoStudentSidebar({ activeTab }: Props) {
  return (
    <nav
      className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto"
      style={{ background: '#FFFFFF', borderRight: '1px solid rgba(200,188,245,0.40)' }}
    >
      {/* 로고 + 프로필 (선생님 사이드바와 동일 구조) */}
      <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(200,188,245,0.30)' }}>
        <p className="text-lg text-center mb-4" style={{ color: '#8575C4', fontFamily: "'Berkshire Swash', cursive" }}>Moni</p>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#C8A020' }}
          >
            김
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm leading-tight truncate" style={{ color: '#4A3E80' }}>김무니</p>
            <p className="text-xs truncate" style={{ color: '#A8A5C0' }}>3학년 2반</p>
          </div>
        </div>

        <span
          className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.22)', color: '#9B7E00' }}
        >
          체험 모드
        </span>
      </div>

      {/* 네비게이션 */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
          const isActive = key === activeTab

          if (isActive) {
            return (
              <div
                key={key}
                className="flex items-center gap-3 px-4 py-3 rounded-full"
                style={{ background: 'rgba(232,197,71,0.15)', color: '#5A4090' }}
              >
                <Icon size={20} weight="fill" />
                <span className="text-sm font-extrabold">{label}</span>
              </div>
            )
          }

          return (
            <Link
              key={key}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-full transition-colors hover:bg-purple-50/60"
              data-tutorial={key === 'profile' ? 'profile-nav' : undefined}
              style={{ color: '#B8B5D0' }}
            >
              <Icon size={20} weight="regular" />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>

      {/* 하단: 체험 선택 */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(200,188,245,0.30)' }}>
        <Link
          href="/demo"
          className="flex items-center gap-3 rounded-full px-4 py-3 transition-colors hover:bg-purple-50/60"
          style={{ color: '#B8B5D0' }}
        >
          <House size={18} />
          <span className="text-sm font-semibold">체험 선택으로</span>
        </Link>
      </div>
    </nav>
  )
}
