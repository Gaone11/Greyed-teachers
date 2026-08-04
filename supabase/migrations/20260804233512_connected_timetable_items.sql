create table if not exists public.connected_timetable_items (
  id uuid primary key default gen_random_uuid(),
  circle_key text not null,
  title text not null,
  item_type text not null default 'Class',
  day_label text not null,
  item_date date,
  start_time text not null,
  end_time text not null,
  location text not null default '',
  notes text,
  created_by_role text not null check (created_by_role in ('student', 'teacher', 'parent')),
  created_by_name text not null default '',
  participant_emails text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists connected_timetable_items_circle_key_idx
  on public.connected_timetable_items (circle_key);

create index if not exists connected_timetable_items_participant_emails_idx
  on public.connected_timetable_items using gin (participant_emails);

create or replace function public.set_connected_timetable_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_connected_timetable_items_updated_at on public.connected_timetable_items;

create trigger set_connected_timetable_items_updated_at
before update on public.connected_timetable_items
for each row
execute function public.set_connected_timetable_items_updated_at();

alter table public.connected_timetable_items enable row level security;

drop policy if exists "Connected members can read timetable items" on public.connected_timetable_items;
create policy "Connected members can read timetable items"
on public.connected_timetable_items
for select
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can add timetable items" on public.connected_timetable_items;
create policy "Connected members can add timetable items"
on public.connected_timetable_items
for insert
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can update timetable items" on public.connected_timetable_items;
create policy "Connected members can update timetable items"
on public.connected_timetable_items
for update
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
)
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);
