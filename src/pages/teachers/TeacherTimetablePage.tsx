import React, { useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  MapPin, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Share2,
  RefreshCw
} from 'lucide-react';

const TeacherTimetablePage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const weekLabel = currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekEndLabel = new Date(currentWeek.getTime() + 4 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const moveWeek = (direction: -1 | 1) => {
    setCurrentWeek(date => new Date(date.getTime() + direction * 7 * 24 * 60 * 60 * 1000));
  };

  const schedule = [
    { id: 1, title: 'Biology 101', type: 'Class', time: '09:00 AM - 10:30 AM', location: 'Room 302', date: 'Monday' },
    { id: 2, title: 'Department Meeting', type: 'Meeting', time: '11:00 AM - 12:00 PM', location: 'Staff Room', date: 'Monday' },
    { id: 3, title: 'Chemistry Adv', type: 'Class', time: '01:00 PM - 02:30 PM', location: 'Lab 4', date: 'Tuesday' },
    { id: 4, title: 'Student Consultation', type: 'Office Hours', time: '03:00 PM - 04:00 PM', location: 'Office 12', date: 'Wednesday' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <TeacherLayout activePage="timetable">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-greyed-blue" />
            Timetable Management
          </h1>
          <p className="text-greyed-navy/70 mt-1">Schedule lessons, reschedule classes, and share updates.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => alert('Schedule updates shared with classes in this preview.')}
            className="bg-white border border-greyed-navy/20 hover:bg-greyed-navy/5 text-greyed-navy px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            Share Updates
          </button>
          <button
            onClick={() => alert('Lesson scheduling form is a demo action here.')}
            className="bg-greyed-navy hover:bg-greyed-navy/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Schedule Lesson
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        {/* Calendar Header */}
        <div className="p-4 md:p-6 border-b border-greyed-navy/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => moveWeek(-1)}
              className="p-2 border border-greyed-navy/20 rounded-lg text-greyed-navy/60 hover:bg-greyed-navy/5 transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-greyed-navy min-w-[150px] text-center">
              {weekLabel} - {weekEndLabel}
            </h2>
            <button
              onClick={() => moveWeek(1)}
              className="p-2 border border-greyed-navy/20 rounded-lg text-greyed-navy/60 hover:bg-greyed-navy/5 transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="text-sm font-semibold text-greyed-navy border border-greyed-navy/20 px-4 py-2 rounded-lg hover:bg-greyed-navy/5 transition-colors"
            >
              Today
            </button>
            <div className="bg-greyed-navy/5 p-1 rounded-lg flex border border-greyed-navy/10">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-bold ${viewMode === 'week' ? 'bg-white shadow-sm text-greyed-navy' : 'text-greyed-navy/60 hover:text-greyed-navy'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-bold ${viewMode === 'month' ? 'bg-white shadow-sm text-greyed-navy' : 'text-greyed-navy/60 hover:text-greyed-navy'}`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto p-6">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              {days.map(day => (
                <div key={day} className="text-center pb-2 border-b-2 border-greyed-navy/10">
                  <h3 className="font-bold text-greyed-navy">{day}</h3>
                </div>
              ))}
            </div>

            {/* Timetable Content */}
            <div className="grid grid-cols-5 gap-4 min-h-[400px]">
              {days.map(day => (
                <div key={day} className="space-y-3">
                  {schedule.filter(s => s.date === day).map(item => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-xl border relative group cursor-pointer hover:shadow-md transition-all ${
                        item.type === 'Class' ? 'bg-blue-50/50 border-blue-200' :
                        item.type === 'Meeting' ? 'bg-purple-50/50 border-purple-200' :
                        'bg-orange-50/50 border-orange-200'
                      }`}
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`${item.title} options opened in this preview.`)} className="p-1 hover:bg-white/50 rounded" title="Options">
                          <MoreVertical className="w-4 h-4 text-greyed-navy/60" />
                        </button>
                      </div>
                      
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex w-max mb-2 ${
                        item.type === 'Class' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'Meeting' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.type}
                      </span>
                      
                      <h4 className="font-bold text-greyed-navy text-sm mb-1 pr-6">{item.title}</h4>
                      
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <button
                          onClick={() => alert(`${item.title} marked for reschedule in this preview.`)}
                          className="p-2 bg-greyed-navy/5 hover:bg-greyed-blue/10 text-greyed-navy hover:text-greyed-blue rounded-lg transition-colors"
                          title="Reschedule"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty Slot Droppable Area (Mock) */}
                  <button
                    onClick={() => alert(`Add a new item for ${day} in this preview.`)}
                    className="h-24 w-full rounded-xl border-2 border-dashed border-greyed-navy/10 hover:border-greyed-blue/40 hover:bg-greyed-blue/5 transition-colors flex items-center justify-center cursor-pointer group"
                  >
                    <Plus className="w-6 h-6 text-greyed-navy/20 group-hover:text-greyed-blue/50" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherTimetablePage;
