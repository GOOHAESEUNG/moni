'use client'

import { motion } from 'framer-motion'
import type { ReactNode, MouseEventHandler } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'
type Variant = 'solid' | 'ghost'

interface MoonButtonProps {
  size?: Size
  variant?: Variant
  glow?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  children?: ReactNode
}

const sizeMap: Record<Size, { dimension: number; fontSize: number }> = {
  sm: { dimension: 36, fontSize: 14 },
  md: { dimension: 48, fontSize: 16 },
  lg: { dimension: 64, fontSize: 20 },
  xl: { dimension: 80, fontSize: 24 },
}

export default function MoonButton({
  size = 'md',
  variant = 'solid',
  glow = false,
  onClick,
  disabled = false,
  children,
}: MoonButtonProps) {
  const { dimension, fontSize } = sizeMap[size]

  const solidStyle = {
    background: 'linear-gradient(135deg, #E8C547, #C8A020)',
    color: '#1A1600',
  }

  const ghostStyle = {
    background: 'transparent',
    border: '2px solid #E8C547',
    color: '#E8C547',
  }

  const glowStyle = glow
    ? { boxShadow: '0 0 28px rgba(232, 197, 71, 0.55)' }
    : {}

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.93 }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        border: 'none',
        outline: 'none',
        flexShrink: 0,
        ...(variant === 'solid' ? solidStyle : ghostStyle),
        ...glowStyle,
      }}
    >
      {children}
    </motion.button>
  )
}
