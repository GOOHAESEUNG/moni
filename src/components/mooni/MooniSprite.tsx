'use client'

// 스프라이트 시트 기반 무니 점프 애니메이션
// 40프레임, 200x356px/frame, 12fps

const FRAME_COUNT = 40
const FRAME_W = 200
const FRAME_H = 356
const FPS = 12

interface MooniSpriteProps {
  size?: number   // 표시 크기 (px, 기본 220)
  className?: string
}

export default function MooniSprite({ size = 220, className = '' }: MooniSpriteProps) {
  const scale = size / FRAME_W
  const displayH = FRAME_H * scale

  const duration = FRAME_COUNT / FPS  // 3.33초

  return (
    <div
      className={className}
      style={{
        width: size,
        height: displayH,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: FRAME_W * FRAME_COUNT * scale,
          height: displayH,
          backgroundImage: 'url(/mooni/sprite-jump.png)',
          backgroundSize: `${FRAME_W * FRAME_COUNT * scale}px ${displayH}px`,
          backgroundRepeat: 'no-repeat',
          animation: `mooni-jump ${duration}s steps(${FRAME_COUNT}) infinite`,
        }}
      />
      <style>{`
        @keyframes mooni-jump {
          from { background-position-x: 0px; }
          to   { background-position-x: -${FRAME_W * FRAME_COUNT * scale}px; }
        }
      `}</style>
    </div>
  )
}
