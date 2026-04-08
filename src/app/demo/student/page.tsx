'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, ArrowLeft } from '@phosphor-icons/react'
import type { Expression } from '@/types/database'

interface Message {
  role: 'user' | 'assistant'
  content: string
  expression?: Expression
}

const DEMO_CONCEPT = '분모가 같은 분수끼리 더할 때는 분자끼리 더하고 분모는 그대로 유지한다. 분모가 다를 때는 통분 후 더한다.'

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: '안녕하세요! 저는 무니예요 🌙 달에서 왔는데, 지구에서는 "분수의 덧셈"을 배운다고 들었어요. 저는 분수가 뭔지 전혀 몰라요. 가르쳐 줄 수 있어요?',
  expression: 'curious',
}

export default function DemoStudentPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [understanding, setUnderstanding] = useState(0)
  const [mooniExpression, setMooniExpression] = useState<Expression>('curious')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'demo',
          message: text,
          conversationHistory: history,
          unitConcept: DEMO_CONCEPT,
        }),
      })
      const data = await res.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.message ?? '잘 모르겠어요... 다시 설명해줄 수 있어요?',
        expression: data.expression ?? 'curious',
      }
      setMooniExpression(data.expression ?? 'curious')
      setUnderstanding(data.understanding ?? 0)
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '앗, 연결이 끊겼어요. 다시 시도해줄 수 있어요?', expression: 'oops' as Expression },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 60%, #1E1A35 100%)' }}
    >
      {/* 헤더 */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(13,11,30,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <Link href="/demo" className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <ArrowLeft size={16} />
          돌아가기
        </Link>
        <div className="text-center">
          <p className="text-xs font-semibold" style={{ color: '#E8C547' }}>체험 모드</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>분수의 덧셈 · 초등 4~5학년</p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547' }}
        >
          이해도 {understanding}%
        </div>
      </header>

      {/* 무니 캐릭터 */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
          style={{ width: 100, height: 100 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mooniExpression}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              style={{ width: 100, height: 100, position: 'relative' }}
            >
              <Image
                src={`/mooni/${mooniExpression}.png`}
                alt="무니"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 대화 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? { background: '#E8C547', color: '#1A1830', fontWeight: 600 }
                    : { background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-3xl px-4 py-3 text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}
            >
              무니가 생각 중이에요...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div
        className="sticky bottom-0 px-4 py-4"
        style={{ background: 'rgba(13,11,30,0.90)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="flex items-end gap-2 rounded-3xl border px-4 py-3"
          style={{ borderColor: 'rgba(232,197,71,0.25)', background: 'rgba(255,255,255,0.06)' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무니에게 설명해보세요..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
            style={{ background: '#E8C547' }}
          >
            <PaperPlaneTilt size={16} weight="fill" style={{ color: '#1A1830' }} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Enter로 전송 · Shift+Enter 줄바꿈
        </p>
      </div>
    </div>
  )
}
