'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Microphone, SpeakerHigh, X } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'
import type { Expression } from '@/types/database'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface UnitInfo {
  id: string
  title: string
  concept: string
}

// 별빛 파티클 20개 (고정값으로 SSR hydration 불일치 방지)
const STARS = [
  { id: 0, top: 8.2, left: 12.5, size: 1.8, delay: 0.3, dur: 2.8 },
  { id: 1, top: 15.7, left: 78.3, size: 2.3, delay: 1.1, dur: 3.5 },
  { id: 2, top: 3.4, left: 45.6, size: 1.5, delay: 0.7, dur: 2.2 },
  { id: 3, top: 22.1, left: 91.2, size: 2.8, delay: 2.0, dur: 4.1 },
  { id: 4, top: 35.9, left: 5.7, size: 1.6, delay: 0.4, dur: 3.0 },
  { id: 5, top: 48.3, left: 87.4, size: 2.1, delay: 1.8, dur: 2.5 },
  { id: 6, top: 62.5, left: 33.2, size: 1.9, delay: 0.9, dur: 3.8 },
  { id: 7, top: 75.1, left: 67.8, size: 2.5, delay: 1.5, dur: 2.9 },
  { id: 8, top: 88.7, left: 20.4, size: 1.7, delay: 2.3, dur: 3.3 },
  { id: 9, top: 6.8, left: 58.9, size: 2.2, delay: 0.2, dur: 4.0 },
  { id: 10, top: 19.3, left: 25.1, size: 1.4, delay: 1.6, dur: 2.7 },
  { id: 11, top: 31.6, left: 71.5, size: 2.6, delay: 0.8, dur: 3.6 },
  { id: 12, top: 44.9, left: 48.2, size: 1.8, delay: 2.1, dur: 2.4 },
  { id: 13, top: 57.4, left: 14.7, size: 2.0, delay: 1.3, dur: 4.2 },
  { id: 14, top: 70.8, left: 83.6, size: 1.5, delay: 0.6, dur: 3.1 },
  { id: 15, top: 83.2, left: 39.8, size: 2.4, delay: 1.9, dur: 2.6 },
  { id: 16, top: 12.6, left: 93.4, size: 1.7, delay: 0.5, dur: 3.9 },
  { id: 17, top: 27.9, left: 3.2, size: 2.1, delay: 2.4, dur: 2.3 },
  { id: 18, top: 52.3, left: 56.7, size: 1.6, delay: 1.0, dur: 4.4 },
  { id: 19, top: 93.8, left: 74.1, size: 2.7, delay: 0.1, dur: 3.2 },
]

const expressionLabels: Record<Expression, string> = {
  curious: '궁금해요!',
  confused: '모르겠어요...',
  thinking: '생각 중이에요',
  happy: '이해했어요! ✨',
  oops: '앗, 틀렸나요?',
  impressed: '완벽해요! 🌙',
}

