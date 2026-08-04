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
