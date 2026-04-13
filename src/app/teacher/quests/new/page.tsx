import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import QuestFormClient from './QuestFormClient'

export default async function NewQuestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 선생님 반 조회
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, invite_code')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  if (!classes || classes.length === 0) redirect('/teacher')
  const classId = classes[0].id

  // 활성 단원
  const { data: units } = await supabase
    .from('units')
    .select('*')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // 기존 퀘스트
  const { data: quests } = await supabase
    .from('quests')
    .select('*')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // 학생 목록 (admin으로 조회 — RLS 우회)
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('student_id, profiles!inner(id, name)')
    .eq('class_id', classId)

  const students = (enrollments ?? []).map((e: {
    student_id: string
    profiles: { id: string; name: string } | { id: string; name: string }[]
  }) => {
    const p = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles
    return { id: e.student_id, name: p?.name ?? '학생' }
  })

  return (
    <QuestFormClient
      profile={{ name: profile?.name ?? '' }}
      currentClass={{ id: classId, name: classes[0].name ?? '', inviteCode: classes[0].invite_code ?? '' }}
      units={units ?? []}
      students={students}
      existingQuests={quests ?? []}
    />
  )
}
