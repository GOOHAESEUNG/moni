# AI 활용 기록 로그

> 이 파일은 개발 과정에서 AI 도구를 활용할 때마다 자동으로 기록됩니다.
> report-writer 에이전트가 이 파일을 기반으로 공모전 리포트를 생성합니다.

---

## 2026-04-08

### [프로젝트 기획] Claude Sonnet 4.6 (1M context)
- **작업**: 인터뷰 분석 → 서비스 컨셉 확정
- **입력**: 학원 원장 인터뷰 (학생 피드백 1인당 10분, 수기 관리)
- **출력**: 프로테제 효과 기반 "학생이 AI를 가르친다" 컨셉 도출
- **근거**: Chase et al.(2009) Stanford 연구 — AI 가르치기 효과 크기 0.71 (CHI 2024)

### [학술 리서치] Claude Sonnet 4.6 — general-purpose agent
- **작업**: 프로테제 효과, Socratic AI, 형성평가, 음성 학습 논문 서칭
- **결과**: 5개 주제 × 15편 논문 수집 → docs/research.md 저장
- **활용**: 기획 근거 + 기능 설계 방향에 반영

### [캐릭터 디자인] DALL-E 3 / Midjourney
- **작업**: 무니(달 토끼) 캐릭터 3종 생성 (캐릭터 시트/표정 시트/히어로)
- **프롬프트 전략**: 3D clay render, Pop Mart figurine aesthetic, 달 크레센트 마크
- **후처리**: Real-ESRGAN 4x 업스케일 → rembg 배경 제거 → 6종 표정 개별 커팅

### [DB 설계] Claude Sonnet 4.6
- **작업**: 7개 테이블 스키마 + RLS 정책 + Auth 트리거 설계
- **도구**: Supabase PostgreSQL
- **핵심 결정**: 세션-메시지-리포트 분리 구조로 대화 분석 가능하게 설계

### [프로젝트 초기화] Claude Code
- **작업**: Next.js 16 + Tailwind + shadcn/ui + Framer Motion 세팅
- **에이전트 설계**: planner/coder/reviewer/mooni-evaluator/report-writer/error-fixer 6종
- **인프라 설계**: CloudWatch → Lambda → Claude API → GitHub Issue 파이프라인

---

## 2026-04-09 ~ 04-12

### [전체 UI 구현] Claude Code (Opus 4.6) + Codex (OpenAI)
- **작업**: 27개 페이지 전체 UI 구현 (학생/선생님/데모 플로우)
- **파이프라인**: planner(설계) → coder/codex(구현) → design-reviewer(검수) → reviewer/codex(리뷰) → PR 머지
- **핵심**: GAN 영감 — 코더가 생성, 리뷰어가 판별하여 품질 수렴
- **결과**: 학생 플로우 8페이지, 선생님 플로우 10페이지, 데모 플로우 9페이지 완성

### [무니 채팅방 리디자인] Claude Code + impeccable /critique
- **작업**: 3컬럼 레이아웃 → 통합 채팅 레이아웃으로 전면 재설계
- **문제 발견**: scrollIntoView 사용 시 전체 뷰포트 스크롤 → 헤더 가려짐
- **해결**: Codex에게 진단 위임 → scrollTo({ top: scrollHeight })로 수정
- **학습**: scrollIntoView는 앱 레이아웃에서 부작용 위험 — 메모리에 기록

### [반 전체 요약 대시보드] Claude Code + frontend-design + Codex
- **작업**: 선생님용 반 전체 학생 데이터 집계 대시보드 신규 구현
- **구성**: 평균 이해도, 역량 분석 바, 약점 TOP, 학생 히트맵, AI 수업 추천
- **AI 수업 추천**: GPT-4o에 반 데이터 전달 → 맞춤 수업 전략 생성
- **데모 버전**: 하드코딩 데이터로 동시 구현

### [학부모 상담 자료 자동 생성] Claude Code + Codex
- **작업**: 학생 상세 페이지에서 1클릭으로 학부모 상담 자료 생성
- **구현**: GPT-4o에 학생 리포트 데이터 전달 → 강점/개선점/가정 실천 방안 생성
- **UX**: 모달 팝업 + 클립보드 복사 + ESC 닫기

