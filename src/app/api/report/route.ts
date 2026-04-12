import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import type { CompetencyScores } from '@/types/database'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const COMPETENCY_KEYS = ['자기관리역량', '대인관계역량', '시민역량', '문제해결역량'] as const

function validateCompetencyScores(raw: unknown): CompetencyScores | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  for (const key of COMPETENCY_KEYS) {
    const val = obj[key]
    if (typeof val !== 'number' || val < 1 || val > 5) return null
  }
  return {
    자기관리역량: obj['자기관리역량'] as number,
    대인관계역량: obj['대인관계역량'] as number,
    시민역량: obj['시민역량'] as number,
    문제해결역량: obj['문제해결역량'] as number,
    comment: typeof obj['comment'] === 'string' ? obj['comment'] : undefined,
  }
}

async function callFineTuneModel(text: string): Promise<CompetencyScores | null> {
  const apiUrl = process.env.FINE_TUNE_API_URL
  if (!apiUrl) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const res = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    })
    if (!res.ok) return null
    const data = await res.json()
    return validateCompetencyScores(data?.scores ?? data)
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId는 필수입니다.' }, { status: 400 })
    }

    const supabase = await createClient()

    // 세션 정보 조회
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, units(concept, title)')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: '세션을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 대화 메시지 조회
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (messagesError || !messages) {
      return NextResponse.json({ error: '메시지를 불러올 수 없습니다.' }, { status: 500 })
    }

    // 대화 내용을 텍스트로 변환
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? '학생' : '무니'}: ${m.content}`)
      .join('\n')

    const unit = session.units as { concept: string; title: string } | null
    const concept = unit?.concept ?? '개념'

    // GPT-4o + 파인튜닝 모델 병렬 호출
    const [gptResult, ftResult] = await Promise.allSettled([
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 학생의 학습 이해도를 분석하는 교육 전문가입니다.
학생이 AI(무니)에게 개념을 설명하는 대화를 분석하여 JSON으로 응답하세요.

반드시 아래 JSON 형식만 출력하세요:
{
  "understanding_score": 0~100,
  "weak_points": ["취약점1", "취약점2"],
  "suggestions": ["제안1", "제안2"],
  "summary": "2~3문장 요약"
}`,
          },
          {
            role: 'user',
            content: `학습 개념: ${concept}\n\n대화 내용:\n${conversationText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
      callFineTuneModel(conversationText),
    ])

    if (gptResult.status === 'rejected') {
      console.error('[/api/report] GPT-4o 호출 실패:', gptResult.reason)
      return NextResponse.json({ error: 'AI 분석 실패' }, { status: 500 })
    }

    const completion = gptResult.value
    const competency_scores: CompetencyScores | null =
      ftResult.status === 'fulfilled' ? ftResult.value : null

    if (ftResult.status === 'rejected') {
      console.warn('[/api/report] 파인튜닝 모델 호출 실패 (리포트는 정상 저장):', ftResult.reason)
    }

    const rawText = completion.choices[0]?.message?.content ?? '{}'
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/)
    const reportData = JSON.parse(jsonMatch?.[1] || jsonMatch?.[0] || '{}')

    const understanding_score = typeof reportData.understanding_score === 'number'
      ? Math.max(0, Math.min(100, Math.round(reportData.understanding_score)))
      : 0
    const weak_points: string[] = Array.isArray(reportData.weak_points) ? reportData.weak_points : []
    const suggestions: string[] = Array.isArray(reportData.suggestions) ? reportData.suggestions : []
    const summary: string = typeof reportData.summary === 'string' ? reportData.summary : ''

    // reports 테이블에 upsert (session_id unique constraint 기반)
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .upsert({
        session_id: sessionId,
        student_id: session.student_id,
        unit_id: session.unit_id,
        summary,
        weak_points,
        suggestions,
        ...(competency_scores ? { competency_scores } : {}),
      }, { onConflict: 'session_id' })
      .select()
      .single()

    if (reportError || !report) {
      console.error('[/api/report] report insert error:', reportError)
      return NextResponse.json({ error: '리포트 저장 실패' }, { status: 500 })
    }

    // sessions 테이블 업데이트
    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        understanding_score,
      })
      .eq('id', sessionId)

    if (sessionUpdateError) {
      console.error('[/api/report] sessions update error:', sessionUpdateError)
    }

    // 해당 unit_id와 매칭되는 활성 퀘스트 자동 완료
    if (session.unit_id) {
      const { data: matchedQuests } = await supabase
        .from('quests')
        .select('id, student_id')
        .eq('unit_id', session.unit_id)
        .eq('is_active', true)

      if (matchedQuests && matchedQuests.length > 0) {
        const completions = matchedQuests
          .filter((q: { id: string; student_id: string | null }) => q.student_id === null || q.student_id === session.student_id)
          .map((q: { id: string; student_id: string | null }) => ({ quest_id: q.id, student_id: session.student_id }))

        if (completions.length > 0) {
          await supabase
            .from('quest_completions')
            .upsert(completions, { onConflict: 'quest_id,student_id', ignoreDuplicates: true })
        }
      }
    }

    return NextResponse.json({
      ...report,
      understanding_score,
      weak_points,
      suggestions,
      summary,
    })
  } catch (error) {
    console.error('[/api/report]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
