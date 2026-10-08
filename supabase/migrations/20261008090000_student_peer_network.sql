-- Student-to-student connections, the "open to connect" board and study groups.
-- Everything here is readable by student accounts only.

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'student'
  );
$$;

create table if not exists public.student_peer_profiles (
  email text primary key,
  name text not null,
  invite_code text not null unique,
  open_to_connect boolean not null default false,
  headline text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_peer_profiles_open_idx
  on public.student_peer_profiles (open_to_connect, updated_at desc);

create table if not exists public.student_peer_links (
  id uuid primary key default gen_random_uuid(),
  student_a text not null,
  student_b text not null,
  student_a_name text not null,
  student_b_name text not null,
  requested_by text not null,
  created_at timestamptz not null default now(),
  constraint student_peer_links_ordered check (student_a < student_b),
  constraint student_peer_links_pair unique (student_a, student_b)
);

create table if not exists public.student_study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  owner_email text not null,
  members jsonb not null default '[]',
  member_emails text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_study_groups_member_emails_idx
  on public.student_study_groups using gin (member_emails);

create or replace function public.set_student_network_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_student_peer_profiles_updated_at on public.student_peer_profiles;
create trigger set_student_peer_profiles_updated_at
before update on public.student_peer_profiles
for each row execute function public.set_student_network_updated_at();

drop trigger if exists set_student_study_groups_updated_at on public.student_study_groups;
create trigger set_student_study_groups_updated_at
before update on public.student_study_groups
for each row execute function public.set_student_network_updated_at();

alter table public.student_peer_profiles enable row level security;
alter table public.student_peer_links enable row level security;
alter table public.student_study_groups enable row level security;

-- Profiles: students see their own row and anyone who opted into the board.
drop policy if exists "Students read own or open peer profiles" on public.student_peer_profiles;
create policy "Students read own or open peer profiles"
on public.student_peer_profiles for select
using (
  public.is_student()
  and (open_to_connect or email = lower(auth.jwt() ->> 'email'))
);

drop policy if exists "Students create own peer profile" on public.student_peer_profiles;
create policy "Students create own peer profile"
on public.student_peer_profiles for insert
with check (public.is_student() and email = lower(auth.jwt() ->> 'email'));

drop policy if exists "Students update own peer profile" on public.student_peer_profiles;
create policy "Students update own peer profile"
on public.student_peer_profiles for update
using (email = lower(auth.jwt() ->> 'email'))
with check (email = lower(auth.jwt() ->> 'email'));

-- Links: only the two students involved can see or create a friendship.
drop policy if exists "Students read own peer links" on public.student_peer_links;
create policy "Students read own peer links"
on public.student_peer_links for select
using (lower(auth.jwt() ->> 'email') in (student_a, student_b));

drop policy if exists "Students create own peer links" on public.student_peer_links;
create policy "Students create own peer links"
on public.student_peer_links for insert
with check (
  public.is_student()
  and requested_by = lower(auth.jwt() ->> 'email')
  and requested_by in (student_a, student_b)
);

drop policy if exists "Students remove own peer links" on public.student_peer_links;
create policy "Students remove own peer links"
on public.student_peer_links for delete
using (lower(auth.jwt() ->> 'email') in (student_a, student_b));

-- Study groups: members read, owner creates and manages.
drop policy if exists "Members read study groups" on public.student_study_groups;
create policy "Members read study groups"
on public.student_study_groups for select
using (lower(auth.jwt() ->> 'email') = any (member_emails));

drop policy if exists "Students create study groups" on public.student_study_groups;
create policy "Students create study groups"
on public.student_study_groups for insert
with check (
  public.is_student()
  and owner_email = lower(auth.jwt() ->> 'email')
  and owner_email = any (member_emails)
);

drop policy if exists "Owners update study groups" on public.student_study_groups;
create policy "Owners update study groups"
on public.student_study_groups for update
using (owner_email = lower(auth.jwt() ->> 'email'))
with check (owner_email = lower(auth.jwt() ->> 'email'));

drop policy if exists "Owners delete study groups" on public.student_study_groups;
create policy "Owners delete study groups"
on public.student_study_groups for delete
using (owner_email = lower(auth.jwt() ->> 'email'));

-- Resolve a shared invite code without exposing private profiles.
create or replace function public.find_student_by_invite_code(p_code text)
returns table (email text, name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.email, p.name
  from public.student_peer_profiles p
  where public.is_student()
    and p.invite_code = upper(trim(p_code))
  limit 1;
$$;

-- Let a non-owner member remove themselves from a group.
create or replace function public.leave_study_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me text := lower(auth.jwt() ->> 'email');
begin
  update public.student_study_groups
  set
    member_emails = array_remove(member_emails, me),
    members = coalesce((
      select jsonb_agg(m) from jsonb_array_elements(members) m
      where lower(m ->> 'email') <> me
    ), '[]'::jsonb)
  where id = p_group_id
    and me = any (member_emails)
    and owner_email <> me;
end;
$$;

grant execute on function public.find_student_by_invite_code(text) to authenticated;
grant execute on function public.leave_study_group(uuid) to authenticated;
