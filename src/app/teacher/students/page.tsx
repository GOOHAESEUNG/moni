import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentsClient from './StudentsClient'

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') redirect('/student')

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  const currentClass = classes?.[0]
  if (!currentClass) redirect('/teacher')

  // 학생 목록
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student_id, profiles!inner(id, name, email)')
    .eq('class_id', currentClass.id)

  const students = (enrollments ?? []).map((e: { student_id: string; profiles: { id: string; name: string; email: string } | { id: string; name: string; email: string }[] }) => {
    const p = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles
    return { id: e.student_id, name: p?.name ?? '학생', email: p?.email ?? '' }
  })

  // 각 학생의 최근 리포트
  const { data: reports } = await supabase
    .from('reports')
    .select('id, student_id, unit_id, summary, weak_points, created_at')
    .in('student_id', students.map((s: { id: string }) => s.id))
    .order('created_at', { ascending: false })

  return (
    <StudentsClient
      currentClass={currentClass}
      students={students}
      reports={reports ?? []}
    />
  )
}
