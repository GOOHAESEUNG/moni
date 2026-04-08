-- 무니에게 알려줘 — DB 스키마

-- 1. 사용자 (Supabase Auth 연동)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz default now()
);

-- 2. 반 (선생님이 만드는 클래스)
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  invite_code text unique not null default substring(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

-- 3. 수강 등록 (학생-반 연결)
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(student_id, class_id)
);

-- 4. 학습 단원 (선생님이 만드는 학습 주제)
create table public.units (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade not null,
  title text not null,
  concept text not null,
  grade_hint text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. 학습 세션 (학생 1회 대화)
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  unit_id uuid references public.units(id) on delete cascade not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  understanding_score integer check (understanding_score between 0 and 100),
  self_reflection text
);

-- 6. 대화 메시지
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  expression text check (expression in ('curious', 'confused', 'thinking', 'happy', 'oops', 'impressed')),
  created_at timestamptz default now()
);

-- 7. 리포트 (세션 종료 후 AI 분석)
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  unit_id uuid references public.units(id) on delete cascade not null,
  summary text not null,
  weak_points text[] default '{}',
  suggestions text[] default '{}',
  created_at timestamptz default now()
);

-- RLS 정책

-- profiles: 본인만 읽기/수정
alter table public.profiles enable row level security;
create policy "본인 프로필 조회" on public.profiles for select using (auth.uid() = id);
create policy "본인 프로필 수정" on public.profiles for update using (auth.uid() = id);
create policy "프로필 생성" on public.profiles for insert with check (auth.uid() = id);

-- classes: 선생님 본인만 CRUD, 소속 학생은 읽기
alter table public.classes enable row level security;
create policy "선생님 반 관리" on public.classes for all using (teacher_id = auth.uid());
create policy "학생 반 조회" on public.classes for select using (
  exists (select 1 from public.enrollments where class_id = id and student_id = auth.uid())
);

-- enrollments: 본인 등록 정보 조회
alter table public.enrollments enable row level security;
create policy "본인 수강 조회" on public.enrollments for select using (student_id = auth.uid());
create policy "수강 등록" on public.enrollments for insert with check (student_id = auth.uid());
create policy "선생님 수강 조회" on public.enrollments for select using (
  exists (select 1 from public.classes where id = class_id and teacher_id = auth.uid())
);

-- units: 소속 클래스 멤버만 조회, 선생님만 생성/수정
alter table public.units enable row level security;
create policy "선생님 단원 관리" on public.units for all using (
  exists (select 1 from public.classes where id = class_id and teacher_id = auth.uid())
);
create policy "학생 단원 조회" on public.units for select using (
  exists (
    select 1 from public.enrollments e
    join public.classes c on c.id = e.class_id
    where c.id = class_id and e.student_id = auth.uid()
  )
);

-- sessions: 본인 세션 + 담당 선생님
alter table public.sessions enable row level security;
create policy "본인 세션" on public.sessions for all using (student_id = auth.uid());
create policy "선생님 세션 조회" on public.sessions for select using (
  exists (
    select 1 from public.units u
    join public.classes c on c.id = u.class_id
    where u.id = unit_id and c.teacher_id = auth.uid()
  )
);

-- messages: 세션 소유자만
alter table public.messages enable row level security;
create policy "세션 메시지 접근" on public.messages for all using (
  exists (select 1 from public.sessions where id = session_id and student_id = auth.uid())
);
create policy "선생님 메시지 조회" on public.messages for select using (
  exists (
    select 1 from public.sessions s
    join public.units u on u.id = s.unit_id
    join public.classes c on c.id = u.class_id
    where s.id = session_id and c.teacher_id = auth.uid()
  )
);

-- reports: 본인 + 담당 선생님
alter table public.reports enable row level security;
create policy "본인 리포트" on public.reports for all using (student_id = auth.uid());
create policy "선생님 리포트 조회" on public.reports for select using (
  exists (
    select 1 from public.units u
    join public.classes c on c.id = u.class_id
    where u.id = unit_id and c.teacher_id = auth.uid()
  )
);

-- Auth 트리거: 회원가입 시 profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
