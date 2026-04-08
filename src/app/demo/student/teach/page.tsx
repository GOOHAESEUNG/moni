'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, ArrowLeft, Microphone, X, SpeakerHigh } from '@phosphor-icons/react'
import type { Expression } from '@/types/database'

interface Message {
  role: 'user' | 'assistant'
  content: string
  expression?: Expression
}

const DEMO_CONCEPT = '도형의 넓이를 구하는 방법: 직사각형은 가로×세로, 삼각형은 밑변×높이÷2, 평행사변형은 밑변×높이로 구한다.'
const DEMO_UNIT_TITLE = '도형의 넓이'

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: '안녕! 나는 무니야 🌙 달나라엔 도형이 없어서... "도형의 넓이"가 뭔지 전혀 몰라. 네가 가르쳐줄 수 있어?',
  expression: 'curious',
}

export default function DemoTeachPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [understanding, setUnderstanding] = useState(0)
  const [mooniExpression, setMooniExpression] = useState<Expression>('curious')
  const [isRecording, setIsRecording] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  function startVoice() {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechAPI) { alert('이 브라우저는 음성 인식을 지원하지 않아요.'); return }
    const recognition = new SpeechAPI() as any
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    setIsRecording(true)
    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function playTTS(text: string) {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      new Audio(url).play()
    } catch { /* silent */ }
  }

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
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '앗, 연결이 끊겼어요. 다시 시도해줘! 🌙',
        expression: 'oops' as Expression,
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const latestAssistant = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 50%, #1E1A35 100%)' }}
    >
      {/* 대화 히스토리 패널 (md+) */}
      <div
        className="hidden md:flex flex-col"
        style={{ width: 340, borderRight: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <Link href="/demo/student" className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <ArrowLeft size={16} />
            홈으로
          </Link>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.40)' }}>대화 기록</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: 'rgba(232,197,71,0.22)', color: '#E8C547', fontWeight: 600 }
                      : { background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }
                  }
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-3 py-2 text-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
                무니가 생각 중...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 메인 — 무니 화면 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-4" style={{ height: 56 }}>
          <Link href="/demo/student" className="flex items-center gap-1.5 text-sm md:hidden" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <ArrowLeft size={16} />
            홈
          </Link>
          <div
            className="px-4 py-1.5 rounded-full text-sm font-bold mx-auto md:mx-0"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.35)' }}
          >
            🌙 {DEMO_UNIT_TITLE}
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.12)', color: '#E8C547' }}
          >
            체험 모드
          </div>
        </header>

        {/* 무니 말풍선 */}
        <div className="px-5 mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={latestAssistant?.content}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto rounded-3xl p-4"
              style={{
                maxWidth: 340,
                background: 'rgba(232,197,71,0.12)',
                border: '1px solid rgba(232,197,71,0.28)',
              }}
            >
              <p className="text-sm leading-relaxed text-white">
                {latestAssistant?.content ?? INITIAL_MESSAGE.content}
              </p>
              <button
                onClick={() => latestAssistant && playTTS(latestAssistant.content)}
                className="flex items-center gap-1.5 mt-2 text-xs font-medium rounded-full px-3 py-1"
                style={{ color: '#E8C547', background: 'rgba(232,197,71,0.12)' }}
              >
                <SpeakerHigh size={12} weight="fill" />
                듣기
              </button>
              <div
                className="absolute left-1/2 -bottom-2.5 w-4 h-4"
                style={{
                  background: 'rgba(232,197,71,0.12)',
                  border: '1px solid rgba(232,197,71,0.28)',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderTop: 'none',
                  borderLeft: 'none',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 무니 캐릭터 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 240, height: 240, background: 'radial-gradient(circle, rgba(232,197,71,0.15) 0%, transparent 70%)' }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={mooniExpression}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Image
                  src={`/mooni/${mooniExpression}.png`}
                  alt="무니"
                  width={200}
                  height={200}
                  priority
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* 이해도 */}
          <div className="mt-4 w-52 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold" style={{ color: '#E8C547' }}>{understanding}%</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>무니 이해도</p>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#E8C547' }}
                animate={{ width: `${understanding}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="px-5 pb-8 flex flex-col items-center gap-3">
          {/* 녹음 상태 */}
          <div
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}
          >
            {loading ? '🤔 무니가 생각하고 있어요...' : isRecording ? '🔴 듣고 있어요...' : '마이크를 누르고 설명해봐요!'}
          </div>

          {/* 마이크 버튼 */}
          <motion.button
            onClick={isRecording ? stopVoice : startVoice}
            disabled={loading}
            whileTap={{ scale: 0.92 }}
            className="relative w-20 h-20 rounded-full flex items-center justify-center disabled:opacity-40"
            style={{
              background: isRecording ? 'rgba(239,68,68,0.85)' : '#E8C547',
              boxShadow: isRecording
                ? '0 0 0 8px rgba(239,68,68,0.20), 0 8px 32px rgba(239,68,68,0.40)'
                : '0 0 0 8px rgba(232,197,71,0.20), 0 8px 32px rgba(232,197,71,0.40)',
            }}
            aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
          >
            {isRecording ? <X size={32} weight="bold" color="#1A1830" /> : <Microphone size={32} weight="fill" color="#1A1830" />}
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ background: 'rgba(239,68,68,0.35)' }}
              />
            )}
          </motion.button>

          {/* 텍스트 입력 */}
          <div
            className="flex items-end gap-2 rounded-2xl p-3 w-full max-w-sm"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="텍스트로도 설명할 수 있어요..."
              rows={2}
              className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/30"
              aria-label="무니에게 설명 입력"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40"
              style={{ background: '#E8C547', color: '#1A1830' }}
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
