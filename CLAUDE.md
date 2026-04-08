# 무니에게 알려줘

## 프로젝트
학생이 AI(무니)를 가르치며 배우는 교육 앱 — 프로테제 효과 기반. 소규모 학원 타겟.
마감: 2026-04-14 (KIT 바이브코딩 공모전). **동작하는 데모 > 완벽한 코드.**

## 스택
- Next.js 16 App Router · TypeScript · Tailwind v4 · shadcn/ui
- Supabase (PostgreSQL + Auth + RLS)
- OpenAI API (gpt-4o) · Web Speech API (STT) · OpenAI TTS
- Framer Motion · @phosphor-icons/react (lucide 금지)

## 핵심 명령어
```bash
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 빌드 검증 — 커밋 전 필수
```

## 파일 구조
```
src/app/(auth)/          # 로그인/회원가입
src/app/student/         # 학생 플로우
src/app/teacher/         # 선생님 플로우
src/app/demo/            # 게스트 데모
src/components/mooni/    # 무니 캐릭터 컴포넌트
src/lib/supabase/        # client.ts / server.ts
src/types/database.ts    # DB 타입 정의
public/mooni/            # 캐릭터 PNG 6종 (curious/confused/happy/thinking/oops/impressed)
```

## DB 핵심 테이블
`profiles` · `classes` · `enrollments` · `units` · `sessions` · `messages` · `reports`
스키마: `supabase/schema.sql` · RLS 활성화됨

## 에이전트 & 워크플로우
@docs/workflow.md

## 디자인 시스템
@.impeccable.md

## 심사 기준 (판단 기준)
1. 기술 완성도 — 실제로 돌아가는가
2. AI 활용 능력 — 전략적으로 썼는가
3. 기획력 — 인터뷰 기반, 수치 있는가
4. 창의성 — AI 없이는 불가능한가
