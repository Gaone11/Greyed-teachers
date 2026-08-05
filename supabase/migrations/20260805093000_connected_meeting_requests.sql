create table if not exists public.connected_meeting_requests (
  id uuid primary key default gen_random_uuid(),
  circle_key text not null,
  parent_name text not null,
  parent_email text,
  teacher_name text not null,
  teacher_email text,
  student_name text not null,
  student_email text,
  requested_date date not null,
  requested_time time not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  participant_emails text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists connected_meeting_requests_circle_key_created_idx
  on public.connected_meeting_requests (circle_key, created_at desc);

create index if not exists connected_meeting_requests_teacher_email_idx
  on public.connected_meeting_requests (lower(teacher_email));

create index if not exists connected_meeting_requests_participant_emails_idx
  on public.connected_meeting_requests using gin (participant_emails);

create or replace function public.set_connected_meeting_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_connected_meeting_requests_updated_at on public.connected_meeting_requests;

create trigger set_connected_meeting_requests_updated_at
before update on public.connected_meeting_requests
for each row
execute function public.set_connected_meeting_requests_updated_at();

alter table public.connected_meeting_requests enable row level security;

drop policy if exists "Connected members can read meeting requests" on public.connected_meeting_requests;
create policy "Connected members can read meeting requests"
on public.connected_meeting_requests
for select
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can create meeting requests" on public.connected_meeting_requests;
create policy "Connected members can create meeting requests"
on public.connected_meeting_requests
for insert
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can update meeting requests" on public.connected_meeting_requests;
create policy "Connected members can update meeting requests"
on public.connected_meeting_requests
for update
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
)
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);