### [파인튜닝 모델 통합] Claude Code
- **작업**: Gemma 4B + LoRA 파인튜닝 모델 API 연동
- **데이터**: AI-Hub 142번 데이터셋 24,000건 (초등 학습 수행 평가)
- **아키텍처**: GPT-4o + 파인튜닝 모델 Promise.allSettled 병렬 호출
- **안전장치**: 20초 타임아웃, 응답 검증(4키 존재 + 1-5 범위), 실패 시 graceful skip

### [데모 튜토리얼 시스템] Claude Code + Codex
- **작업**: 데모 페이지 스포트라이트 튜토리얼 오버레이 + 채팅 대본 카드 구현
- **목적**: 심사위원이 회원가입 없이 3분 안에 핵심 기능 체험
- **구성**: DemoTutorialOverlay(스포트라이트+툴팁) + DemoChatScript(대본 복사)
- **적용**: 데모 학생 홈/채팅방/선생님 대시보드 총 4페이지

### [디자인 검수] impeccable /critique + /audit
- **작업**: 반 요약 대시보드, 채팅방, 상담 모달 디자인 검수
- **도구**: impeccable 플러그인 (UX 크리틱 + 접근성 감사)
- **결과**: 터치 타겟 44px 미달 수정, aria-label 추가, 색상 대비 확인

---

## 2026-04-13

### [자율 루프 구축] Claude Code (Opus 4.6)
- **작업**: 심사 기준 45점 만점 자동 평가 + 반복 개선 루프 설정
- **구성**: judging-criteria.md(26개 항목) + autonomous-loop.md(파이프라인)
- **전략**: 매 라운드 최저 점수 항목 개선 → 빌드 검증 → 커밋

### [README 전면 재작성] Claude Code (Opus 4.6)
- **작업**: create-next-app 기본 템플릿 → 심사위원용 프로젝트 소개로 교체
- **포함**: 서비스 소개, 핵심 기능, AI 아키텍처 다이어그램, 로컬 실행 가이드

### [학술 근거 최신화] Claude Code + WebSearch
- **작업**: 2025~2026 최신 논문 9건 추가 검색 및 정리
- **주요 논문**: CHI 2025 "Playing Dumb to Get Smart", BEA 2025 "LLMs Protégés", Google LearnLM RCT
- **결과**: 전체 20편+ 논문 → docs/research.md 갱신

### [E2E 플로우 검증] Claude Code + Explore 에이전트 3병렬
- **작업**: 학생/선생님/데모 전체 유저 플로우 코드 레벨 검증
- **결과**: 핵심 경로 전부 정상, 개선사항 2건 수정 (지난 학습 링크, 퀘스트 뒤로가기)

### [데모 API Fallback] Claude Code (Opus 4.6)
- **작업**: OpenAI API 키 없이도 데모 체험 가능하도록 fallback 구현
- **채팅 API**: sessionId='demo' + 키 없음 → 5단계 하드코딩 응답 (이해도 25→88 단계적 상승)
- **수업 추천**: demoMode에서 1.5초 로딩 후 하드코딩 추천 표시
- **의의**: 심사위원 로컬 실행 시 환경 무관하게 핵심 기능 체험 보장

### [코드 품질 정비] Claude Code (Opus 4.6)
- **작업**: lint 에러 18→8건 감소, React hooks 규칙 위반 수정
- **핵심 수정**: useRef/useEffect가 조기 반환 뒤에 있어 런타임 에러 가능 → 순서 재배치
- **기타**: unused vars 정리, prefer-const, unescaped entities, eslint 인프라 폴더 제외

### [접근성 향상] Claude Code (Opus 4.6)
- **작업**: 전역 focus-visible 스타일 추가, aside→nav 시맨틱 태그 수정
- **결과**: 키보드 네비게이션 시 달 옐로우 아웃라인 표시 (WCAG AA 기본 충족)

<!-- 이하 에이전트가 자동으로 추가 -->
