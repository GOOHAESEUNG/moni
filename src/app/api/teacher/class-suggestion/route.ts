import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const COMPETENCY_KEYS = ['자기관리역량', '대인관계역량', '시민역량', '문제해결역량'] as const

interface RequestBody {
  classId: string
  weakPoints: string[]
  avgCompetency: Record<string, number>
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody
    const { classId, weakPoints, avgCompetency } = body

    if (
      typeof classId !== 'string' ||
      !classId ||
      !Array.isArray(weakPoints) ||
      typeof avgCompetency !== 'object' ||
      !avgCompetency
    ) {
      return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const weakPointLines = weakPoints.length > 0
      ? weakPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')
      : '특별히 반복된 약점 없음'

    const competencyLines = COMPETENCY_KEYS
      .map((key) => `- ${key}: ${typeof avgCompetency[key] === 'number' ? avgCompetency[key].toFixed(1) : '데이터 없음'}`)
      .join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '당신은 초등학교 교사의 수업 계획을 돕는 교육 전문가입니다. 학생들의 학습 데이터를 분석하여 다음 수업 방향을 3-4문장으로 제안하세요. 따뜻하고 실용적인 톤으로 작성하세요.',
        },
        {
          role: 'user',
          content: `반 ID: ${classId}

반 전체 주요 약점:
${weakPointLines}

반 평균 핵심역량 점수:
${competencyLines}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const suggestion = completion.choices[0]?.message?.content?.trim()

    if (!suggestion) {
      return NextResponse.json({ error: '제안 생성에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ suggestion })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
