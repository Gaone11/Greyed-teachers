import React, { useEffect, useMemo, useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  FileText, 
  Upload, 
  Download,
  CheckCircle, 
  Clock, 
  XCircle, 
  MessageSquare,
  Search
} from 'lucide-react';
import { CONNECTION_UPDATED_EVENT, loadConnectionCircle } from '../../lib/connection-circle';
import {
  CONNECTED_ASSIGNMENTS_UPDATED_EVENT,
  ConnectedAssignment,
  formatAssignmentDueDate,
  loadConnectedAssignments,
  submitConnectedAssignment,
} from '../../lib/connected-assignments';
import { sendConnectedMessage } from '../../lib/connected-messages';

interface StudentAssignmentView {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  description: string;
  feedback: string | null;
  grade: string | null;
  isConnected?: boolean;
  raw?: ConnectedAssignment;
  attachmentName?: string | null;
  attachmentUrl?: string | null;
}

type AssignmentFilter = 'all' | 'Not Started' | 'In Progress' | 'Submitted' | 'Graded';
const assignmentFilters: AssignmentFilter[] = ['all', 'Not Started', 'In Progress', 'Submitted', 'Graded'];

const AssignmentsPage: React.FC = () => {
  const [filter, setFilter] = useState<AssignmentFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [connectedAssignments, setConnectedAssignments] = useState<ConnectedAssignment[]>([]);

  useEffect(() => {
    let mounted = true;

    const refreshAssignments = () => {
      const nextCircle = loadConnectionCircle();
      setCircle(nextCircle);
      loadConnectedAssignments(nextCircle).then(assignments => {
        if (mounted) setConnectedAssignments(assignments);
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

  const assignments = useMemo<StudentAssignmentView[]>(() => {
    const previewAssignments: StudentAssignmentView[] = [
    {
      id: 'preview-1',
      title: 'Calculus Worksheet 4',
      subject: 'Mathematics',
      dueDate: 'Oct 12, 11:59 PM',
      status: 'In Progress',
      description: 'Complete problems 1-20 showing all work.',
      feedback: null,
      grade: null
    },
    {
      id: 'preview-2',
      title: 'Essay Draft: The Great Gatsby',
      subject: 'Literature',
      dueDate: 'Oct 15, 5:00 PM',
      status: 'Not Started',
      description: 'Submit your first draft focusing on character analysis of Gatsby.',
      feedback: null,
      grade: null
    },
    {
      id: 'preview-3',
      title: 'Lab Report: Photosynthesis',
      subject: 'Biology',
      dueDate: 'Oct 8, 11:59 PM',
      status: 'Submitted',
      description: 'Upload your completed lab report including graphs.',
      feedback: null,
      grade: null
    },
    {
      id: 'preview-4',
      title: 'History Quiz 2',
      subject: 'World History',
      dueDate: 'Oct 1, 11:59 PM',
      status: 'Graded',
      description: 'Online multiple choice quiz.',
      feedback: 'Great job! Make sure to review the causes of WWI.',
      grade: '95%'
    }
    ];

    const sharedAssignments = connectedAssignments.map<StudentAssignmentView>(assignment => ({
      id: assignment.id,
      title: assignment.title,
      subject: assignment.subject || assignment.class_name || 'Assigned work',
      dueDate: formatAssignmentDueDate(assignment.due_at),
      status: assignment.status === 'graded'
        ? 'Graded'
        : assignment.status === 'submitted'
          ? 'Submitted'
          : 'Not Started',
      description: assignment.description || assignment.topic || 'Open the assignment from your teacher.',
      feedback: assignment.feedback || null,
      grade: assignment.grade_label || (typeof assignment.score === 'number' && assignment.max_score ? `${Math.round((assignment.score / assignment.max_score) * 100)}%` : null),
      isConnected: true,
      raw: assignment,
      attachmentName: assignment.attachment_name,
      attachmentUrl: assignment.attachment_url,
    }));

    return [...sharedAssignments, ...previewAssignments];
  }, [connectedAssignments]);

  const assignmentsWithLocalStatus = assignments.map(assignment => ({
    ...assignment,
    status: localStatuses[assignment.id] || assignment.status,
  }));

  const filteredAssignments = assignmentsWithLocalStatus.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = `${assignment.title} ${assignment.subject} ${assignment.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleUploadWork = async (assignment: StudentAssignmentView) => {
    if (assignment.isConnected) {
      const updated = await submitConnectedAssignment(circle, assignment.id);
      if (updated) {
        setConnectedAssignments(await loadConnectedAssignments(circle));
        await sendConnectedMessage(
          circle,
          ['student', 'teacher'],
          'student',
          `Submitted ${updated.assignment_type}: ${updated.title}`
        );
      }
      return;
    }

    setLocalStatuses(prev => ({ ...prev, [assignment.id]: 'Submitted' }));
  };

  const handleAddComment = (assignmentTitle: string) => {
    const comment = window.prompt(`Add a comment for ${assignmentTitle}`);
    if (comment?.trim()) {
      alert('Comment added for this preview.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Not Started':
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-greyed-navy/10 text-greyed-navy"><XCircle className="w-3.5 h-3.5" /> Not Started</span>;
      case 'In Progress':
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800"><Clock className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Submitted':
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800"><CheckCircle className="w-3.5 h-3.5" /> Submitted</span>;
      case 'Graded':
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800"><AwardIcon className="w-3.5 h-3.5" /> Graded</span>;
      default:
        return null;
    }
  };

  return (
    <StudentLayout activePage="assignments">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <FileText className="w-8 h-8 text-greyed-blue" />
            Assignments & Homework
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">Track, submit, and review your coursework.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-greyed-navy/5 bg-greyed-white/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-greyed-navy/10 rounded-xl text-sm focus:outline-none focus:border-greyed-blue transition-colors"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {assignmentFilters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-greyed-navy text-white'
                    : 'bg-white border border-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/5'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="divide-y divide-greyed-navy/5">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="p-4 sm:p-6 hover:bg-greyed-white/50 transition-colors flex flex-col md:flex-row gap-6">
              
              {/* Info section */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-greyed-navy">{assignment.title}</h3>
                    <p className="text-sm text-greyed-blue font-semibold">{assignment.subject}</p>
                    {assignment.isConnected && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-green-700">Teacher assigned</p>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    {getStatusBadge(assignment.status)}
                  </div>
                </div>
                
                <p className="text-sm text-greyed-navy/70 mb-4">{assignment.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-greyed-navy/60">
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5" /> Due: {assignment.dueDate}
                  </span>

                  {assignment.attachmentName && (
                    <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      <FileText className="w-3.5 h-3.5" /> {assignment.attachmentName}
                    </span>
                  )}
                  
                  {assignment.grade && (
                     <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded font-bold">
                       Grade: {assignment.grade}
                     </span>
                  )}
                </div>

                {assignment.feedback && (
                  <div className="mt-4 p-3 bg-[#bbd7eb]/10 rounded-xl border border-[#bbd7eb]/20 flex gap-2">
                    <MessageSquare className="w-4 h-4 text-greyed-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-greyed-blue block mb-1">Teacher Feedback:</span>
                      <p className="text-sm text-greyed-navy/80">{assignment.feedback}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action section */}
              <div className="w-full md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-greyed-navy/10 pt-4 md:pt-0 md:pl-6">
                <div className="sm:hidden mb-4">
                  {getStatusBadge(assignment.status)}
                </div>

                {assignment.attachmentUrl && (
                  <a
                    href={assignment.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-greyed-navy/10 bg-white px-4 py-2.5 text-sm font-semibold text-greyed-navy transition-colors hover:bg-greyed-navy/5"
                  >
                    <Download className="h-4 w-4" />
                    Open File
                  </a>
                )}
                
                {assignment.status !== 'Graded' && assignment.status !== 'Submitted' && (
                  <button
                    onClick={() => handleUploadWork(assignment)}
                    className="w-full py-2.5 px-4 bg-[#2a2f6e] hover:bg-[#212754] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm mb-3"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Work
                  </button>
                )}
                
                {assignment.status === 'Submitted' && (
                  <div className="w-full py-2.5 px-4 bg-white border border-greyed-navy/10 text-greyed-navy rounded-xl text-sm font-semibold text-center opacity-70">
                    Awaiting Grade
                  </div>
                )}

                {assignment.status !== 'Graded' && (
                  <div className="text-center">
                    <button
                      onClick={() => handleAddComment(assignment.title)}
                      className="text-xs font-semibold text-greyed-blue hover:underline"
                    >
                      Add a comment
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {filteredAssignments.length === 0 && (
            <div className="p-12 text-center text-greyed-navy/50">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-semibold">No assignments found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

// Mini helper for the Graded badge
const AwardIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="6"></circle>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
  </svg>
);

export default AssignmentsPage;
