---
description: UI/컴포넌트 작업 시 자동 로드되는 디자인 규칙
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# 디자인 규칙

## UI 코드 작성 전 필수
```bash
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "education kids learning mobile app playful" --design-system -p "무니에게 알려줘" -f markdown
```
결과 + `.impeccable.md` 원칙 결합 후 코드 작성.

## 토큰
| 항목 | 값 |
|------|-----|
| font | Nunito |
| primary | `oklch(0.58 0.18 280)` |
| accent | `oklch(0.82 0.12 85)` |
| bg | `oklch(0.98 0.008 280)` |
| radius | 1rem base (카드 rounded-3xl, 버튼 rounded-full) |
| shadow | `shadow-primary/10` — 흰 그림자 금지 |

## 아이콘
- `@phosphor-icons/react` 전용. lucide-react 금지.
- `import { Moon, Star } from '@phosphor-icons/react'`
- 이모지를 네비/버튼 아이콘으로 사용 금지

## 5원칙 (요약)
1. 무니가 주인공 — 캐릭터 먼저
2. 학생은 항상 이긴다 — 에러도 골드 톤
3. 대화 화면 집중 — 네비 숨김
4. 선생님 대시보드 스캔 가능
5. 애니메이션 = 목적 있는 것만

## 금지
- 보라 그라디언트 남발
- Inter 폰트
- 카드 안에 카드 중첩
- 장식용 애니메이션
