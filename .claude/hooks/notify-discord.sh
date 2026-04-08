#!/bin/bash
# Discord 웹훅 알림
# 사용법: ./notify-discord.sh "제목" "내용" "색상(선택, 기본 노랑)"

TITLE="${1:-알림}"
MESSAGE="${2:-작업 완료}"
COLOR="${3:-16119590}"  # #E8C547 달 옐로우

WEBHOOK_URL="https://discord.com/api/webhooks/1491386949221748857/guc0R4MdDktbMrbJAvEfStHjP8xCZvUpAgtyFS9yu7kZUcQOUSAJh4JrpwtuR_hnnoFh"

PAYLOAD=$(cat <<JSON
{
  "embeds": [{
    "title": "🌙 ${TITLE}",
    "description": "${MESSAGE}",
    "color": ${COLOR},
    "footer": { "text": "무니에게 알려줘 · $(date '+%H:%M')" }
  }]
}
JSON
)

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" > /dev/null

echo "✅ Discord 알림 전송: $TITLE"
