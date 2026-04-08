# pr

현재 브랜치 기준으로 PR을 생성하고 squash 머지한다.

## 실행 순서

1. `git log main..HEAD --oneline`으로 커밋 목록 파악
2. 커밋 내용 분석 → PR 제목과 본문 작성
3. 브랜치명에서 이슈 번호 추출 → `Closes #이슈번호` 본문에 포함
4. PR 생성:
   ```
   gh pr create --base main --head {현재브랜치} --title "{타입}: {제목}" --body "..."
   ```
5. reviewer 에이전트 → Codex 리뷰 통과 확인
6. Squash 머지 + 브랜치 삭제:
   ```
   gh pr merge {PR번호} --squash --delete-branch
   ```
7. 로컬 최신화: `git checkout main && git pull origin main`
8. AI 로그 기록

## 규칙
- 머지: squash (main 히스토리 깔끔하게)
- UI 변경이면 PR 전 design-reviewer 에이전트 먼저
- Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
