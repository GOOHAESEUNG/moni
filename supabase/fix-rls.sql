-- 기존 RLS 정책 제거 후 올바르게 재생성

-- classes
DROP POLICY IF EXISTS "선생님 반 관리" ON public.classes;
DROP POLICY IF EXISTS "학생 반 조회" ON public.classes;

CREATE POLICY "teachers_own_classes" ON public.classes
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "students_enrolled_classes" ON public.classes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE class_id = id AND student_id = auth.uid()
    )
  );

-- units
DROP POLICY IF EXISTS "선생님 단원 관리" ON public.units;
DROP POLICY IF EXISTS "학생 단원 조회" ON public.units;

CREATE POLICY "teachers_manage_units" ON public.units
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND teacher_id = auth.uid())
  );

CREATE POLICY "students_view_units" ON public.units
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.classes c ON c.id = e.class_id
      WHERE c.id = class_id AND e.student_id = auth.uid()
    )
  );

-- enrollments
DROP POLICY IF EXISTS "본인 수강 조회" ON public.enrollments;
DROP POLICY IF EXISTS "수강 등록" ON public.enrollments;
DROP POLICY IF EXISTS "선생님 수강 조회" ON public.enrollments;

CREATE POLICY "students_own_enrollments" ON public.enrollments
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "teachers_view_enrollments" ON public.enrollments
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND teacher_id = auth.uid())
  );

-- sessions
DROP POLICY IF EXISTS "본인 세션" ON public.sessions;
DROP POLICY IF EXISTS "선생님 세션 조회" ON public.sessions;

CREATE POLICY "students_own_sessions" ON public.sessions
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "teachers_view_sessions" ON public.sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.classes c ON c.id = u.class_id
      WHERE u.id = unit_id AND c.teacher_id = auth.uid()
    )
  );

-- messages
DROP POLICY IF EXISTS "세션 메시지 접근" ON public.messages;
DROP POLICY IF EXISTS "선생님 메시지 조회" ON public.messages;

CREATE POLICY "students_own_messages" ON public.messages
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND student_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND student_id = auth.uid())
  );

CREATE POLICY "teachers_view_messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      JOIN public.units u ON u.id = s.unit_id
      JOIN public.classes c ON c.id = u.class_id
      WHERE s.id = session_id AND c.teacher_id = auth.uid()
    )
  );

-- reports
DROP POLICY IF EXISTS "본인 리포트" ON public.reports;
DROP POLICY IF EXISTS "선생님 리포트 조회" ON public.reports;

CREATE POLICY "students_own_reports" ON public.reports
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "teachers_view_reports" ON public.reports
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.classes c ON c.id = u.class_id
      WHERE u.id = unit_id AND c.teacher_id = auth.uid()
    )
  );
