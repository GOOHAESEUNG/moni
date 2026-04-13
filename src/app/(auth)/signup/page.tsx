'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import MooniCharacter from '@/components/mooni/MooniCharacter'

type Role = 'teacher' | 'student'

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // 선생님이면 기본 반 자동 생성
    if (role === 'teacher') {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        await supabase.from('classes').insert({
          teacher_id: user.id,
          name: `${name}의 반`,
          invite_code: inviteCode,
        })
      }
    }

    router.push(role === 'teacher' ? '/teacher' : '/student')
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
          <MooniCharacter expression="happy" size={90} className="mb-3" />
          <h1 className="text-2xl font-extrabold" style={{ color: '#2D2F2F' }}>Moni</h1>
          <p className="text-xs mt-1" style={{ color: '#9EA0B4' }}>새로운 친구가 생겼어요!</p>
        </div>

        {/* 폼 카드 — Claymorphism */}
        <div
          className="rounded-[20px] p-6"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* 역할 선택 pill 탭 */}
          <div
            className="flex rounded-full p-1 mb-5"
            style={{ background: '#F7F7F7' }}
          >
            {(['student', 'teacher'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200"
                style={
                  role === r
                    ? {
                        background: '#E8C547',
                        color: '#1A1830',
                        boxShadow: '0 2px 0 #C8A020',
                      }
                    : { color: '#9EA0B4' }
                }
              >
                {r === 'student' ? '학생' : '선생님'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold" style={{ color: '#2D2F2F' }}>
                이름
              </label>
              <input
                id="name"
                placeholder={role === 'teacher' ? '홍길동 선생님' : '홍길동'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all"
                style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none' }}
              />
            </div>
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
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all"
                style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none' }}
              />
            </div>

            {error && <p className="text-sm" style={{ color: '#FF5555' }}>{error}</p>}

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
              {loading ? '가입 중...' : '시작하기'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-4 text-center">
            <span className="text-sm" style={{ color: '#9EA0B4' }}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-bold hover:opacity-70 transition-opacity" style={{ color: '#2D2F2F' }}>
                로그인
              </Link>
            </span>
          </div>
        </div>

        {/* 체험 링크 */}
        <div className="mt-4 text-center">
          <Link href="/demo" className="text-sm transition-opacity hover:opacity-70" style={{ color: '#9EA0B4' }}>
            체험해보기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
