import React from 'react';
import ParentLayout from '../../layouts/ParentLayout';
import { useAuth } from '../../context/AuthContext';
import { useWorkflowDemo } from '../../context/WorkflowDemoContext';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ParentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const parentName = user?.user_metadata?.first_name || 'Parent';
  const { assignmentStatus, assignmentGrade } = useWorkflowDemo();

  return (
    <ParentLayout activePage="dashboard">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            Welcome back, {parentName}
          </h1>
          <p className="text-greyed-navy/70 mt-1">Here's what's happening with Emma's education today.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Excellent</span>
          </div>
          <p className="text-sm font-semibold text-greyed-navy/60 mb-1">Attendance</p>
          <p className="text-3xl font-black text-greyed-navy">98%</p>
          <p className="text-sm text-greyed-navy/70 mt-1 flex items-center gap-1">
            0 absences this term
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-semibold text-greyed-navy/60 mb-1">Overall Grade</p>
          <p className="text-3xl font-black text-greyed-navy flex items-center gap-2">
            {assignmentStatus === 'graded' ? 'A+' : 'A-'}
            {assignmentStatus === 'graded' && <TrendingUp className="w-5 h-5 text-green-500 animate-bounce" />}
          </p>
          <p className="text-sm text-green-600 font-semibold mt-1 flex items-center gap-1">
            Top 10% of class
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            {assignmentStatus === 'assigned' && <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg animate-pulse">Action Needed</span>}
          </div>
          <p className="text-sm font-semibold text-greyed-navy/60 mb-1">Homework Completion</p>
          <p className="text-3xl font-black text-greyed-navy">
            {assignmentStatus === 'assigned' ? '88%' : assignmentStatus === 'graded' ? '96%' : '92%'}
          </p>
          <p className="text-sm text-greyed-navy/70 mt-1 flex items-center gap-1">
            {assignmentStatus === 'assigned' ? '1 pending assignment' : 'All caught up!'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <p className="text-sm font-semibold text-greyed-navy/60 mb-1">Teacher Feedback</p>
          <p className="text-3xl font-black text-greyed-navy">2</p>
          <p className="text-sm text-greyed-navy/70 mt-1 flex items-center gap-1">
            Unread messages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity / Demo Workflow */}
          <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-greyed-navy">Recent Academic Activity</h2>
              <Link to="/parents/notifications" className="text-sm font-semibold text-greyed-blue hover:text-greyed-navy transition-colors">View Full Report</Link>
            </div>
            
            <div className="space-y-4">
              {/* Workflow Demo State */}
              {assignmentStatus !== 'unassigned' && (
                <div className={`p-4 border rounded-xl flex items-center justify-between group transition-colors ${
                  assignmentStatus === 'assigned' ? 'border-orange-200 bg-orange-50' : 
                  assignmentStatus === 'submitted' ? 'border-blue-200 bg-blue-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      assignmentStatus === 'assigned' ? 'bg-orange-100 text-orange-600' : 
                      assignmentStatus === 'submitted' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {assignmentStatus === 'assigned' ? <AlertTriangle className="w-5 h-5" /> :
                       assignmentStatus === 'submitted' ? <FileText className="w-5 h-5" /> :
                       <CheckCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-greyed-navy">History Midterm Essay (Demo)</h3>
                      <p className="text-xs text-greyed-navy/60 mt-0.5">
                        {assignmentStatus === 'assigned' ? 'Assigned by Teacher • Due Tomorrow' : 
                         assignmentStatus === 'submitted' ? 'Submitted by Emma • Pending Grade' :
                         `Graded • Score: ${assignmentGrade}%`}
                      </p>
                    </div>
                  </div>
                  {assignmentStatus === 'assigned' && <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending Action</span>}
                  {assignmentStatus === 'submitted' && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">In Review</span>}
                  {assignmentStatus === 'graded' && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">New Result</span>}
                </div>
              )}

              <div className="p-4 border border-greyed-navy/10 rounded-xl flex items-center justify-between group hover:border-greyed-blue/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-greyed-navy">Physics Midterm Graded</h3>
                    <p className="text-xs text-greyed-navy/60 mt-0.5">Score: 92% (A)</p>
                  </div>
                </div>
                <Link to="/parents/notifications" className="text-greyed-blue p-2 rounded-lg hover:bg-blue-50 transition-colors" aria-label="View grade details">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="p-4 border border-greyed-navy/10 rounded-xl flex items-center justify-between group hover:border-greyed-blue/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-greyed-navy">Student of the Month Nomination</h3>
                    <p className="text-xs text-greyed-navy/60 mt-0.5">Emma was nominated by Mr. Davis.</p>
                  </div>
                </div>
                <Link to="/parents/notifications" className="text-greyed-blue p-2 rounded-lg hover:bg-blue-50 transition-colors" aria-label="View nomination details">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-lg font-bold text-greyed-navy mb-4">Emma's Schedule Today</h2>
            <div className="space-y-4">
              <div className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-blue-500 absolute left-[11px] top-2 z-10"></div>
                <div className="w-0.5 bg-greyed-navy/5 absolute left-3 top-4 bottom-[-16px]"></div>
                <div className="w-16 text-right pt-0.5">
                  <span className="text-xs font-bold text-greyed-navy/50">09:00</span>
                </div>
                <div className="flex-1 bg-blue-50/50 border border-blue-100 p-3 rounded-xl ml-2">
                  <h4 className="font-bold text-greyed-navy text-sm">Biology 101</h4>
                  <p className="text-xs text-greyed-navy/60 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Room 302
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-greyed-navy/20 absolute left-[11px] top-2 z-10"></div>
                <div className="w-16 text-right pt-0.5">
                  <span className="text-xs font-bold text-greyed-navy/50">11:30</span>
                </div>
                <div className="flex-1 bg-greyed-navy/5 border border-transparent p-3 rounded-xl ml-2">
                  <h4 className="font-bold text-greyed-navy text-sm">Literature</h4>
                  <p className="text-xs text-greyed-navy/60 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Library
                  </p>
                </div>
              </div>
            </div>
            
            <Link to="/parents/timetable" className="mt-6 block text-center w-full py-2 bg-greyed-navy/5 text-greyed-navy font-semibold rounded-xl hover:bg-greyed-navy/10 transition-colors">
              View Full Calendar
            </Link>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentDashboardPage;
