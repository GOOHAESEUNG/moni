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
    <div className="flex flex-col min-h-screen" style={{ background: '#F2F1FA' }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6"
        style={{ background: '#13112A', height: 52, boxShadow: '0 1px 0 rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base" style={{ color: '#E8C547', fontFamily: "'Berkshire Swash', cursive" }}>Moni</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }}>
            선생님
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {teacherName} 선생님
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
