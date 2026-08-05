create table if not exists public.connected_announcements (
  id uuid primary key default gen_random_uuid(),
  circle_key text not null,
  sender_role text not null check (sender_role in ('student', 'teacher', 'parent')),
  sender_name text not null,
  sender_email text,
  title text not null,
  body text not null,
  audience text not null default 'all' check (audience in ('all', 'students', 'parents')),
  participant_emails text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists connected_announcements_circle_key_created_idx
  on public.connected_announcements (circle_key, created_at desc);

create index if not exists connected_announcements_participant_emails_idx
  on public.connected_announcements using gin (participant_emails);

alter table public.connected_announcements enable row level security;

drop policy if exists "Connected members can read announcements" on public.connected_announcements;
create policy "Connected members can read announcements"
on public.connected_announcements
for select
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can create announcements" on public.connected_announcements;
create policy "Connected members can create announcements"
on public.connected_announcements
for insert
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);
