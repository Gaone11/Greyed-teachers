import { supabase } from './supabase';
import { ConnectionCircle, ConnectionRole } from './connection-circle';

export type AnnouncementAudience = 'all' | 'students' | 'parents';

export interface ConnectedAnnouncement {
  id: string;
  circle_key: string;
  sender_role: ConnectionRole;
  sender_name: string;
  sender_email?: string | null;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  created_at: string;
}

export interface ConnectedAnnouncementInput {
  title: string;
  body: string;
  audience?: AnnouncementAudience;
}

export const CONNECTED_ANNOUNCEMENTS_UPDATED_EVENT = 'greyed-connected-announcements-updated';

const normalizeIdentityPart = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, '-');

export const getAnnouncementCircleKey = (circle: ConnectionCircle) => {
  const circleIdentity = (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => {
      const member = circle.members[role];
      return normalizeIdentityPart(member.email || member.name || role);
    })
    .join('|');

  return `greyed-announcements:${circleIdentity}`;
};

const getAnnouncementParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => circle.members[role].email.trim().toLowerCase())
    .filter(Boolean);
};

const getAnnouncementStorageKey = (circleKey: string) => `greyed-connected-announcements:${circleKey}`;

const isMissingAnnouncementsTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_announcements.* does not exist/i.test(message)
    || /schema cache.*public\.connected_announcements/i.test(message)
    || /could not find the table .*connected_announcements/i.test(message);
};

const readLocalAnnouncements = (circleKey: string): ConnectedAnnouncement[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getAnnouncementStorageKey(circleKey));
    return stored ? JSON.parse(stored) as ConnectedAnnouncement[] : [];
  } catch {
    return [];
  }
};

const writeLocalAnnouncements = (circleKey: string, announcements: ConnectedAnnouncement[]) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(getAnnouncementStorageKey(circleKey), JSON.stringify(announcements));
  window.dispatchEvent(new CustomEvent(CONNECTED_ANNOUNCEMENTS_UPDATED_EVENT, { detail: { circleKey } }));
};

const mergeAnnouncements = (announcements: ConnectedAnnouncement[]) => {
  const seen = new Set<string>();
  return announcements
    .filter(announcement => {
      if (seen.has(announcement.id)) return false;
      seen.add(announcement.id);
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const loadConnectedAnnouncements = async (
  circle: ConnectionCircle
): Promise<ConnectedAnnouncement[]> => {
  const circleKey = getAnnouncementCircleKey(circle);
  const localAnnouncements = readLocalAnnouncements(circleKey);

  try {
    const { data, error } = await supabase
      .from('connected_announcements')
      .select('id,circle_key,sender_role,sender_name,sender_email,title,body,audience,created_at')
      .eq('circle_key', circleKey)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingAnnouncementsTableError(error)) return localAnnouncements;
      throw error;
    }

    const merged = mergeAnnouncements([...(data || []) as ConnectedAnnouncement[], ...localAnnouncements]);
    writeLocalAnnouncements(circleKey, merged);
    return merged;
  } catch {
    return localAnnouncements;
  }
};

export const publishConnectedAnnouncement = async (
  circle: ConnectionCircle,
  senderRole: ConnectionRole,
  input: ConnectedAnnouncementInput
) => {
  const circleKey = getAnnouncementCircleKey(circle);
  const sender = circle.members[senderRole];
  const announcement: ConnectedAnnouncement = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    circle_key: circleKey,
    sender_role: senderRole,
    sender_name: sender.name,
    sender_email: sender.email,
    title: input.title.trim(),
    body: input.body.trim(),
    audience: input.audience || 'all',
    created_at: new Date().toISOString(),
  };

  writeLocalAnnouncements(circleKey, mergeAnnouncements([announcement, ...readLocalAnnouncements(circleKey)]));

  try {
    const { data, error } = await supabase
      .from('connected_announcements')
      .insert({
        circle_key: circleKey,
        sender_role: announcement.sender_role,
        sender_name: announcement.sender_name,
        sender_email: announcement.sender_email,
        title: announcement.title,
        body: announcement.body,
        audience: announcement.audience,
        participant_emails: getAnnouncementParticipantEmails(circle),
      })
      .select('id,circle_key,sender_role,sender_name,sender_email,title,body,audience,created_at')
      .single();

    if (error) {
      if (!isMissingAnnouncementsTableError(error)) throw error;
      return announcement;
    }

    const savedAnnouncement = data as ConnectedAnnouncement;
    writeLocalAnnouncements(circleKey, mergeAnnouncements([
      savedAnnouncement,
      ...readLocalAnnouncements(circleKey).filter(existing => existing.id !== announcement.id),
    ]));
    return savedAnnouncement;
  } catch {
    return announcement;
  }
};
