# AI 빌딩 리포트 초안

> 원본 양식: `/Users/haeseung/2026/KIT/submit/③ 2026 KIT 바이브코딩 공모전_팀명(개인은 이름)_AI리포트.docx`

---

## 기본 정보
- **팀명**: 구혜승 (개인)
- **휴대폰번호**: (직접 기입)
- **프로젝트명**: 무니에게 알려줘

---

## 1. 기획

### ■ 설정한 사용자는 누구이며, 해결하려는 구체적인 문제점/불편함은 무엇인가요?

**타겟 사용자:**
- Primary A: 초등~중등 학생 (학원 수업 후 자습/숙제로 사용)
- Primary B: 소규모 학원 강사 (1~3명 규모)

**문제점 (학원 원장 인터뷰 기반):**
1. **학생 피드백에 1인당 10분** 소요 → 학생 20명이면 하루 3시간+
2. **수기+메모장으로 학생 관리** → 누적 데이터 없음, 학부모 상담 때 기억에 의존
3. **학생이 "아는 척"하는지 판별 어려움** → 공식 암기 vs 원리 이해 구분 불가
4. **AI 도입 필요성은 느끼나 진입장벽** → 기존 LMS는 복잡하고 비쌈

> 인터뷰 원본: `/Users/haeseung/2026/KIT/interview/`

### ■ 문제를 해결하기 위한 솔루션의 핵심 기능은 무엇인가요?

**"학생이 AI를 가르친다" — 프로테제 효과(Protégé Effect) 기반 AI 학습 앱**

1. **무니에게 설명하기**: 학생이 오늘 배운 개념을 AI 캐릭터(무니)에게 설명. 무니는 의도적으로 모르는 척 + 꼬리 질문 → 학생이 막히는 순간 = 진짜 모르는 지점 자동 포착
2. **실시간 이해도 리포트**: 세션 종료 시 GPT-4o가 자동으로 이해도 점수(0-100), 취약점, 학습 제안 생성
3. **4대 핵심역량 분석**: 자체 파인튜닝 모델(Gemma 4B + LoRA, AI-Hub 24k 데이터)이 자기관리·대인관계·시민·문제해결 역량 1-5점 분석
4. **반 전체 요약 대시보드**: 반 평균 이해도, 역량 분석, 약점 TOP, AI 수업 추천
5. **학부모 상담 자료 자동 생성**: 버튼 하나로 강점/개선점/가정 실천 방안 1페이지 요약

### ■ 이 솔루션이 도입되었을 때 기대되는 개선점이 무엇인가요?

| 현재 | 도입 후 |
|------|---------|
| 학생 피드백 1인당 10분 | 자동 리포트로 1인당 30초 |
| 수기 메모장 관리 | 디지털 대시보드에 누적 |
| 학부모 상담 자료 수동 작성 | AI가 1클릭으로 생성 |
| "아는 척" 판별 불가 | 무니 꼬리 질문으로 자동 포착 |
| AI 도입 진입장벽 높음 | 초대 코드 하나로 즉시 시작 |

**학술 근거:**
- Chase et al.(2009, Stanford): AI를 가르친 학생이 직접 공부한 학생보다 높은 학습 성취
- Jin et al.(CHI 2024, KAIST·Stanford): LLM teachable agent 효과 크기 0.71
- MathSpring RCT(2025, 2003명): AI 튜터 사용 그룹 유의미한 수학 성취 향상

---

## 2. AI 활용 전략

### ■ 이 프로젝트에서 사용할 AI 도구와 모델은 무엇이며, 선택한 이유는 무엇인가요?

**개발 도구:**
| 도구 | 역할 | 선택 이유 |
|------|------|----------|
| Claude Code (Opus 4.6) | 오케스트레이터 — 전체 설계, 코드 리뷰, 품질 관리 | 1M 컨텍스트로 프로젝트 전체 파악, 멀티 에이전트 지휘 |
| Codex (OpenAI) | 코드 구현 — 서브에이전트로 실제 코딩 | 샌드박스 격리 실행으로 안전한 코드 생성 |
| impeccable 플러그인 | UI/UX 검수 — /critique, /audit, /polish | 디자인 품질 자동 평가 + 수정 제안 |
| Stitch MCP | UI 초안 생성 | Gemini 2.5 Pro 기반 고퀄 화면 생성 |

