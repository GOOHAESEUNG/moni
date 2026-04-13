'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from '@phosphor-icons/react'

export interface TutorialStep {
  targetSelector: string
  title: string
  description: string
  position?: 'top' | 'bottom'
}

interface DemoTutorialOverlayProps {
  steps: TutorialStep[]
  storageKey: string
  onComplete?: () => void
}

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface ViewportSize {
  width: number
  height: number
}

const SPOTLIGHT_PADDING = 8
const VIEWPORT_MARGIN = 16
const TOOLTIP_GAP = 18
const DEFAULT_TOOLTIP_HEIGHT = 180
const TOOLTIP_MAX_WIDTH = 320

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function DemoTutorialOverlay({
  steps,
  storageKey,
  onComplete,
}: DemoTutorialOverlayProps) {
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null)
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 0, height: 0 })
  const [tooltipHeight, setTooltipHeight] = useState(DEFAULT_TOOLTIP_HEIGHT)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const activeStep = steps[currentStep]

  const measure = useCallback(() => {
    if (!activeStep) {
      setSpotlightRect(null)
      return
    }

    const target = document.querySelector(activeStep.targetSelector)
    if (!(target instanceof HTMLElement)) {
      setSpotlightRect(null)
      return
    }

    const rect = target.getBoundingClientRect()
    setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    setSpotlightRect({
      top: Math.max(VIEWPORT_MARGIN, rect.top - SPOTLIGHT_PADDING),
      left: Math.max(VIEWPORT_MARGIN, rect.left - SPOTLIGHT_PADDING),
      width: Math.min(window.innerWidth - VIEWPORT_MARGIN * 2, rect.width + SPOTLIGHT_PADDING * 2),
      height: rect.height + SPOTLIGHT_PADDING * 2,
    })
  }, [activeStep])

  useEffect(() => {
    if (!steps.length) {
      setIsReady(true)
      setIsVisible(false)
      return
    }

    try {
      const seen = window.localStorage.getItem(storageKey) === 'true'
      setIsVisible(!seen)
    } catch {
      setIsVisible(true)
    } finally {
      setIsReady(true)
    }
  }, [steps.length, storageKey])

  useEffect(() => {
    if (!isVisible) return

    const updatePosition = () => {
      window.requestAnimationFrame(measure)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isVisible, measure])

  useEffect(() => {
    if (!isVisible) return
    if (!tooltipRef.current) return

    const updateTooltipHeight = () => {
      setTooltipHeight(tooltipRef.current?.offsetHeight ?? DEFAULT_TOOLTIP_HEIGHT)
    }

    updateTooltipHeight()

    const resizeObserver = new ResizeObserver(updateTooltipHeight)
    resizeObserver.observe(tooltipRef.current)

    return () => resizeObserver.disconnect()
  }, [currentStep, isVisible])

  const finishTutorial = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, 'true')
    } catch {
      // Ignore storage errors and still close the overlay.
    }

    setIsVisible(false)
    onComplete?.()
  }, [onComplete, storageKey])

  const shouldShow = isReady && isVisible && !!activeStep && !!spotlightRect && viewportSize.width > 0

  const tooltipWidth = shouldShow ? Math.min(TOOLTIP_MAX_WIDTH, viewportSize.width - VIEWPORT_MARGIN * 2) : 0
  const tooltipLeft = shouldShow ? clamp(
    spotlightRect!.left + spotlightRect!.width / 2 - tooltipWidth / 2,
    VIEWPORT_MARGIN,
    viewportSize.width - tooltipWidth - VIEWPORT_MARGIN,
  ) : 0

  const canPlaceBelow = shouldShow ? spotlightRect!.top + spotlightRect!.height + TOOLTIP_GAP + tooltipHeight <= viewportSize.height - VIEWPORT_MARGIN : true
  const canPlaceAbove = shouldShow ? spotlightRect!.top - TOOLTIP_GAP - tooltipHeight >= VIEWPORT_MARGIN : false

  let placement: 'top' | 'bottom' = 'bottom'
  if (activeStep?.position === 'top') {
    placement = canPlaceAbove ? 'top' : 'bottom'
  } else if (activeStep?.position === 'bottom') {
    placement = canPlaceBelow ? 'bottom' : 'top'
  } else if (!canPlaceBelow && canPlaceAbove) {
    placement = 'top'
  }

  const tooltipTop = shouldShow ? (placement === 'bottom'
    ? Math.min(
        viewportSize.height - tooltipHeight - VIEWPORT_MARGIN,
        spotlightRect!.top + spotlightRect!.height + TOOLTIP_GAP,
      )
    : Math.max(VIEWPORT_MARGIN, spotlightRect!.top - tooltipHeight - TOOLTIP_GAP)) : 0

  const arrowLeft = shouldShow ? clamp(
    spotlightRect!.left + spotlightRect!.width / 2 - tooltipLeft - 10,
    18,
    tooltipWidth - 28,
  ) : 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <AnimatePresence>
      {shouldShow && (
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[90] pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
            border: '2px solid #E8C547',
            borderRadius: 16,
            boxShadow: '0 0 0 9999px rgba(13,11,30,0.70)',
          }}
        />
        {/* 펄싱 하이라이트 링 */}
        <motion.div
          className="fixed pointer-events-none rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(232,197,71,0.4)',
              '0 0 0 8px rgba(232,197,71,0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          style={{
            top: spotlightRect.top - 2,
            left: spotlightRect.left - 2,
            width: spotlightRect.width + 4,
            height: spotlightRect.height + 4,
            border: '2px solid transparent',
            borderRadius: 18,
          }}
        />

        <motion.div
          key={currentStep}
          ref={tooltipRef}
          initial={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed pointer-events-auto rounded-2xl p-5"
          style={{
            top: tooltipTop,
            left: tooltipLeft,
            width: tooltipWidth,
            background: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
          }}
        >
          <button
            type="button"
            onClick={finishTutorial}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: '#9EA0B4', background: 'rgba(245,246,250,0.9)' }}
            aria-label="튜토리얼 닫기"
          >
            <X size={16} weight="bold" />
          </button>

          <div
            className="absolute h-5 w-5 rotate-45"
            style={{
              left: arrowLeft,
              background: '#FFFFFF',
              top: placement === 'bottom' ? -8 : undefined,
              bottom: placement === 'top' ? -8 : undefined,
            }}
          />

          <p className="pr-10 text-base font-extrabold" style={{ color: '#2D2F2F' }}>
            {activeStep.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>
            {activeStep.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={finishTutorial}
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: '#9EA0B4' }}
            >
              건너뛰기
            </button>

            <button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  finishTutorial()
                  return
                }

                setCurrentStep((prev) => prev + 1)
              }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition-transform active:scale-95"
              style={{ background: '#E8C547', color: '#1A1830' }}
            >
              {isLastStep ? '시작하기' : '다음'}
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
