import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { CompetencyScores } from '@/types/database'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const COMPETENCY_KEYS = ['자기관리역량', '대인관계역량', '시민역량', '문제해결역량'] as const

interface RequestBody {
  studentId: string
}

interface OwnershipRow {
  class_id: string
  classes: { teacher_id: string } | { teacher_id: string }[] | null
}

interface StudentProfileRow {
  name: string | null
}

interface ReportRow {
  summary: string | null
  weak_points: string[] | null
  suggestions: string[] | null
  competency_scores: CompetencyScores | null
  created_at: string
}

function formatCompetency(scores: CompetencyScores | null) {
  if (!scores) return '없음'

  return COMPETENCY_KEYS
    .map((key) => `${key} ${scores[key]}/5`)
    .join(', ')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody
    const { studentId } = body

    if (typeof studentId !== 'string' || !studentId) {
      return NextResponse.json({ error: 'studentId는 필수입니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: ownership } = await admin
      .from('enrollments')
      .select('class_id, classes!inner(teacher_id)')
      .eq('student_id', studentId)
      .eq('classes.teacher_id', user.id)
      .single<OwnershipRow>()

    if (!ownership) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
    }

    const [{ data: student }, { data: reports }] = await Promise.all([
      admin
        .from('profiles')
        .select('name')
        .eq('id', studentId)
        .single<StudentProfileRow>(),
      admin
        .from('reports')
        .select('summary, weak_points, suggestions, competency_scores, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .returns<ReportRow[]>(),
    ])

    if (!reports || reports.length === 0) {
      return NextResponse.json({ error: '상담 자료를 만들 리포트가 없습니다.' }, { status: 404 })
    }

    const reportDigest = reports
      .map((report, index) => {
        const date = new Date(report.created_at).toISOString().slice(0, 10)
        const weakPoints = report.weak_points?.length ? report.weak_points.join(', ') : '없음'
        const suggestions = report.suggestions?.length ? report.suggestions.join(', ') : '없음'
        const summary = report.summary?.trim() || '요약 없음'

        return [
          `리포트 ${index + 1} (${date})`,
          `- 요약: ${summary}`,
          `- 약점: ${weakPoints}`,
          `- 제안: ${suggestions}`,
          `- 핵심역량: ${formatCompetency(report.competency_scores ?? null)}`,
        ].join('\n')
      })
      .join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '당신은 학생의 학습 데이터를 분석하여 학부모 상담용 자료를 작성하는 교육 전문가입니다.',
        },
        {
          role: 'user',
          content: `${student?.name ?? '학생'}의 학습 리포트입니다.

다음 형식을 정확히 지켜 한국어 마크다운으로 작성하세요.
- 제목은 반드시 "## 강점", "## 개선이 필요한 부분", "## 가정에서 도와줄 수 있는 것" 세 가지입니다.
- 각 섹션에는 정확히 3개의 항목을 작성하세요.
- 각 항목은 2-3문장으로 작성하세요.
- "개선이 필요한 부분"은 부드럽고 격려하는 표현을 사용하세요.
- 전체 톤은 따뜻하고 격려적으로 유지하세요.

학습 리포트:
${reportDigest}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 900,
    })

    const content = completion.choices[0]?.message?.content?.trim()

    if (!content) {
      return NextResponse.json({ error: '상담 자료 생성에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('[/api/teacher/consultation]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
