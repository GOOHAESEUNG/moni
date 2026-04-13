"""
전처리 스크립트: 수업기록 데이터 → MLX 파인튜닝용 JSONL 변환
- 입력: TL1.zip, VL1.zip 내 수업기록 데이터/5.수업기록 데이터.csv
- 출력: output/train.jsonl, output/valid.jsonl
"""

import csv
import io
import json
import random
import zipfile
from pathlib import Path

# ─────────────────────────────────────────
# 설정
# ─────────────────────────────────────────
BASE_DIR = Path(__file__).parent / "142.학생 청소년 교육활동 역량 데이터" / "01.데이터"
TRAIN_ZIP = BASE_DIR / "1. Training" / "라벨링데이터" / "TL1.zip"
VALID_ZIP = BASE_DIR / "2. Validation" / "라벨링데이터" / "VL1.zip"
CSV_INNER_PATH = "수업기록 데이터/5.수업기록 데이터.csv"

OUTPUT_DIR = Path(__file__).parent / "output"

# train/valid 분할 비율 (AI-Hub Validation을 별도 활용할 경우 1.0으로 설정 가능)
TRAIN_SPLIT = 0.9
RANDOM_SEED = 42

# 클래스 불균형 완화: 레이블별 3점 행의 최대 허용 수
# (문제해결 82%, 시민 78% 등 3점이 압도적 → 레이블별 언더샘플링)
MAX_THREE_PER_LABEL = 15000

# ─────────────────────────────────────────
# 역량 레이블 한국어 이름 매핑
# ─────────────────────────────────────────
LABEL_NAMES = {
    "competency_label_1": "자기관리역량",
    "competency_label_2": "대인관계역량",
    "competency_label_3": "시민역량",
    "competency_label_4": "문제해결역량",
}


def load_csv_from_zip(zip_path: Path, inner_path: str) -> list[dict]:
    """zip 파일에서 CSV를 읽어 딕셔너리 리스트로 반환"""
    with zipfile.ZipFile(zip_path) as z:
        with z.open(inner_path) as f:
            content = f.read().decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))
    return list(reader)


def is_valid_row(row: dict) -> bool:
    """결측값(빈 문자열) 포함 행을 제거"""
    required_fields = [
        "student_performance",
        "student_assessment",
        "competency_label_1",
        "competency_label_2",
        "competency_label_3",
        "competency_label_4",
    ]
    return all(row.get(field, "").strip() for field in required_fields)


def build_example(row: dict) -> dict:
    """행 하나를 파인튜닝용 prompt/completion 쌍으로 변환"""
    performance = row["student_performance"].strip()

    label_lines = "\n".join(
        f"- {name}: {row[key].strip()}/5"
        for key, name in LABEL_NAMES.items()
    )
    assessment = row["student_assessment"].strip()

    prompt = f"다음 학생의 수행 내용을 분석해줘:\n{performance}"
    # <END> 토큰으로 completion 종료를 명시 → 추론 시 반복 루프 방지
    completion = f"역량 분석:\n{label_lines}\n교사 관찰: {assessment}<END>"

    return {"prompt": prompt, "completion": completion}


def write_jsonl(examples: list[dict], path: Path) -> None:
    """딕셔너리 리스트를 JSONL 파일로 저장"""
    path.parent.mkdir(parents=True, exist_ok=True)
    # mlx_lm은 BOM 없는 utf-8을 요구하므로 utf-8 사용
    with open(path, "w", encoding="utf-8") as f:
        for ex in examples:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")


def main():
    # 1. Training zip에서 수업기록 로드
    print(f"[1/5] Training 데이터 로드: {TRAIN_ZIP.name}")
    train_raw = load_csv_from_zip(TRAIN_ZIP, CSV_INNER_PATH)
    print(f"      원본 행 수: {len(train_raw):,}")

    # 2. Validation zip에서 수업기록 로드 (전체 데이터 풀에 합산 후 재분할)
    print(f"[2/5] Validation 데이터 로드: {VALID_ZIP.name}")
    valid_raw = load_csv_from_zip(VALID_ZIP, CSV_INNER_PATH)
    print(f"      원본 행 수: {len(valid_raw):,}")

    # 3. 두 데이터 합산 후 결측값 제거
    all_rows = train_raw + valid_raw
    print(f"[3/5] 결측값 필터링 (전체 {len(all_rows):,}건)")
    clean_rows = [r for r in all_rows if is_valid_row(r)]
    dropped = len(all_rows) - len(clean_rows)
    print(f"      제거된 행: {dropped:,}건 → 남은 행: {len(clean_rows):,}건")

    # 3-1. 클래스 불균형 완화: 레이블별 3점 행을 개별 언더샘플링
    # "4개 모두 3점"만 제한하면 marginal imbalance가 그대로 남음
    # → 각 레이블 기준으로 3점인 행을 MAX_THREE_PER_LABEL 이하로 제한
    random.seed(RANDOM_SEED)
    random.shuffle(clean_rows)  # 샘플링 전 셔플로 편향 방지

    kept = []
    label_three_count = {k: 0 for k in LABEL_NAMES}
    for row in clean_rows:
        # 이 행에서 3점인 레이블 목록
        three_labels = [k for k in LABEL_NAMES if row[k].strip() == "3"]
        # 3점 레이블 중 하나라도 상한 초과 시 스킵
        if any(label_three_count[k] >= MAX_THREE_PER_LABEL for k in three_labels):
            continue
        kept.append(row)
        for k in three_labels:
            label_three_count[k] += 1

    before = len(clean_rows)
    clean_rows = kept
    print(f"      레이블별 3점 언더샘플링: {before:,}건 → {len(clean_rows):,}건")
    for k, name in LABEL_NAMES.items():
        cnt = sum(1 for r in clean_rows if r[k].strip() == "3")
        print(f"        {name} 3점: {cnt:,}건 ({cnt/len(clean_rows)*100:.1f}%)")

    # 4. prompt/completion 쌍 생성
    print("[4/5] 예시 변환 중...")
    examples = [build_example(r) for r in clean_rows]

    # 5. train/valid 9:1 분리 후 저장
    print(f"[5/5] train/valid 분리 (비율 {TRAIN_SPLIT:.0%} / {1-TRAIN_SPLIT:.0%})")
    random.seed(RANDOM_SEED)
    random.shuffle(examples)

    split_idx = int(len(examples) * TRAIN_SPLIT)
    train_examples = examples[:split_idx]
    valid_examples = examples[split_idx:]

    train_path = OUTPUT_DIR / "train.jsonl"
    valid_path = OUTPUT_DIR / "valid.jsonl"

    write_jsonl(train_examples, train_path)
    write_jsonl(valid_examples, valid_path)

    print(f"\n완료!")
    print(f"  train.jsonl: {len(train_examples):,}건  →  {train_path}")
    print(f"  valid.jsonl: {len(valid_examples):,}건  →  {valid_path}")

    # 샘플 출력 (첫 번째 예시)
    print("\n[샘플 예시]")
    sample = train_examples[0]
    print(f"  prompt   : {sample['prompt'][:80]}...")
    print(f"  completion: {sample['completion'][:120]}...")


if __name__ == "__main__":
    main()
