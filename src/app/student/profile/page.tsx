'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  User, SignOut, Copy, Check, House, Trophy, ArrowLeft,
} from '@phosphor-icons/react'

const clayCard = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(170,155,230,0.16), 0 2px 8px rgba(150,135,210,0.08)',
} as const

export default function StudentProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null)
  const [className, setClassName] = useState<string | null>(null)
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

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('classes(invite_code, name)')
        .eq('student_id', user.id)
        .limit(1)
      if (enrollments?.[0]) {
        const cls = Array.isArray(enrollments[0].classes) ? enrollments[0].classes[0] : enrollments[0].classes as any
        setInviteCode(cls?.invite_code ?? null)
        setClassName(cls?.name ?? null)
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
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}>
      <div className="text-4xl animate-pulse">🌙</div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex flex-row overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #A99DD6 0%, #BCB5E8 30%, #D5CFFA 65%, #EAE7FF 100%)' }}
    >
      {/* ── 배경 별 파티클 ── */}
      {[
        { top: '8%',  left: '32%', size: 13, delay: 0.3, dur: 3.5 },
        { top: '5%',  left: '52%', size: 11, delay: 1.1, dur: 4.0 },
        { top: '15%', left: '70%', size: 14, delay: 0.5, dur: 3.2 },
        { top: '3%',  left: '60%', size: 12, delay: 0.2, dur: 3.0 },
        { top: '20%', left: '45%', size: 10, delay: 1.8, dur: 4.8 },
      ].map((s, i) => (
        <div key={i} className="star-particle-slow absolute pointer-events-none"
          style={{ top: s.top, left: s.left, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, zIndex: 0 } as React.CSSProperties}>
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="rgba(232,197,71,0.85)" />
          </svg>
        </div>
      ))}

      {/* ── 좌측 네비 ── */}
      <nav
        className="hidden md:flex flex-col h-screen"
        style={{
          width: 220,
          flexShrink: 0,
          background: '#FFFFFF',
          borderRight: '1px solid rgba(180,160,220,0.35)',
          zIndex: 10,
        }}
      >
        <div className="px-5 pt-6 pb-4">
          <p style={{ color: '#5A4FA0', fontFamily: "'Berkshire Swash', cursive", fontSize: 24 }}>Moni</p>
        </div>
        <div style={{ height: 1, background: '#F0F0F0' }} />
        <div className="flex-1 flex flex-col gap-1 px-3 py-4">
          <Link href="/student" className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/[0.04]"
            style={{ color: '#9EA0B4' }}>
            <House size={20} weight="regular" />
            <span className="font-semibold text-sm">학습</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-not-allowed" style={{ color: '#9EA0B4' }}>
            <Trophy size={20} weight="regular" />
            <span className="font-semibold text-sm">리더보드</span>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#9EA0B4' }}>준비중</span>
          </div>
          {/* 프로필 — active */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}>
            <User size={20} weight="fill" />
            <span className="font-bold text-sm">프로필</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/[0.04] text-left w-full"
            style={{ color: '#9EA0B4' }}>
            <SignOut size={20} weight="regular" />
            <span className="font-semibold text-sm">로그아웃</span>
          </button>
        </div>
        {profile && (
          <div style={{ borderTop: '1px solid #F0F0F0' }} className="px-5 py-4">
            <p className="font-bold text-sm" style={{ color: '#2D2F2F' }}>{profile.name}</p>
            {className && <p className="text-xs mt-0.5" style={{ color: '#9EA0B4' }}>{className}</p>}
          </div>
        )}
      </nav>

      {/* ── 중앙 콘텐츠 ── */}
      <main className="flex-1 flex flex-col items-center py-10 px-6 overflow-y-auto" style={{ zIndex: 1 }}>
        {/* 뒤로가기 (모바일) */}
        <div className="w-full max-w-md md:hidden mb-4">
          <Link href="/student" className="flex items-center gap-1.5 text-sm font-bold"
            style={{ color: 'rgba(45,31,110,0.65)' }}>
            <ArrowLeft size={16} weight="bold" />
            홈으로
          </Link>
        </div>

        {/* 이름 히어로 */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: '#2D1F6E' }}>
            {profile?.name}
          </h1>
          {className && (
            <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(45,31,110,0.55)' }}>
              {className}
            </p>
          )}
          <p className="mt-0.5 text-xs" style={{ color: 'rgba(45,31,110,0.40)' }}>
            {profile?.email}
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* 내 정보 카드 */}
          <div className="p-5" style={clayCard}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#9EA0B4' }}>내 정보</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: '#6B6C7E' }}>이름</span>
                <span className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{profile?.name}</span>
              </div>
              <div style={{ height: 1, background: '#F5F5F5' }} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: '#6B6C7E' }}>이메일</span>
                <span className="text-sm font-bold" style={{ color: '#2D2F2F' }}>{profile?.email}</span>
              </div>
              {className && (
                <>
                  <div style={{ height: 1, background: '#F5F5F5' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: '#6B6C7E' }}>소속 반</span>
                    <span className="text-sm font-extrabold" style={{ color: '#2D2F2F' }}>{className}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 초대 코드 카드 */}
          {inviteCode && (
            <div className="p-5" style={clayCard}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9EA0B4' }}>소속 반 초대 코드</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  {inviteCode.split('').map((ch, i) => (
                    <span key={i}
                      className="w-9 h-10 flex items-center justify-center rounded-xl text-xl font-extrabold"
                      style={{ background: 'rgba(232,197,71,0.12)', color: '#B8920A', letterSpacing: 0 }}>
                      {ch}
                    </span>
                  ))}
                </div>
                <button onClick={copyCode}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all"
                  style={{
                    background: copied ? 'rgba(76,175,80,0.12)' : 'rgba(232,197,71,0.15)',
                    color: copied ? '#4CAF50' : '#C8A020',
                    border: copied ? '1px solid rgba(76,175,80,0.30)' : '1px solid rgba(232,197,71,0.30)',
                  }}>
                  {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
                  {copied ? '복사됨!' : '복사'}
                </button>
              </div>
            </div>
          )}

          {/* 로그아웃 */}
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 font-extrabold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '9999px',
              padding: '14px 24px',
              color: '#9EA0B4',
              boxShadow: '0 4px 0 rgba(180,160,220,0.30)',
            }}>
            <SignOut size={18} weight="bold" />
            로그아웃
          </button>
        </div>
      </main>
    </div>
  )
}
