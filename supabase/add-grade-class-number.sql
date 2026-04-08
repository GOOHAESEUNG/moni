-- classes 테이블에 학년/반 정보 추가
ALTER TABLE classes ADD COLUMN IF NOT EXISTS grade smallint;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS class_number smallint;
