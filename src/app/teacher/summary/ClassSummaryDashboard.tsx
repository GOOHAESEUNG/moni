'use client'

import type { CompetencyScores } from '@/types/database'

type CoreCompetencyScores = Omit<CompetencyScores, 'comment'>

export interface ClassSummaryData {
  className: string
  profileName: string
  totalStudents: number
  activeStudents: number
  avgScore: number | null
  avgCompetency: CoreCompetencyScores | null
  topWeakPoints: { text: string; count: number }[]
  students: {
    id: string
    name: string
    avgScore: number | null
    sessionCount: number
    latestScore: number | null
  }[]
}

export interface ClassSummaryDashboardProps {
  data: ClassSummaryData
}

export default function ClassSummaryDashboard({ data }: ClassSummaryDashboardProps) {
  return (
    <div className="p-6">
      ClassSummaryDashboard placeholder: {data.className}
    </div>
  )
}
