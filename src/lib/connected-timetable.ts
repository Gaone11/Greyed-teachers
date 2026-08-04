import { supabase } from './supabase';
import { ConnectionCircle, ConnectionRole } from './connection-circle';

export type TimetableItemType = 'Class' | 'Meeting' | 'Office Hours' | 'Exam' | 'Event';

export interface ConnectedTimetableItem {
  id: string;
  circle_key: string;
  title: string;
  item_type: TimetableItemType;
  day_label: string;
  item_date?: string | null;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string | null;
  created_by_role: ConnectionRole;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectedTimetableInput {
  title: string;
  item_type: TimetableItemType;
  day_label: string;
  item_date?: string | null;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string;
}

export const CONNECTED_TIMETABLE_UPDATED_EVENT = 'greyed-connected-timetable-updated';

const normalizeIdentityPart = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, '-');

export const getTimetableCircleKey = (circle: ConnectionCircle) => {
  const circleIdentity = (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => {
      const member = circle.members[role];
      return normalizeIdentityPart(member.email || member.name || role);
    })
    .join('|');

  return `greyed-timetable:${circleIdentity}`;
};

export const getTimetableParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => circle.members[role].email.trim().toLowerCase())
    .filter(Boolean);
};

const getTimetableStorageKey = (circleKey: string) => `greyed-connected-timetable:${circleKey}`;

const isMissingTimetableTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_timetable_items.* does not exist/i.test(message)
    || /schema cache.*public\.connected_timetable_items/i.test(message)
    || /could not find the table .*connected_timetable_items/i.test(message);
};

const readLocalTimetableItems = (circleKey: string): ConnectedTimetableItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getTimetableStorageKey(circleKey));
    return stored ? JSON.parse(stored) as ConnectedTimetableItem[] : [];
  } catch {
    return [];
  }
};

const writeLocalTimetableItems = (circleKey: string, items: ConnectedTimetableItem[]) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(getTimetableStorageKey(circleKey), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CONNECTED_TIMETABLE_UPDATED_EVENT, { detail: { circleKey } }));
};

const mergeTimetableItems = (items: ConnectedTimetableItem[]) => {
  const seen = new Set<string>();
  return items
    .filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => {
      const dayCompare = a.day_label.localeCompare(b.day_label);
      if (dayCompare !== 0) return dayCompare;
      return a.start_time.localeCompare(b.start_time);
    });
};

export const formatTimetableTimeRange = (item: Pick<ConnectedTimetableItem, 'start_time' | 'end_time'>) => {
  return `${item.start_time} - ${item.end_time}`;
};

export const loadConnectedTimetableItems = async (
  circle: ConnectionCircle
): Promise<ConnectedTimetableItem[]> => {
  const circleKey = getTimetableCircleKey(circle);
  const localItems = readLocalTimetableItems(circleKey);

  try {
    const { data, error } = await supabase
      .from('connected_timetable_items')
      .select('id,circle_key,title,item_type,day_label,item_date,start_time,end_time,location,notes,created_by_role,created_by_name,created_at,updated_at')
      .eq('circle_key', circleKey)
      .order('day_label', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      if (isMissingTimetableTableError(error)) return localItems;
      throw error;
    }

    const merged = mergeTimetableItems([...(data || []) as ConnectedTimetableItem[], ...localItems]);
    writeLocalTimetableItems(circleKey, merged);
    return merged;
  } catch {
    return localItems;
  }
};

export const saveConnectedTimetableItem = async (
  circle: ConnectionCircle,
  createdByRole: ConnectionRole,
  input: ConnectedTimetableInput
) => {
  const circleKey = getTimetableCircleKey(circle);
  const creator = circle.members[createdByRole];
  const now = new Date().toISOString();
  const item: ConnectedTimetableItem = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    circle_key: circleKey,
    title: input.title.trim(),
    item_type: input.item_type,
    day_label: input.day_label,
    item_date: input.item_date || null,
    start_time: input.start_time,
    end_time: input.end_time,
    location: input.location.trim(),
    notes: input.notes?.trim() || null,
    created_by_role: createdByRole,
    created_by_name: creator.name,
    created_at: now,
    updated_at: now,
  };

  const localItems = mergeTimetableItems([...readLocalTimetableItems(circleKey), item]);
  writeLocalTimetableItems(circleKey, localItems);

  try {
    const { data, error } = await supabase
      .from('connected_timetable_items')
      .insert({
        circle_key: circleKey,
        title: item.title,
        item_type: item.item_type,
        day_label: item.day_label,
        item_date: item.item_date,
        start_time: item.start_time,
        end_time: item.end_time,
        location: item.location,
        notes: item.notes,
        created_by_role: item.created_by_role,
        created_by_name: item.created_by_name,
        participant_emails: getTimetableParticipantEmails(circle),
      })
      .select('id,circle_key,title,item_type,day_label,item_date,start_time,end_time,location,notes,created_by_role,created_by_name,created_at,updated_at')
      .single();

    if (error) {
      if (!isMissingTimetableTableError(error)) throw error;
      return item;
    }

    const savedItem = data as ConnectedTimetableItem;
    const syncedItems = mergeTimetableItems([
      ...readLocalTimetableItems(circleKey).filter(existing => existing.id !== item.id),
      savedItem,
    ]);
    writeLocalTimetableItems(circleKey, syncedItems);
    return savedItem;
  } catch {
    return item;
  }
};
