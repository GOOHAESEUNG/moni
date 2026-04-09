// 모든 커스텀 SVG 아이콘을 이 파일에서 export

// 1. CarrotIcon — 퀘스트 아이콘 (Lightning 대체)
// 주황색 당근 몸통 + 초록 잎 3개
export function CarrotIcon({ size = 20, color = '#FF8C42' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 당근 몸통 (위쪽이 좁고 아래가 둥근 형태) */}
      <path d="M12 4 C9 4 7 7 7 11 C7 16 9.5 20 12 21 C14.5 20 17 16 17 11 C17 7 15 4 12 4Z" fill={color} />
      {/* 세로 줄무늬 */}
      <path d="M12 6 L12 19" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
      {/* 잎 3개 */}
      <path d="M12 4 Q9 0 7 1 Q9 3 12 4" fill="#5CB85C"/>
      <path d="M12 4 Q12 -1 12 -1 Q11 2 12 4" fill="#4CAF50"/>
      <path d="M12 4 Q15 0 17 1 Q15 3 12 4" fill="#5CB85C"/>
    </svg>
  )
}

// 2. RabbitPawIcon — 학습 횟수 (Flame 대체)
// 토끼 발바닥 패드 + 발가락 4개
export function RabbitPawIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* 메인 발바닥 패드 (하트 모양에 가까운 둥근 형태) */}
      <ellipse cx="12" cy="15" rx="6" ry="5" />
      {/* 발가락 4개 */}
      <circle cx="6.5" cy="9.5" r="2.5" />
      <circle cx="10" cy="7.5" r="2.5" />
      <circle cx="14" cy="7.5" r="2.5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
    </svg>
  )
}

// 3. MoonStarIcon — 점수/별점 (Star 대체)
// 초승달 + 작은 별
export function MoonStarIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* 초승달 */}
      <path d="M12 3C8.13 3 5 6.13 5 10C5 13.87 8.13 17 12 17C13.5 17 14.87 16.5 16 15.65C14.03 15.88 12 14.5 11 12.5C10 10.5 10.5 8 12 6.5C12.7 5.8 13.6 5.3 14.5 5.1C13.7 3.8 12.9 3 12 3Z"/>
      {/* 작은 별 */}
      <polygon points="19,2 20,5 23,5 20.5,7 21.5,10 19,8 16.5,10 17.5,7 15,5 18,5" transform="scale(0.6) translate(13, 3)"/>
    </svg>
  )
}

// 4. FullMoonNode — 완료 단원 노드용 (큰 사이즈, 크레이터 포함)
export function FullMoonNode({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      {/* 달 본체 */}
      <circle cx="36" cy="36" r="34" fill="#E8C547" />
      {/* 아래 그림자 (입체감) */}
      <circle cx="36" cy="36" r="34" fill="url(#moonGrad)" />
      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="100%" stopColor="rgba(200,160,32,0.4)"/>
        </radialGradient>
      </defs>
      {/* 크레이터 3개 */}
      <circle cx="22" cy="26" r="6" fill="rgba(200,160,32,0.35)" />
      <circle cx="50" cy="20" r="4" fill="rgba(200,160,32,0.30)" />
      <circle cx="44" cy="48" r="5" fill="rgba(200,160,32,0.25)" />
      {/* 체크 아이콘 */}
      <path d="M20 36 L30 46 L52 24" stroke="#1A1830" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 5. CrescentMoonNode — 잠긴 단원 노드용 (회색 초승달)
export function CrescentMoonNode({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      {/* 바깥 원 (회색 달) */}
      <circle cx="36" cy="36" r="34" fill="#D8D8D8" />
      {/* 초승달 음영 (겹치는 원으로 초승달 형태) */}
      <circle cx="48" cy="28" r="30" fill="#EFEFEF" />
      {/* 자물쇠 아이콘 */}
      <rect x="28" y="36" width="16" height="13" rx="3" fill="#9EA0B4"/>
      <path d="M30 36 L30 30 C30 25 42 25 42 30 L42 36" stroke="#9EA0B4" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <circle cx="36" cy="42" r="2" fill="white"/>
    </svg>
  )
}

// 6. StarBurstNode — 현재 단원 노드용 (빛나는 별 버스트)
export function StarBurstNode({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* 외곽 광선 8개 */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line
          key={i}
          x1="40" y1="40"
          x2={40 + 38 * Math.cos((deg * Math.PI) / 180)}
          y2={40 + 38 * Math.sin((deg * Math.PI) / 180)}
          stroke="rgba(232,197,71,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* 메인 원 */}
      <circle cx="40" cy="40" r="32" fill="#E8C547" />
      {/* 하이라이트 */}
      <circle cx="40" cy="40" r="32" fill="url(#burstGrad)" />
      <defs>
        <radialGradient id="burstGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
          <stop offset="100%" stopColor="rgba(200,160,32,0.2)"/>
        </radialGradient>
      </defs>
      {/* 중앙 별 */}
      <polygon
        points="40,18 44.7,32.6 60,32.6 47.7,41.5 52.3,56 40,47.1 27.7,56 32.3,41.5 20,32.6 35.3,32.6"
        fill="#1A1830"
      />
    </svg>
  )
}
