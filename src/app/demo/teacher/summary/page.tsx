'use client'

import ClassSummaryDashboard, { type ClassSummaryData } from '@/app/teacher/summary/ClassSummaryDashboard'
import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'

const DEMO_DATA: ClassSummaryData = {
  className: '3학년2반',
  profileName: '이선생',
  totalStudents: 5,
  activeStudents: 4,
  avgScore: 74,
  avgCompetency: {
    자기관리역량: 3.5,
    대인관계역량: 4.0,
    시민역량: 3.0,
    문제해결역량: 3.5,
  },
  topWeakPoints: [
    { text: '평행사변형넓이원리', count: 3 },
    { text: '단위cm2의미연결', count: 2 },
    { text: '삼각형높이개념', count: 2 },
  ],
  students: [
    { id: 's1', name: '김지민', avgScore: 88, sessionCount: 2, latestScore: 88 },
    { id: 's2', name: '박서연', avgScore: 72, sessionCount: 1, latestScore: 72 },
    { id: 's3', name: '이준혁', avgScore: 45, sessionCount: 1, latestScore: 45 },
    { id: 's4', name: '최수아', avgScore: 91, sessionCount: 1, latestScore: 91 },
    { id: 's5', name: '정민준', avgScore: null, sessionCount: 0, latestScore: null },
  ],
}

export default function DemoTeacherSummaryPage() {
  return (
    <>
      <ClassSummaryDashboard data={DEMO_DATA} classId="demo-class" demoMode />
      <DemoTutorialOverlay
        storageKey="demo-teacher-summary-tutorial"
        steps={[
          {
            targetSelector: '[data-tutorial="stats-cards"]',
            title: '반 전체 현황을 확인하세요',
            description: '평균 이해도, 참여율, 총 학습 횟수를 한눈에 볼 수 있어요.',
            position: 'bottom',
          },
          {
            targetSelector: '[data-tutorial="ai-suggestion"]',
            title: 'AI 수업 추천을 받아보세요',
            description: '버튼을 눌러 GPT-4o가 분석한 맞춤 수업 전략을 확인해보세요!',
            position: 'top',
          },
        ]}
      />
    </>
  )
}
