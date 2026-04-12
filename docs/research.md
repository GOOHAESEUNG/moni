# 무니에게 알려줘 — 학술 근거 자료

## 1. Protégé Effect / Teachable Agent

### Chase et al. (2009) — 핵심 근거 논문
- **제목:** Teachable Agents and the Protégé Effect: Increasing the Effort Towards Learning
- **저자/연도:** Chase, Chin, Oppezzo, Schwartz / 2009 (Stanford AAA Lab)
- **인용:** 314회+
- **핵심 발견:**
  - 8학년 학생이 AI 에이전트("Betty's Brain")를 가르칠 때 자신을 위해 공부할 때보다 더 많은 시간을 독서에 투자하고 실제 학습 결과도 향상
  - 특히 **성취도가 낮은 학생에게 효과 두드러짐**
  - "AI를 가르친다"는 사회적 메타포 자체가 학습 동기를 높이는 핵심 기제
- **출처:** https://link.springer.com/article/10.1007/s10956-009-9180-4

### Jin et al. (CHI 2024, KAIST·Stanford) — 최신 LLM 적용 연구
- **제목:** "Teach AI How to Code": Using Large Language Models as Teachable Agents for Programming Education
- **저자/연도:** Jin, Lee, Shin, Kim / CHI 2024
- **핵심 발견:**
  - LLM 기반 튜티 챗봇(AlgoBo)이 의도적으로 오개념과 모름을 시뮬레이션하고 "왜?"·"어떻게?" 질문을 던지도록 설계
  - 40명 피험자 실험에서 **지식 밀도 높은 대화 효과 크기 0.71 달성**
  - LLM의 '이미 다 아는 척' 문제를 프롬프트 파이프라인으로 제어하는 방법론 제시
- **출처:** https://arxiv.org/abs/2309.14534 / https://dl.acm.org/doi/10.1145/3613904.3642349

### (2024) — ChatGPT Teachable Agent
- **제목:** Learning-by-teaching with ChatGPT: The effect of teachable ChatGPT agent on programming education
- **저자/연도:** 복수 저자 / 2024
- **핵심 발견:**
  - 41명 대학생 실험. 가르침 받는 역할로 설계된 ChatGPT와 대화 시 지식 향상 + 자기조절학습(SRL) 능력 향상
  - 단, AI가 정확한 코드를 내뱉는 특성 탓에 디버깅 훈련에는 한계
- **출처:** https://arxiv.org/abs/2412.15226

---

## 2. Socratic Tutoring AI

### Zhang et al. (Computers & Education, 2025)
- **제목:** Investigating the effects of an LLM-based Socratic conversational agent on students' academic performance and reflective thinking in higher education
- **핵심 발견:**
  - **94명 무작위 대조 실험** (S-ICA vs 일반 대화 에이전트)
  - S-ICA 그룹이 학업 성취·반성적 사고에서 통계적으로 유의미하게 우수
  - 더 고차원 반성 경로 활성화 확인
- **출처:** https://www.sciencedirect.com/science/article/abs/pii/S0360131525002623

### Khanmigo (Khan Academy, 2023~2025 실증)
- **핵심 발견:**
  - GPT-4 기반 소크라테스식 AI 튜터. 직접 답 대신 유도 질문 설계
  - 1년 만에 사용자 68,000 → 700,000명
  - 학생 68%가 ChatGPT보다 Khanmigo의 소크라테스식 접근 선호
  - 수학 어려운 단원에서 좌절감 감소, 마스터리 향상이 인간 튜터 수준에 근접
- **출처:** https://www.khanmigo.ai / https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/

---

## 3. Formative Assessment AI

### Deep Knowledge Tracing (NeurIPS 2015)
- **제목:** Deep Knowledge Tracing
- **저자/연도:** Piech, Bassen 외 / NeurIPS 2015
- **핵심 발견:**
  - RNN으로 학생 학습 궤적을 모델링해 다음 문제 정답률 예측
  - 인간이 직접 도메인 지식을 코딩하지 않아도 됨
  - 이후 Transformer 기반 변형 모델(2022~)이 실시간 이해도 측정의 핵심 기술로 자리잡음
- **출처:** https://www.semanticscholar.org/paper/Deep-Knowledge-Tracing-Piech-Bassen/fa98d609eb14ce25dd73cd8713a5e284948b4ff4

### AI 형성평가 리뷰 (Computers and Education: AI, 2023)
- **제목:** A review of assessment for learning with artificial intelligence
- **핵심 발견:**
  - AI 기반 형성평가는 실시간 피드백, 학습 경로 개인화, 취약 영역 자동 식별에 효과적
  - 단, 타당도·신뢰도가 총괄평가 대비 약하고 교사 데이터 리터러시 요구
