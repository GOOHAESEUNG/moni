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
    const { sessionId, message, conversationHistory, unitConcept, imageBase64 } = await req.json()

    if (!sessionId || !message || !unitConcept) {
      return NextResponse.json({ error: 'sessionId, message, unitConcept은 필수입니다.' }, { status: 400 })
    }

    // 데모 모드 + API 키 없음 → 하드코딩 응답 반환
    if (sessionId === 'demo' && !process.env.OPENAI_API_KEY) {
      const demoResponses = [
        { expression: 'curious', message: '오, 그게 뭔데? 더 자세히 설명해줘! 🌙', understanding: 25 },
        { expression: 'confused', message: '음... 잘 모르겠어. 예를 들어 설명해줄 수 있어?', understanding: 40 },
        { expression: 'thinking', message: '아하, 그러면 이 부분은 어떻게 되는 거야?', understanding: 55 },
        { expression: 'happy', message: '와, 이제 좀 알 것 같아! 근데 하나만 더 물어볼게!', understanding: 70 },
        { expression: 'impressed', message: '완전 잘 설명해줬어! 이제 나도 알겠다! ✨', understanding: 88 },
      ]
      const history: ConversationMessage[] = Array.isArray(conversationHistory) ? conversationHistory : []
      const idx = Math.min(Math.floor(history.length / 2), demoResponses.length - 1)
      return NextResponse.json(demoResponses[idx])
    }

    const history: ConversationMessage[] = Array.isArray(conversationHistory) ? conversationHistory : []

    const systemPrompt = getMooniSystemPrompt(unitConcept)

    // 이미지가 있으면 multimodal content, 없으면 text only
    const userContent: OpenAI.Chat.ChatCompletionContentPart[] | string = imageBase64
      ? [
          { type: 'text' as const, text: message },
          {
            type: 'image_url' as const,
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'low' as const,
            },
          },
        ]
      : message

    const systemMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ]

    const userAssistantMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: userContent },
    ]

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...systemMessages,
      ...userAssistantMessages.slice(-10),
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 300,
    })

    const rawText = completion.choices[0]?.message?.content ?? ''
    const { expression, message: mooniMessage, understanding } = parseMooniResponse(rawText)

    // 데모 세션은 저장 건너뜀
    if (sessionId !== 'demo') {
      const supabase = await createClient()

      const { error: insertError } = await supabase.from('messages').insert([
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

      if (insertError) {
        console.error('[/api/chat] messages insert error:', insertError)
      }
    }

    return NextResponse.json({ expression, message: mooniMessage, understanding })
  } catch (error) {
    console.error('[/api/chat]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
