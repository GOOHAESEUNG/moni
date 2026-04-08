-- 순환 참조 없는 단순한 RLS 재작성

-- === classes ===
DROP POLICY IF EXISTS "teachers_own_classes" ON public.classes;
DROP POLICY IF EXISTS "students_enrolled_classes" ON public.classes;

-- 선생님: 본인 반만
CREATE POLICY "teacher_classes" ON public.classes
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- === enrollments ===
DROP POLICY IF EXISTS "students_own_enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "teachers_view_enrollments" ON public.enrollments;

-- 학생: 본인 등록만
CREATE POLICY "student_enrollments" ON public.enrollments
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 선생님: 본인 반의 등록 조회
CREATE POLICY "teacher_enrollments" ON public.enrollments
  FOR SELECT TO authenticated
  USING (
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

-- === units ===
DROP POLICY IF EXISTS "teachers_manage_units" ON public.units;
DROP POLICY IF EXISTS "students_view_units" ON public.units;

-- 선생님: 본인 반의 단원 관리
CREATE POLICY "teacher_units" ON public.units
  FOR ALL TO authenticated
  USING (class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid()))
  WITH CHECK (class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid()));

-- 학생: 소속 반의 단원 조회
CREATE POLICY "student_units" ON public.units
  FOR SELECT TO authenticated
  USING (class_id IN (SELECT class_id FROM public.enrollments WHERE student_id = auth.uid()));

-- === sessions ===
DROP POLICY IF EXISTS "students_own_sessions" ON public.sessions;
DROP POLICY IF EXISTS "teachers_view_sessions" ON public.sessions;

CREATE POLICY "student_sessions" ON public.sessions
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "teacher_sessions" ON public.sessions
  FOR SELECT TO authenticated
  USING (
    unit_id IN (
      SELECT id FROM public.units
      WHERE class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
    )
  );

-- === messages ===
DROP POLICY IF EXISTS "students_own_messages" ON public.messages;
DROP POLICY IF EXISTS "teachers_view_messages" ON public.messages;

CREATE POLICY "student_messages" ON public.messages
  FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM public.sessions WHERE student_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM public.sessions WHERE student_id = auth.uid()));

CREATE POLICY "teacher_messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT s.id FROM public.sessions s
      JOIN public.units u ON u.id = s.unit_id
      WHERE u.class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
    )
  );

-- === reports ===
DROP POLICY IF EXISTS "students_own_reports" ON public.reports;
DROP POLICY IF EXISTS "teachers_view_reports" ON public.reports;

CREATE POLICY "student_reports" ON public.reports
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "teacher_reports" ON public.reports
  FOR SELECT TO authenticated
  USING (
    unit_id IN (
      SELECT id FROM public.units
      WHERE class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
    )
  );
