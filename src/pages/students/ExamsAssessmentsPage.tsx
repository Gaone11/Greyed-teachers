import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  PenTool, 
  BarChart2,
  Download,
  PlayCircle
} from 'lucide-react';

const ExamsAssessmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'revision' | 'practice' | 'results'>('schedule');

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', title: 'Calculus Final Exam', date: 'Oct 30, 2026', time: '09:00 AM', room: 'Hall A', status: 'Upcoming', daysLeft: 14 },
    { id: 2, subject: 'Physics', title: 'Kinematics Midterm', date: 'Oct 20, 2026', time: '11:00 AM', room: 'Lab 1', status: 'Upcoming', daysLeft: 4 },
  ];

  const revisionMaterials = [
    { id: 1, subject: 'Mathematics', title: 'Calculus Formula Sheet', type: 'PDF', size: '2.4 MB' },
    { id: 2, subject: 'Physics', title: 'Kinematics Summary Notes', type: 'Document', size: '1.1 MB' },
    { id: 3, subject: 'Literature', title: 'Gatsby Character Map', type: 'Image', size: '3.5 MB' },
  ];

  const practiceTests = [
    { id: 1, subject: 'Mathematics', title: 'Mock Exam: Derivatives', questions: 20, timeLimit: '45 mins' },
    { id: 2, subject: 'History', title: 'WWI Practice Quiz', questions: 15, timeLimit: '20 mins' },
  ];

  const pastResults = [
    { id: 1, subject: 'Biology', title: 'Cell Structure Quiz', score: '95%', grade: 'A' },
    { id: 2, subject: 'Literature', title: 'Poetry Analysis Essay', score: '88%', grade: 'B+' },
  ];

  return (
    <StudentLayout activePage="exams">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-greyed-blue" />
            Exams & Assessments
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">Manage your test schedules and track your performance.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Tabs */}
        <div className="flex border-b border-greyed-navy/10 bg-greyed-white/50 px-2 sm:px-6 overflow-x-auto hide-scrollbar">
          {[
            { id: 'schedule', label: 'Exam Schedule', icon: Calendar },
            { id: 'revision', label: 'Revision Materials', icon: FileText },
            { id: 'practice', label: 'Practice Tests', icon: PenTool },
            { id: 'results', label: 'Results Tracking', icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 min-h-[400px]">
          
          {/* Exam Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-5 border border-greyed-navy/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-greyed-blue/30 transition-colors bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#bbd7eb]/20 text-[#2a2f6e] rounded-xl flex flex-col items-center justify-center border border-[#bbd7eb]/50 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase">{exam.date.split(' ')[0]}</span>
                      <span className="text-xl font-headline font-bold">{exam.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-greyed-navy">{exam.title}</h3>
                      <p className="text-sm font-semibold text-greyed-blue mb-2">{exam.subject}</p>
                      <div className="flex items-center gap-3 text-xs font-semibold text-greyed-navy/60">
                        <span className="bg-greyed-navy/5 px-2 py-1 rounded">Time: {exam.time}</span>
                        <span className="bg-greyed-navy/5 px-2 py-1 rounded">Room: {exam.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                      exam.daysLeft <= 7 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      In {exam.daysLeft} Days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revision Materials */}
          {activeTab === 'revision' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {revisionMaterials.map((mat) => (
                <div key={mat.id} className="p-4 border border-greyed-navy/10 rounded-2xl bg-white hover:shadow-md transition-shadow group flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2f6e]/5 text-[#2a2f6e] flex items-center justify-center group-hover:bg-[#2a2f6e] group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-greyed-navy line-clamp-1">{mat.title}</h3>
                      <p className="text-xs text-greyed-navy/50">{mat.subject}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-greyed-navy/5">
                    <span className="text-xs font-semibold text-greyed-navy/40">{mat.type} • {mat.size}</span>
                    <button className="text-greyed-blue hover:text-[#2a2f6e] transition-colors p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Practice Tests */}
          {activeTab === 'practice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceTests.map((test) => (
                <div key={test.id} className="p-5 border border-indigo-100 bg-indigo-50/30 rounded-2xl flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-indigo-900 mb-1">{test.title}</h3>
                    <p className="text-xs font-semibold text-indigo-700/70">{test.subject} • {test.questions} Questions • {test.timeLimit}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors transform group-hover:scale-105">
                    <PlayCircle className="w-4 h-4" /> Start
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Results & Performance Analysis */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="bg-[#2a2f6e] text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#bbd7eb]" /> Overall Performance
                  </h3>
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold">GPA: 3.8</span>
                </div>
                <div className="h-40 flex items-end gap-2 border-b border-white/20 pb-2">
                  {/* Mock Chart Bars */}
                  {[60, 75, 80, 92, 85, 95].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full bg-[#bbd7eb]/80 rounded-t-sm hover:bg-white transition-colors relative" style={{ height: `${val}%` }}>
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                           {val}%
                         </div>
                      </div>
                      <span className="text-[10px] font-bold opacity-60">Exam {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-greyed-navy mb-4">Past Results</h3>
                <div className="divide-y divide-greyed-navy/5 border border-greyed-navy/10 rounded-2xl overflow-hidden">
                  {pastResults.map((result) => (
                    <div key={result.id} className="p-4 flex items-center justify-between bg-white hover:bg-greyed-navy/5 transition-colors">
                      <div>
                        <h4 className="font-bold text-sm text-greyed-navy">{result.title}</h4>
                        <span className="text-xs text-greyed-navy/50">{result.subject}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-[#2a2f6e]">{result.score}</span>
                        <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm border border-green-200">
                          {result.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </StudentLayout>
  );
};

export default ExamsAssessmentsPage;
