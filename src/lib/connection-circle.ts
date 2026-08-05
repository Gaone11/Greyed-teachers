export type ConnectionRole = 'student' | 'teacher' | 'parent';

export interface ConnectionPerson {
  role: ConnectionRole;
  name: string;
  email: string;
  connected: boolean;
}

export interface ConnectionCircle {
  status: 'needs_connection' | 'connected';
  createdBy?: ConnectionRole;
  connectedAt?: string;
  members: Record<ConnectionRole, ConnectionPerson>;
}

export interface ConnectionInput {
  studentName?: string;
  studentEmail?: string;
  teacherName?: string;
  teacherEmail?: string;
  parentName?: string;
  parentEmail?: string;
}

const CONNECTION_STORAGE_KEY = 'greyedConnectionCircle';
export const CONNECTION_UPDATED_EVENT = 'greyed-connection-circle-updated';
const CONNECTED_CIRCLES_TABLE = 'connected_circles';

const defaultMembers: Record<ConnectionRole, ConnectionPerson> = {
  student: {
    role: 'student',
    name: 'Student account',
    email: '',
    connected: false,
  },
  teacher: {
    role: 'teacher',
    name: 'Teacher account',
    email: '',
    connected: false,
  },
  parent: {
    role: 'parent',
    name: 'Parent account',
    email: '',
    connected: false,
  },
};

export const getDefaultConnectionCircle = (): ConnectionCircle => ({
  status: 'needs_connection',
  members: {
    student: { ...defaultMembers.student },
    teacher: { ...defaultMembers.teacher },
    parent: { ...defaultMembers.parent },
  },
});

export const loadConnectionCircle = (): ConnectionCircle => {
  if (typeof window === 'undefined') {
    return getDefaultConnectionCircle();
  }

  const storedCircle = window.localStorage.getItem(CONNECTION_STORAGE_KEY);
  if (!storedCircle) {
    return getDefaultConnectionCircle();
  }

  try {
    const parsedCircle = JSON.parse(storedCircle) as ConnectionCircle;
    return {
      ...getDefaultConnectionCircle(),
      ...parsedCircle,
      members: {
        ...getDefaultConnectionCircle().members,
        ...parsedCircle.members,
      },
    };
  } catch {
    window.localStorage.removeItem(CONNECTION_STORAGE_KEY);
    return getDefaultConnectionCircle();
  }
};

export const saveConnectionCircle = (circle: ConnectionCircle) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(circle));
  window.dispatchEvent(new CustomEvent(CONNECTION_UPDATED_EVENT, { detail: circle }));
};

const normalizeEmail = (email?: string) => (email || '').trim().toLowerCase();

const getParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => normalizeEmail(circle.members[role].email))
    .filter(Boolean);
};

export const isConnectionCircleReady = (circle: ConnectionCircle) => {
  return circle.status === 'connected'
    && (['student', 'teacher', 'parent'] as ConnectionRole[]).every(role => circle.members[role].connected);
};

const isMissingConnectedCirclesTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_circles.* does not exist/i.test(message)
    || /schema cache.*public\.connected_circles/i.test(message)
    || /could not find the table .*connected_circles/i.test(message);
};

export const loadRemoteConnectionCircle = async (email?: string): Promise<ConnectionCircle | null> => {
  const participantEmail = normalizeEmail(email);
  if (!participantEmail) return null;

  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from(CONNECTED_CIRCLES_TABLE)
      .select('circle_payload')
      .contains('participant_emails', [participantEmail])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (isMissingConnectedCirclesTableError(error)) return null;
      throw error;
    }

    const remoteCircle = data?.circle_payload as ConnectionCircle | undefined;
    if (!remoteCircle) return null;
    saveConnectionCircle(remoteCircle);
    return remoteCircle;
  } catch {
    return null;
  }
};

export const saveRemoteConnectionCircle = async (circle: ConnectionCircle) => {
  const participantEmails = getParticipantEmails(circle);
  if (participantEmails.length === 0) return;

  try {
    const { supabase } = await import('./supabase');
    const circleKey = participantEmails.join('|');
    const { error } = await supabase
      .from(CONNECTED_CIRCLES_TABLE)
      .upsert({
        circle_key: circleKey,
        participant_emails: participantEmails,
        circle_payload: circle,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'circle_key' });

    if (error && !isMissingConnectedCirclesTableError(error)) {
      throw error;
    }
  } catch {
  }
};

export const createConnectedCircle = (
  role: ConnectionRole,
  currentCircle: ConnectionCircle,
  input: ConnectionInput,
  currentUser?: { email?: string; user_metadata?: { first_name?: string; last_name?: string; name?: string } } | null
): ConnectionCircle => {
  const userName = [
    currentUser?.user_metadata?.first_name,
    currentUser?.user_metadata?.last_name,
  ].filter(Boolean).join(' ') || currentUser?.user_metadata?.name || currentUser?.email || currentCircle.members[role].name;

  const userEmail = currentUser?.email || currentCircle.members[role].email;

  const members = {
    student: {
      ...currentCircle.members.student,
      name: input.studentName || currentCircle.members.student.name,
      email: input.studentEmail || currentCircle.members.student.email,
      connected: true,
    },
    teacher: {
      ...currentCircle.members.teacher,
      name: input.teacherName || currentCircle.members.teacher.name,
      email: input.teacherEmail || currentCircle.members.teacher.email,
      connected: true,
    },
    parent: {
      ...currentCircle.members.parent,
      name: input.parentName || currentCircle.members.parent.name,
      email: input.parentEmail || currentCircle.members.parent.email,
      connected: true,
    },
  };

  members[role] = {
    ...members[role],
    name: userName,
    email: userEmail,
    connected: true,
  };

  return {
    status: 'connected',
    createdBy: role,
    connectedAt: new Date().toISOString(),
    members,
  };
};
