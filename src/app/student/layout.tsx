'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, ChartBar, User } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { href: '/student', label: '홈', Icon: House },
  { href: '/student/progress', label: '학습 현황', Icon: ChartBar },
  { href: '/student/profile', label: '내 정보', Icon: User },
]

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F2F2F5' }}>
      <main className="flex-1 pb-20">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t"
        style={{ background: '#FFFFFF', borderColor: '#E4E4EA', height: 64 }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/student' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 py-2 px-4"
            >
              <Icon
                size={24}
                weight={isActive ? 'fill' : 'regular'}
                color={isActive ? '#E8C547' : '#9EA0B4'}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? '#E8C547' : '#9EA0B4' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
