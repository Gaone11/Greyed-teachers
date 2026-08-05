import { supabase } from './supabase';
import { ConnectionCircle, ConnectionRole } from './connection-circle';

export type MeetingRequestStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectedMeetingRequest {
  id: string;
  circle_key: string;
  parent_name: string;
  parent_email?: string | null;
  teacher_name: string;
  teacher_email?: string | null;
  student_name: string;
  student_email?: string | null;
  requested_date: string;
  requested_time: string;
  reason: string;
  status: MeetingRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface ConnectedMeetingRequestInput {
  requested_date: string;
  requested_time: string;
  reason: string;
}

export const CONNECTED_MEETINGS_UPDATED_EVENT = 'greyed-connected-meetings-updated';

const normalizeIdentityPart = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, '-');

export const getMeetingCircleKey = (circle: ConnectionCircle) => {
  const circleIdentity = (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => {
      const member = circle.members[role];
      return normalizeIdentityPart(member.email || member.name || role);
    })
    .join('|');

  return `greyed-meetings:${circleIdentity}`;
};

const getMeetingParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => circle.members[role].email.trim().toLowerCase())
    .filter(Boolean);
};

const getMeetingStorageKey = (circleKey: string) => `greyed-connected-meetings:${circleKey}`;

const isMissingMeetingsTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_meeting_requests.* does not exist/i.test(message)
    || /schema cache.*public\.connected_meeting_requests/i.test(message)
    || /could not find the table .*connected_meeting_requests/i.test(message);
};

const readLocalMeetingRequests = (circleKey: string): ConnectedMeetingRequest[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getMeetingStorageKey(circleKey));
    return stored ? JSON.parse(stored) as ConnectedMeetingRequest[] : [];
  } catch {
    return [];
  }
};

const writeLocalMeetingRequests = (circleKey: string, requests: ConnectedMeetingRequest[]) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(getMeetingStorageKey(circleKey), JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent(CONNECTED_MEETINGS_UPDATED_EVENT, { detail: { circleKey } }));
};

const mergeMeetingRequests = (requests: ConnectedMeetingRequest[]) => {
  const seen = new Set<string>();
  return requests
    .filter(request => {
      if (seen.has(request.id)) return false;
      seen.add(request.id);
      return true;
    })
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
};

const replaceMeetingRequest = (
  requests: ConnectedMeetingRequest[],
  updated: ConnectedMeetingRequest
) => mergeMeetingRequests([
  updated,
  ...requests.filter(request => request.id !== updated.id),
]);

export const loadConnectedMeetingRequests = async (
  circle: ConnectionCircle
): Promise<ConnectedMeetingRequest[]> => {
  const circleKey = getMeetingCircleKey(circle);
  const localRequests = readLocalMeetingRequests(circleKey);

  try {
    const { data, error } = await supabase
      .from('connected_meeting_requests')
      .select('id,circle_key,parent_name,parent_email,teacher_name,teacher_email,student_name,student_email,requested_date,requested_time,reason,status,created_at,updated_at')
      .eq('circle_key', circleKey)
      .order('updated_at', { ascending: false });

    if (error) {
      if (isMissingMeetingsTableError(error)) return localRequests;
      throw error;
    }

    const merged = mergeMeetingRequests([...(data || []) as ConnectedMeetingRequest[], ...localRequests]);
    writeLocalMeetingRequests(circleKey, merged);
    return merged;
  } catch {
    return localRequests;
  }
};

export const publishConnectedMeetingRequest = async (
  circle: ConnectionCircle,
  input: ConnectedMeetingRequestInput
) => {
  const circleKey = getMeetingCircleKey(circle);
  const now = new Date().toISOString();
  const parent = circle.members.parent;
  const teacher = circle.members.teacher;
  const student = circle.members.student;
  const request: ConnectedMeetingRequest = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    circle_key: circleKey,
    parent_name: parent.name,
    parent_email: parent.email,
    teacher_name: teacher.name,
    teacher_email: teacher.email,
    student_name: student.name,
    student_email: student.email,
    requested_date: input.requested_date,
    requested_time: input.requested_time,
    reason: input.reason.trim(),
    status: 'pending',
    created_at: now,
    updated_at: now,
  };

  writeLocalMeetingRequests(circleKey, replaceMeetingRequest(readLocalMeetingRequests(circleKey), request));

  try {
    const { data, error } = await supabase
      .from('connected_meeting_requests')
      .insert({
        circle_key: request.circle_key,
        parent_name: request.parent_name,
        parent_email: request.parent_email,
        teacher_name: request.teacher_name,
        teacher_email: request.teacher_email,
        student_name: request.student_name,
        student_email: request.student_email,
        requested_date: request.requested_date,
        requested_time: request.requested_time,
        reason: request.reason,
        status: request.status,
        participant_emails: getMeetingParticipantEmails(circle),
      })
      .select('id,circle_key,parent_name,parent_email,teacher_name,teacher_email,student_name,student_email,requested_date,requested_time,reason,status,created_at,updated_at')
      .single();

    if (error) {
      if (!isMissingMeetingsTableError(error)) throw error;
      return request;
    }

    const savedRequest = data as ConnectedMeetingRequest;
    writeLocalMeetingRequests(circleKey, mergeMeetingRequests([
      savedRequest,
      ...readLocalMeetingRequests(circleKey).filter(existing => existing.id !== request.id),
    ]));
    return savedRequest;
  } catch {
    return request;
  }
};

export const updateConnectedMeetingRequestStatus = async (
  circle: ConnectionCircle,
  requestId: string,
  status: MeetingRequestStatus
) => {
  const circleKey = getMeetingCircleKey(circle);
  const current = readLocalMeetingRequests(circleKey);
  const existing = current.find(request => request.id === requestId);
  const updated = existing
    ? { ...existing, status, updated_at: new Date().toISOString() }
    : null;

  if (updated) {
    writeLocalMeetingRequests(circleKey, replaceMeetingRequest(current, updated));
  }

  if (requestId.startsWith('local-')) return updated;

  try {
    const { data, error } = await supabase
      .from('connected_meeting_requests')
      .update({ status })
      .eq('id', requestId)
      .select('id,circle_key,parent_name,parent_email,teacher_name,teacher_email,student_name,student_email,requested_date,requested_time,reason,status,created_at,updated_at')
      .single();

    if (error) {
      if (!isMissingMeetingsTableError(error)) throw error;
      return updated;
    }

    const savedRequest = data as ConnectedMeetingRequest;
    writeLocalMeetingRequests(circleKey, replaceMeetingRequest(readLocalMeetingRequests(circleKey), savedRequest));
    return savedRequest;
  } catch {
    return updated;
  }
};
