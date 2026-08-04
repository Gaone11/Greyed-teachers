alter table public.connected_assignments
  add column if not exists attachment_name text,
  add column if not exists attachment_url text,
  add column if not exists attachment_type text;
