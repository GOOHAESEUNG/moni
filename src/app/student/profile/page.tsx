'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, SignOut, Copy, Check } from '@phosphor-icons/react'

const clayStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

export default function StudentProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: p } = await supabase.from('profiles').select('name, email').eq('id', user.id).single()
      setProfile(p)

      // 소속 반 초대 코드
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('classes(invite_code, name)')
        .eq('student_id', user.id)
        .limit(1)
      if (enrollments?.[0]) {
        const cls = Array.isArray(enrollments[0].classes) ? enrollments[0].classes[0] : enrollments[0].classes as any
        setInviteCode(cls?.invite_code ?? null)
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function copyCode() {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F7F7' }}>
      <div className="text-2xl animate-pulse">🌙</div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F7F7F7' }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>내 정보</h1>
      </div>

      <div className="px-5 space-y-4 max-w-lg mx-auto">
        {/* 프로필 카드 */}
        <div className="p-5" style={clayStyle}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(232,197,71,0.15)' }}>
              <User size={32} weight="fill" style={{ color: '#E8C547' }} />
            </div>
            <div>
              <p className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>{profile?.name}</p>
              <p className="text-sm mt-0.5" style={{ color: '#9EA0B4' }}>{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* 초대 코드 */}
        {inviteCode && (
          <div className="p-5" style={clayStyle}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9EA0B4' }}>소속 반 초대 코드</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold tracking-widest" style={{ color: '#E8C547' }}>{inviteCode}</span>
              <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold"
                style={{ background: 'rgba(232,197,71,0.1)', color: '#C8A020' }}>
                {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 font-extrabold text-sm transition-all duration-150"
          style={{
            background: '#FFFFFF',
            borderRadius: '9999px',
            padding: '14px 24px',
            color: '#9EA0B4',
            boxShadow: '0 4px 0 #E8E8E8',
            border: '1px solid #F0F0F0',
          }}
        >
          <SignOut size={18} weight="bold" />
          로그아웃
        </button>
      </div>
    </div>
  )
}
