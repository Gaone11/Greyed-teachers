import { supabase } from './supabase';
import { ConnectionCircle, ConnectionRole } from './connection-circle';

export type ConnectedAssignmentType = 'homework' | 'quiz' | 'test' | 'exam' | 'assessment';
export type ConnectedAssignmentStatus = 'assigned' | 'submitted' | 'graded';

export interface ConnectedAssignment {
  id: string;
  circle_key: string;
  source_assessment_id?: string | null;
  class_id?: string | null;
  class_name?: string | null;
  subject?: string | null;
  grade_level?: string | null;
  title: string;
  assignment_type: ConnectedAssignmentType;
  topic?: string | null;
  description?: string | null;
  content?: string | null;
  due_at?: string | null;
  status: ConnectedAssignmentStatus;
  student_name: string;
  student_email?: string | null;
  teacher_name: string;
  teacher_email?: string | null;
  score?: number | null;
  max_score?: number | null;
  grade_label?: string | null;
  feedback?: string | null;
  submitted_at?: string | null;
  graded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectedAssignmentInput {
  source_assessment_id?: string | null;
  class_id?: string | null;
  class_name?: string | null;
  subject?: string | null;
  grade_level?: string | null;
  title: string;
  assignment_type: ConnectedAssignmentType;
  topic?: string | null;
  description?: string | null;
  content?: string | null;
  due_at?: string | null;
  max_score?: number | null;
}

export interface ConnectedAssignmentGradeInput {
  score: number;
  max_score: number;
  grade_label?: string;
  feedback?: string;
}

export const CONNECTED_ASSIGNMENTS_UPDATED_EVENT = 'greyed-connected-assignments-updated';

const normalizeIdentityPart = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, '-');

export const getAssignmentCircleKey = (circle: ConnectionCircle) => {
  const circleIdentity = (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => {
      const member = circle.members[role];
      return normalizeIdentityPart(member.email || member.name || role);
    })
    .join('|');

  return `greyed-assignments:${circleIdentity}`;
};

export const getAssignmentParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => circle.members[role].email.trim().toLowerCase())
    .filter(Boolean);
};

const getAssignmentStorageKey = (circleKey: string) => `greyed-connected-assignments:${circleKey}`;

const isMissingAssignmentsTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_assignments.* does not exist/i.test(message)
    || /schema cache.*public\.connected_assignments/i.test(message)
    || /could not find the table .*connected_assignments/i.test(message);
};

const readLocalAssignments = (circleKey: string): ConnectedAssignment[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getAssignmentStorageKey(circleKey));
    return stored ? JSON.parse(stored) as ConnectedAssignment[] : [];
  } catch {
    return [];
  }
};

const writeLocalAssignments = (circleKey: string, assignments: ConnectedAssignment[]) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(getAssignmentStorageKey(circleKey), JSON.stringify(assignments));
  window.dispatchEvent(new CustomEvent(CONNECTED_ASSIGNMENTS_UPDATED_EVENT, { detail: { circleKey } }));
};

const mergeAssignments = (assignments: ConnectedAssignment[]) => {
  const seen = new Set<string>();
  return assignments
    .filter(assignment => {
      if (seen.has(assignment.id)) return false;
      seen.add(assignment.id);
      return true;
    })
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
};

const replaceAssignment = (assignments: ConnectedAssignment[], updated: ConnectedAssignment) => {
  return mergeAssignments([
    updated,
    ...assignments.filter(assignment => assignment.id !== updated.id),
  ]);
};

export const formatAssignmentDueDate = (value?: string | null) => {
  if (!value) return 'No due date';

  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
};

export const loadConnectedAssignments = async (
  circle: ConnectionCircle
): Promise<ConnectedAssignment[]> => {
  const circleKey = getAssignmentCircleKey(circle);
  const localAssignments = readLocalAssignments(circleKey);

  try {
    const { data, error } = await supabase
      .from('connected_assignments')
      .select('id,circle_key,source_assessment_id,class_id,class_name,subject,grade_level,title,assignment_type,topic,description,content,due_at,status,student_name,student_email,teacher_name,teacher_email,score,max_score,grade_label,feedback,submitted_at,graded_at,created_at,updated_at')
      .eq('circle_key', circleKey)
      .order('updated_at', { ascending: false });

    if (error) {
      if (isMissingAssignmentsTableError(error)) return localAssignments;
      throw error;
    }

    const merged = mergeAssignments([...(data || []) as ConnectedAssignment[], ...localAssignments]);
    writeLocalAssignments(circleKey, merged);
    return merged;
  } catch {
    return localAssignments;
  }
};

