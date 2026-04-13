"""
파인튜닝 결과 추론 테스트
- 베이스 모델 vs 파인튜닝 모델 비교 출력
"""

from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler, make_logits_processors

MODEL_PATH = "./models/gemma-4-e4b-it-4bit"
ADAPTER_PATH = "./output/adapters"

# 테스트용 학생 수행 내용 샘플
TEST_CASES = [
    "수학 시간에 분수의 덧셈을 배웠는데, 분모가 같을 때는 분자끼리 더하면 된다고 했어요. 그런데 분모가 다를 때는 어떻게 해야 할지 잘 모르겠어요.",
    "오늘 모둠 활동에서 제가 발표를 맡았어요. 친구들이 준비한 자료를 정리해서 제가 대신 발표했고, 친구들이 고마워했어요.",
    "환경 오염에 대해 배웠는데 플라스틱이 바다에 버려지면 물고기가 먹고 결국 사람한테도 돌아온다고 했어요. 분리수거를 잘 해야 할 것 같아요.",
]

def run_inference(model, tokenizer, prompt: str) -> str:
    messages = [{"role": "user", "content": f"다음 학생의 수행 내용을 분석해줘:\n{prompt}"}]
    formatted = tokenizer.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=False
    )
    # greedy decoding 대신 sampler/logits_processors 명시 → 반복 루프 방지
    sampler = make_sampler(temp=0.2, top_p=0.9)
    logits_processors = make_logits_processors(repetition_penalty=1.1, repetition_context_size=20)
    response = generate(
        model, tokenizer,
        prompt=formatted,
        max_tokens=128,
        sampler=sampler,
        logits_processors=logits_processors,
        verbose=False,
    )
    # <END> 토큰까지만 잘라내기
    return response.split("<END>")[0].strip()


def main():
    print("=" * 60)
    print("파인튜닝 모델 추론 테스트")
    print("=" * 60)

    # 파인튜닝 모델 로드
    print("\n[파인튜닝 모델 로드 중...]")
    ft_model, ft_tokenizer = load(MODEL_PATH, adapter_path=ADAPTER_PATH)
    print("로드 완료\n")

    for i, test_input in enumerate(TEST_CASES, 1):
        print(f"{'─' * 60}")
        print(f"[테스트 {i}]")
        print(f"학생 수행 내용: {test_input[:60]}...")
        print()
        print("[파인튜닝 모델 출력]")
        ft_output = run_inference(ft_model, ft_tokenizer, test_input)
        print(ft_output)
        print()


if __name__ == "__main__":
    main()
