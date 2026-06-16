import React from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useWorkflowDemo } from '../../context/WorkflowDemoContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Award, 
  Target, 
  Bell, 
  BookOpen, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.first_name || 'Emma';
  const { assignmentStatus, assignmentGrade, submitHomework } = useWorkflowDemo();

  // Mock Data
  const todaysClasses = [
    { id: 1, subject: 'Mathematics', time: '09:00 AM', room: 'Room 302', color: 'bg-[#bbd7eb]' },
    { id: 2, subject: 'Physics', time: '11:00 AM', room: 'Lab 1', color: 'bg-[#2a2f6e] text-white' },
    { id: 3, subject: 'Literature', time: '01:30 PM', room: 'Room 105', color: 'bg-[#212754] text-white' },
  ];

  const upcomingHomework = [
    { id: 1, title: 'Calculus Worksheet 4', subject: 'Mathematics', due: 'Tomorrow, 11:59 PM', status: 'In Progress' },
    { id: 2, title: 'Essay Draft', subject: 'Literature', due: 'Friday, 5:00 PM', status: 'Not Started' },
  ];

  const recentGrades = [
    { id: 1, subject: 'Physics', title: 'Midterm Exam', grade: '92%', trend: 'up' },
    { id: 2, subject: 'History', title: 'Research Paper', grade: '88%', trend: 'up' },
  ];

  const announcements = [
    { id: 1, title: 'Science Fair Registration Open', date: 'Today' },
    { id: 2, title: 'Library Hours Extended', date: 'Yesterday' },
  ];

  return (
    <StudentLayout activePage="dashboard">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy">
          Welcome back, {userName}!
        </h1>
        <p className="text-greyed-beige/70 mt-1">Here is an overview of your academic day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Left Column: Timetable & Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-greyed-blue" />
                Today's Timetable
              </h2>
              <Link to="/students/timetable" className="text-xs font-semibold text-greyed-blue hover:text-[#2a2f6e] transition-colors">
                View Full Timetable
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {todaysClasses.map((cls) => (
                <div key={cls.id} className={`${cls.color} rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[100px]`}>
                  <div>
                    <h3 className="font-bold font-headline">{cls.subject}</h3>
                    <p className="text-xs opacity-90 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {cls.time}
                    </p>
                  </div>
                  <div className="text-xs font-medium mt-3 opacity-90 text-right">
                    {cls.room}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homework Due Dates */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-greyed-blue" />
                Homework & Assignments
              </h2>
              <Link to="/students/assignments" className="text-xs font-semibold text-greyed-blue hover:text-[#2a2f6e] transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              
              {/* Demo Workflow Assignment */}
              {assignmentStatus !== 'unassigned' && (
                <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  assignmentStatus === 'assigned' ? 'border-blue-300 bg-blue-50/50 hover:border-blue-400' :
                  assignmentStatus === 'submitted' ? 'border-yellow-300 bg-yellow-50/50' :
                  'border-green-300 bg-green-50/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      assignmentStatus === 'assigned' ? 'bg-blue-100 text-blue-600' :
                      assignmentStatus === 'submitted' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {assignmentStatus === 'graded' ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-greyed-navy">History Midterm Essay (Demo)</h4>
                      <p className="text-xs text-greyed-beige/60">
                        History 101 • 
                        {assignmentStatus === 'assigned' ? ' Due: Tomorrow' :
                         assignmentStatus === 'submitted' ? ' Waiting for grade' :
                         ` Graded: ${assignmentGrade}%`}
                      </p>
                    </div>
                  </div>
                  
                  {assignmentStatus === 'assigned' && (
                    <button 
                      onClick={submitHomework}
                      className="px-3 py-1.5 bg-greyed-navy text-white text-xs font-bold rounded hover:bg-greyed-navy/90 animate-pulse shadow-sm"
                    >
                      Submit Now
                    </button>
                  )}
                  {assignmentStatus === 'submitted' && (
                     <span className="px-2 py-1 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700">
                       Submitted
                     </span>
                  )}
                  {assignmentStatus === 'graded' && (
                     <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700">
                       Completed
                     </span>
                  )}
                </div>
              )}

              {upcomingHomework.map((hw) => (
                <div key={hw.id} className="flex items-center justify-between p-3 rounded-xl border border-greyed-navy/10 hover:border-greyed-blue/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-greyed-blue/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-greyed-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-greyed-navy">{hw.title}</h4>
                      <p className="text-xs text-greyed-beige/60">{hw.subject} • Due: {hw.due}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    hw.status === 'In Progress' ? 'bg-[#bbd7eb]/30 text-[#2a2f6e]' : 'bg-red-50 text-red-600'
                  }`}>
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-greyed-blue" />
              Recent Grades
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="p-4 rounded-xl border border-greyed-navy/5 bg-greyed-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-greyed-navy text-sm">{grade.subject}</h4>
                    <p className="text-xs text-greyed-beige/60">{grade.title}</p>
                  </div>
                  <div className="text-xl font-bold text-[#2a2f6e]">{grade.grade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Attendance Status */}
          <div className="bg-gradient-to-br from-[#212754] to-[#2a2f6e] rounded-2xl p-5 shadow-sm text-white relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <CheckCircle className="w-5 h-5 text-[#bbd7eb]" />
              Overall GPA
            </h2>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-4xl font-bold flex items-center gap-2">
                  {assignmentStatus === 'graded' ? '3.92' : '3.85'}
                  {assignmentStatus === 'graded' && <TrendingUp className="w-6 h-6 text-green-400 animate-bounce" />}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {assignmentStatus === 'graded' ? 'Increased from 3.85!' : 'Current Semester'}
                </p>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-greyed-blue" />
              Learning Goals
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-greyed-navy mb-1">
                  <span>Read 5 books</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-greyed-navy/10 rounded-full h-2">
                  <div className="bg-greyed-blue h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-greyed-navy mb-1">
                  <span>Master Calculus limits</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-greyed-navy/10 rounded-full h-2">
                  <div className="bg-[#2a2f6e] h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-greyed-blue" />
              Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200" title="Perfect Attendance">
                🏆
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200" title="Math Wizard">
                📐
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border border-green-200" title="Science Fair Winner">
                🔬
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200" title="Creative Writer">
                ✍️
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-[#bbd7eb]/20 rounded-2xl p-5 shadow-sm border border-[#bbd7eb]/30">
            <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#2a2f6e]" />
              Announcements
            </h2>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="pb-3 border-b border-[#bbd7eb]/30 last:border-0 last:pb-0">
                  <h4 className="text-sm font-semibold text-greyed-navy">{ann.title}</h4>
                  <p className="text-xs text-greyed-navy/60">{ann.date}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboardPage;
