'use client'

import ClassSummaryDashboard, { type ClassSummaryData } from '@/app/teacher/summary/ClassSummaryDashboard'

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
  return <ClassSummaryDashboard data={DEMO_DATA} classId="demo-class" demoMode />
}
