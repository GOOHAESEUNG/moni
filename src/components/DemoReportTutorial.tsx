'use client'

import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'

export default function DemoReportTutorial() {
  return (
    <DemoTutorialOverlay
      storageKey="demo-student-report-tutorial"
      steps={[
        {
          targetSelector: '[data-tutorial="score-card"]',
          title: '이해도 점수를 확인하세요',
          description: '무니와의 대화에서 학생이 얼마나 잘 설명했는지 AI가 자동으로 평가한 점수예요.',
          position: 'bottom',
        },
        {
          targetSelector: '[data-tutorial="competency"]',
          title: '핵심역량 분석도 확인해보세요',
          description: '자체 파인튜닝 AI가 4대 핵심역량을 분석한 결과예요. 선생님 대시보드에도 이 정보가 전달돼요.',
          position: 'top',
        },
      ]}
    />
  )
}
