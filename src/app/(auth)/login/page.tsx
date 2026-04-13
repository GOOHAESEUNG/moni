'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import MooniCharacter from '@/components/mooni/MooniCharacter'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      router.push(profile?.role === 'teacher' ? '/teacher' : '/student')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: '#F7F7F7' }}>
      <div className="w-full max-w-sm">
        {/* 홈 링크 */}
        <div className="mb-4">
          <Link href="/" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#9EA0B4' }}>
            ← 홈으로
          </Link>
        </div>

        {/* 캐릭터 + 앱 이름 */}
        <div className="flex flex-col items-center mb-6">
          <MooniCharacter expression="curious" size={90} className="mb-3" />
          <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>Moni</h1>
          <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>무니가 기다리고 있어요!</p>
        </div>

        {/* 폼 카드 — Claymorphism */}
        <div
          className="rounded-[20px] p-6"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold" style={{ color: '#2D2F2F' }}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all"
                style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none' }}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold" style={{ color: '#2D2F2F' }}>
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all"
                style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none' }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#FF5555' }}>{error}</p>
            )}

            {/* Duolingo 3D 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-extrabold text-sm transition-all duration-150 disabled:opacity-60"
              style={{
                background: '#E8C547',
                borderRadius: '9999px',
                padding: '14px 24px',
                color: '#1A1830',
                boxShadow: loading ? '0 2px 0 #C8A020' : '0 4px 0 #C8A020',
                transform: loading ? 'translateY(2px)' : 'translateY(0)',
              }}
              onMouseDown={(e) => {
                const btn = e.currentTarget
                btn.style.transform = 'translateY(2px)'
                btn.style.boxShadow = '0 2px 0 #C8A020'
              }}
              onMouseUp={(e) => {
                const btn = e.currentTarget
                btn.style.transform = 'translateY(0)'
                btn.style.boxShadow = '0 4px 0 #C8A020'
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget
                btn.style.transform = 'translateY(0)'
                btn.style.boxShadow = '0 4px 0 #C8A020'
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: '#E8E8E8' }} />
            <span className="text-xs" style={{ color: '#9EA0B4' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: '#E8E8E8' }} />
          </div>

          {/* 회원가입 아웃라인 버튼 */}
          <Link
            href="/signup"
            className="w-full flex items-center justify-center font-extrabold text-sm transition-all duration-150"
            style={{
              borderRadius: '9999px',
              padding: '14px 24px',
              color: '#2D2F2F',
              border: '2px solid #E8C547',
              background: 'transparent',
            }}
          >
            회원가입
          </Link>
        </div>

        {/* 체험해보기 링크 */}
        <div className="mt-4 text-center">
          <Link
            href="/demo"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: '#9EA0B4' }}
          >
            체험해보기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
