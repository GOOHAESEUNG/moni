import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { CompetencyScores } from '@/types/database'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type WeakPointInput = {
  text: string
  count: number
}

function isWeakPointInput(value: unknown): value is WeakPointInput {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.text === 'string' && typeof candidate.count === 'number'
}

function isCompetencyScores(value: unknown): value is CompetencyScores {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate['자기관리역량'] === 'number' &&
    typeof candidate['대인관계역량'] === 'number' &&
    typeof candidate['시민역량'] === 'number' &&
    typeof candidate['문제해결역량'] === 'number'
  )
}

export async function POST(req: NextRequest) {
  try {
    const { classId, weakPoints, avgCompetency } = await req.json()

    if (typeof classId !== 'string' || !classId) {
      return NextResponse.json({ error: 'classId는 필수입니다.' }, { status: 400 })
    }

    if (!Array.isArray(weakPoints) || !weakPoints.every(isWeakPointInput)) {
      return NextResponse.json({ error: 'weakPoints 형식이 올바르지 않습니다.' }, { status: 400 })
    }

    if (!isCompetencyScores(avgCompetency)) {
      return NextResponse.json({ error: 'avgCompetency 형식이 올바르지 않습니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'teacher') {
      return NextResponse.json({ error: '교사만 사용할 수 있습니다.' }, { status: 403 })
    }

    const { data: ownedClass } = await admin
      .from('classes')
      .select('id, name')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single()

    if (!ownedClass) {
      return NextResponse.json({ error: '해당 반에 접근할 수 없습니다.' }, { status: 403 })
    }

    const weakPointText = weakPoints.length > 0
      ? weakPoints.map((item) => `- ${item.text} (${item.count}회)`).join('\n')
      : '- 집계된 약점 없음'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 초등 교사의 수업 코칭을 돕는 교육 코치입니다.
반 전체 학습 데이터를 바탕으로 다음 차시 수업 방향을 한국어로 3~4문장으로 제안하세요.
실행 가능한 수업 전략 중심으로, 교사가 바로 적용할 수 있게 간결하게 작성하세요.`,
        },
        {
          role: 'user',
          content: `반 이름: ${ownedClass.name}

주요 약점:
${weakPointText}

평균 핵심역량:
- 자기관리역량: ${avgCompetency.자기관리역량}/5
- 대인관계역량: ${avgCompetency.대인관계역량}/5
- 시민역량: ${avgCompetency.시민역량}/5
- 문제해결역량: ${avgCompetency.문제해결역량}/5`,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    })

    const suggestion = completion.choices[0]?.message?.content?.trim()
    if (!suggestion) {
      return NextResponse.json({ error: '추천 생성에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('[/api/teacher/class-suggestion]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
