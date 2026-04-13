'use client'

import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'

export default function DemoStudentDetailTutorial() {
  return (
    <DemoTutorialOverlay
      storageKey="demo-teacher-student-detail-tutorial"
      steps={[
        {
          targetSelector: '[data-tutorial="report-card"]',
          title: '학습 리포트를 확인하세요',
          description: '이해도 점수, 핵심역량 분석, 약점을 한눈에 볼 수 있어요. "전체 보기"를 눌러 상세 리포트를 확인해보세요.',
          position: 'bottom',
        },
      ]}
    />
  )
}
