# 개발 워크플로우

## 전체 흐름

```
기능 요청
   │
   ▼
[1] planner 에이전트
   → GitHub Issue 생성
   → 브랜치명 + 구현 스펙 반환
   → AI 로그 기록
   │
   ▼
[2] coder 에이전트 (worktree 격리)
   → 브랜치 생성 (feat/issue-{N}-{설명})
   → 구현
   → 논리적 단위로 커밋 (이슈 번호 포함)
   → 빌드 검증
   → 모든 커밋 완료 후 푸시
   → AI 로그 기록
   │
   ▼
[3] design-reviewer 에이전트 ← UI 화면 변경 시 필수, 비UI 작업은 스킵
   → /critique: UX/계층/무니 원칙 검토
   → /audit: 접근성/반응형 검토
   → 필요 시 /animate, /bolder, /typeset 등
   → 수정 사항 커밋
   → AI 로그 기록
   │
   ▼
[4] reviewer 에이전트 (Codex)
   → diff 코드 품질 검토
   → APPROVED → [5]로
   → CHANGES_REQUESTED → [2]로 돌아감
   → AI 로그 기록
   │
   ▼
[5] PR 생성 → main 머지
   → gh pr create
   → gh pr merge --squash --delete-branch
   → AI 로그 기록
```

## 디자인 툴체인

```
새 화면 설계
   │
   ├─ /enhance-prompt    → 프롬프트 품질 향상
   ├─ /design-dna        → Duolingo DNA 추출 (레퍼런스)
   ├─ /stitch-design     → Stitch MCP로 UI 초안 생성
   └─ /react:components  → React 컴포넌트 변환
   │
구현 완료 후 (design-reviewer 에이전트)
   ├─ /critique          → UX/계층/무니 원칙 검토
   ├─ /audit             → 접근성/반응형 검토
   ├─ /animate           → 애니메이션 보완 (필요 시)
   └─ /polish            → 배포 전 최종 다듬기
```

### 설치된 디자인 도구 목록
| 도구 | 스킬/MCP | 용도 |
|------|---------|------|
| impeccable | 플러그인 | /critique, /audit, /polish 등 20개 커맨드 |
| design-dna | 스킬 | 레퍼런스 UI → Design DNA JSON 추출 |
| Stitch MCP | MCP 서버 | 텍스트 → 고퀄 UI 화면 생성 (Gemini 2.5 Pro) |
| react:components | 스킬 | Stitch 화면 → React 컴포넌트 변환 |
| enhance-prompt | 스킬 | UI 프롬프트 품질 향상 |
| .impeccable.md | 컨텍스트 | 무니 디자인 원칙 5가지 (모든 도구 자동 참조) |

## UI 작업 여부 판단 기준

| 작업 유형 | design-reviewer 실행 |
|---------|-------------------|
| 새 페이지/화면 | ✅ 필수 |
| 신규 컴포넌트 | ✅ 필수 |
| API/DB 로직만 | ❌ 스킵 |
| 버그 수정 (UI 없음) | ❌ 스킵 |
| 스타일/레이아웃 변경 | ✅ 필수 |

---

## 커밋 규칙

### 형식
```
{타입}: {한글 설명}

{변경 내용 상세 (선택)}

#{이슈번호}
Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
```

### 타입
| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | UI/스타일 |
| `chore` | 설정/빌드 |

### 논리적 단위 커밋 원칙
- 하나의 PR = 하나의 이슈
- 하나의 커밋 = 하나의 논리적 변경 (파일 여러 개도 하나의 목적이면 OK)
- 빌드 통과하지 않는 상태로 커밋 금지
- 작업 완료 전 push 금지 (모든 커밋 완료 후 한 번에)

### 예시
```
feat: 선생님 대시보드 학생 목록 구현

- 반별 학생 카드 컴포넌트
- Supabase enrollments 테이블 연동

#3
Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
```

---

## PR 규칙

```bash
gh pr create \
  --title "{타입}: {이슈 제목}" \
  --body "## 변경 내용
{구현한 내용 요약}

## 스크린샷 (UI 변경 시)
{선택}

Closes #{이슈번호}" \
  --base main \
  --head {브랜치명}
```

### 머지 방식
- **Squash merge** 사용 (`gh pr merge --squash --delete-branch`)
- main 브랜치는 항상 빌드 가능한 상태 유지

---

## AI 활동 로그 기록 시점

| 시점 | 기록 내용 |
|------|---------|
| 에이전트 실행 완료 | 에이전트명, 작업, 결과 |
| 중요 기술 결정 시 | 결정 내용, 근거, 대안 검토 |
| 프롬프트 변경 시 | 변경 전/후, mooni-evaluator 점수 |
| 배포/에러 발생 시 | error-fixer 실행 결과 |
