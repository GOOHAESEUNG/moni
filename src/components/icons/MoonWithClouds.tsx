// 학생 대시보드 배경 — 대형 달 + 구름 SVG 일러스트레이션

export function MoonWithClouds({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* 달 본체 그라디언트 */}
        <radialGradient id="moonBodyGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="35%" stopColor="#FFF176" />
          <stop offset="70%" stopColor="#F5D847" />
          <stop offset="100%" stopColor="#E8C020" />
        </radialGradient>

        {/* 달 글로우 (외곽 빛) */}
        <radialGradient id="moonGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="rgba(255,235,100,0)" />
          <stop offset="75%" stopColor="rgba(255,220,80,0.18)" />
          <stop offset="90%" stopColor="rgba(255,200,60,0.10)" />
          <stop offset="100%" stopColor="rgba(255,180,40,0)" />
        </radialGradient>

        {/* 달 하이라이트 */}
        <radialGradient id="moonHighlight" cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* 크레이터 그라디언트 */}
        <radialGradient id="crater1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(200,160,20,0.50)" />
          <stop offset="100%" stopColor="rgba(200,160,20,0)" />
        </radialGradient>
        <radialGradient id="crater2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(190,150,15,0.40)" />
          <stop offset="100%" stopColor="rgba(190,150,15,0)" />
        </radialGradient>

        {/* 구름 그라디언트 */}
        <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="100%" stopColor="rgba(235,228,255,0.85)" />
        </linearGradient>
        <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(245,240,255,0.88)" />
          <stop offset="100%" stopColor="rgba(220,210,250,0.80)" />
        </linearGradient>
        <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="100%" stopColor="rgba(230,222,255,0.70)" />
        </linearGradient>

        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cloudShadow">
          <feDropShadow dx="0" dy="-4" stdDeviation="8" floodColor="rgba(140,120,200,0.20)" />
        </filter>
      </defs>

      {/* ── 달 글로우 후광 ── */}
      <circle cx="390" cy="290" r="280" fill="url(#moonGlowGrad)" />

      {/* ── 달 본체 ── */}
      <circle cx="390" cy="290" r="230" fill="url(#moonBodyGrad)" />

      {/* ── 달 하이라이트 ── */}
      <circle cx="390" cy="290" r="230" fill="url(#moonHighlight)" />

      {/* ── 크레이터 ── */}
      <ellipse cx="310" cy="200" rx="42" ry="40" fill="url(#crater1)" />
      <ellipse cx="490" cy="170" rx="28" ry="27" fill="url(#crater2)" />
      <ellipse cx="460" cy="360" rx="35" ry="33" fill="url(#crater1)" />
      <ellipse cx="300" cy="350" rx="20" ry="19" fill="url(#crater2)" />
      <ellipse cx="540" cy="280" rx="18" ry="17" fill="url(#crater2)" />
      <ellipse cx="360" cy="440" rx="14" ry="13" fill="url(#crater1)" />

      {/* 크레이터 내부 밝은 테두리 */}
      <ellipse cx="310" cy="200" rx="42" ry="40" fill="none" stroke="rgba(255,240,120,0.25)" strokeWidth="2" />
      <ellipse cx="490" cy="170" rx="28" ry="27" fill="none" stroke="rgba(255,240,120,0.20)" strokeWidth="1.5" />
      <ellipse cx="460" cy="360" rx="35" ry="33" fill="none" stroke="rgba(255,240,120,0.22)" strokeWidth="1.5" />

      {/* ── 달 테두리 (은은한 빛) ── */}
      <circle cx="390" cy="290" r="230" fill="none" stroke="rgba(255,235,100,0.35)" strokeWidth="3" />

      {/* ── 구름 레이어 (하단) ── */}

      {/* 구름 1 — 왼쪽 하단 큰 구름 */}
      <g filter="url(#cloudShadow)">
        <path
          d="M-20 620 Q30 560 100 575 Q120 540 170 548 Q200 510 260 525
             Q300 495 340 515 Q370 490 400 510 Q430 500 440 525
             Q480 510 500 540 Q530 525 550 550 Q580 545 600 570
             L600 680 L-20 680 Z"
          fill="url(#cloudGrad1)"
        />
      </g>

      {/* 구름 2 — 오른쪽 중간 구름 */}
      <g filter="url(#cloudShadow)">
        <path
          d="M300 590 Q330 555 380 565 Q400 535 445 548
             Q470 520 520 535 Q555 515 580 535 Q600 530 600 555
             L600 680 L300 680 Z"
          fill="url(#cloudGrad2)"
        />
      </g>

      {/* 구름 3 — 맨 앞 하단 구름 */}
      <g filter="url(#cloudShadow)">
        <path
          d="M-20 650 Q20 620 70 630 Q100 605 150 618
             Q180 595 230 610 Q260 590 300 605
             Q330 585 370 600 Q400 580 430 598
             Q460 580 490 595 Q520 578 550 592
             Q575 580 600 595
             L600 680 L-20 680 Z"
          fill="url(#cloudGrad1)"
        />
      </g>

      {/* 구름 4 — 왼쪽 중간 작은 구름 (달 앞에) */}
      <g filter="url(#cloudShadow)">
        <path
          d="M-20 558 Q10 525 55 535 Q75 505 120 518
             Q145 495 180 508 Q200 490 220 505
             L220 650 L-20 650 Z"
          fill="url(#cloudGrad3)"
        />
      </g>

      {/* ── 작은 장식 별들 ── */}
      {/* 달 주변 작은 십자 별 */}
      <g fill="rgba(255,235,100,0.85)">
        <path d="M148 120 L151 130 L161 133 L151 136 L148 146 L145 136 L135 133 L145 130 Z" />
        <path d="M570 380 L572 387 L579 389 L572 391 L570 398 L568 391 L561 389 L568 387 Z" />
        <path d="M200 460 L202 467 L209 469 L202 471 L200 478 L198 471 L191 469 L198 467 Z" />
        <path d="M520 120 L522 126 L528 128 L522 130 L520 136 L518 130 L512 128 L518 126 Z" />
      </g>
      {/* 작은 점 별들 */}
      <circle cx="160" cy="340" r="3" fill="rgba(255,235,100,0.60)" />
      <circle cx="560" cy="450" r="2.5" fill="rgba(255,235,100,0.55)" />
      <circle cx="120" cy="490" r="2" fill="rgba(255,235,100,0.50)" />
    </svg>
  )
}
