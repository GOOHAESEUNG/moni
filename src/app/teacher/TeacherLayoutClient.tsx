'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ReactNode } from 'react'

interface TeacherLayoutClientProps {
  teacherName: string
  children: ReactNode
}

export default function TeacherLayoutClient({ teacherName, children }: TeacherLayoutClientProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F2F2F5' }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 border-b"
        style={{ background: '#FFFFFF', borderColor: '#E4E4EA', height: 56 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: '#E8C547' }}>무니</span>
          <span className="text-sm font-medium text-muted-foreground">선생님 대시보드</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
            {teacherName} 선생님
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: '#F2F2F5', color: '#9EA0B4' }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
