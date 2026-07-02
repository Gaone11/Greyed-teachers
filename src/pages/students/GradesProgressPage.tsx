import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  TrendingUp, 
  Award, 
  Star, 
  Target, 
  ChevronRight,
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const GradesProgressPage: React.FC = () => {
  // Gamified data
  const xp = 8450;
  const level = 12;
  const nextLevelXp = 10000;
  const xpProgress = (xp / nextLevelXp) * 100;

  const subjectMastery = [
    { subject: 'Mathematics', level: 8, progress: 75, color: 'bg-blue-500' },
    { subject: 'Literature', level: 9, progress: 90, color: 'bg-purple-500' },
    { subject: 'Physics', level: 6, progress: 45, color: 'bg-indigo-500' },
    { subject: 'History', level: 7, progress: 60, color: 'bg-green-500' },
  ];

  const recentResults = [
    { id: 1, title: 'Calculus Midterm', subject: 'Mathematics', type: 'Test', score: '92%', date: 'Oct 15', xpEarned: 500 },
    { id: 2, title: 'Gatsby Essay', subject: 'Literature', type: 'Assignment', score: '88%', date: 'Oct 12', xpEarned: 300 },
    { id: 3, title: 'Kinematics Lab', subject: 'Physics', type: 'Assignment', score: '85%', date: 'Oct 10', xpEarned: 250 },
    { id: 4, title: 'WWII Quiz', subject: 'History', type: 'Test', score: '95%', date: 'Oct 8', xpEarned: 150 },
  ];

  const skillsMastery = [
    { skill: 'Algebraic Equations', subject: 'Mathematics' },
    { skill: 'Literary Analysis', subject: 'Literature' },
    { skill: 'Newtonian Mechanics', subject: 'Physics' },
  ];

  const areasForImprovement = [
    { skill: 'Integration Techniques', subject: 'Mathematics', advice: 'Review partial fractions' },
    { skill: 'Historical Thesis Writing', subject: 'History', advice: 'Focus on clear arguments' },
  ];

  return (
    <StudentLayout activePage="grades">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-greyed-blue" />
          Grades & Progress
        </h1>
        <p className="text-greyed-navy/75 mt-1 font-medium">Track your performance and level up your learning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gamification Header */}
          <div className="bg-gradient-to-br from-[#212754] to-[#2a2f6e] rounded-2xl p-6 shadow-md text-white animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-[#212754] flex items-center justify-center border-4 border-[#212754]">
                      <span className="text-2xl font-bold font-headline">{level}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#212754]">
                    Lvl
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Scholar Rank</h2>
                  <p className="text-white/70 text-sm font-medium">Keep learning to reach the next rank!</p>
                </div>
              </div>

              <div className="w-full sm:w-1/2 flex flex-col justify-center">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> {xp.toLocaleString()} XP
                  </span>
                  <span className="text-white/50">{nextLevelXp.toLocaleString()} XP</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full relative" 
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results & Assignments */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-greyed-blue" />
                Recent Scores
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-greyed-navy/5 text-sm text-greyed-navy/50">
                    <th className="pb-3 font-semibold px-2">Title</th>
                    <th className="pb-3 font-semibold px-2">Type</th>
                    <th className="pb-3 font-semibold px-2">Score</th>
                    <th className="pb-3 font-semibold px-2 text-right">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-greyed-navy/5">
                  {recentResults.map((item) => (
                    <tr key={item.id} className="hover:bg-greyed-navy/5 transition-colors group">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-sm text-greyed-navy">{item.title}</div>
                        <div className="text-xs text-greyed-navy/60">{item.subject} • {item.date}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          item.type === 'Test' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-bold text-[#2a2f6e]">{item.score}</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-lg">
                          +{item.xpEarned} XP
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          
          {/* Subject Mastery */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5">
            <h2 className="text-lg font-bold text-greyed-navy flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-greyed-blue" />
              Subject Mastery
            </h2>
            <div className="space-y-4">
              {subjectMastery.map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold text-greyed-navy mb-1.5">
                    <span>{sub.subject}</span>
                    <span className="text-greyed-blue">Lvl {sub.level}</span>
                  </div>
                  <div className="w-full bg-greyed-navy/5 rounded-full h-2">
                    <div className={`${sub.color} h-2 rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Mastered */}
          <div className="bg-green-50 rounded-2xl p-5 shadow-sm border border-green-100">
            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Skills Mastered
            </h2>
            <div className="space-y-3">
              {skillsMastery.map((skill, i) => (
                <div key={i} className="bg-white/60 p-3 rounded-xl border border-green-200/50 flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-900">{skill.skill}</h4>
                    <p className="text-xs text-green-700/70">{skill.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-orange-50 rounded-2xl p-5 shadow-sm border border-orange-100">
            <h2 className="text-lg font-bold text-orange-900 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Needs Improvement
            </h2>
            <div className="space-y-3">
              {areasForImprovement.map((area, i) => (
                <div key={i} className="bg-white/60 p-3 rounded-xl border border-orange-200/50 flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-900">{area.skill}</h4>
                    <p className="text-xs text-orange-700/70 mb-1">{area.subject}</p>
                    <p className="text-xs font-semibold text-orange-800 bg-orange-100/50 px-2 py-1 rounded inline-block">
                      Tip: {area.advice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
};

export default GradesProgressPage;
