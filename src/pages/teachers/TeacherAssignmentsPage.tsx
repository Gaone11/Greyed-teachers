import React, { useEffect, useMemo, useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList,
  Download,
  FileText,
  Filter,
  MessageSquare,
  Plus,
  Send,
  Upload,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchTeacherClasses } from '../../lib/api/teacher-api';
import { Class } from '../../types/teacher';
import { CONNECTION_UPDATED_EVENT, loadConnectionCircle } from '../../lib/connection-circle';
import {
  CONNECTED_ASSIGNMENTS_UPDATED_EVENT,
  ConnectedAssignment,
  formatAssignmentDueDate,
  gradeConnectedAssignment,
  loadConnectedAssignments,
  publishConnectedAssignment,
  ConnectedAssignmentType,
} from '../../lib/connected-assignments';
import { sendConnectedMessage } from '../../lib/connected-messages';

type AssignmentTab = 'active' | 'grading' | 'completed';
type CreateAssignmentType = Extract<ConnectedAssignmentType, 'homework' | 'assessment'>;

interface HomeworkForm {
  assignmentType: CreateAssignmentType;
  classId: string;
  title: string;
  instructions: string;
  dueDate: string;
  maxScore: string;
}

const getDefaultDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  return dueDate.toISOString().slice(0, 10);
};

const defaultForm: HomeworkForm = {
  assignmentType: 'homework',
  classId: '',
  title: '',
  instructions: '',
  dueDate: getDefaultDueDate(),
  maxScore: '100',
};

const TeacherAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AssignmentTab>('active');
  const [showOnlyUngraded, setShowOnlyUngraded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [assignments, setAssignments] = useState<ConnectedAssignment[]>([]);
  const [form, setForm] = useState<HomeworkForm>(defaultForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState('Homework tools ready.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadClasses = async () => {
      if (!user) return;

      try {
        const teacherClasses = await fetchTeacherClasses(user.id);
        if (!mounted) return;
        setClasses(teacherClasses);
        setForm(current => ({
          ...current,
          classId: current.classId || teacherClasses[0]?.id || '',
        }));
      } catch {
        if (mounted) setStatusMessage('Classes could not be loaded. You can still create homework manually.');
      }
    };

    loadClasses();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const refreshAssignments = () => {
      const nextCircle = loadConnectionCircle();
      setCircle(nextCircle);
      loadConnectedAssignments(nextCircle).then(items => {
        if (mounted) setAssignments(items);
      });
    };

    refreshAssignments();
    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshAssignments);
    window.addEventListener(CONNECTED_ASSIGNMENTS_UPDATED_EVENT, refreshAssignments);
    window.addEventListener('storage', refreshAssignments);

    return () => {
      mounted = false;
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshAssignments);
      window.removeEventListener(CONNECTED_ASSIGNMENTS_UPDATED_EVENT, refreshAssignments);
      window.removeEventListener('storage', refreshAssignments);
    };
  }, []);

  const activeHomework = useMemo(() => assignments.filter(item => item.status === 'assigned'), [assignments]);
  const submittedHomework = useMemo(() => assignments.filter(item => item.status === 'submitted'), [assignments]);
  const completedHomework = useMemo(() => assignments.filter(item => item.status === 'graded'), [assignments]);
  const visibleSubmittedHomework = showOnlyUngraded
    ? submittedHomework
    : [...submittedHomework, ...activeHomework.slice(0, 2)];

  const openCreateModal = () => {
    const firstClass = classes[0];
    setForm({
      ...defaultForm,
      classId: firstClass?.id || '',
      title: firstClass ? `${firstClass.subject} homework` : '',
    });
    setSelectedFile(null);
    setShowCreateModal(true);
    setStatusMessage('Fill in the details and send the work to the connected student.');
  };

  const getFileDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

  const uploadAssignmentFile = async (file: File) => {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const filePath = `connected-assignments/${user?.id || 'teacher'}/${Date.now()}-${safeFileName}`;

    try {
      const { error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, { upsert: false });

      if (!error) {
        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
        if (data.publicUrl) {
          return {
            attachment_name: file.name,
            attachment_url: data.publicUrl,
            attachment_type: file.type || 'application/octet-stream',
          };
        }
      }
    } catch {
      // Fall back to an in-record attachment for small files.
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('The upload bucket is not ready yet, and this file is too large for temporary browser storage. Use a file under 2 MB or create the uploads bucket in Supabase.');
    }

    return {
      attachment_name: file.name,
      attachment_url: await getFileDataUrl(file),
      attachment_type: file.type || 'application/octet-stream',
    };
  };

  const handleCreateHomework = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.instructions.trim()) {
      setStatusMessage(`Add a ${form.assignmentType} title and instructions before sending.`);
      return;
    }

    if (circle.status !== 'connected') {
      setStatusMessage('Connect the student and parent first, then work can be sent across hubs.');
      return;
    }

    const selectedClass = classes.find(cls => cls.id === form.classId);
    const dueAt = form.dueDate ? new Date(`${form.dueDate}T23:59:00`).toISOString() : undefined;
    const maxScore = Number(form.maxScore) || 100;

    setIsSaving(true);
    let attachment: {
      attachment_name?: string;
      attachment_url?: string;
      attachment_type?: string;
    } = {};

    try {
      if (selectedFile) {
        attachment = await uploadAssignmentFile(selectedFile);
      }
    } catch (error) {
      setIsSaving(false);
      setStatusMessage(error instanceof Error ? error.message : 'The file could not be uploaded.');
      return;
    }

    const homework = await publishConnectedAssignment(circle, {
      class_id: selectedClass?.id || null,
      class_name: selectedClass?.name || null,
      subject: selectedClass?.subject || null,
      grade_level: selectedClass?.grade || null,
      title: form.title,
      assignment_type: form.assignmentType,
      topic: form.title,
      description: form.instructions,
      content: form.instructions,
      due_at: dueAt,
      max_score: maxScore,
      ...attachment,
    });

    const message = [
      `New ${homework.assignment_type}: ${homework.title}`,
      homework.class_name ? `Class: ${homework.class_name}` : '',
      homework.subject ? `Subject: ${homework.subject}` : '',
      homework.due_at ? `Due: ${new Date(homework.due_at).toLocaleDateString()}` : '',
      homework.attachment_name ? `Attachment: ${homework.attachment_name}` : '',
    ].filter(Boolean).join('\n');

    await Promise.all([
      sendConnectedMessage(circle, ['student', 'teacher'], 'teacher', message),
      sendConnectedMessage(circle, ['teacher', 'parent'], 'teacher', message),
    ]);

    setAssignments(await loadConnectedAssignments(circle));
    setShowCreateModal(false);
    setActiveTab('active');
    setIsSaving(false);
    setStatusMessage(`${homework.assignment_type === 'homework' ? 'Homework' : 'Assessment'} created and sent to the connected student and parent.`);
  };

  const handleQuickGrade = async (assignment: ConnectedAssignment) => {
    const scoreText = window.prompt(`Score for ${assignment.student_name || 'student'} out of ${assignment.max_score || 100}`, String(assignment.max_score || 100));
    if (!scoreText) return;

    const score = Number(scoreText);
    const maxScore = assignment.max_score || 100;
    if (!Number.isFinite(score)) {
      setStatusMessage('Enter a valid number for the score.');
      return;
    }

    const feedback = window.prompt('Feedback for the student') || 'Marked by your teacher.';
    const updated = await gradeConnectedAssignment(circle, assignment.id, {
      score,
      max_score: maxScore,
      grade_label: `${Math.round((score / maxScore) * 100)}%`,
      feedback,
    });

    if (!updated) {
      setStatusMessage('Could not grade this homework yet.');
      return;
    }

    await Promise.all([
      sendConnectedMessage(circle, ['student', 'teacher'], 'teacher', `Homework graded: ${updated.title}\nMark: ${updated.grade_label}`),
      sendConnectedMessage(circle, ['teacher', 'parent'], 'teacher', `Homework graded: ${updated.title}\nMark: ${updated.grade_label}`),
    ]);
    setAssignments(await loadConnectedAssignments(circle));
    setActiveTab('completed');
    setStatusMessage('Grade saved and shared with the connected student and parent.');
  };

  const renderAssignmentCard = (assignment: ConnectedAssignment, showGradeAction = false) => (
    <div key={assignment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-greyed-navy/10 rounded-xl hover:border-greyed-blue/30 transition-colors bg-white gap-4">
      <div>
        <h3 className="font-bold text-greyed-navy text-lg">{assignment.title}</h3>
        <p className="text-sm text-greyed-navy/60">
          {[assignment.assignment_type, assignment.class_name, assignment.subject, assignment.grade_level].filter(Boolean).join(' • ') || 'Connected work'}
        </p>
        <p className="mt-2 text-sm text-greyed-navy/70 line-clamp-2">{assignment.description || assignment.content}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded bg-greyed-navy/5 px-2 py-1 text-greyed-navy/70">Due: {formatAssignmentDueDate(assignment.due_at)}</span>
          <span className="rounded bg-greyed-blue/10 px-2 py-1 text-greyed-navy">{assignment.status}</span>
          {assignment.grade_label && (
            <span className="rounded bg-green-100 px-2 py-1 text-green-800">Grade: {assignment.grade_label}</span>
          )}
          {assignment.attachment_name && (
            <span className="rounded bg-purple-50 px-2 py-1 text-purple-700">File: {assignment.attachment_name}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {assignment.attachment_url && (
          <a
            href={assignment.attachment_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-greyed-navy/70 hover:text-greyed-navy px-3 py-1.5 rounded-lg hover:bg-greyed-navy/5 transition-colors"
          >
            <Download className="w-4 h-4" /> File
          </a>
        )}
        <button
          onClick={() => setStatusMessage(assignment.content || assignment.description || 'No extra instructions attached.')}
          className="flex items-center gap-2 text-sm text-greyed-navy/70 hover:text-greyed-navy px-3 py-1.5 rounded-lg hover:bg-greyed-navy/5 transition-colors"
        >
          <FileText className="w-4 h-4" /> View
        </button>
        {showGradeAction && (
          <button
            onClick={() => handleQuickGrade(assignment)}
            className="flex items-center gap-2 text-sm text-greyed-blue bg-greyed-blue/10 hover:bg-greyed-blue/20 px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            <MessageSquare className="w-4 h-4" /> Grade
          </button>
        )}
      </div>
    </div>
  );

  return (
    <TeacherLayout activePage="assignments">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-greyed-blue" />
            Homework & Assessments
          </h1>
          <p className="text-greyed-navy/70 mt-1">Create homework or upload assessments, grade submissions, and give feedback.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-greyed-navy hover:bg-greyed-navy/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Homework/Assessment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="flex border-b border-greyed-navy/10 overflow-x-auto">
          <button
            className={`px-6 py-4 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'active' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Work
            {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
          <button
            className={`px-6 py-4 font-semibold text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'grading' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('grading')}
          >
            Needs Grading
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{submittedHomework.length}</span>
            {activeTab === 'grading' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
          <button
            className={`px-6 py-4 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'completed' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
            {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
        </div>

        <div className="border-b border-greyed-navy/10 bg-greyed-white/60 px-6 py-3 text-sm font-semibold text-greyed-navy/70" role="status">
          {statusMessage}
        </div>

        <div className="p-6">
          {activeTab === 'active' && (
            <div className="space-y-3">
              {activeHomework.length > 0 ? activeHomework.map(item => renderAssignmentCard(item)) : (
                <EmptyAssignments activeTab={activeTab} />
              )}
            </div>
          )}

          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-greyed-navy">Submissions Awaiting Review</h2>
                <button
                  onClick={() => setShowOnlyUngraded(enabled => !enabled)}
                  className="text-sm text-greyed-blue font-semibold flex items-center gap-1 hover:underline"
                >
                  <Filter className="w-4 h-4" /> {showOnlyUngraded ? 'Show Active Too' : 'Submitted Only'}
                </button>
              </div>

              <div className="space-y-3">
                {visibleSubmittedHomework.length > 0 ? visibleSubmittedHomework.map(item => renderAssignmentCard(item, item.status === 'submitted')) : (
                  <EmptyAssignments activeTab={activeTab} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-3">
              {completedHomework.length > 0 ? completedHomework.map(item => renderAssignmentCard(item)) : (
                <EmptyAssignments activeTab={activeTab} />
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-greyed-navy/40 p-4">
          <form
            onSubmit={handleCreateHomework}
            className="w-full max-w-2xl rounded-2xl border border-greyed-navy/10 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-greyed-navy">Create Homework or Assessment</h2>
                <p className="mt-1 text-sm font-semibold text-greyed-navy/60">
                  This will appear in the connected student's Homework & Assessments page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-greyed-navy/60 hover:bg-greyed-navy/10 hover:text-greyed-navy"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Type
                <select
                  value={form.assignmentType}
                  onChange={event => {
                    const assignmentType = event.target.value as CreateAssignmentType;
                    setForm(current => ({
                      ...current,
                      assignmentType,
                      title: current.title.replace(/\bhomework\b|\bassessment\b/i, assignmentType),
                    }));
                  }}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                >
                  <option value="homework">Homework</option>
                  <option value="assessment">Assessment</option>
                </select>
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Class
                <select
                  value={form.classId}
                  onChange={event => {
                    const selectedClass = classes.find(cls => cls.id === event.target.value);
                    setForm(current => ({
                      ...current,
                      classId: event.target.value,
                      title: selectedClass && !current.title.trim() ? `${selectedClass.subject} ${current.assignmentType}` : current.title,
                    }));
                  }}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                >
                  <option value="">Manual work</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} - {cls.grade} ({cls.subject})</option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Title
                <input
                  value={form.title}
                  onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Algebra practice worksheet"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Due date
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={event => setForm(current => ({ ...current, dueDate: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Max score
                <input
                  type="number"
                  min="1"
                  value={form.maxScore}
                  onChange={event => setForm(current => ({ ...current, maxScore: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                />
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Instructions
                <textarea
                  value={form.instructions}
                  onChange={event => setForm(current => ({ ...current, instructions: event.target.value }))}
                  className="mt-1 min-h-[120px] w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Complete questions 1-10 and show all working."
                />
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Upload assessment file
                <div className="mt-1 rounded-xl border border-dashed border-greyed-navy/20 bg-greyed-navy/5 p-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    onChange={event => setSelectedFile(event.target.files?.[0] || null)}
                    className="block w-full text-sm font-semibold text-greyed-navy file:mr-4 file:rounded-lg file:border-0 file:bg-greyed-navy file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                  />
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-greyed-navy/60">
                    <Upload className="h-3.5 w-3.5" />
                    {selectedFile ? `${selectedFile.name} selected` : 'Attach a PDF, Word document, or image for assessments.'}
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-greyed-navy/20 px-4 py-2.5 font-bold text-greyed-navy hover:bg-greyed-navy/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-greyed-navy px-4 py-2.5 font-bold text-white hover:bg-greyed-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isSaving ? 'Sending...' : `Send ${form.assignmentType === 'homework' ? 'Homework' : 'Assessment'}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </TeacherLayout>
  );
};

const EmptyAssignments = ({ activeTab }: { activeTab: AssignmentTab }) => (
  <div className="py-12 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-greyed-navy/5 rounded-full flex items-center justify-center mb-4">
      <ClipboardList className="w-8 h-8 text-greyed-navy/40" />
    </div>
    <h3 className="text-lg font-bold text-greyed-navy">No {activeTab} assignments</h3>
    <p className="text-greyed-navy/60 mt-2 max-w-sm">
      {activeTab === 'active'
        ? 'Create homework and it will appear here and on the connected student account.'
        : 'When students submit work or you complete grading, it will appear here.'}
    </p>
  </div>
);

export default TeacherAssignmentsPage;
