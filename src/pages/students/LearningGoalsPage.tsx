import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  Target, 
  PlusCircle, 
  CheckCircle2, 
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  MoreVertical
} from 'lucide-react';

const LearningGoalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const goals = [
    {
      id: 1,
      title: 'Read 5 Books this Semester',
      category: 'Reading',
      progress: 3,
      total: 5,
      deadline: 'Dec 15, 2026',
      status: 'active',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      title: 'Master Calculus Limits',
      category: 'Mathematics',
      progress: 80,
      total: 100,
      deadline: 'Nov 1, 2026',
      status: 'active',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 3,
      title: 'Complete History Research Paper',
      category: 'History',
      progress: 50,
      total: 100,
      deadline: 'Oct 30, 2026',
      status: 'active',
      icon: Target,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 4,
      title: 'Score 90%+ on Physics Midterm',
      category: 'Physics',
      progress: 92,
      total: 100,
      deadline: 'Oct 15, 2026',
      status: 'completed',
      icon: Award,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 5,
      title: 'Perfect Attendance for September',
      category: 'General',
      progress: 100,
      total: 100,
      deadline: 'Sep 30, 2026',
      status: 'completed',
      icon: CheckCircle2,
      color: 'bg-yellow-100 text-yellow-700'
    }
  ];

  const filteredGoals = goals.filter(g => g.status === activeTab);

  return (
    <StudentLayout activePage="goals">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Target className="w-8 h-8 text-greyed-blue" />
            Learning Goals
          </h1>
          <p className="text-greyed-beige/70 mt-1">Set, track, and achieve your academic objectives.</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2a2f6e] hover:bg-[#212754] text-white rounded-xl font-bold shadow-sm transition-all transform hover:-translate-y-0.5">
          <PlusCircle className="w-5 h-5" />
          Set New Goal
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Tabs */}
        <div className="flex border-b border-greyed-navy/10 bg-greyed-white/50 px-2 sm:px-6">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'active' ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            Active Goals
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'completed' ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </button>
        </div>

        {/* Goals List */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const Icon = goal.icon;
            const percentage = Math.round((goal.progress / goal.total) * 100);

            return (
              <div 
                key={goal.id} 
                className={`relative rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md ${
                  goal.status === 'completed' ? 'bg-green-50/30 border-green-100' : 'bg-white border-greyed-navy/10 hover:border-greyed-blue/30'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button className="text-greyed-navy/30 hover:text-greyed-navy transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-greyed-navy/50 block mb-1">
                    {goal.category}
                  </span>
                  <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${goal.status === 'completed' ? 'text-green-900' : 'text-greyed-navy'}`}>
                    {goal.title}
                  </h3>
                  
                  {goal.status === 'active' ? (
                    <p className="text-xs font-semibold text-red-600/80 flex items-center gap-1 mb-4 bg-red-50 inline-block px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 inline" /> Due {goal.deadline}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-green-600 flex items-center gap-1 mb-4 bg-green-100 inline-block px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 inline" /> Achieved
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-auto pt-4 border-t border-greyed-navy/5">
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className={goal.status === 'completed' ? 'text-green-700' : 'text-greyed-navy'}>
                      {goal.status === 'active' ? `${percentage}%` : 'Complete'}
                    </span>
                    <span className="text-greyed-navy/40">
                      {goal.progress} / {goal.total}
                    </span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${goal.status === 'completed' ? 'bg-green-200' : 'bg-greyed-navy/5'}`}>
                    <div 
                      className={`h-full rounded-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-[#2a2f6e]'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Completion Overlay (Subtle) */}
                {goal.status === 'completed' && (
                  <div className="absolute top-4 right-12 opacity-10 transform rotate-12 pointer-events-none">
                    <Award className="w-24 h-24 text-green-500" />
                  </div>
                )}
              </div>
            );
          })}

          {filteredGoals.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-16 h-16 bg-greyed-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-greyed-navy/30" />
              </div>
              <h3 className="text-lg font-bold text-greyed-navy mb-1">No {activeTab} goals found</h3>
              <p className="text-sm text-greyed-navy/60">
                {activeTab === 'active' 
                  ? "You haven't set any learning goals yet. Click 'Set New Goal' to start." 
                  : "You haven't completed any goals yet. Keep working at it!"}
              </p>
            </div>
          )}

        </div>
      </div>
    </StudentLayout>
  );
};

export default LearningGoalsPage;
