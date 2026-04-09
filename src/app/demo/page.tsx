'use client'

import Link from 'next/link'
import Image from 'next/image'

const STARS = [
  { id: 0, top: '5%', left: '10%', size: 1.8, delay: 0.3, duration: 2.8 },
  { id: 1, top: '18%', left: '82%', size: 2.3, delay: 1.1, duration: 3.5 },
  { id: 2, top: '30%', left: '55%', size: 1.5, delay: 0.7, duration: 2.2 },
  { id: 3, top: '70%', left: '25%', size: 2.0, delay: 2.0, duration: 4.1 },
  { id: 4, top: '85%', left: '70%', size: 1.6, delay: 0.4, duration: 3.0 },
  { id: 5, top: '45%', left: '90%', size: 2.1, delay: 1.8, duration: 2.5 },
  { id: 6, top: '60%', left: '8%', size: 1.9, delay: 0.9, duration: 3.8 },
  { id: 7, top: '90%', left: '45%', size: 2.5, delay: 1.5, duration: 2.9 },
  { id: 8, top: '12%', left: '38%', size: 1.7, delay: 2.3, duration: 3.3 },
  { id: 9, top: '75%', left: '60%', size: 2.2, delay: 0.2, duration: 4.0 },
  { id: 10, top: '22%', left: '15%', size: 1.4, delay: 1.6, duration: 2.7 },
  { id: 11, top: '55%', left: '78%', size: 2.6, delay: 0.8, duration: 3.6 },
  { id: 12, top: '40%', left: '42%', size: 1.8, delay: 2.1, duration: 2.4 },
  { id: 13, top: '8%', left: '65%', size: 2.0, delay: 1.3, duration: 4.2 },
  { id: 14, top: '95%', left: '20%', size: 1.5, delay: 0.6, duration: 3.1 },
  { id: 15, top: '35%', left: '95%', size: 2.4, delay: 1.9, duration: 2.6 },
]

const ROLES = [
  {
    href: '/demo/student',
    emoji: '🐇',
    title: '학생으로 체험',
    desc: '무니에게 "분수의 덧셈"을 직접 설명해보세요. 무니가 질문하며 반응해요.',
    cta: '학생 체험 시작',
  },
  {
    href: '/demo/teacher',
    emoji: '📚',
    title: '선생님으로 체험',
    desc: '학생별 이해도 리포트와 대시보드가 어떻게 생겼는지 미리 살펴보세요.',
    cta: '대시보드 체험',
  },
]

export default function DemoPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 55%, #1E1A35 100%)' }}
    >
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star-particle"
          style={{
            top: s.top,
            left: s.left,
            '--dur': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        >
          <svg width={s.size * 4} height={s.size * 4} viewBox="0 0 10 10">
            <polygon points="5,0 6,3.5 10,3.5 7,5.5 8,9 5,7 2,9 3,5.5 0,3.5 4,3.5" fill="white" />
          </svg>
        </div>
      ))}

      <div
        className="relative mb-6"
        style={{
          width: 180, height: 120,
          animation: 'float 3.5s ease-in-out infinite',
        }}
      >
        <Image src="/mooni/curious.png" alt="무니" fill className="object-contain drop-shadow-xl" priority />
      </div>

      <p className="mb-2 text-sm font-black tracking-widest" style={{ color: '#E8C547' }}>
        무니에게 알려줘
      </p>
      <h1 className="mb-2 text-2xl font-black text-white text-center">어떤 역할로 체험할까요?</h1>
      <p className="mb-10 text-sm text-center" style={{ color: 'rgba(255,255,255,0.55)' }}>
        로그인 없이 샘플 데이터로 바로 체험할 수 있어요
      </p>

      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
        {ROLES.map(({ href, emoji, title, desc, cta }) => (
          <div key={href} className="flex-1" style={{ opacity: 1 }}>
            <Link
              href={href}
              className="flex flex-col gap-4 rounded-3xl border p-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.09)',
                borderColor: 'rgba(232,197,71,0.25)',
              }}
            >
              <span className="text-4xl">{emoji}</span>
              <div>
                <p className="text-base font-bold text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  {desc}
                </p>
              </div>
              <span
                className="mt-auto inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold"
                style={{ background: '#E8C547', color: '#1A1830' }}
              >
                {cta}
              </span>
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 text-sm transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.40)' }}
      >
        ← 홈으로 돌아가기
      </Link>
    </div>
  )
}
