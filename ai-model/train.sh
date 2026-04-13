#!/bin/bash
# Gemma 4 E4B LoRA 파인튜닝 실행 스크립트

set -e  # 에러 발생 시 즉시 중단

# 가상환경 활성화
source "$(dirname "$0")/.venv/bin/activate"

echo "=== Gemma 4 E4B LoRA 파인튜닝 시작 ==="
echo "모델: ./models/gemma-4-e4b-it-4bit"
echo "데이터: ./output/train.jsonl, ./output/valid.jsonl"
echo "어댑터 저장: ./output/adapters"
echo ""

# output/adapters 디렉토리 생성
mkdir -p output/adapters

# 파인튜닝 실행
mlx_lm.lora \
  --config finetune_config.yaml \
  --train

echo ""
echo "=== 학습 완료 ==="
echo "어댑터 파일: ./output/adapters/"
