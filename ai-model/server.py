"""
FastAPI 추론 서버
- POST /analyze: 학생 수행 텍스트 → 역량 점수 + 교사 코멘트
- 모델은 서버 시작 시 한 번만 로드 (lifespan 이벤트)
"""

import re
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler, make_logits_processors

# ─────────────────────────────────────────
# 설정
# ─────────────────────────────────────────
MODEL_PATH = "./models/gemma-4-e4b-it-4bit"
ADAPTER_PATH = "./output/adapters"

# ─────────────────────────────────────────
# 전역 모델 (lifespan에서 초기화)
# ─────────────────────────────────────────
_model = None
_tokenizer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작 시 모델 로드, 종료 시 정리"""
    global _model, _tokenizer
    print("[서버 시작] 모델 로드 중...")
    _model, _tokenizer = load(MODEL_PATH, adapter_path=ADAPTER_PATH)
    print("[서버 시작] 모델 로드 완료")
    yield
    _model = None
    _tokenizer = None


app = FastAPI(lifespan=lifespan)


# ─────────────────────────────────────────
# 요청/응답 스키마
# ─────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    scores: dict[str, int]
    comment: str
    raw: str


# ─────────────────────────────────────────
# 추론 함수
# ─────────────────────────────────────────
def run_inference(text: str) -> str:
    messages = [{"role": "user", "content": f"다음 학생의 수행 내용을 분석해줘:\n{text}"}]
    formatted = _tokenizer.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=False
    )
    sampler = make_sampler(temp=0.2, top_p=0.9)
    logits_processors = make_logits_processors(
        repetition_penalty=1.1, repetition_context_size=20
    )
    response = generate(
        _model, _tokenizer,
        prompt=formatted,
        max_tokens=128,
        sampler=sampler,
        logits_processors=logits_processors,
        verbose=False,
    )
    return response.split("<END>")[0].strip()


def parse_completion(raw: str) -> tuple[dict[str, int], str]:
    """completion 텍스트에서 점수와 교사 관찰 파싱"""
    LABEL_MAP = {
        "자기관리역량": "자기관리역량",
        "대인관계역량": "대인관계역량",
        "시민역량": "시민역량",
        "문제해결역량": "문제해결역량",
    }
    scores = {}
    for label in LABEL_MAP:
        m = re.search(rf"- {label}:\s*([1-5])/5", raw)
        scores[label] = int(m.group(1)) if m else 0

    m = re.search(r"교사 관찰:\s*(.+)", raw, re.DOTALL)
    comment = m.group(1).strip() if m else ""

    return scores, comment


# ─────────────────────────────────────────
# 엔드포인트
# ─────────────────────────────────────────
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text는 비어있을 수 없습니다.")

    raw = run_inference(req.text)
    scores, comment = parse_completion(raw)

    return AnalyzeResponse(scores=scores, comment=comment, raw=raw)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
