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

<!-- 이하 에이전트가 자동으로 추가 -->
