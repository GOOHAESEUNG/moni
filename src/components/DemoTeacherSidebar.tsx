'use client'

import Link from 'next/link'
import { BookOpen, Users, Trophy, ChartBar, House } from '@phosphor-icons/react'

type ActiveTab = 'units' | 'students' | 'quests' | 'summary'

interface Props {
  activeTab: ActiveTab
  teacherName?: string
  className?: string
  inviteCode?: string
}

const NAV_ITEMS: { key: ActiveTab; label: string; href: string; icon: typeof BookOpen }[] = [
  { key: 'units', label: '단원 관리', href: '/demo/teacher', icon: BookOpen },
  { key: 'students', label: '학생 목록', href: '/demo/teacher/students', icon: Users },
  { key: 'quests', label: '퀘스트', href: '/demo/teacher/quests/new', icon: Trophy },
  { key: 'summary', label: '반 요약', href: '/demo/teacher/summary', icon: ChartBar },
]

export default function DemoTeacherSidebar({ activeTab, teacherName = '이선생', className = '', inviteCode = 'ABC123' }: Props) {
  return (
    <nav className={`hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto ${className}`}
      style={{ background: '#13112A' }}>

      {/* 로고 + 프로필 */}
      <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-lg mb-4 text-center" style={{ color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>Moni</p>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(232,197,71,0.18)' }}>
            <span className="text-sm font-extrabold" style={{ color: '#E8C547' }}>{teacherName[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm leading-tight truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>{teacherName} 선생님</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>3학년 2반</p>
          </div>
        </div>

        {/* 초대 코드 */}
        <div className="mt-4 flex items-center gap-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>초대 코드</p>
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}>
            {inviteCode}
          </span>
        </div>

        <span className="mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547' }}>
          체험 모드
        </span>
      </div>

      {/* 네비게이션 */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
          const isActive = key === activeTab
          return isActive ? (
            <div key={key} className="flex items-center gap-3 rounded-full px-3 py-2.5"
              style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}>
              <Icon size={18} weight="fill" />
              <span className="text-sm font-extrabold">{label}</span>
            </div>
          ) : (
            <Link key={key} href={href}
              className="flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              <Icon size={18} />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>

      {/* 하단: 체험 선택 */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/demo" className="flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          <House size={18} />
          <span className="text-sm font-semibold">체험 선택으로</span>
        </Link>
      </div>
    </nav>
  )
}
