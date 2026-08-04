import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UserPlus, Trash2, Search, Users, X, AlertCircle, CheckCircle2
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class_id: string;
  created_at: string;
  source?: 'supabase' | 'local';
}

interface ClassStudentsManagerProps {
  classId: string;
  onStudentCountChange?: (count: number) => void;
}

type RawStudentRow = {
  id: string;
  class_id: string;
  created_at?: string;
  name?: string | null;
  full_name?: string | null;
  student_name?: string | null;
  student_id?: string | null;
};

type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

type RawAttendanceRow = {
  student_id: string;
  status: AttendanceStatus;
};

const attendanceStatuses: { value: AttendanceStatus; label: string; className: string }[] = [
  { value: 'present', label: 'Present', className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
  { value: 'late', label: 'Late', className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { value: 'absent', label: 'Absent', className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
  { value: 'excused', label: 'Excused', className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
];

const isMissingTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*class_students.* does not exist/i.test(message)
    || /relation .*class_attendance.* does not exist/i.test(message)
    || /schema cache.*public\.class_students/i.test(message)
    || /schema cache.*public\.class_attendance/i.test(message)
    || /could not find the table .*class_students/i.test(message)
    || /could not find the table .*class_attendance/i.test(message);
};

const getSupabaseErrorMessage = (error: unknown, fallback: string) => {
  const err = error as { message?: string; code?: string; details?: string; hint?: string };
  const message = err?.message || '';
  const code = err?.code || '';
  const details = err?.details || '';
  const hint = err?.hint || '';

  if (isMissingTableError(error)) {
    return 'Roster tables are not available in Supabase yet. This class is using temporary local roster storage.';
  }
  if (code === '42501' || /row-level security/i.test(message)) {
    return 'Permission denied by Supabase RLS policy for the class roster.';
  }
  if (code === '23505') {
    return 'This student is already in the class.';
  }

  if (message && details) return `${message} (${details})`;
  if (message && hint) return `${message} (${hint})`;
  return message || fallback;
};

const getLocalRosterKey = (classId: string) => `greyed-local-class-roster:${classId}`;
const getLocalAttendanceKey = (classId: string, attendanceDate: string) => `greyed-local-class-attendance:${classId}:${attendanceDate}`;

const loadLocalStudents = (classId: string): Student[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getLocalRosterKey(classId));
    if (!stored) return [];
    return (JSON.parse(stored) as Student[])
      .map(student => ({ ...student, source: 'local' as const }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
};

const saveLocalStudents = (classId: string, students: Student[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getLocalRosterKey(classId), JSON.stringify(students));
};

const upsertLocalStudent = (classId: string, name: string): Student => {
  const students = loadLocalStudents(classId);
  const existing = students.find(student => student.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const student: Student = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    class_id: classId,
    name,
    created_at: new Date().toISOString(),
    source: 'local',
  };
  saveLocalStudents(classId, [...students, student].sort((a, b) => a.name.localeCompare(b.name)));
  return student;
};

const removeLocalStudent = (classId: string, studentId: string) => {
  saveLocalStudents(classId, loadLocalStudents(classId).filter(student => student.id !== studentId));
};

const loadLocalAttendance = (classId: string, attendanceDate: string): Record<string, AttendanceStatus> => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = window.localStorage.getItem(getLocalAttendanceKey(classId, attendanceDate));
    return stored ? JSON.parse(stored) as Record<string, AttendanceStatus> : {};
  } catch {
    return {};
  }
};

const saveLocalAttendance = (classId: string, attendanceDate: string, attendance: Record<string, AttendanceStatus>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getLocalAttendanceKey(classId, attendanceDate), JSON.stringify(attendance));
};

const saveLocalAttendanceStatus = (
  classId: string,
  attendanceDate: string,
  studentId: string,
  status: AttendanceStatus
) => {
  const attendance = loadLocalAttendance(classId, attendanceDate);
  saveLocalAttendance(classId, attendanceDate, { ...attendance, [studentId]: status });
};

const getTodayInputValue = () => new Date().toISOString().slice(0, 10);

const normalizeStudent = (row: RawStudentRow): Student => ({
  id: row.id,
  class_id: row.class_id,
  created_at: row.created_at || new Date().toISOString(),
  name: row.name || row.full_name || row.student_name || row.student_id || 'Unnamed Student',
  source: 'supabase',
});

const mergeStudents = (students: Student[]) => {
  const seen = new Set<string>();
  return students
    .filter(student => {
      const key = `${student.class_id}:${student.id}:${student.name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

const ClassStudentsManager: React.FC<ClassStudentsManagerProps> = ({ classId, onStudentCountChange }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(getTodayInputValue());
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSavingId, setAttendanceSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchStudentsWithFallback = async (): Promise<Student[]> => {
    const attempts = [
      { select: 'id,class_id,created_at,name', orderBy: 'name' },
      { select: 'id,class_id,created_at,full_name', orderBy: 'full_name' },
      { select: 'id,class_id,created_at,student_name', orderBy: 'student_name' },
      { select: 'id,class_id,created_at,student_id', orderBy: 'student_id' },
      { select: '*' as const, orderBy: '' },
    ];

    let lastError: unknown = null;

    for (const attempt of attempts) {
      let query = supabase.from('class_students').select(attempt.select).eq('class_id', classId);
      if (attempt.orderBy) {
        query = query.order(attempt.orderBy, { ascending: true });
      }
      const { data, error } = await query;

      if (!error) {
        const rows = (data || []) as RawStudentRow[];
        return rows.map(normalizeStudent).sort((a, b) => a.name.localeCompare(b.name));
      }
      lastError = error;
    }

    if (isMissingTableError(lastError)) {
      return loadLocalStudents(classId);
    }

    throw lastError;
  };

  const insertStudentWithFallback = async (name: string): Promise<Student> => {
    const { data: authData } = await supabase.auth.getUser();
    const teacherId = authData?.user?.id;

    const payloads = [
      { class_id: classId, name },
      { class_id: classId, full_name: name },
      { class_id: classId, student_name: name },
      { class_id: classId, student_id: name },
    ].flatMap(payload => {
      if (!teacherId) return [payload];
      return [payload, { ...payload, teacher_id: teacherId }];
    });

    let lastError: unknown = null;

    for (const payload of payloads) {
      const { data, error } = await supabase
        .from('class_students')
        .insert(payload)
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) return normalizeStudent(data as RawStudentRow);
      if (!error && !data) {
        // Row may insert successfully but not return due policy. Re-read list.
        const refreshed = await fetchStudentsWithFallback();
        const existing = refreshed.find(student => student.name.toLowerCase() === name.toLowerCase());
        if (existing) return existing;
        lastError = {
          message: 'Insert completed but no student row was returned or found after refresh.',
          details: 'Possible RLS SELECT restriction or schema mismatch on class_students.',
        };
        continue;
      }
      lastError = error;
    }

    if (isMissingTableError(lastError)) {
      return upsertLocalStudent(classId, name);
    }

    throw lastError || {
      message: 'Unable to insert student with current class_students schema.',
      details: 'Expected one of name/full_name/student_name/student_id and class_id.',
    };
  };

  const fetchAttendance = async (studentList = students) => {
    if (!studentList.length) {
      setAttendance({});
      return;
    }

    setAttendanceLoading(true);
    const localAttendance = loadLocalAttendance(classId, attendanceDate);

    try {
      const { data, error } = await supabase
        .from('class_attendance')
        .select('student_id,status')
        .eq('class_id', classId)
        .eq('attendance_date', attendanceDate);

      if (error) {
        if (isMissingTableError(error)) {
          setAttendance(localAttendance);
          return;
        }
        throw error;
      }

      const remoteAttendance = ((data || []) as RawAttendanceRow[]).reduce<Record<string, AttendanceStatus>>((acc, row) => {
        acc[row.student_id] = row.status;
        return acc;
      }, {});

      setAttendance({ ...localAttendance, ...remoteAttendance });
    } catch (error: unknown) {
      setAttendance(localAttendance);
      setToast({ type: 'error', message: getSupabaseErrorMessage(error, 'Could not load attendance for this date.') });
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [attendanceDate]);

  const handleAttendanceChange = async (student: Student, status: AttendanceStatus) => {
    setAttendanceSavingId(student.id);
    setAttendance(current => ({ ...current, [student.id]: status }));
    saveLocalAttendanceStatus(classId, attendanceDate, student.id, status);

    try {
      if (student.source === 'local') {
        setToast({ type: 'success', message: `${student.name} marked ${status}.` });
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('class_attendance')
        .upsert(
          {
            class_id: classId,
            student_id: student.id,
            teacher_id: authData?.user?.id,
            attendance_date: attendanceDate,
            status,
          },
          { onConflict: 'student_id,attendance_date' }
        );

      if (error) {
        if (isMissingTableError(error)) {
          setToast({ type: 'success', message: `${student.name} marked ${status} locally.` });
          return;
        }
        throw error;
      }

      setToast({ type: 'success', message: `${student.name} marked ${status}.` });
    } catch (error: unknown) {
      setToast({ type: 'error', message: getSupabaseErrorMessage(error, 'Could not save attendance.') });
    } finally {
      setAttendanceSavingId(null);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const list = await fetchStudentsWithFallback();
      setStudents(list);
      onStudentCountChange?.(list.length);
      await fetchAttendance(list);
    } catch (error: unknown) {
      setStudents([]);
      onStudentCountChange?.(0);
      setToast({ type: 'error', message: getSupabaseErrorMessage(error, 'Could not load students for this class.') });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingle = async () => {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const data = await insertStudentWithFallback(name);
      const updated = mergeStudents([...students, data]);
      setStudents(updated);
      onStudentCountChange?.(updated.length);
      await fetchAttendance(updated);
      setNewName('');
      setShowAddForm(false);
      setToast({ type: 'success', message: `${name} added successfully` });
    } catch (error: unknown) {
      console.error('Add student failed', error);
      setToast({ type: 'error', message: getSupabaseErrorMessage(error, 'Failed to add student. Please try again.') });
    } finally {
      setSaving(false);
    }
  };

  const handleAddBulk = async () => {
    const names = bulkNames
      .split('\n')
      .map(n => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    setSaving(true);
    try {
      const createdStudents: Student[] = [];
      for (const name of names) {
        const student = await insertStudentWithFallback(name);
        createdStudents.push(student);
      }

      const updated = mergeStudents([...students, ...createdStudents]);

      setStudents(updated);
      onStudentCountChange?.(updated.length);
      await fetchAttendance(updated);
      setBulkNames('');
      setShowAddForm(false);
      setToast({ type: 'success', message: `${names.length} student${names.length > 1 ? 's' : ''} added` });
    } catch (error: unknown) {
      console.error('Add students failed', error);
      setToast({ type: 'error', message: getSupabaseErrorMessage(error, 'Failed to add students. Please try again.') });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const student = students.find(item => item.id === id);
      if (student?.source === 'local') {
        removeLocalStudent(classId, id);
        const updated = students.filter(s => s.id !== id);
        setStudents(updated);
        onStudentCountChange?.(updated.length);
        setDeleteConfirmId(null);
        setToast({ type: 'success', message: `${name} removed` });
        return;
      }

      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('id', id);
      if (error) {
        if (isMissingTableError(error)) {
          removeLocalStudent(classId, id);
        } else {
          throw error;
        }
      }
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      onStudentCountChange?.(updated.length);
      setDeleteConfirmId(null);
      setToast({ type: 'success', message: `${name} removed` });
    } catch {
      setToast({ type: 'error', message: 'Failed to remove student.' });
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-greyed-navy/8 text-greyed-navy border border-greyed-navy/10'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={16} className="flex-shrink-0" />
            : <AlertCircle size={16} className="flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-greyed-navy" />
          <h2 className="text-base font-bold text-greyed-navy">
            Students
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({students.length} enrolled)
            </span>
          </h2>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setAddMode('single'); }}
          className="flex items-center gap-2 px-4 py-2 bg-greyed-navy text-white rounded-xl hover:bg-greyed-navy/90 transition-colors text-sm font-semibold"
        >
          <UserPlus size={15} />
          Add Student
        </button>
      </div>

      {/* Add student form */}
      {showAddForm && (
        <div className="bg-greyed-white border border-greyed-beige/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-greyed-navy text-sm">Add Student(s)</h3>
            <button onClick={() => { setShowAddForm(false); setNewName(''); setBulkNames(''); }}
              className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4 w-fit">
            {(['single', 'bulk'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setAddMode(mode)}
                className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                  addMode === mode
                    ? 'bg-greyed-navy text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode === 'single' ? 'Single' : 'Bulk (paste list)'}
              </button>
            ))}
          </div>

          {addMode === 'single' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSingle(); }}
                placeholder="Student full name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
                autoFocus
              />
              <button
                onClick={handleAddSingle}
                disabled={!newName.trim() || saving}
                className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Adding…' : 'Add'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={bulkNames}
                onChange={e => setBulkNames(e.target.value)}
                placeholder={"One name per line:\nJohn Smith\nMary Dube\nThabo Mokoena"}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddForm(false); setBulkNames(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBulk}
                  disabled={!bulkNames.trim() || saving}
                  className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Adding…' : `Add ${bulkNames.split('\n').filter(n => n.trim()).length || ''} Students`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white border border-greyed-navy/10 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-greyed-navy text-sm">Attendance</h3>
            <p className="text-xs text-gray-500 mt-1">
              Mark attendance for the selected date.
              {attendanceLoading && <span className="ml-1">Loading saved marks...</span>}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-semibold text-gray-500">
              Date
              <input
                type="date"
                value={attendanceDate}
                onChange={event => setAttendanceDate(event.target.value)}
                className="mt-1 sm:mt-0 sm:ml-2 px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
              />
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{Object.keys(attendance).length} marked</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{students.length} enrolled</span>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search students…"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-greyed-navy/20 border-t-greyed-navy rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-greyed-navy/10 rounded-2xl">
          <Users className="w-10 h-10 text-greyed-navy/20 mx-auto mb-3" />
          <h3 className="font-semibold text-greyed-navy mb-1">No students yet</h3>
          <p className="text-sm text-gray-500 mb-4">Add students individually or paste a list of names.</p>
          <button
            onClick={() => { setShowAddForm(true); setAddMode('single'); }}
            className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 transition-colors"
          >
            Add First Student
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No students match "<span className="font-medium">{searchTerm}</span>"
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-greyed-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((student, index) => (
                <tr key={student.id} className="hover:bg-greyed-white/60 transition-colors group">
                  <td className="px-4 py-3 text-sm text-gray-400 w-10">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-greyed-navy/8 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-greyed-navy">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(student.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {attendanceStatuses.map(status => {
                        const isSelected = attendance[student.id] === status.value;
                        return (
                          <button
                            key={status.value}
                            onClick={() => handleAttendanceChange(student, status.value)}
                            disabled={attendanceSavingId === student.id}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                              isSelected
                                ? status.className
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            } disabled:opacity-60 disabled:cursor-wait`}
                          >
                            {attendanceSavingId === student.id && isSelected ? 'Saving...' : status.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {deleteConfirmId === student.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(student.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove student"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassStudentsManager;
