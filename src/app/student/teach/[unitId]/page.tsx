'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Microphone, SpeakerHigh, X, PaperPlaneTilt } from '@phosphor-icons/react'
import DrawingCanvas, { type DrawingCanvasRef } from '@/components/DrawingCanvas'
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

// 크고 밝은 4각 별 — 8개
const BIG_STARS = [
  { id: 0, top: 10, left: 20, size: 12, delay: 0.5, dur: 3.5 },
  { id: 1, top: 5, left: 60, size: 10, delay: 1.2, dur: 4.0 },
  { id: 2, top: 18, left: 85, size: 14, delay: 0.3, dur: 3.2 },
  { id: 3, top: 30, left: 40, size: 10, delay: 2.0, dur: 4.5 },
  { id: 4, top: 8, left: 75, size: 12, delay: 0.8, dur: 3.8 },
  { id: 5, top: 25, left: 10, size: 11, delay: 1.5, dur: 4.2 },
  { id: 6, top: 15, left: 50, size: 13, delay: 0.2, dur: 3.0 },
  { id: 7, top: 35, left: 70, size: 10, delay: 1.8, dur: 4.8 },
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
  const [mooniMessage, setMooniMessage] = useState('')
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [guideStep, setGuideStep] = useState<'mic' | 'done'>('mic')
  const [understanding, setUnderstanding] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isEnding, setIsEnding] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showUnderstandingBurst, setShowUnderstandingBurst] = useState(false)
  const [showAwesomePopup, setShowAwesomePopup] = useState(false)
  const [micSuccess, setMicSuccess] = useState(false)
  const prevUnderstandingRef = useRef(0)
  const hasReached85Ref = useRef(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const sessionIdRef = useRef<string | null>(null)
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null)

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
      setMooniMessage(`"${unitData.title}"? 그게 뭐야? 🌙 나한테 설명해줘!`)

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

      const visited = localStorage.getItem('mooni-teach-visited')
      if (!visited) {
        setIsFirstVisit(true)
      }
    }
    init()
  }, [unitId, router])

  // 첫 방문 시 무니 메시지 업데이트
  useEffect(() => {
    if (isFirstVisit && unit) {
      setMooniMessage(`"${unit.title}"? 그게 뭐야? 🌙 아래에서 설명해줘!`)
    }
  }, [isFirstVisit, unit])

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

    // 그림 데이터 캡처 (비어있으면 null)
    const imageBase64 = drawingCanvasRef.current?.getImageBase64() ?? null

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
          imageBase64,
        }),
      })
      const data = await res.json()
      if (data.message) {
        setMooniMessage(data.message)
        setExpression(data.expression ?? 'curious')
        // 이미지 포함 시 JSON 파싱 실패 → fallback 0 반환 가능
        // 대화 중 0으로 내려가는 것 방지: 기존 값이 있으면 유지
        const rawUnderstanding = data.understanding ?? 0
        const newUnderstanding = (rawUnderstanding === 0 && understanding > 0)
          ? understanding
          : rawUnderstanding
        if (newUnderstanding - prevUnderstandingRef.current >= 10) {
          setShowUnderstandingBurst(true)
          setTimeout(() => setShowUnderstandingBurst(false), 1200)
        }
        if (newUnderstanding >= 85 && !hasReached85Ref.current) {
          hasReached85Ref.current = true
          setShowAwesomePopup(true)
          setTimeout(() => setShowAwesomePopup(false), 2000)
        }
        prevUnderstandingRef.current = newUnderstanding
        setUnderstanding(newUnderstanding)
        setConversationHistory([
          ...newHistory,
          { role: 'assistant', content: data.message },
        ])
        if (isFirstVisit) {
          setIsFirstVisit(false)
          setGuideStep('done')
          localStorage.setItem('mooni-teach-visited', 'true')
        }
        // 그림 전송 후 캔버스 초기화
        if (imageBase64) {
          drawingCanvasRef.current?.clear()
        }
      }
    } catch {
      setMooniMessage('앗, 잠깐 연결이 끊겼어요. 다시 말해줘! 🌙')
      setExpression('oops')
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, unit, isLoading, conversationHistory])

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
      setMicSuccess(true)
      setTimeout(() => setMicSuccess(false), 600)
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
        className="flex flex-col items-center justify-center font-sans"
        style={{ background: 'linear-gradient(160deg, #0A0818 0%, #0D0B1E 30%, #12103A 60%, #1A1535 80%, #1E1A35 100%)', height: '100dvh' }}
      >
        <p className="text-white text-sm">연결에 문제가 생겼어요. 새로고침해 주세요.</p>
      </div>
    )
  }

  // 채팅 자동 스크롤
  const chatScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = chatScrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: conversationHistory.length > 0 ? 'smooth' : 'auto' })
  }, [conversationHistory])

  const understandingColor = understanding >= 85 ? '#4CAF50' : understanding >= 50 ? '#E8C547' : 'rgba(255,255,255,0.50)'

  return (
    <div
      className="overflow-hidden font-sans relative"
      style={{ background: 'linear-gradient(160deg, #0A0818 0%, #0D0B1E 30%, #12103A 60%, #1A1535 80%, #1E1A35 100%)', height: '100dvh', paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* 별빛 파티클 */}
      {STARS.map((s) => (
        <div key={s.id} className="star-particle"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as React.CSSProperties}>
          <svg width={s.size} height={s.size} viewBox="0 0 10 10">
            <polygon points="5,0 6,3.5 10,3.5 7,5.5 8,9 5,7 2,9 3,5.5 0,3.5 4,3.5" fill="white" />
          </svg>
        </div>
      ))}
      {BIG_STARS.map((s) => (
        <div key={`big-${s.id}`} className="star-particle-slow"
          style={{ top: `${s.top}%`, left: `${s.left}%`, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as React.CSSProperties}>
          <svg width={s.size} height={s.size} viewBox="0 0 24 24">
            <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="rgba(232,197,71,0.9)" />
          </svg>
        </div>
      ))}

      {/* 배경 글로우 */}
      <div className="absolute pointer-events-none" style={{ top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,197,71,0.20) 0%, rgba(232,197,71,0.08) 40%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: -40, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,120,255,0.08) 0%, transparent 70%)' }} />

      {/* ━━━ 레이아웃 ━━━ */}
      <div className="relative z-10 h-full flex flex-col md:flex-row">

        {/* ── 좌측: 무니 + 채팅 + 입력 ── */}
        <div className="flex-1 flex flex-col h-full min-w-0">

          {/* 헤더 */}
          <header className="flex items-center gap-3 px-4 shrink-0"
            style={{ height: 56, background: 'rgba(13,11,30,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => router.back()}
              className="flex items-center justify-center w-11 h-11 rounded-full shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.10)' }} aria-label="뒤로가기">
              <ArrowLeft size={18} weight="bold" color="white" />
            </button>
            <p className="text-sm font-bold truncate min-w-0" style={{ color: '#E8C547' }}>
              🌙 {unit?.title ?? '불러오는 중...'}
            </p>
            <div className="flex-1" />
            <button onClick={() => setShowEndConfirm(true)} disabled={isEnding || !sessionId}
              className="px-4 py-2 rounded-full text-xs font-extrabold transition-all disabled:opacity-40 shrink-0"
              style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 2px 0 #C8A020' }}>
              {isEnding ? '저장 중...' : '학습 완료'}
            </button>
          </header>

          {/* 무니 캐릭터 존 */}
          <div className="shrink-0 flex flex-col items-center px-4 py-2 relative">
            {/* glow */}
            <div className="absolute rounded-full pointer-events-none"
              style={{ width: 180, height: 180, background: 'radial-gradient(circle, rgba(232,197,71,0.15) 0%, transparent 70%)' }} />

            {/* 85점 팝업 */}
            <AnimatePresence>
              {showAwesomePopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="absolute z-20 px-4 py-2 rounded-full font-extrabold text-sm"
                  style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 16px rgba(232,197,71,0.5)', top: -8, whiteSpace: 'nowrap' }}
                  role="status" aria-live="polite">
                  완벽해요! 🌙✨
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={expression}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Image src={`/mooni/${expression}.png`} alt={`무니 - ${expressionLabels[expression]}`}
                    width={200} height={134} priority className="drop-shadow-2xl" />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* 이해도 바 + 표정 라벨 */}
            <div className="flex items-center gap-3 mt-1 w-full max-w-xs">
              <p className="text-xs font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {expressionLabels[expression]}
              </p>
              <div className="flex-1 flex items-center gap-2 relative">
                {/* 이해도 상승 파티클 */}
                <AnimatePresence>
                  {showUnderstandingBurst && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div key={i} className="absolute pointer-events-none"
                          style={{ left: `${15 + i * 14}%`, top: '50%' }}
                          initial={{ opacity: 1, y: 0, scale: 0 }}
                          animate={{ opacity: 0, y: -20 - (i % 3) * 8, x: (i % 2 === 0 ? 1 : -1) * (4 + (i % 3) * 4), scale: 1.2 }}
                          exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                          <svg width={8} height={8} viewBox="0 0 24 24">
                            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="#E8C547" />
                          </svg>
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: understandingColor, transformOrigin: 'left' }}
                    animate={{ width: `${understanding}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }} />
                </div>
                <p className="text-xs font-bold shrink-0" style={{ color: understandingColor }}>{understanding}%</p>
              </div>
            </div>
          </div>

          {/* ── 채팅 영역 ── */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 min-h-0"
            style={{ maskImage: 'linear-gradient(to bottom, transparent 0px, black 16px)' }}>
            <div className="max-w-lg mx-auto space-y-3 py-3">
              {/* 초기 무니 메시지 (대화 기록이 없을 때) */}
              {conversationHistory.length === 0 && (
                <div className="flex items-start gap-2.5">
                  <Image src={`/mooni/face-${expression}.png`} alt="무니" width={32} height={32}
                    className="rounded-full shrink-0 mt-0.5" style={{ background: 'rgba(232,197,71,0.15)' }} />
                  <div>
                    <motion.div key={mooniMessage}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.90)', maxWidth: 300 }}>
                      {mooniMessage}
                    </motion.div>
                    <button onClick={playTTS}
                      className="flex items-center gap-1 mt-1 text-xs font-medium rounded-full px-2.5 py-0.5 transition-opacity hover:opacity-80"
                      style={{ color: '#E8C547', background: 'rgba(232,197,71,0.10)' }} aria-label="듣기">
                      <SpeakerHigh size={12} weight="fill" /> 듣기
                    </button>
                  </div>
                </div>
              )}

              {/* 대화 기록 */}
              <AnimatePresence initial={false}>
                {conversationHistory.map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2.5'}`}>
                    {msg.role === 'assistant' && (
                      <Image src={`/mooni/face-${i === conversationHistory.length - 1 ? expression : 'curious'}.png`}
                        alt="무니" width={32} height={32}
                        className="rounded-full shrink-0 mt-0.5" style={{ background: 'rgba(232,197,71,0.15)' }} />
                    )}
                    <div>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-br-sm' : 'rounded-tl-sm'}`}
                        style={{
                          background: msg.role === 'user' ? 'rgba(232,197,71,0.22)' : 'rgba(255,255,255,0.08)',
                          color: msg.role === 'user' ? '#E8C547' : 'rgba(255,255,255,0.90)',
                          fontWeight: msg.role === 'user' ? 600 : 400,
                          maxWidth: 300,
                        }}>
                        {msg.content}
                      </div>
                      {msg.role === 'assistant' && i === conversationHistory.length - 1 && (
                        <button onClick={playTTS}
                          className="flex items-center gap-1 mt-1 text-xs font-medium rounded-full px-2.5 py-0.5 transition-opacity hover:opacity-80"
                          style={{ color: '#E8C547', background: 'rgba(232,197,71,0.10)' }} aria-label="듣기">
                          <SpeakerHigh size={12} weight="fill" /> 듣기
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <Image src={`/mooni/face-thinking.png`} alt="무니" width={32} height={32}
                    className="rounded-full shrink-0 mt-0.5" style={{ background: 'rgba(232,197,71,0.15)' }} />
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="flex gap-1.5"
                      animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(232,197,71,0.60)' }} />
                      <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(232,197,71,0.40)' }} />
                      <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(232,197,71,0.20)' }} />
                    </motion.div>
                  </div>
                </div>
              )}

              <div />
            </div>
          </div>

          {/* ── 입력 바 ── */}
          <div className="shrink-0 px-4 pb-5 pt-2 relative z-10">
            {/* 첫 방문 가이드 */}
            {isFirstVisit && guideStep === 'mic' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-2">
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}
                  style={{ color: '#E8C547' }}>↓</motion.span>
                <p className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(232,197,71,0.20)', color: '#E8C547' }}>
                  마이크를 눌러봐! 🎤
                </p>
              </motion.div>
            )}

            <div className="max-w-lg mx-auto flex items-end gap-2">
              {/* 텍스트 입력 */}
              <div className="flex-1 flex items-end gap-2 rounded-2xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit() } }}
                  placeholder="설명해봐요..."
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/30 max-h-20"
                  style={{ lineHeight: '1.5' }}
                  aria-label="무니에게 설명 입력"
                />
                <button onClick={handleTextSubmit} disabled={!textInput.trim() || isLoading}
                  className="shrink-0 p-2 rounded-xl disabled:opacity-30 transition-opacity"
                  style={{ background: '#E8C547' }} aria-label="전송">
                  <PaperPlaneTilt size={16} weight="fill" color="#1A1830" />
                </button>
              </div>

              {/* 마이크 버튼 */}
              <motion.button onClick={toggleRecording} disabled={isLoading} whileTap={{ scale: 0.92 }}
                className="relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-40"
                style={{
                  background: micSuccess ? 'rgba(76,175,80,0.85)' : isRecording ? 'rgba(239,68,68,0.85)' : '#E8C547',
                  boxShadow: isRecording ? '0 0 0 5px rgba(239,68,68,0.20)' : '0 0 0 5px rgba(232,197,71,0.15)',
                }}
                aria-label={isRecording ? '녹음 중지' : '녹음 시작'}>
                {isRecording ? <X size={20} weight="bold" color="#1A1830" /> : <Microphone size={20} weight="fill" color="#1A1830" />}
                {isRecording && (
                  <motion.div className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ background: 'rgba(239,68,68,0.35)' }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── 우측: 그림판 (md+ 전용) ── */}
        <div className="hidden md:flex flex-col h-full shrink-0"
          style={{ width: 380, borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.50)' }}>
              ✏️ 설명 그림판
            </p>
          </div>
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <DrawingCanvas ref={drawingCanvasRef} className="h-full" />
          </div>
        </div>
      </div>

      {/* 종료 확인 오버레이 */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowEndConfirm(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowEndConfirm(false)}>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm mb-8 rounded-3xl p-6 space-y-4"
            style={{ background: '#1E1A35', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <Image src="/mooni/curious.png" alt="무니" width={120} height={80} className="mx-auto mb-3" />
              <p className="font-extrabold text-white text-lg">학습을 끝낼까요?</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
                무니가 지금까지 배운 내용을 정리해줄 거예요!
              </p>
            </div>
            <button onClick={() => { setShowEndConfirm(false); endSession() }}
              className="w-full font-extrabold text-sm rounded-full py-4"
              style={{ background: '#E8C547', color: '#1A1830', boxShadow: '0 4px 0 #C8A020' }}>
              네, 끝낼게요 ✓
            </button>
            <button onClick={() => setShowEndConfirm(false)}
              className="w-full font-semibold text-sm rounded-full py-3"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.70)' }}>
              계속 가르칠게요
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
