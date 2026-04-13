'use client'

import Link from 'next/link'
import { BookOpen, ChartBar, Trophy, Users } from '@phosphor-icons/react'
import { MoonStarIcon } from '@/components/icons'
import DemoTutorialOverlay from '@/components/DemoTutorialOverlay'

const DEMO_TEACHER = { name: '이선생' }
const DEMO_CLASS = { name: '3학년 2반', inviteCode: 'ABC123' }
const DEMO_STUDENTS = [
  {
    id: 's1', name: '김지민', email: 'jimin@demo.com',
    score: 88, summary: '직사각형과 삼각형의 넓이 공식을 정확히 이해하고 원리까지 설명함.',
    weakPoints: ['평행사변형 넓이 혼동'],
  },
  {
    id: 's2', name: '박서연', email: 'seoyeon@demo.com',
    score: 72, summary: '기본 공식은 알고 있지만 원리 설명에 어려움을 겪음.',
    weakPoints: ['단위 의미 불명확'],
  },
  {
    id: 's3', name: '이준혁', email: 'junhyeok@demo.com',
    score: 45, summary: '직사각형 넓이는 구할 수 있지만 다른 도형으로 확장이 어려움.',
    weakPoints: ['삼각형 높이 개념 불명확'],
  },
  {
    id: 's4', name: '최수아', email: 'sua@demo.com',
    score: 91, summary: '모든 도형의 넓이 원리를 명확히 설명하고 응용까지 이해.',
    weakPoints: [],
  },
  {
    id: 's5', name: '정민준', email: 'minjun@demo.com',
    score: null, summary: null,
    weakPoints: [],
  },
]

function ScorePill({ score }: { score: number | null }) {
  if (score == null) return null
  const color = score >= 80 ? '#4CAF50' : score >= 60 ? '#C8A020' : '#FF9600'
  const bg = score >= 80 ? '#4CAF5020' : score >= 60 ? '#E8C54720' : '#FF960020'
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
      {score}점
    </span>
  )
}

function LeftNav() {
  return (
    <aside className="hidden md:flex w-[220px] shrink-0 flex-col overflow-y-auto" style={{ background: '#13112A' }}>
      <div className="px-5 pt-8 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          
          <span className="text-lg text-white" style={{ fontFamily: "'Berkshire Swash', cursive" }}>Moni</span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold shrink-0"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547' }}>이</div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-white truncate">{DEMO_TEACHER.name} 선생님</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{DEMO_CLASS.name}</p>
          </div>
        </div>
        <span className="mt-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(232,197,71,0.18)', color: '#E8C547' }}>체험 모드</span>
      </div>
      <div className="flex-1 px-3 py-4 space-y-1">
        <Link href="/demo/teacher" className="flex items-center gap-3 rounded-full px-3 py-2.5"
          style={{ color: 'rgba(255,255,255,0.55)' }}>
          <BookOpen size={18} /><span className="text-sm font-semibold">단원 관리</span>
        </Link>
        <div className="flex items-center gap-3 rounded-full px-3 py-2.5" style={{ background: 'rgba(232,197,71,0.14)', color: '#E8C547' }}>
          <Users size={18} weight="fill" /><span className="text-sm font-extrabold">학생 목록</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(232,197,71,0.15)', color: '#E8C547' }}>{DEMO_STUDENTS.length}</span>
        </div>
        <div className="flex items-center gap-3 rounded-full px-3 py-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <Trophy size={18} /><span className="text-sm font-semibold">퀘스트</span>
        </div>
        <Link href="/demo/teacher/summary" className="flex items-center gap-3 rounded-full px-3 py-2.5 transition-colors hover:bg-white/[0.06]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <ChartBar size={18} /><span className="text-sm font-semibold">반 요약</span>
        </Link>
      </div>
    </aside>
  )
}

export default function DemoStudentsPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F2F1FA' }}>
      <LeftNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 flex items-center gap-3 shrink-0"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
          <h1 className="font-extrabold text-xl" style={{ color: '#2D2F2F' }}>학생 목록</h1>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(232,197,71,0.18)', color: '#9B7E00' }}>{DEMO_STUDENTS.length}명</span>
          <span className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(232,197,71,0.25)', color: '#9B7E00' }}>체험 모드</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div
            className="mb-5 w-full rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ background: 'rgba(232,197,71,0.16)', color: '#9B7E00', border: '1px solid rgba(232,197,71,0.30)' }}
          >
            샘플 데이터 · 실제 데이터는 회원가입 후 확인 가능
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-tutorial="student-cards">
            {DEMO_STUDENTS.map((student, idx) => (
              <div key={student.id} className="p-5" {...(idx === 0 ? { 'data-tutorial': 'first-student' } : {})}
                style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #ECEAF6' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: '#F4F2FF', color: '#7C6FBF' }}>
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm" style={{ color: '#2D2F2F' }}>{student.name}</p>
                      <p className="text-xs" style={{ color: '#9EA0B4' }}>{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScorePill score={student.score} />
                    <Link
                      href={`/demo/teacher/students/${student.id}`}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                      style={{ background: '#F4F2FF', color: '#7C6FBF' }}
                    >
                      <ChartBar size={13} weight="bold" />리포트
                    </Link>
                  </div>
                </div>

                {student.summary ? (
                  <div className="rounded-2xl p-3" style={{ background: '#F7F7FB' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#9EA0B4' }}>최근 리포트</p>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#2D2F2F' }}>{student.summary}</p>
                    {student.weakPoints.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {student.weakPoints.map((wp, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: 'rgba(255,150,0,0.12)', color: '#CC7000' }}>{wp}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl p-3" style={{ background: '#F7F7FB' }}>
                    <p className="text-xs" style={{ color: '#C0C0D0' }}>아직 세션 기록이 없어요</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DemoTutorialOverlay
        storageKey="demo-teacher-students-tutorial"
        steps={[
          {
            targetSelector: '[data-tutorial="first-student"]',
            title: '학생 카드를 확인해보세요',
            description: '각 학생의 최근 이해도 점수와 약점을 한눈에 볼 수 있어요. "리포트" 버튼을 눌러 상세 내용을 확인해보세요.',
            position: 'bottom',
          },
        ]}
      />
    </div>
  )
}
