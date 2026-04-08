import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getMooniSystemPrompt, parseMooniResponse } from '@/lib/mooni-prompt'
import { createClient } from '@/lib/supabase/server'
import type { MessageRole } from '@/types/database'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, conversationHistory, unitConcept } = await req.json()

    if (!sessionId || !message || !unitConcept) {
      return NextResponse.json({ error: 'sessionId, message, unitConcept은 필수입니다.' }, { status: 400 })
    }

    const systemPrompt = getMooniSystemPrompt(unitConcept)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory as ConversationMessage[]).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 300,
    })

    const rawText = completion.choices[0]?.message?.content ?? ''
    const { expression, message: mooniMessage, understanding } = parseMooniResponse(rawText)

<<<<<<< Updated upstream
    // Supabase에 메시지 저장
    const supabase = await createClient()

    await supabase.from('messages').insert([
      {
        session_id: sessionId,
        role: 'user' as MessageRole,
        content: message,
        expression: null,
      },
      {
        session_id: sessionId,
        role: 'assistant' as MessageRole,
        content: mooniMessage,
        expression,
      },
    ])
=======
    // 데모 세션은 저장 건너뜀
    if (sessionId !== 'demo') {
      const supabase = await createClient()

      await supabase.from('messages').insert([
        {
          session_id: sessionId,
          role: 'user' as MessageRole,
          content: message,
          expression: null,
        },
        {
          session_id: sessionId,
          role: 'assistant' as MessageRole,
          content: mooniMessage,
          expression,
        },
      ])
    }
>>>>>>> Stashed changes

    return NextResponse.json({ expression, message: mooniMessage, understanding })
  } catch (error) {
    console.error('[/api/chat]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
