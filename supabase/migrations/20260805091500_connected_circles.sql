create table if not exists public.connected_circles (
  id uuid primary key default gen_random_uuid(),
  circle_key text not null unique,
  participant_emails text[] not null default '{}',
  circle_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists connected_circles_participant_emails_idx
  on public.connected_circles using gin (participant_emails);

create or replace function public.set_connected_circles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_connected_circles_updated_at on public.connected_circles;

create trigger set_connected_circles_updated_at
before update on public.connected_circles
for each row
execute function public.set_connected_circles_updated_at();

alter table public.connected_circles enable row level security;

drop policy if exists "Connected members can read circles" on public.connected_circles;
create policy "Connected members can read circles"
on public.connected_circles
for select
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can create circles" on public.connected_circles;
create policy "Connected members can create circles"
on public.connected_circles
for insert
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);

drop policy if exists "Connected members can update circles" on public.connected_circles;
create policy "Connected members can update circles"
on public.connected_circles
for update
using (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
)
with check (
  lower(auth.jwt() ->> 'email') = any (participant_emails)
);
