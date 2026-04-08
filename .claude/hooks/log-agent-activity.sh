#!/bin/bash
# 에이전트 활동 자동 로깅 훅
# 사용법: ./log-agent-activity.sh "에이전트명" "작업내용" "입력" "출력"

AGENT_NAME="${1:-unknown}"
TASK="${2:-}"
INPUT="${3:-}"
OUTPUT="${4:-}"
DATE=$(date '+%Y-%m-%d')
TIME=$(date '+%H:%M')
LOG_FILE="$(git rev-parse --show-toplevel)/docs/ai-log.md"

ENTRY="
### [${TIME}] ${AGENT_NAME}
- **작업**: ${TASK}
- **입력**: ${INPUT}
- **출력**: ${OUTPUT}
"

# 날짜 헤더가 없으면 추가
if ! grep -q "## ${DATE}" "$LOG_FILE"; then
  echo -e "\n---\n\n## ${DATE}" >> "$LOG_FILE"
fi

# 로그 추가 (날짜 헤더 바로 다음에 삽입되도록 파일 끝에 추가)
echo "$ENTRY" >> "$LOG_FILE"

echo "✅ AI 활동 로그 기록: $AGENT_NAME"
