import React, { useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { useWorkflowDemo } from '../../context/WorkflowDemoContext';
import { 
  FileText, 
  Plus, 
  Filter,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

const TeacherAssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'grading' | 'completed'>('active');
  const [showOnlyUngraded, setShowOnlyUngraded] = useState(false);
  const [gradedTaskIds, setGradedTaskIds] = useState<number[]>([]);
  const { assignmentStatus, assignmentGrade, assignHomework, gradeHomework } = useWorkflowDemo();

  const gradingTasks = [
    { id: 1, title: 'History Midterm Essay', class: 'History 101', due: 'Tomorrow', submitted: assignmentStatus === 'submitted' || assignmentStatus === 'graded' ? 1 : 0, total: 1 },
    { id: 2, name: 'Emma H.', date: 'Today, 9:12 AM' },
    { id: 3, name: 'Lebo M.', date: 'Yesterday, 4:40 PM' },
    { id: 4, name: 'Ava K.', date: 'Yesterday, 3:18 PM' },
  ];

  const visibleStudentTasks = gradingTasks
    .slice(1)
    .filter(task => !showOnlyUngraded || !gradedTaskIds.includes(task.id));

  const handleCreateHomework = () => {
    assignHomework();
    setActiveTab('active');
    alert('Homework assigned to the demo student.');
  };

  const handleGradeTask = (taskId?: number) => {
    if (taskId) {
      setGradedTaskIds(prev => Array.from(new Set([...prev, taskId])));
    } else {
      setGradedTaskIds(gradingTasks.slice(1).map(task => task.id));
    }

    gradeHomework();
    setActiveTab('completed');
  };

  return (
    <TeacherLayout activePage="assignments">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-greyed-blue" />
            Assignments & Homework
          </h1>
          <p className="text-greyed-navy/70 mt-1">Create homework, grade submissions, and give feedback.</p>
        </div>
        
        <button
          onClick={handleCreateHomework}
          className="bg-greyed-navy hover:bg-greyed-navy/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Homework
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="flex border-b border-greyed-navy/10">
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative ${activeTab === 'active' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Homework
            {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'grading' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('grading')}
          >
            Needs Grading
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">12</span>
            {activeTab === 'grading' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative ${activeTab === 'completed' ? 'text-greyed-navy' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
            {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-navy"></div>}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-greyed-navy">Submissions Awaiting Review</h2>
                <button
                  onClick={() => setShowOnlyUngraded(enabled => !enabled)}
                  className="text-sm text-greyed-blue font-semibold flex items-center gap-1 hover:underline"
                >
                  <Filter className="w-4 h-4" /> {showOnlyUngraded ? 'Show All' : 'Filter'}
                </button>
              </div>

              <div className="bg-greyed-navy/5 rounded-xl border border-greyed-navy/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-greyed-navy text-lg">{gradingTasks[0].title}</h3>
                  <p className="text-sm text-greyed-navy/60">{gradingTasks[0].class} • Due {gradingTasks[0].due}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-greyed-navy">{gradingTasks[0].submitted}/{gradingTasks[0].total}</p>
                    <p className="text-xs text-greyed-navy/60 uppercase font-bold">Submitted</p>
                  </div>
                  <button
                    onClick={() => handleGradeTask()}
                    className="bg-white border border-greyed-navy/20 text-greyed-navy px-4 py-2 rounded-lg font-semibold hover:bg-greyed-navy/5 transition-colors"
                  >
                    Grade All
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {visibleStudentTasks.map((task) => (
                  <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-greyed-navy/10 rounded-xl hover:border-greyed-blue/30 transition-colors bg-white">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-greyed-blue/10 flex items-center justify-center text-greyed-blue font-bold">
                        {task.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-greyed-navy">{task.name}</p>
                        <p className="text-xs text-greyed-navy/60">Submitted: {task.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert(`${task.name}'s work opened in this preview.`)}
                        className="flex items-center gap-2 text-sm text-greyed-navy/70 hover:text-greyed-navy px-3 py-1.5 rounded-lg hover:bg-greyed-navy/5 transition-colors border border-transparent"
                      >
                        <FileText className="w-4 h-4" /> View Work
                      </button>
                      <button
                        onClick={() => handleGradeTask(task.id)}
                        className="flex items-center gap-2 text-sm text-greyed-blue bg-greyed-blue/10 hover:bg-greyed-blue/20 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                      >
                        <MessageSquare className="w-4 h-4" /> Grade & Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'grading' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-greyed-navy/5 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-greyed-navy/40" />
              </div>
              <h3 className="text-lg font-bold text-greyed-navy">No {activeTab} assignments</h3>
              <p className="text-greyed-navy/60 mt-2 max-w-sm">
                {activeTab === 'completed' && gradedTaskIds.length > 0
                  ? `Grading complete. Latest demo score: ${assignmentGrade}%.`
                  : 'When you create new homework assignments or complete grading, they will appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAssignmentsPage;
