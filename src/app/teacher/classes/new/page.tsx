'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

export default function NewClassPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { error: err } = await supabase.from('classes').insert({
      teacher_id: user.id,
      name: name.trim(),
      invite_code: inviteCode,
    })

    if (err) {
      setError('반 만들기에 실패했어요. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    router.push('/teacher')
  }

  const clayCard = {
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
  } as const

  return (
    <div className="min-h-screen px-5 pt-12 pb-8" style={{ background: '#F7F7F7' }}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={20} weight="bold" style={{ color: '#2D2F2F' }} />
        </button>
        <h1 className="text-xl font-extrabold" style={{ color: '#2D2F2F' }}>반 만들기</h1>
      </div>

      {/* 폼 카드 */}
      <div className="p-6" style={clayCard}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold" style={{ color: '#2D2F2F' }}>반 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동의 수학반"
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all"
              style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none' }}
            />
            <p className="text-xs" style={{ color: '#9EA0B4' }}>학생들이 초대 코드로 이 반에 참여해요</p>
          </div>

          {error && <p className="text-sm" style={{ color: '#FF9600' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full font-extrabold text-sm transition-all duration-150 disabled:opacity-50"
            style={{
              background: '#E8C547',
              borderRadius: '9999px',
              padding: '14px 24px',
              color: '#1A1830',
              boxShadow: loading ? '0 2px 0 #C8A020' : '0 4px 0 #C8A020',
              transform: loading ? 'translateY(2px)' : 'translateY(0)',
            }}
          >
            {loading ? '만드는 중...' : '반 만들기'}
          </button>
        </form>
      </div>
    </div>
  )
}
