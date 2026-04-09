export function MoonSurfaceBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '60%', opacity: 0.12 }}
      >
        {/* 별들 (상단) */}
        {[
          [80, 60], [200, 30], [350, 80], [500, 40], [650, 70], [750, 25],
          [130, 120], [420, 100], [580, 130], [700, 90],
        ].map(([x, y], i) => (
          <polygon
            key={i}
            points={`${x},${y-6} ${x+1.5},${y-2} ${x+6},${y-2} ${x+2.5},${y+1} ${x+4},${y+6} ${x},${y+3} ${x-4},${y+6} ${x-2.5},${y+1} ${x-6},${y-2} ${x-1.5},${y-2}`}
            fill="#E8C547"
          />
        ))}

        {/* 달 표면 언덕 (뒤쪽, 더 둥글고 큰) */}
        <ellipse cx="150" cy="520" rx="220" ry="80" fill="#E0E0E8" />
        <ellipse cx="650" cy="540" rx="250" ry="90" fill="#D8D8E4" />

        {/* 달 표면 언덕 (앞쪽, 메인) */}
        <path
          d="M0 580 Q100 480 250 500 Q400 520 550 480 Q680 450 800 490 L800 600 L0 600 Z"
          fill="#DCDCE8"
        />

        {/* 크레이터들 */}
        <ellipse cx="120" cy="545" rx="35" ry="10" fill="rgba(0,0,0,0.06)" />
        <ellipse cx="380" cy="530" rx="25" ry="7" fill="rgba(0,0,0,0.05)" />
        <ellipse cx="620" cy="510" rx="30" ry="9" fill="rgba(0,0,0,0.06)" />
        <ellipse cx="750" cy="550" rx="20" ry="6" fill="rgba(0,0,0,0.04)" />

        {/* 작은 크레이터 */}
        <circle cx="200" cy="535" r="8" fill="rgba(0,0,0,0.04)" />
        <circle cx="500" cy="500" r="6" fill="rgba(0,0,0,0.04)" />
      </svg>
    </div>
  )
}
