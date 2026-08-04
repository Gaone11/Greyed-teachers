create table if not exists public.connected_assignments (
  id uuid primary key default gen_random_uuid(),
  circle_key text not null,
  source_assessment_id text,
  class_id uuid,
  class_name text,
  subject text,
  grade_level text,
  title text not null,
  assignment_type text not null default 'assessment',
  topic text,
  description text,
  content text,
  due_at timestamptz,
  status text not null default 'assigned' check (status in ('assigned', 'submitted', 'graded')),
  student_name text not null default '',
  student_email text,
  teacher_name text not null default '',
  teacher_email text,
  participant_emails text[] not null default '{}',
  score numeric,
  max_score numeric not null default 100,
  grade_label text,
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists connected_assignments_circle_key_idx
  on public.connected_assignments (circle_key);

create index if not exists connected_assignments_class_id_idx
  on public.connected_assignments (class_id);

create index if not exists connected_assignments_participant_emails_idx
  on public.connected_assignments using gin (participant_emails);

create or replace function public.set_connected_assignments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_connected_assignments_updated_at on public.connected_assignments;

create trigger set_connected_assignments_updated_at
before update on public.connected_assignments
for each row
execute function public.set_connected_assignments_updated_at();

alter table public.connected_assignments enable row level security;

drop policy if exists "Connected members can read assignments" on public.connected_assignments;
create policy "Connected members can read assignments"
on public.connected_assignments
for select
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can add assignments" on public.connected_assignments;
create policy "Connected members can add assignments"
on public.connected_assignments
for insert
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can update assignments" on public.connected_assignments;
create policy "Connected members can update assignments"
on public.connected_assignments
for update
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
)
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);
