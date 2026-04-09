import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
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

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: enrollments } = await admin
    .from('enrollments')
    .select('student_id, profiles!inner(id, name, email)')
    .eq('class_id', currentClass.id)

  const students = (enrollments ?? []).map((e: { student_id: string; profiles: { id: string; name: string; email: string } | { id: string; name: string; email: string }[] }) => {
    const p = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles
    return { id: e.student_id, name: p?.name ?? '학생', email: p?.email ?? '' }
  })

  const { data: reports } = await admin
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
