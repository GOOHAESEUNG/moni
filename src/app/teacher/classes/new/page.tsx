'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

const GRADES = [1, 2, 3, 4, 5, 6]
const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6]

export default function NewClassPage() {
  const router = useRouter()
  const [grade, setGrade] = useState<number | null>(null)
  const [classNumber, setClassNumber] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = grade !== null && classNumber !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const name = `${grade}학년 ${classNumber}반`

    const { error: err } = await supabase.from('classes').insert({
      teacher_id: user.id,
      name,
      grade,
      class_number: classNumber,
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

  const pillSelected = {
    background: '#E8C547',
    color: '#1A1830',
    boxShadow: '0 2px 0 #C8A020',
  } as const

  const pillUnselected = {
    background: '#F7F7F7',
    color: '#9EA0B4',
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
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* 학년 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-bold" style={{ color: '#2D2F2F' }}>학년</label>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className="rounded-full px-4 py-2 text-sm font-bold transition-all duration-150"
                  style={grade === g ? pillSelected : pillUnselected}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* 반 번호 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-bold" style={{ color: '#2D2F2F' }}>반</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_NUMBERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setClassNumber(n)}
                  className="rounded-full px-4 py-2 text-sm font-bold transition-all duration-150"
                  style={classNumber === n ? pillSelected : pillUnselected}
                >
                  {n}반
                </button>
              ))}
            </div>
          </div>

          {/* 미리보기 */}
          {canSubmit && (
            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: '#FDF8E1', border: '1.5px solid rgba(232,197,71,0.4)' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: '#9EA0B4' }}>반 이름 미리보기</p>
              <p className="text-lg font-extrabold" style={{ color: '#1A1830' }}>
                {grade}학년 {classNumber}반
              </p>
            </div>
          )}

          {error && <p className="text-sm" style={{ color: '#FF9600' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !canSubmit}
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