export default function TeachPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unitId as string

  const [unit, setUnit] = useState<UnitInfo | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [initError, setInitError] = useState(false)
  const [expression, setExpression] = useState<Expression>('curious')
  const [mooniMessage, setMooniMessage] = useState('안녕! 나는 무니야. 달에서 왔는데... 선생님이 오늘 뭘 배웠는지 알려준대서 기다리고 있었어! 🌙')
  const [understanding, setUnderstanding] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isEnding, setIsEnding] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const sessionIdRef = useRef<string | null>(null)

  // 단원 정보 + 세션 시작
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const { data: unitData } = await supabase
        .from('units')
        .select('id, title, concept')
        .eq('id', unitId)
        .single()

      if (!unitData) { router.replace('/student'); return }
      setUnit(unitData)

      const { data: session } = await supabase
        .from('sessions')
        .insert({ student_id: user.id, unit_id: unitId })
        .select('id')
        .single()

      if (session) {
        setSessionId(session.id)
        sessionIdRef.current = session.id
      } else {
        setInitError(true)
      }
    }
    init()
  }, [unitId, router])

  // 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (sessionIdRef.current) {
        const supabase = createClient()
        supabase.from('sessions').update({ ended_at: new Date().toISOString() }).eq('id', sessionIdRef.current).then(() => {})
      }
    }
  }, [])

  // 메시지 전송 (공통)
  const sendMessage = useCallback(async (userText: string) => {
    if (!sessionId || !unit || !userText.trim() || isLoading) return

    setIsLoading(true)
    const newHistory: ConversationMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userText },
    ]
    setConversationHistory(newHistory)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userText,
          unitConcept: unit.concept,
          conversationHistory,
        }),
      })
      const data = await res.json()
      if (data.message) {
        setMooniMessage(data.message)
        setExpression(data.expression ?? 'curious')
        setUnderstanding(data.understanding ?? understanding)
        setConversationHistory([
          ...newHistory,
          { role: 'assistant', content: data.message },
        ])
      }
    } catch {
      setMooniMessage('앗, 잠깐 연결이 끊겼어요. 다시 말해줘! 🌙')
      setExpression('oops')
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, unit, isLoading, conversationHistory, understanding])

  // 음성 녹음
  const toggleRecording = useCallback(() => {
    if (isLoading) return

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setShowTextInput(true)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRecognitionAPI() as any
    recognition.lang = 'ko-KR'
    recognition.continuous = false
    recognition.interimResults = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript
      setIsRecording(false)
      await sendMessage(transcript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      setExpression('oops')
      setShowTextInput(true)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isLoading, isRecording, sendMessage])

  // TTS 재생
  const playTTS = useCallback(async () => {
    if (!mooniMessage) return
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mooniMessage }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play()
    } catch {
      // TTS 실패 시 조용히 넘어감
    }
  }, [mooniMessage])

  // 세션 종료
  const endSession = useCallback(async () => {
    if (!sessionId || isEnding) return
    setIsEnding(true)

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      if (!res.ok) {
        throw new Error(`Report API ${res.status}`)
      }
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      router.push(`/student/session-end/${sessionId}?reportId=${data.id ?? ''}`)
    } catch {
      router.push(`/student/session-end/${sessionId}`)
    }
  }, [sessionId, isEnding, router])

  // 텍스트 전송
  const handleTextSubmit = useCallback(async () => {
    if (!textInput.trim()) return
    const text = textInput
    setTextInput('')
    await sendMessage(text)
  }, [textInput, sendMessage])

  if (initError) {
    return (
      <div
        className="flex flex-col h-screen items-center justify-center font-sans"
        style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 50%, #1E1A35 100%)' }}
      >
        <p className="text-white text-sm">연결에 문제가 생겼어요. 새로고침해 주세요.</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden font-sans relative"
      style={{
        background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 50%, #1E1A35 100%)',
      }}
    >
      {/* 별빛 파티클 */}
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* 헤더 */}
      <header
        className="relative z-10 flex items-center justify-between px-4"
        style={{ height: 56 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>

        <div
          className="px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.35)' }}
        >
          🌙 {unit?.title ?? '단원 불러오는 중...'}
        </div>

        <button
          onClick={endSession}
          disabled={isEnding || !sessionId}
          className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {isEnding ? '저장 중...' : '종료'}
        </button>
      </header>

      {/* 무니 말풍선 */}
      <div className="relative z-10 px-5 mt-2">
        <motion.div
          key={mooniMessage}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mx-auto rounded-3xl p-4"
          style={{
            maxWidth: 320,
            background: 'rgba(232,197,71,0.10)',
            border: '1px solid rgba(232,197,71,0.28)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-sm leading-relaxed text-white">{mooniMessage}</p>
          <button
            onClick={playTTS}
            className="flex items-center gap-1.5 mt-2 text-xs font-medium rounded-full px-3 py-1 transition-opacity hover:opacity-80"
            style={{ color: '#E8C547', background: 'rgba(232,197,71,0.12)' }}
          >
            <SpeakerHigh size={14} weight="fill" />
            듣기
          </button>

          {/* 말풍선 꼬리 */}
          <div
            className="absolute left-1/2 -bottom-2.5 w-4 h-4 rotate-45"
            style={{
              background: 'rgba(232,197,71,0.10)',
              border: '1px solid rgba(232,197,71,0.28)',
              transform: 'translateX(-50%) rotate(45deg)',
              borderTop: 'none',
              borderLeft: 'none',
            }}
          />
        </motion.div>
      </div>

      {/* 무니 캐릭터 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* glow circle */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 256,
            height: 256,
            background: 'radial-gradient(circle, rgba(232,197,71,0.18) 0%, transparent 70%)',
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={expression}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src={`/mooni/${expression}.png`}
                alt={`무니 - ${expressionLabels[expression]}`}
                width={208}
                height={208}
                priority
                className="drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
          {expressionLabels[expression]}
        </p>

        {/* 이해도 바 */}
        <div className="mt-4 w-48 flex flex-col items-center gap-1">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
            무니 이해도 {understanding}%
          </p>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#E8C547' }}
              animate={{ width: `${understanding}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* 하단 입력 영역 */}
      <div className="relative z-10 px-5 pb-8 flex flex-col items-center gap-4">
        {/* 텍스트 입력 토글 */}
        {showTextInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <div
              className="flex items-end gap-2 rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleTextSubmit()
                  }
                }}
                placeholder="무니에게 설명해봐요..."
                rows={2}
                className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/30"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isLoading}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 transition-opacity"
                style={{ background: '#E8C547', color: '#1A1830' }}
              >
                전송
              </button>
            </div>
          </motion.div>
        )}

        {/* 녹음 상태 pill */}
        <div
          className="px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}
        >
          {isLoading
            ? '🤔 무니가 생각하고 있어요...'
            : isRecording
            ? '🔴 듣고 있어요...'
            : '지금 말해보세요...'}
        </div>

        {/* 마이크 버튼 */}
        <motion.button
          onClick={toggleRecording}
          disabled={isLoading}
          whileTap={{ scale: 0.92 }}
          className="relative w-20 h-20 rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity"
          style={{
            background: isRecording
              ? 'rgba(239,68,68,0.85)'
              : '#E8C547',
            boxShadow: isRecording
              ? '0 0 0 8px rgba(239,68,68,0.20), 0 8px 32px rgba(239,68,68,0.40)'
              : '0 0 0 8px rgba(232,197,71,0.20), 0 8px 32px rgba(232,197,71,0.40)',
          }}
          aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
        >
          {isRecording ? (
            <X size={32} weight="bold" color="#1A1830" />
          ) : (
            <Microphone size={32} weight="fill" color="#1A1830" />
          )}

          {/* 녹음 중 펄스 */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ background: 'rgba(239,68,68,0.35)' }}
            />
          )}
        </motion.button>

        {/* 텍스트 입력 토글 버튼 */}
        <button
          onClick={() => setShowTextInput((v) => !v)}
          className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          {showTextInput ? '텍스트 입력 숨기기' : '텍스트로 입력하기'}
        </button>
      </div>
    </div>
  )
}
