export type Role = 'teacher' | 'student'
export type Expression = 'curious' | 'confused' | 'thinking' | 'happy' | 'oops' | 'impressed'
export type MessageRole = 'user' | 'assistant'

export interface Profile {
  id: string
  email: string
  name: string
  role: Role
  created_at: string
}

export interface Class {
  id: string
  teacher_id: string
  name: string
  invite_code: string
  created_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  class_id: string
  joined_at: string
}

export interface Unit {
  id: string
  class_id: string
  title: string
  concept: string
  grade_hint: string | null
  is_active: boolean
  created_at: string
}

export interface Session {
  id: string
  student_id: string
  unit_id: string
  started_at: string
  ended_at: string | null
  understanding_score: number | null
  self_reflection: string | null
}

export interface Message {
  id: string
  session_id: string
  role: MessageRole
  content: string
  expression: Expression | null
  created_at: string
}

export interface Report {
  id: string
  session_id: string
  student_id: string
  unit_id: string
  summary: string
  weak_points: string[]
  suggestions: string[]
  created_at: string
}
