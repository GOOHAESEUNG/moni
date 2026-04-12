import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import type { CompetencyScores } from '@/types/database'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type ConsultationReportRow = {
  created_at: string
  summary: string | null
  weak_points: string[] | null
  suggestions: string[] | null
  competency_scores: CompetencyScores | null
}

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json()

    if (typeof studentId !== 'string' || !studentId) {
      return NextResponse.json({ error: 'studentId는 필수입니다.' }, { status: 400 })
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

    const { data: ownership } = await admin
      .from('enrollments')
      .select('class_id, classes!inner(teacher_id)')
      .eq('student_id', studentId)
      .eq('classes.teacher_id', user.id)
      .single()

    if (!ownership) {
      return NextResponse.json({ error: '해당 학생에 접근할 수 없습니다.' }, { status: 403 })
    }

    const { data: student } = await admin
      .from('profiles')
      .select('name')
      .eq('id', studentId)
      .single()

    const { data: reports } = await admin
      .from('reports')
      .select('created_at, summary, weak_points, suggestions, competency_scores')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (!reports || reports.length === 0) {
      return NextResponse.json({ error: '상담 자료를 만들 학습 리포트가 없습니다.' }, { status: 404 })
    }

    const reportDigest = (reports as ConsultationReportRow[]).map((report, index) => {
      const competency = report.competency_scores
      const competencyText = competency
        ? `자기관리 ${competency.자기관리역량}/5, 대인관계 ${competency.대인관계역량}/5, 시민 ${competency.시민역량}/5, 문제해결 ${competency.문제해결역량}/5`
        : '역량 점수 없음'

      return [
        `${index + 1}. 작성일 ${new Date(report.created_at).toLocaleDateString('ko-KR')}`,
        `요약: ${report.summary ?? '요약 없음'}`,
        `약점: ${(report.weak_points ?? []).join(', ') || '없음'}`,
        `제안: ${(report.suggestions ?? []).join(', ') || '없음'}`,
        `핵심역량: ${competencyText}`,
      ].join('\n')
    }).join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 초등학교 담임교사를 돕는 상담 지원 전문가입니다.
학습 리포트를 바탕으로 학부모 상담용 요약을 한국어 마크다운으로 작성하세요.
반드시 아래 3개 섹션만 사용하세요.
## 강점
## 개선점
## 가정 실천 방안
각 섹션은 2~3개의 짧은 bullet로 작성하고, 과장 없이 구체적으로 작성하세요.`,
        },
        {
          role: 'user',
          content: `학생 이름: ${student?.name ?? '학생'}

학습 리포트:
${reportDigest}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 500,
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
