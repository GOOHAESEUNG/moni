'use client'

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Eraser, Trash, PencilSimple } from '@phosphor-icons/react'

const COLORS = [
  { value: '#1A1830', label: '검정' },
  { value: '#E8C547', label: '노랑' },
  { value: '#EF4444', label: '빨강' },
  { value: '#3B82F6', label: '파랑' },
  { value: '#22C55E', label: '초록' },
]

const BRUSH_SIZES = [2, 4, 8]

export interface DrawingCanvasRef {
  getImageBase64: () => string | null
  clear: () => void
  hasContent: boolean
}

interface Props {
  className?: string
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, Props>(function DrawingCanvas({ className = '' }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const [color, setColor] = useState('#1A1830')
  const [brushSize, setBrushSize] = useState(4)
  const [isEraser, setIsEraser] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  // 캔버스 크기를 컨테이너에 맞게 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let debounceTimer: ReturnType<typeof setTimeout>

    const resize = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        const w = container.offsetWidth
        const h = container.offsetHeight
        if (w === 0 || h === 0) return  // 레이아웃 미완료

        // 크기 변화 없으면 스킵 — 대화 추가 시 ResizeObserver 루프 방지
        if (canvas.width === w && canvas.height === h) return

        const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#F5F3EE'
        ctx.fillRect(0, 0, w, h)
        if (imageData && imageData.width > 0) {
          ctx.putImageData(imageData, 0, 0)
        }
      }, 16)  // 1프레임 디바운스
    }

    // 초기화: rAF로 레이아웃 완료 후 실행 + 100ms 백업
    const raf = requestAnimationFrame(resize)
    const timer = setTimeout(resize, 100)

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      clearTimeout(debounceTimer)
      observer.disconnect()
    }
  }, [])

  const getPos = useCallback((e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas || !lastPosRef.current) return

    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = isEraser ? '#F5F3EE' : color
    ctx.lineWidth = isEraser ? brushSize * 4 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPosRef.current = pos
    setIsEmpty(false)
  }, [color, brushSize, isEraser])

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true
      lastPosRef.current = getPos(e, canvas)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return
      draw(getPos(e, canvas))
    }
    const onMouseUp = () => { isDrawingRef.current = false; lastPosRef.current = null }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseUp)
    }
  }, [draw, getPos])

  // Touch events (iPad)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      isDrawingRef.current = true
      lastPosRef.current = getPos(e.touches[0], canvas)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isDrawingRef.current) return
      draw(getPos(e.touches[0], canvas))
    }
    const onTouchEnd = () => { isDrawingRef.current = false; lastPosRef.current = null }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [draw, getPos])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.fillStyle = '#F5F3EE'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }, [])

  const getImageBase64 = useCallback((): string | null => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return null

    const maxW = 800
    const scale = Math.min(1, maxW / canvas.width)
    const offscreen = document.createElement('canvas')
    offscreen.width = canvas.width * scale
    offscreen.height = canvas.height * scale
    const ctx = offscreen.getContext('2d')!
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)
    ctx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height)

    return offscreen.toDataURL('image/jpeg', 0.75).split(',')[1]
  }, [isEmpty])

  useImperativeHandle(ref, () => ({
    getImageBase64,
    clear: clearCanvas,
    hasContent: !isEmpty,
  }), [getImageBase64, clearCanvas, isEmpty])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 툴바 */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}
      >
        {/* 색상 팔레트 */}
        <div className="flex items-center gap-1.5">
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { setColor(c.value); setIsEraser(false) }}
              className="rounded-full transition-transform"
              style={{
                width: 18,
                height: 18,
                background: c.value,
                border: !isEraser && color === c.value ? '2.5px solid white' : '2px solid rgba(255,255,255,0.3)',
                transform: !isEraser && color === c.value ? 'scale(1.25)' : 'scale(1)',
              }}
              aria-label={c.label}
            />
          ))}
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.20)' }} />

        {/* 굵기 */}
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className="rounded-full flex items-center justify-center transition-all"
              style={{
                width: 20, height: 20,
                background: brushSize === size ? 'rgba(232,197,71,0.30)' : 'transparent',
              }}
              aria-label={`굵기 ${size}`}
            >
              <div className="rounded-full bg-white" style={{ width: size + 1, height: size + 1 }} />
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.20)' }} />

        {/* 연필/지우개 */}
        <button
          onClick={() => setIsEraser(false)}
          className="p-1 rounded-lg transition-all"
          style={{ background: !isEraser ? 'rgba(232,197,71,0.25)' : 'transparent' }}
          aria-label="연필"
        >
          <PencilSimple size={16} weight={!isEraser ? 'fill' : 'regular'} color={!isEraser ? '#E8C547' : 'rgba(255,255,255,0.5)'} />
        </button>
        <button
          onClick={() => setIsEraser(true)}
          className="p-1 rounded-lg transition-all"
          style={{ background: isEraser ? 'rgba(232,197,71,0.25)' : 'transparent' }}
          aria-label="지우개"
        >
          <Eraser size={16} weight={isEraser ? 'fill' : 'regular'} color={isEraser ? '#E8C547' : 'rgba(255,255,255,0.5)'} />
        </button>

        <div className="flex-1" />

        {/* 전체 지우기 */}
        <button
          onClick={clearCanvas}
          disabled={isEmpty}
          className="p-1 rounded-lg transition-all disabled:opacity-30"
          style={{ background: 'transparent' }}
          aria-label="전체 지우기"
        >
          <Trash size={16} weight="regular" color="rgba(255,255,255,0.5)" />
        </button>
      </div>

      {/* 캔버스 영역 — minHeight: 0 필수 (flex-1이 무한 확장하는 것 방지) */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ cursor: isEraser ? 'cell' : 'crosshair', minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none', background: '#F5F3EE' }}
        />
        {/* 첫 안내 텍스트 */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
              여기에 그림으로 설명해봐요 ✏️
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

export default DrawingCanvas
