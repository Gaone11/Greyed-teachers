import React from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';

const TeacherAnalyticsPage: React.FC = () => {
  return (
    <TeacherLayout activePage="analytics">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-greyed-blue" />
            Analytics & Reports
          </h1>
          <p className="text-greyed-navy/70 mt-1">Track performance, attendance, and identify at-risk students.</p>
        </div>
        
        <button className="bg-white border border-greyed-navy/20 hover:bg-greyed-navy/5 text-greyed-navy px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+2.4%</span>
          </div>
          <h3 className="text-greyed-navy/60 font-semibold text-sm">Average Class Grade</h3>
          <p className="text-3xl font-black text-greyed-navy mt-1">82.5%</p>
          <p className="text-xs text-greyed-navy/50 mt-2">vs. last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">-1.1%</span>
          </div>
          <h3 className="text-greyed-navy/60 font-semibold text-sm">Average Attendance</h3>
          <p className="text-3xl font-black text-greyed-navy mt-1">94.2%</p>
          <p className="text-xs text-greyed-navy/50 mt-2">vs. last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-greyed-navy/10 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-greyed-navy/60 font-semibold text-sm">At-Risk Students</h3>
          <p className="text-3xl font-black text-greyed-navy mt-1">3</p>
          <p className="text-xs text-greyed-navy/50 mt-2">Requires immediate attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-greyed-navy">Class Performance Trend</h2>
              <button className="text-sm font-semibold text-greyed-navy/60 flex items-center gap-1 border border-greyed-navy/20 px-3 py-1.5 rounded-lg">
                Last 6 Months <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-64 flex items-end gap-2">
              {[65, 70, 72, 68, 75, 82].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-greyed-blue/20 rounded-t-lg relative group hover:bg-greyed-blue transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-greyed-navy text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {height}%
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-greyed-navy/50">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-greyed-navy">At-Risk Alerts</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-greyed-navy/10 p-3 rounded-xl bg-red-50/50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-greyed-navy text-sm">Noah Williams</h3>
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Attendance</span>
                </div>
                <p className="text-xs text-greyed-navy/70 mt-1 mb-2">Missed 4 classes in the last 2 weeks.</p>
                <button className="text-xs font-bold text-red-600 hover:underline">Message Parent</button>
              </div>

              <div className="border border-greyed-navy/10 p-3 rounded-xl bg-orange-50/50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-greyed-navy text-sm">Sophia Martinez</h3>
                  <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Grades</span>
                </div>
                <p className="text-xs text-greyed-navy/70 mt-1 mb-2">Score dropped by 15% in recent exams.</p>
                <button className="text-xs font-bold text-orange-600 hover:underline">Schedule Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAnalyticsPage;
