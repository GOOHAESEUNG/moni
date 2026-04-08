# ship

변경 내용을 빠르게 이슈 → 브랜치 → 커밋 → 푸시까지 한 번에 처리한다.
설정 변경, 문서 수정, 소소한 수정 등 planner+coder 파이프라인이 과할 때 사용.

## 언제 쓰는가
- 코드 구조 변경 없는 수정 (CLAUDE.md, 문서, 설정 등)
- 이미 작업된 변경사항을 빠르게 올릴 때

## 실행 순서

1. `git status`와 `git diff` 로 변경 내용 파악
2. 변경 내용 기반으로 이슈 생성:
   ```
   gh issue create --title "{한글 제목}" --body "{내용}" --label "{feat|fix|refactor}" --repo GOOHAESEUNG/Moni
   ```
3. 이슈 번호로 브랜치 생성: `{타입}/issue-{번호}-{설명}`
4. 스테이징 + 커밋:
   ```
   git add {관련 파일들}
   git commit -m "{타입}: {한글 설명}

   #{이슈번호}
   Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>"
   ```
5. `git push -u origin {브랜치명}`
6. `/pr` 커맨드로 이어서 머지

## 규칙
- UI 변경이 포함되면 ship 대신 planner+coder 풀 파이프라인 사용
- 커밋 메시지 한글
- 브랜치명 영어 소문자 + 하이픈
