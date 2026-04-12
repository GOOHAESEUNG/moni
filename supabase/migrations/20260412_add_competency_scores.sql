-- 파인튜닝 모델(Gemma 4B LoRA) 역량 분석 결과 저장 컬럼 추가
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS competency_scores JSONB;

-- 중복 리포트 방지 및 upsert 지원을 위한 unique constraint
-- (이미 있을 경우 무시)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reports_session_id_key'
      AND conrelid = 'reports'::regclass
  ) THEN
    ALTER TABLE reports ADD CONSTRAINT reports_session_id_key UNIQUE (session_id);
  END IF;
END $$;
