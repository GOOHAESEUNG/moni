'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Expression } from '@/types/database'

interface MooniCharacterProps {
  expression?: Expression
  size?: number
  className?: string
  animate?: boolean
  useVideo?: boolean  // stand.webm 애니메이션 영상 사용
}

const expressionLabels: Record<Expression, string> = {
  curious: '궁금해요!',
  confused: '모르겠어요...',
  thinking: '생각 중이에요',
  happy: '이해했어요! ✨',
  oops: '앗, 틀렸나요?',
  impressed: '완벽해요! 🌙',
}

export default function MooniCharacter({
  expression = 'curious',
  size = 200,
  className = '',
  animate = true,
  useVideo = false,
}: MooniCharacterProps) {
  const [currentExpression, setCurrentExpression] = useState(expression)
  const [isBlinking, setIsBlinking] = useState(false)

  // 표정 전환 시 부드럽게
  useEffect(() => {
    setCurrentExpression(expression)
  }, [expression])

  // 랜덤 깜빡임 idle 효과
  useEffect(() => {
    if (!animate) return
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [animate])

  // 영상 모드: stand.webm (투명 배경 루핑)
  if (useVideo) {
    return (
      <div className={`relative flex flex-col items-center ${className}`}>
        <div style={{ width: size, height: size }} className="relative">
          <video
            src="/mooni/stand.webm"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(232,197,71,0.3))',
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-medium">
          {expressionLabels[expression]}
        </p>
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <motion.div
        animate={animate ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: size, height: size }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExpression}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: isBlinking ? 0.7 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            style={{ width: size, height: size }}
            className="relative"
          >
            <Image
              src={`/mooni/${currentExpression}.png`}
              alt={`무니 - ${expressionLabels[currentExpression]}`}
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* 주변 별빛 파티클 */}
        {animate && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-accent"
                style={{
                  fontSize: 10 + i * 4,
                  top: `${15 + i * 25}%`,
                  left: i % 2 === 0 ? `${-10 - i * 5}%` : `${110 + i * 3}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              >
                ✦
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* 표정 라벨 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentExpression}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-xs text-muted-foreground font-medium"
        >
          {expressionLabels[currentExpression]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