**서비스 내 AI:**
| 모델 | 역할 | 선택 이유 |
|------|------|----------|
| GPT-4o | 무니 대화 + 리포트 + 수업 추천 + 상담 자료 | 한국어 품질 최상, 역할 연기 능력 |
| Gemma 4B + LoRA | 핵심역량 분석 (4대 역량 1-5점) | 자체 파인튜닝으로 교육부 역량 체계에 특화 |
| OpenAI TTS | 무니 음성 출력 | 자연스러운 한국어 음성 |
| Web Speech API | 학생 음성 입력 | 브라우저 네이티브, 추가 비용 없음 |

### ■ 각 AI 도구별 활용 전략을 작성해주세요.

**1. 멀티 에이전트 개발 파이프라인 (GAN 영감)**
```
플래너 Claude → 스펙 설계, 기능 우선순위
코더 Codex   → 실제 코드 구현 (worktree 격리)
리뷰어 Codex → 코드 품질 검증 (APPROVED / CHANGES_REQUESTED)
디자인 검수  → impeccable /critique + /audit
```
GAN의 생성기-판별기 구조에서 영감: 코더가 생성, 리뷰어가 판별 → 품질 수렴.

**2. 무니 캐릭터 프롬프트 전략** (`src/lib/mooni-prompt.ts`)
- 시스템 프롬프트: "모르는 척하는 AI" — 의도적 오개념 시뮬레이션 + 소크라테스식 꼬리 질문
- **3단계 대화 전략**: ① 멍청한 척 → ② 오개념 흘리기 → ③ 꼬리질문
  - 예: "아, 그러면 X랑 Y는 항상 같은 거야?" (학생이 교정하게 유도)
- 6가지 표정 상태 제어 (curious, confused, thinking, happy, oops, impressed)
  - 각 표정에 선택 기준 명시 (예: oops = 오개념 흘릴 때)
- 이해도 0-100 실시간 추적 — 5단계 루브릭으로 정밀 채점
  - 0: 미설명 / 1-30: 단어 나열 / 31-60: 부분 정확 / 61-85: 대부분 정확 / 86-100: 완벽
- JSON 구조화 출력 강제 (`{ expression, message, understanding }`) + 파싱 fallback
- 학년 맞춤 어휘 조절 (gradeHint 파라미터)
- 그림 입력 시 시각 정보 활용 전략 (도형/수식 파악 → 꼬리질문 연계)

**3. 자체 파인튜닝 (Gemma 4B + LoRA)**
- 데이터: AI-Hub 142번 데이터셋 24,000건 (초등 학습 수행 평가 텍스트)
- 학습: LoRA rank 16, 4-bit QLoRA, 3 epoch
- 추론: FastAPI 서빙, /api/report에서 GPT-4o와 병렬 호출 (Promise.allSettled)
- 실패 안전: 20초 타임아웃, 실패 시 GPT-4o 결과만으로 리포트 저장

### ■ 토큰 낭비를 최소화하고 유지보수성 및 재현성을 높이기 위한 전략이 있다면 작성해주세요.

1. **CLAUDE.md 컨텍스트 파일**: 프로젝트 구조, 디자인 토큰, 파일 위치를 문서화 → 매 세션 재설명 불필요
2. **메모리 시스템**: 사용자 피드백, 프로젝트 상태, 디자인 시스템을 파일로 저장 → 세션 간 연속성
3. **서브에이전트 위임**: 대규모 코드 작성은 Codex에게 위임 → 오케스트레이터 컨텍스트 절약
4. **자동 컴팩트**: 컨텍스트 60% 도달 시 문서 업데이트 후 컴팩트 → 긴 세션 지속 가능
5. **교육과정 JSON**: NCIC 2022 초등 수학 성취기준을 JSON으로 구조화 → 매번 재입력 불필요

---

## 3. 시연 시나리오 (3분)

### 도입 (30초)
> "소규모 학원 강사는 학생 20명의 피드백에 하루 3시간을 씁니다. 학생이 진짜 이해했는지, 아는 척하는 건지 구분도 어렵습니다. 무니에게 알려줘는 이 문제를 뒤집습니다 — 학생이 AI를 가르칩니다."

### 학생 체험 (1분 30초)
1. `/demo` 접속 → "학생으로 체험하기" 선택
2. 튜토리얼 오버레이가 화면 안내 → "다음" 클릭하며 따라가기
3. "분수의 덧셈" 단원 선택 → 무니와 대화 시작
4. 대본 카드의 설명을 복사하여 입력 → 무니가 꼬리 질문
5. 3~4회 대화 후 "학습 완료" → 자동 리포트 생성 화면
6. 리포트: 이해도 점수, 취약점, 학습 제안, 4대 역량 분석 확인

