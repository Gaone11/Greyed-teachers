alter table public.connected_timetable_items
  add column if not exists class_id uuid,
  add column if not exists class_name text,
  add column if not exists subject text,
  add column if not exists grade text;

create index if not exists connected_timetable_items_class_id_idx
  on public.connected_timetable_items (class_id);