- **출처:** https://www.sciencedirect.com/science/article/pii/S2949882123000403

---

## 4. Voice-based Learning

### Alexa 음성 열정 연구 (Education and IT, 2022)
- **제목:** I am Alexa, your virtual tutor!: The effects of Amazon Alexa's text-to-speech voice enthusiasm in a multimedia learning environment
- **핵심 발견:**
  - **244명 아시아 대학생** 대상
  - 음성 열정(enthusiasm) 수준이 학습자 감정 상태·주의·내재 동기·학습 성취에 양의 영향
  - 텍스트 기반 대비 음성 인터페이스의 정서적 차별성 실증
- **출처:** https://link.springer.com/article/10.1007/s10639-022-11255-6

---

## 5. Elementary Math AI Tutor

### MathSpring RCT (Journal of Computer Assisted Learning, 2025)
- **제목:** Evaluating the Efficacy of an Intelligent Tutoring System That Integrates Affective Supports Into Math Learning
- **핵심 발견:**
  - **53명 교사·2003명 초등생(10~12세)** 대상 무작위 대조 실험
  - AI 튜터 사용 그룹이 사전 성취도 통제 후 유의미한 수학 성취 향상
  - 정서 지원(affective support) 포함 설계가 핵심
- **출처:** https://onlinelibrary.wiley.com/doi/abs/10.1111/jcal.70106

### K-12 AI ITS 종합 리뷰 (npj Science of Learning, Nature, 2025)
- **제목:** A systematic review of AI-driven intelligent tutoring systems (ITS) in K-12 education
- **핵심 발견:**
  - HINTS 시스템: 6회(45분) 세션 후 산술 문제 해결력 **26.7% 향상 (효과 크기 d=0.58)**
  - 2019~2023년이 생성형 AI 등장과 함께 ITS 연구 최성기
  - 초등 수학 ITS가 전체 연구의 가장 큰 비중
- **출처:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12078640/

---

## 6. 최신 LLM Teachable Agent 연구 (2025~2026)

### Grossman et al. (CHI 2025) — Playing Dumb to Get Smart
- **제목:** Playing Dumb to Get Smart: Creating and Evaluating an LLM-based Teachable Agent within University Computer Science Classes
- **저자/연도:** Grossman et al. / CHI 2025
- **핵심 발견:**
  - 대학 CS 수업에서 LLM 기반 teachable agent를 평가
  - "멍청한 척하는 AI" 전략이 학생의 능동적 학습 유도에 효과적
  - 무니의 "모르는 척" 설계와 직접적으로 일치하는 방법론
- **출처:** https://dl.acm.org/doi/10.1145/3706598.3713644

### BEA 2025 — LLMs Protégés
- **제목:** LLMs Protégés: Tutoring LLMs with Knowledge Gaps Improves Student Learning Outcome
- **저자/연도:** 복수 저자 / BEA 2025 (ACL Workshop)
- **핵심 발견:**
  - 알고리즘 수업에서 지식 격차가 있는 LLM을 가르친 학생들이 평균 **0.72점(1-6점 척도) 향상**
  - 이 접근이 완전히 도입되면 중간고사 실패율이 28% → 8%로 감소 (**72% 감소**)
  - 프로테제 효과의 LLM 적용 최신 실증
- **출처:** https://aclanthology.org/2025.bea-1.19/

### LLM Teachable Agent in Music Education (arXiv 2025)
- **제목:** Exploring the Impact of an LLM-Powered Teachable Agent on Learning Gains and Cognitive Load in Music Education
- **핵심 발견:**
  - LLM 기반 teachable agent 사용 그룹이 사후 테스트에서 유의미하게 높은 점수
  - 동시에 **인지 부하(cognitive load)가 더 낮음** — 가르치는 행위가 오히려 학습 부담을 줄임
- **출처:** https://arxiv.org/abs/2504.00636

---

## 7. AI 튜터링 RCT 최신 연구 (2025~2026)

### LearnLM RCT (Google DeepMind & Eedi, 2025)
- **제목:** AI tutoring can safely and effectively support students: An exploratory RCT in UK classrooms
- **핵심 발견:**
  - **165명 영국 중등학생** 대상 무작위 대조 실험
  - AI 감독 튜터 사용 학생의 문제 해결 성공률 **66.2%** vs 인간 튜터 **60.7%**
  - 감독 튜터가 AI 메시지의 76.4%를 무수정 승인 — AI 교육 품질의 신뢰성 입증
  - 3,617개 메시지 중 환각(hallucination)은 단 **5건(0.1%)**
- **출처:** https://arxiv.org/abs/2512.23633