export const publishConnectedAssignment = async (
  circle: ConnectionCircle,
  input: ConnectedAssignmentInput
) => {
  const circleKey = getAssignmentCircleKey(circle);
  const now = new Date().toISOString();
  const student = circle.members.student;
  const teacher = circle.members.teacher;
  const assignment: ConnectedAssignment = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    circle_key: circleKey,
    source_assessment_id: input.source_assessment_id || null,
    class_id: input.class_id || null,
    class_name: input.class_name?.trim() || null,
    subject: input.subject?.trim() || null,
    grade_level: input.grade_level?.trim() || null,
    title: input.title.trim(),
    assignment_type: input.assignment_type,
    topic: input.topic?.trim() || null,
    description: input.description?.trim() || null,
    content: input.content || null,
    due_at: input.due_at || null,
    status: 'assigned',
    student_name: student.name,
    student_email: student.email,
    teacher_name: teacher.name,
    teacher_email: teacher.email,
    score: null,
    max_score: input.max_score || 100,
    grade_label: null,
    feedback: null,
    submitted_at: null,
    graded_at: null,
    created_at: now,
    updated_at: now,
  };

  const localAssignments = replaceAssignment(readLocalAssignments(circleKey), assignment);
  writeLocalAssignments(circleKey, localAssignments);

  try {
    const { data, error } = await supabase
      .from('connected_assignments')
      .insert({
        circle_key: circleKey,
        source_assessment_id: assignment.source_assessment_id,
        class_id: assignment.class_id,
        class_name: assignment.class_name,
        subject: assignment.subject,
        grade_level: assignment.grade_level,
        title: assignment.title,
        assignment_type: assignment.assignment_type,
        topic: assignment.topic,
        description: assignment.description,
        content: assignment.content,
        due_at: assignment.due_at,
        status: assignment.status,
        student_name: assignment.student_name,
        student_email: assignment.student_email,
        teacher_name: assignment.teacher_name,
        teacher_email: assignment.teacher_email,
        participant_emails: getAssignmentParticipantEmails(circle),
        max_score: assignment.max_score,
      })
      .select('id,circle_key,source_assessment_id,class_id,class_name,subject,grade_level,title,assignment_type,topic,description,content,due_at,status,student_name,student_email,teacher_name,teacher_email,score,max_score,grade_label,feedback,submitted_at,graded_at,created_at,updated_at')
      .single();

    if (error) {
      if (!isMissingAssignmentsTableError(error)) throw error;
      return assignment;
    }

    const savedAssignment = data as ConnectedAssignment;
    writeLocalAssignments(circleKey, mergeAssignments([
      savedAssignment,
      ...readLocalAssignments(circleKey).filter(existing => existing.id !== assignment.id),
    ]));
    return savedAssignment;
  } catch {
    return assignment;
  }
};

export const submitConnectedAssignment = async (
  circle: ConnectionCircle,
  assignmentId: string
) => {
  const circleKey = getAssignmentCircleKey(circle);
  const now = new Date().toISOString();
  const existing = readLocalAssignments(circleKey).find(assignment => assignment.id === assignmentId);
  if (!existing) return null;

  const updated: ConnectedAssignment = {
    ...existing,
    status: 'submitted',
    submitted_at: now,
    updated_at: now,
  };
  writeLocalAssignments(circleKey, replaceAssignment(readLocalAssignments(circleKey), updated));

  try {
    const { error } = await supabase
      .from('connected_assignments')
      .update({ status: 'submitted', submitted_at: now, updated_at: now })
      .eq('id', assignmentId);

    if (error && !isMissingAssignmentsTableError(error)) throw error;
  } catch {
    return updated;
  }

  return updated;
};

export const gradeConnectedAssignment = async (
  circle: ConnectionCircle,
  assignmentId: string,
  input: ConnectedAssignmentGradeInput
) => {
  const circleKey = getAssignmentCircleKey(circle);
  const now = new Date().toISOString();
  const existing = readLocalAssignments(circleKey).find(assignment => assignment.id === assignmentId);
  if (!existing) return null;

  const updated: ConnectedAssignment = {
    ...existing,
    status: 'graded',
    score: input.score,
    max_score: input.max_score,
    grade_label: input.grade_label?.trim() || `${Math.round((input.score / input.max_score) * 100)}%`,
    feedback: input.feedback?.trim() || null,
    graded_at: now,
    updated_at: now,
  };
  writeLocalAssignments(circleKey, replaceAssignment(readLocalAssignments(circleKey), updated));

  try {
    const { error } = await supabase
      .from('connected_assignments')
      .update({
        status: updated.status,
        score: updated.score,
        max_score: updated.max_score,
        grade_label: updated.grade_label,
        feedback: updated.feedback,
        graded_at: updated.graded_at,
        updated_at: updated.updated_at,
      })
      .eq('id', assignmentId);

    if (error && !isMissingAssignmentsTableError(error)) throw error;
  } catch {
    return updated;
  }

  return updated;
};
