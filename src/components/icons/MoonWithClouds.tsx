import React from 'react'

// 학생 대시보드 하단 배경 — 달 + 구름 SVG
// position: absolute bottom 0 으로 사용 → 콘텐츠 끝에 붙음
// 단원 많을수록 위쪽 보라 하늘이 길어지는 구조

export function MoonWithClouds({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* 달 그라디언트 */}
        <radialGradient id="mwc-moon" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="40%" stopColor="#FFF176" />
          <stop offset="75%" stopColor="#F5D847" />
          <stop offset="100%" stopColor="#DEB820" />
        </radialGradient>

        {/* 달 글로우 */}
        <radialGradient id="mwc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="rgba(255,230,80,0)" />
          <stop offset="78%" stopColor="rgba(255,220,60,0.22)" />
          <stop offset="100%" stopColor="rgba(255,200,40,0)" />
        </radialGradient>

        {/* 달 하이라이트 */}
        <radialGradient id="mwc-hi" cx="33%" cy="28%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.50)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* 구름 레이어 색상 */}
        <linearGradient id="mwc-cloud-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(210,205,240,0.85)" />
          <stop offset="100%" stopColor="rgba(195,188,232,0.80)" />
        </linearGradient>
        <linearGradient id="mwc-cloud-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(232,228,250,0.92)" />
          <stop offset="100%" stopColor="rgba(218,212,245,0.88)" />
        </linearGradient>
        <linearGradient id="mwc-cloud-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(252,250,255,0.97)" />
          <stop offset="100%" stopColor="rgba(240,236,255,0.94)" />
        </linearGradient>
      </defs>

      {/* ── 달 글로우 ── */}
      <circle cx="650" cy="130" r="210" fill="url(#mwc-glow)" />

      {/* ── 달 본체 ── */}
      <circle cx="650" cy="130" r="170" fill="url(#mwc-moon)" />
      <circle cx="650" cy="130" r="170" fill="url(#mwc-hi)" />
      <circle cx="650" cy="130" r="170" fill="none" stroke="rgba(255,230,80,0.30)" strokeWidth="2.5" />

      {/* 크레이터 */}
      <ellipse cx="590" cy="80"  rx="32" ry="30" fill="rgba(195,150,20,0.40)" />
      <ellipse cx="720" cy="65"  rx="22" ry="21" fill="rgba(190,148,18,0.35)" />
      <ellipse cx="700" cy="190" rx="28" ry="26" fill="rgba(195,150,20,0.38)" />
      <ellipse cx="570" cy="185" rx="16" ry="15" fill="rgba(190,148,18,0.30)" />
      <ellipse cx="765" cy="130" rx="14" ry="13" fill="rgba(190,148,18,0.28)" />

      {/* ── 구름 3겹 (타원 여러 개 겹쳐서 자연스러운 윤곽) ── */}
      {/*
        구름 중심 y가 380~430 → viewBox(400) 아래로 반쯤 잘림
        = 구름 위쪽 절반만 화면에 보임
      */}

      {/* 레이어 1 — 가장 뒤, 연한 보라 */}
      <ellipse cx="-20" cy="400" rx="110" ry="90" fill="url(#mwc-cloud-back)" />
      <ellipse cx="110" cy="415" rx="130" ry="100" fill="url(#mwc-cloud-back)" />
      <ellipse cx="270" cy="405" rx="120" ry="95" fill="url(#mwc-cloud-back)" />
      <ellipse cx="420" cy="418" rx="140" ry="105" fill="url(#mwc-cloud-back)" />
      <ellipse cx="570" cy="408" rx="125" ry="98" fill="url(#mwc-cloud-back)" />
      <ellipse cx="710" cy="420" rx="130" ry="102" fill="url(#mwc-cloud-back)" />
      <ellipse cx="840" cy="410" rx="115" ry="92" fill="url(#mwc-cloud-back)" />

      {/* 레이어 2 — 중간 */}
      <ellipse cx="50"  cy="395" rx="120" ry="95" fill="url(#mwc-cloud-mid)" />
      <ellipse cx="195" cy="412" rx="145" ry="108" fill="url(#mwc-cloud-mid)" />
      <ellipse cx="355" cy="400" rx="135" ry="102" fill="url(#mwc-cloud-mid)" />
      <ellipse cx="510" cy="415" rx="148" ry="110" fill="url(#mwc-cloud-mid)" />
      <ellipse cx="665" cy="402" rx="130" ry="100" fill="url(#mwc-cloud-mid)" />
      <ellipse cx="800" cy="416" rx="125" ry="98" fill="url(#mwc-cloud-mid)" />

      {/* 레이어 3 — 맨 앞, 흰색 */}
      <ellipse cx="-10" cy="390" rx="130" ry="100" fill="url(#mwc-cloud-front)" />
      <ellipse cx="145" cy="408" rx="155" ry="115" fill="url(#mwc-cloud-front)" />
      <ellipse cx="315" cy="395" rx="145" ry="108" fill="url(#mwc-cloud-front)" />
      <ellipse cx="480" cy="410" rx="158" ry="116" fill="url(#mwc-cloud-front)" />
      <ellipse cx="640" cy="396" rx="140" ry="106" fill="url(#mwc-cloud-front)" />
      <ellipse cx="790" cy="408" rx="135" ry="104" fill="url(#mwc-cloud-front)" />

      {/* 바닥 채우기 — 구름 아래 빈틈 없애기 */}
      <rect x="-10" y="380" width="820" height="30" fill="url(#mwc-cloud-front)" />

      {/* ── 장식 별 ── */}
      <g fill="rgba(255,230,80,0.80)">
        <path d="M120 80  L122 88  L130 90  L122 92  L120 100 L118 92  L110 90  L118 88 Z" />
        <path d="M780 60  L782 67  L789 69  L782 71  L780 78  L778 71  L771 69  L778 67 Z" />
        <path d="M420 30  L422 37  L429 39  L422 41  L420 48  L418 41  L411 39  L418 37 Z" />
      </g>
      <circle cx="200" cy="55"  r="3" fill="rgba(255,230,80,0.65)" />
      <circle cx="500" cy="40"  r="2.5" fill="rgba(255,230,80,0.60)" />
      <circle cx="330" cy="95"  r="2" fill="rgba(255,230,80,0.55)" />
    </svg>
  )
}