### Tutor CoPilot RCT (Stanford, 2024-2025)
- **제목:** Tutor CoPilot: AI-Assisted Human Tutoring
- **핵심 발견:**
  - **1,000명 초등학생** 무작위 배정 (AI 보조 튜터 vs 인간 튜터 단독)
  - AI 보조 조건에서 학생의 주제 마스터리 달성이 **4%p 높음**
  - 경험 부족한 튜터와 함께할 때 효과 최대 (**최대 9%p 향상**)
  - 소규모 학원의 신입 강사 지원에 직접적 시사점
- **출처:** https://arxiv.org/html/2512.23633v1

### AI Tutoring vs Active Learning (Nature Scientific Reports, 2025)
- **제목:** AI tutoring outperforms in-class active learning
- **핵심 발견:**
  - AI 튜터 사용 시 교실 내 능동 학습보다 **더 많이, 더 빨리** 학습
  - 학생들이 더 높은 참여도와 동기를 보고
- **출처:** https://www.nature.com/articles/s41598-025-97652-6

---

## 8. 교사 대시보드 & 학습 분석 (2025)

### AI-Powered Learning Analytics Dashboards (Springer, 2025)
- **제목:** AI-powered learning analytics dashboards: a systematic review of applications, techniques, and research gaps
- **핵심 발견:**
  - AI 기반 학습 분석 대시보드의 체계적 리뷰
  - 학업 성취 예측, 자기조절학습 지원, 교사용 인사이트 제공이 주요 용도
  - **교사의 전문성과 결합될 때** 가장 효과적인 개입 발생
  - 앙상블 학습(AdaBoost, CatBoost)이 가장 높은 예측 성능
- **출처:** https://link.springer.com/article/10.1007/s44217-025-00964-y

---

## 9. 게이미피케이션 + 교육 효과 (2023~2025)

### 게이미피케이션 메타분석 (2023)
- **핵심 발견:**
  - **41개 연구, 5,000명 이상** 메타분석
  - 게이미피케이션의 학습 성과 효과 크기 **g = 0.822 (대효과)**
  - 자기결정이론(SDT)과 구성주의에 기반한 설계일 때 효과 극대화
  - 과도한 경쟁이나 외적 보상 편향 시 효과 감소
- **출처:** https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1253549/full

### AI + 게이미피케이션 통합 (Frontiers in Computer Science, 2025)
- **제목:** Research AI: integrating AI and gamification in higher education
- **핵심 발견:**
  - AI와 게이미피케이션의 통합이 학습 개인화와 핵심 역량 육성에 효과적
  - 무니의 퀘스트/이해도 바/달성 팝업이 이 패러다임에 부합
- **출처:** https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1587040/full

---

## 기획서 바로 쓸 수 있는 문장

> "Stanford의 Chase et al.(2009) 연구에서 AI를 가르친 학생들은 직접 공부한 학생보다 더 높은 학습 성취를 보였으며, CHI 2024(Jin et al.)에서는 LLM 기반 teachable agent의 효과 크기가 0.71로 측정되었다. 특히 성취도가 낮은 학생에게 효과가 두드러져, 소규모 학원의 하위권 학생 관리 문제를 해결할 수 있는 근거를 제공한다."

> "음성 인터페이스를 활용한 학습에서 텍스트 대비 감정·동기·성취에 양의 영향이 확인되었으며(244명, 2022), 이는 초등 저학년 대상 음성 입출력 설계의 근거가 된다."

> "MathSpring의 무작위 대조 실험(2003명 초등생)에서 정서 지원을 포함한 AI 튜터가 통제 그룹 대비 유의미한 수학 성취 향상을 보였고, HINTS 시스템은 6회 세션 후 26.7% 향상(d=0.58)을 달성했다."

> "CHI 2025에서 발표된 'Playing Dumb to Get Smart' 연구는 LLM이 의도적으로 멍청한 척할 때 학생의 능동적 학습이 유도됨을 실증했으며, BEA 2025에서는 지식 격차가 있는 LLM을 가르친 학생의 중간고사 실패율이 28%에서 8%로 72% 감소했다."

> "Google DeepMind의 LearnLM RCT(165명, 2025)에서 AI 튜터 사용 학생의 문제 해결 성공률은 66.2%로 인간 튜터(60.7%)를 상회했으며, Stanford의 Tutor CoPilot RCT(1,000명)에서는 AI 보조 시 학생의 주제 마스터리가 4~9%p 향상되었다."

> "게이미피케이션의 학습 효과를 분석한 메타분석(41개 연구, 5,000명+)에서 효과 크기 g=0.822(대효과)가 확인되었으며, 무니의 퀘스트·이해도 바·달성 팝업은 이 근거에 기반한 설계이다."
