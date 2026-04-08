'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import MooniCharacter from '@/components/mooni/MooniCharacter'

const clayStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(232,197,71,0.12), 0 2px 8px rgba(0,0,0,0.06)',
} as const

export default function JoinClassPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // 초대 코드로 반 찾기
    const { data: cls, error: ce } = await supabase
      .from('classes')
      .select('id, name')
      .eq('invite_code', trimmed)
      .single()

    if (ce || !cls) {
      setError('초대 코드를 찾을 수 없어요. 다시 확인해주세요.')
      setLoading(false)
      return
    }

    // 이미 등록됐는지 확인
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('class_id', cls.id)
      .single()

    if (existing) {
      setError('이미 참여 중인 반이에요.')
      setLoading(false)
      return
    }

    // 반 참여
    const { error: ie } = await supabase
      .from('enrollments')
      .insert({ student_id: user.id, class_id: cls.id })

    if (ie) {
      setError('참여에 실패했어요. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/student'), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 pb-12" style={{ background: '#F7F7F7' }}>
      <div className="w-full max-w-sm">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm font-semibold"
          style={{ color: '#9EA0B4' }}
        >
          <ArrowLeft size={16} weight="bold" />
          뒤로
        </button>

        {/* 무니 + 타이틀 */}
        <div className="flex flex-col items-center mb-8">
          <MooniCharacter
            expression={success ? 'happy' : 'curious'}
            size={140}
            className="mb-4"
          />
          <h1 className="text-2xl font-extrabold text-center" style={{ color: '#2D2F2F' }}>
            {success ? '참여 완료! 🎉' : '반에 참여하기'}
          </h1>
          <p className="text-sm mt-2 text-center" style={{ color: '#9EA0B4' }}>
            {success
              ? '무니가 기다리고 있어요!'
              : '선생님께 받은 초대 코드를 입력해주세요'}
          </p>
        </div>

        {!success && (
          <div className="p-6" style={clayStyle}>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="초대 코드 입력 (예: ABC123)"
                maxLength={8}
                required
                className="w-full rounded-xl px-4 py-4 text-xl font-extrabold text-center tracking-widest outline-none focus:ring-2 focus:ring-[#E8C547]/50 transition-all uppercase"
                style={{ background: '#F7F7F7', color: '#2D2F2F', border: 'none', letterSpacing: '0.15em' }}
              />

              {error && (
                <p className="text-sm text-center font-medium" style={{ color: '#FF9600' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !code.trim()}
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
                {loading ? '참여 중...' : '반 참여하기'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
