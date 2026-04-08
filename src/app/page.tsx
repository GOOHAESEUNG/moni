'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  ChartBar,
  Microphone,
  Moon,
} from '@phosphor-icons/react'

const STARS = [
  { id: 0, top: '8%', left: '12%', size: 1.8, delay: 0.3, dur: 2.8 },
  { id: 1, top: '15%', left: '78%', size: 2.3, delay: 1.1, dur: 3.5 },
  { id: 2, top: '3%', left: '45%', size: 1.5, delay: 0.7, dur: 2.2 },
  { id: 3, top: '22%', left: '91%', size: 2.8, delay: 2.0, dur: 4.1 },
  { id: 4, top: '35%', left: '5%', size: 1.6, delay: 0.4, dur: 3.0 },
  { id: 5, top: '48%', left: '87%', size: 2.1, delay: 1.8, dur: 2.5 },
  { id: 6, top: '62%', left: '33%', size: 1.9, delay: 0.9, dur: 3.8 },
  { id: 7, top: '75%', left: '67%', size: 2.5, delay: 1.5, dur: 2.9 },
  { id: 8, top: '88%', left: '20%', size: 1.7, delay: 2.3, dur: 3.3 },
  { id: 9, top: '6%', left: '58%', size: 2.2, delay: 0.2, dur: 4.0 },
  { id: 10, top: '19%', left: '25%', size: 1.4, delay: 1.6, dur: 2.7 },
  { id: 11, top: '31%', left: '71%', size: 2.6, delay: 0.8, dur: 3.6 },
  { id: 12, top: '44%', left: '48%', size: 1.8, delay: 2.1, dur: 2.4 },
  { id: 13, top: '57%', left: '14%', size: 2.0, delay: 1.3, dur: 4.2 },
  { id: 14, top: '70%', left: '83%', size: 1.5, delay: 0.6, dur: 3.1 },
  { id: 15, top: '83%', left: '39%', size: 2.4, delay: 1.9, dur: 2.6 },
  { id: 16, top: '12%', left: '93%', size: 1.7, delay: 0.5, dur: 3.9 },
  { id: 17, top: '27%', left: '3%', size: 2.1, delay: 2.4, dur: 2.3 },
  { id: 18, top: '52%', left: '56%', size: 1.6, delay: 1.0, dur: 4.4 },
  { id: 19, top: '93%', left: '74%', size: 2.7, delay: 0.1, dur: 3.2 },
]

const FEATURES = [
  {
    icon: Brain,
    title: '설명하면서 배워요',
    desc: '프로테제 효과: 가르치는 사람이 가장 많이 배웁니다',
  },
  {
    icon: ChartBar,
    title: '리포트 자동 생성',
    desc: '강사 대시보드에 학생별 이해도 분석이 바로 나와요',
  },
  {
    icon: Microphone,
    title: '음성으로 설명해요',
    desc: '초등 저학년도 타이핑 없이 말로 설명할 수 있어요',
  },
  {
    icon: Moon,
    title: '모든 과목 지원',
    desc: '수학, 영어, 과학 등 어떤 개념이든 무니가 배울 준비가 됐어요',
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col font-sans">
      {/* HERO */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, #0D0B1E 0%, #151325 55%, #1E1A35 100%)',
        }}
      >
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <p
          className="mb-6 text-sm font-black tracking-widest"
          style={{ color: '#E8C547' }}
        >
          무니에게 알려줘
        </p>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-6"
          style={{ width: 240, height: 240 }}
        >
          <Image
            src="/mooni/hero.png"
            alt="무니 — 달에서 온 아기 토끼"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        <h1 className="mb-4 max-w-xs text-4xl font-black leading-tight text-white sm:max-w-md sm:text-5xl">
          학생이 AI를 가르치며<br />진짜 실력이 쌓여요
        </h1>

        <p className="mb-10 max-w-sm text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
          무니는 달에서 온 아기 토끼예요. 지구의 수학이 궁금해서 여러분의 설명이 필요해요.
        </p>

        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/signup"
            className="flex h-14 items-center justify-center rounded-full px-8 text-base font-bold transition-opacity hover:opacity-90"
            style={{ background: '#E8C547', color: '#1A1830', minWidth: 160 }}
          >
            시작하기
          </Link>
          <Link
            href="/demo"
            className="flex h-14 items-center justify-center rounded-full border px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            style={{ borderColor: 'rgba(232,197,71,0.40)', minWidth: 160 }}
          >
            체험해보기
          </Link>
        </motion.div>
      </section>

      {/* 기능 섹션 */}
      <section className="px-6 py-20" style={{ background: '#F2F2F5' }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-2xl font-black" style={{ color: '#1A1830' }}>
            왜 무니인가요?
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-md">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(232,197,71,0.15)' }}
                >
                  <Icon size={22} weight="fill" style={{ color: '#E8C547' }} />
                </div>
                <p className="text-base font-bold" style={{ color: '#1A1830' }}>{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B8D' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연구 근거 섹션 */}
      <section className="px-6 py-20" style={{ background: '#0D0B1E' }}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-10 text-sm font-semibold uppercase tracking-widest" style={{ color: '#E8C547' }}>
            Stanford 연구팀이 증명한 학습법
          </p>

          <div className="mb-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black leading-none" style={{ color: '#E8C547' }}>0.71</span>
              <span className="mt-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                효과 크기 (Effect Size)
              </span>
            </div>
            <div className="hidden h-20 w-px sm:block" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black leading-none" style={{ color: '#E8C547' }}>314+</span>
              <span className="mt-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                인용 횟수
              </span>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Chase et al. (2009) Stanford · CHI 2024
          </p>
        </div>
      </section>

      {/* 최종 CTA 섹션 */}
      <section className="flex flex-col items-center px-6 py-24" style={{ background: '#0D0B1E' }}>
        <h2 className="mb-2 text-3xl font-black text-white">지금 바로 시작해요</h2>
        <p className="mb-10 text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
          무니가 기다리고 있어요 🌙
        </p>
        <Link
          href="/signup"
          className="flex h-16 items-center justify-center rounded-full px-12 text-lg font-bold transition-opacity hover:opacity-90"
          style={{ background: '#E8C547', color: '#1A1830' }}
        >
          시작하기
        </Link>
      </section>
    </div>
  )
}
