#!/bin/bash
# Lambda 배포 스크립트
# 사용법: ./deploy.sh

set -e

FUNCTION_NAME="mooni-error-handler"
REGION="ap-northeast-2"

echo "📦 Lambda 패키지 생성..."
cd "$(dirname "$0")"
zip -r function.zip error-handler.js

echo "🚀 Lambda 배포..."
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --region $REGION

echo "⚙️  환경변수 설정..."
aws lambda update-function-configuration \
  --function-name $FUNCTION_NAME \
  --environment "Variables={
    CLAUDE_API_KEY=${CLAUDE_API_KEY},
    GITHUB_TOKEN=${GITHUB_TOKEN}
  }" \
  --region $REGION

echo "✅ 배포 완료: $FUNCTION_NAME"
rm function.zip
