'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[oklch(0.95_0.04_280)] to-[oklch(0.98_0.01_280)] px-4">
      <div className="w-full max-w-sm">
        {/* 로고 + 캐릭터 */}
        <div className="flex flex-col items-center mb-8">
          <MooniCharacter expression="curious" size={120} className="mb-3" />
          <h1 className="text-2xl font-bold text-primary">무니에게 알려줘</h1>
          <p className="text-sm text-muted-foreground mt-1">무니가 기다리고 있어요! 🌙</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-3xl shadow-lg shadow-primary/10 p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </div>
        </div>

        {/* 게스트 데모 링크 */}
        <div className="mt-4 text-center">
          <Link href="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            로그인 없이 체험해보기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
