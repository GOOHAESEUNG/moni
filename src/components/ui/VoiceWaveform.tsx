'use client'

import { motion } from 'framer-motion'

interface VoiceWaveformProps {
  isActive: boolean
  color?: string
}

const BAR_COUNT = 7

// 각 바의 진동 높이 배율 (가운데가 더 높게)
const barHeights = [0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4]

export default function VoiceWaveform({ isActive, color = '#E8C547' }: VoiceWaveformProps) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          style={{ backgroundColor: color, borderRadius: 99, width: 3 }}
          animate={
            isActive
              ? {
                  height: [
                    6,
                    Math.round(6 + 22 * barHeights[i]),
                    6,
                  ],
                }
              : { height: 6 }
          }
          transition={
            isActive
              ? {
                  duration: 0.5 + i * 0.07,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.06,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  )
}