### 선생님 체험 (1분)
1. `/demo` → "선생님으로 체험하기" 선택
2. 대시보드에서 단원 목록 확인 → 사이드바 "학생 목록" 클릭
3. 학생 클릭 → 세션별 이해도 점수, 역량 점수 확인
4. "학부모 상담 자료 생성" 버튼 → 1클릭으로 상담 자료 완성
5. "반 요약" → 전체 평균, 역량 분석, 약점 TOP, AI 수업 추천

---

## 4. 핵심 화면 설명

### 무니와 대화 (채팅방)
- 우주/달밤 배경에 무니 캐릭터가 상단에 위치
- 학생의 메시지와 무니의 응답이 채팅 형태로 표시
- 음성 입력(Web Speech API) + 텍스트 입력 + 그림판 지원
- 무니 표정이 대화 맥락에 따라 6종 변화 (curious, confused, thinking, happy, oops, impressed)
- 이해도 바가 실시간으로 0-100 업데이트

### 학습 리포트
- GPT-4o가 자동 생성: 이해도 점수, 요약, 취약점 리스트, 학습 제안
- Gemma 4B LoRA 파인튜닝 모델이 4대 핵심역량(자기관리/대인관계/시민/문제해결) 1-5점 분석
- 두 AI가 병렬 호출(Promise.allSettled)되어 속도 최적화

### 선생님 대시보드
- 단원 관리: 교육과정(NCIC 2022) 기반 단원 배정
- 학생별 상세: 세션 히스토리, 이해도 추이, 역량 레이더
- 반 전체 요약: 평균 이해도, 역량 분석 바, 약점 TOP 랭킹, 학생 히트맵
- AI 수업 추천: GPT-4o가 반 데이터 분석 후 맞춤 수업 전략 제안
- 학부모 상담 자료: 1클릭으로 강점/개선점/가정 실천 방안 자동 생성

### 데모 체험 모드
- 회원가입 없이 학생/선생님 플로우 전체 체험
- 튜토리얼 오버레이(스포트라이트 + 툴팁)로 단계별 안내
- 학생 채팅방에서는 대본 카드 제공 (복사 → 입력)
- 하드코딩된 샘플 데이터로 빈 화면 없이 체험

---

## 5. 한계와 Fallback

| 한계 | 대응 |
|------|------|
| OpenAI API 키 없으면 대화 불가 | 데모 모드에서 하드코딩 응답으로 체험 가능 |
| 파인튜닝 모델 서버 다운 | 20초 타임아웃 후 GPT-4o 리포트만 저장 (역량 분석 스킵) |
| 음성 인식 브라우저 미지원 | 텍스트 입력으로 자동 폴백 |
| 초등 수학만 지원 | 교육과정 JSON 구조화로 다른 과목/학년 확장 가능 |
| 동시 접속 부하 | Supabase Edge Functions + Vercel Serverless로 자동 스케일링 |

---

## 6. 참고문헌

1. Chase, C. C., Chin, D. B., Oppezzo, M. A., & Schwartz, D. L. (2009). Teachable Agents and the Protégé Effect. *Journal of Science Education and Technology*, 18(4), 334-352.
2. Jin, H., Lee, S., Shin, H., & Kim, J. (2024). "Teach AI How to Code": Using Large Language Models as Teachable Agents for Programming Education. *CHI 2024*.
3. Grossman, S. et al. (2025). Playing Dumb to Get Smart: Creating and Evaluating an LLM-based Teachable Agent. *CHI 2025*.
4. LLMs Protégés: Tutoring LLMs with Knowledge Gaps Improves Student Learning Outcome. *BEA 2025* (ACL Workshop).
5. AI tutoring can safely and effectively support students: An exploratory RCT in UK classrooms. *Google DeepMind & Eedi*, 2025.
6. AI tutoring outperforms in-class active learning. *Nature Scientific Reports*, 2025.
7. MathSpring RCT: Evaluating the Efficacy of an Intelligent Tutoring System. *Journal of Computer Assisted Learning*, 2025.
8. K-12 AI-driven ITS systematic review. *npj Science of Learning* (Nature), 2025.
9. Zhang et al. (2025). LLM-based Socratic conversational agent effects. *Computers & Education*.
10. 게이미피케이션 메타분석 (g=0.822). *Frontiers in Psychology*, 2023.
11. AI-powered learning analytics dashboards: systematic review. *Discover Education* (Springer), 2025.
