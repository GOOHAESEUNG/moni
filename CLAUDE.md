# 무니에게 알려줘

## 프로젝트
학생이 AI(무니)를 가르치며 배우는 교육 앱 — 프로테제 효과 기반. 소규모 학원 타겟.
마감: 2026-04-14 (KIT 바이브코딩 공모전). **동작하는 데모 > 완벽한 코드.**

## 스택
- Next.js 16 App Router · TypeScript · Tailwind v4 · shadcn/ui
- Supabase (PostgreSQL + Auth + RLS)
- OpenAI API (gpt-4o) · Web Speech API (STT) · OpenAI TTS
- Framer Motion · @phosphor-icons/react (**lucide-react 절대 금지**)

## 핵심 명령어
```bash
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 빌드 검증 — 커밋 전 필수
```

## 파일 구조
```
src/app/(auth)/               # 로그인/회원가입
src/app/student/              # 학생 플로우
  ├ page.tsx                  # 서버 컴포넌트 (데이터 fetch)
  ├ StudentHome.tsx           # 학생 대시보드 UI (클라이언트)
  ├ layout.tsx                # 패스스루 레이아웃
  ├ profile/page.tsx          # 프로필 페이지
  ├ teach/[unitId]/page.tsx   # 무니와 대화 화면
  └ report/[reportId]/page.tsx
src/app/teacher/              # 선생님 플로우
src/app/demo/                 # 게스트 데모
src/components/icons/         # 커스텀 SVG 아이콘
  ├ MoonWithClouds.tsx        # 학생 대시보드 배경 SVG
  └ index.tsx                 # StarBurstNode, CrescentMoonNode 등
src/lib/supabase/             # client.ts / server.ts
src/types/database.ts         # DB 타입 정의
public/mooni/                 # 무니 캐릭터 에셋
  # 전신: body.png · curious.png · confused.png · happy.png
  #       thinking.png · oops.png · impressed.png · stand.png · hero.png
  # 얼굴: face-curious.png · face-confused.png · face-happy.png
  #       face-thinking.png · face-oops.png · face-impressed.png
  # 기타: ear-left.png · ear-right.png · sprite-jump.png · moonbackground.png
```

## DB 핵심 테이블
`profiles` · `classes` · `enrollments` · `units` · `sessions` · `messages` · `reports`
스키마: `supabase/schema.sql` · RLS 활성화됨

---

## 디자인 구현 패턴

### 배경 그라디언트 (학생 화면 공통)
```tsx
background: 'linear-gradient(160deg, #7A6CC0 0%, #9485CF 25%, #B4A8DC 55%, #D4CEF0 100%)'
```

### 학생 대시보드 3컬럼 레이아웃
```
LeftNav (220px, background: #FFFFFF)
  CenterContent (flex-1, transparent)
RightSidebar (280px, background: #FFFFFF)
```
- 좌우 사이드바는 반드시 **완전 불투명(#FFFFFF)** — 반투명이면 배경 달이 비쳐 보임
- `MoonWithClouds`는 `overflow: hidden` wrapper 안에 배치
  ```tsx
  <div style={{ position:'absolute', left:220, right:280, bottom:0, height:'95%', overflow:'hidden' }}>
    <MoonWithClouds className="w-full h-full" />
  </div>
  ```

### clayCard 스타일
```tsx
const clayCard = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(130,110,200,0.22), 0 2px 8px rgba(100,85,170,0.10)',
} as const
```

### 단원 노드 3종 (StudentHome.tsx)
| 상태 | 컴포넌트 | 크기 | 특징 |
|------|---------|------|------|
| completed | `CompletedNode` | 84px | 금빛 메달 + 체크 + 스파클 |
| current | `CurrentNode` | 96px | 플레이 오브 + 이중 펄스 링 |
| locked | `LockedNode` | 64px | 흐릿한 크레센트 + 자물쇠 |

### MooniSpeechBubble
- 플러피 클라우드 말풍선 (상단 원형 범프 6개 + 하단 꼬리 방울 2개)
- 메시지 10종, **6.4초** 주기로 페이드 전환
- 무니 이미지 컨테이너 `bottom: 100%`에 배치 (무니를 가리지 않음)

### CSS 애니메이션 클래스 (globals.css)
| 클래스 | 용도 |
|--------|------|
| `.mooni-float` | 무니 캐릭터 둥실 부유 (4s, 기울기 포함) |
| `.star-particle-slow` | 사각 별 파티클 반짝임 |
| `.star-bg` | 원형 점 파티클 반짝임 |
| `.node-pulse-outer` | 현재 노드 바깥 펄스 링 (2.2s) |
| `.node-pulse-inner` | 현재 노드 안쪽 펄스 링 (2.2s, 0.4s delay) |

### 한국어 텍스트 처리
- `word-break: keep-all` 전역 적용 (`globals.css body`) — **모든 텍스트에 이미 적용됨**
- 한국어는 단어 단위로만 줄바꿈, 추가로 개별 요소에 설정할 필요 없음
- `overflow-wrap: break-word`도 함께 적용 (긴 영문/URL 대응)

---

## 에이전트 & 워크플로우
@docs/workflow.md

## 디자인 시스템
@.impeccable.md

## 심사 기준 (판단 기준)
1. 기술 완성도 — 실제로 돌아가는가
2. AI 활용 능력 — 전략적으로 썼는가
3. 기획력 — 인터뷰 기반, 수치 있는가
4. 창의성 — AI 없이는 불가능한가
