import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeacherLayoutClient from './TeacherLayoutClient'
import type { ReactNode } from 'react'

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') redirect('/student')

  return (
    <TeacherLayoutClient teacherName={profile.name}>
      {children}
    </TeacherLayoutClient>
  )
}
