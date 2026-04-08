---
description: 사용 가능한 에이전트·스킬·MCP 전체 목록 및 호출 가이드
---

# 에이전트 & 도구 레퍼런스

## 개발 워크플로우 에이전트

| 에이전트 | 언제 | 파일 |
|---------|------|------|
| `planner` | 기능 요청 시 → Issue + 스펙 생성 | `.claude/agents/planner.md` |
| `wireframer` | UI 구현 전 → ASCII 와이어프레임 + Stitch 프롬프트 | `.claude/agents/wireframer.md` |
| `coder` | worktree 격리 구현 + 커밋/푸시 | `.claude/agents/coder.md` |
| `design-reviewer` | UI 구현 후 → impeccable + 추론엔진 검증 | `.claude/agents/design-reviewer.md` |
| `reviewer` | 코드 품질 → Codex 리뷰 위임 | `.claude/agents/reviewer.md` |

## 제품 품질 에이전트

| 에이전트 | 언제 |
|---------|------|
| `mooni-evaluator` | 무니 프롬프트 변경 시 → 60점 채점 |
| `report-writer` | 제출 전 → 공모전 AI 리포트 초안 |
| `error-fixer` | 배포 에러 → Issue + 수정 PR 자동 생성 |

## 스킬 커맨드 (impeccable)

| 커맨드 | 용도 |
|--------|------|
| `/critique [화면]` | UX/계층/감성 검토 |
| `/audit [화면]` | 접근성/반응형 체크 |
| `/polish [화면]` | 배포 전 최종 다듬기 |
| `/animate [컴포넌트]` | 애니메이션 보완 |
| `/typeset [화면]` | 폰트/간격 수정 |
| `/bolder [화면]` | 밋밋한 디자인 강화 |
| `/overdrive [화면]` | 기술적으로 특별한 효과 추가 |

## 스킬 커맨드 (design-dna / Stitch / enhance-prompt)

| 커맨드 | 용도 |
|--------|------|
| `/design-dna analyze [URL]` | 레퍼런스 UI → DNA JSON 추출 |
| `/stitch-design [설명]` | Stitch MCP로 고퀄 UI 생성 |
| `/react:components` | Stitch 화면 → React 컴포넌트 변환 |
| `/enhance-prompt [설명]` | Stitch 프롬프트 품질 향상 |

## 전체 플로우

```
planner → wireframer → coder → design-reviewer → reviewer(Codex) → PR 머지
```

## 로그
- AI 활동 자동 기록: `docs/ai-log.md`
- 워크플로우 상세: `docs/workflow.md`
- 와이어프레임: `docs/wireframes/`
