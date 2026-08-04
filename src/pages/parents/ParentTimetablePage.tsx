import React, { useEffect, useMemo, useState } from 'react';
import ParentLayout from '../../layouts/ParentLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bell
} from 'lucide-react';
import { CONNECTION_UPDATED_EVENT, loadConnectionCircle } from '../../lib/connection-circle';
import {
  CONNECTED_TIMETABLE_UPDATED_EVENT,
  ConnectedTimetableItem,
  formatTimetableTimeRange,
  loadConnectedTimetableItems,
} from '../../lib/connected-timetable';

interface ParentScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  teacher: string;
  date: string;
  isTeacherUpdate?: boolean;
}

const ParentTimetablePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'classes' | 'exams' | 'events'>('classes');
  const [weekOffset, setWeekOffset] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState(false);
  const [teacherUpdates, setTeacherUpdates] = useState<ConnectedTimetableItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const refreshTimetable = () => {
      const circle = loadConnectionCircle();
      loadConnectedTimetableItems(circle).then(items => {
        if (mounted) setTeacherUpdates(items);
      });
    };

    refreshTimetable();
    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshTimetable);
    window.addEventListener(CONNECTED_TIMETABLE_UPDATED_EVENT, refreshTimetable);
    window.addEventListener('storage', refreshTimetable);

    return () => {
      mounted = false;
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshTimetable);
      window.removeEventListener(CONNECTED_TIMETABLE_UPDATED_EVENT, refreshTimetable);
      window.removeEventListener('storage', refreshTimetable);
    };
  }, []);

  const weekLabel = weekOffset === 0
    ? 'Oct 16 - Oct 20, 2023'
    : weekOffset < 0
      ? 'Oct 9 - Oct 13, 2023'
      : 'Oct 23 - Oct 27, 2023';

  const schedule = useMemo<ParentScheduleItem[]>(() => {
    const previewSchedule: ParentScheduleItem[] = [
      { id: 'preview-1', title: 'Biology 101', time: '09:00 AM - 10:30 AM', location: 'Room 302', teacher: 'Ms. Smith', date: 'Monday' },
      { id: 'preview-2', title: 'Mathematics Adv', time: '11:00 AM - 12:30 PM', location: 'Room 405', teacher: 'Mr. Johnson', date: 'Monday' },
      { id: 'preview-3', title: 'Literature', time: '01:30 PM - 03:00 PM', location: 'Library', teacher: 'Mrs. Davis', date: 'Monday' },
      { id: 'preview-4', title: 'Physics', time: '09:00 AM - 10:30 AM', location: 'Lab 2', teacher: 'Dr. Brown', date: 'Tuesday' },
      { id: 'preview-5', title: 'Physical Education', time: '11:00 AM - 12:30 PM', location: 'Gymnasium', teacher: 'Coach Taylor', date: 'Tuesday' },
    ];

    const sharedSchedule = teacherUpdates.map<ParentScheduleItem>(update => ({
      id: update.id,
      title: update.title,
      time: formatTimetableTimeRange(update),
      location: update.location,
      teacher: update.created_by_name || 'Connected teacher',
      date: update.day_label,
      isTeacherUpdate: true,
    }));

    return [...previewSchedule, ...sharedSchedule];
  }, [teacherUpdates]);

  const exams = [
    { id: 1, subject: 'Biology 101', title: 'Midterm Exam', date: 'Oct 24, 2023', time: '09:00 AM', duration: '2 Hours', location: 'Main Hall' },
    { id: 2, subject: 'Literature', title: 'Essay Submission', date: 'Oct 26, 2023', time: '11:59 PM', duration: 'N/A', location: 'Online Portal' },
  ];

  const events = [
    { id: 1, title: 'Parent-Teacher Conferences', date: 'Nov 2 - Nov 3, 2023', time: 'All Day', location: 'School Campus' },
    { id: 2, title: 'Science Fair', date: 'Nov 15, 2023', time: '02:00 PM - 05:00 PM', location: 'Main Hall' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <ParentLayout activePage="timetable">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-greyed-blue" />
            Timetable Access
          </h1>
          <p className="text-greyed-navy/70 mt-1">Keep track of Emma's classes, exams, and school events.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        {/* Header Navigation */}
        <div className="flex border-b border-greyed-navy/10 bg-greyed-navy/5 overflow-x-auto">
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeView === 'classes' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveView('classes')}
          >
            Weekly Class Schedule
            {activeView === 'classes' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeView === 'exams' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveView('exams')}
          >
            Exam Schedules
            {activeView === 'exams' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm transition-colors relative whitespace-nowrap ${activeView === 'events' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveView('events')}
          >
            School Events
            {activeView === 'events' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
        </div>

        {teacherUpdates.length > 0 && (
          <div className="border-b border-greyed-navy/10 bg-green-50 px-6 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-green-800">
              <Bell className="h-4 w-4" />
              Latest teacher timetable update:
              <span className="text-greyed-navy">
                {teacherUpdates[teacherUpdates.length - 1].title} on {teacherUpdates[teacherUpdates.length - 1].day_label}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          {activeView === 'classes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setWeekOffset(offset => offset - 1)}
                    className="p-2 border border-greyed-navy/20 rounded-lg text-greyed-navy/60 hover:bg-greyed-navy/5 transition-colors"
                    title="Previous week"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold text-greyed-navy min-w-[150px] text-center">
                    {weekLabel}
                  </h2>
                  <button
                    onClick={() => setWeekOffset(offset => offset + 1)}
                    className="p-2 border border-greyed-navy/20 rounded-lg text-greyed-navy/60 hover:bg-greyed-navy/5 transition-colors"
                    title="Next week"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Days Header */}
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {days.map((day, i) => (
                      <div key={day} className={`text-center pb-2 border-b-2 ${i === 0 ? 'border-greyed-blue' : 'border-greyed-navy/10'}`}>
                        <h3 className={`font-bold ${i === 0 ? 'text-greyed-blue' : 'text-greyed-navy'}`}>{day}</h3>
                      </div>
                    ))}
                  </div>

                  {/* Timetable Content */}
                  <div className="grid grid-cols-5 gap-4 min-h-[400px]">
                    {days.map((day, i) => (
                      <div key={day} className={`space-y-3 p-2 rounded-xl ${i === 0 ? 'bg-greyed-blue/5' : ''}`}>
                        {schedule.filter(s => s.date === day).map(item => (
                          <div 
                            key={item.id} 
                            className={`p-3 rounded-xl border shadow-sm transition-colors ${
                              item.isTeacherUpdate
                                ? 'bg-green-50 border-green-200 hover:border-green-300'
                                : 'bg-white border-greyed-navy/10 hover:border-greyed-blue/30'
                            }`}
                          >
                            {item.isTeacherUpdate && (
                              <span className="mb-2 inline-flex rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                Teacher update
                              </span>
                            )}
                            <h4 className="font-bold text-greyed-navy text-sm mb-2">{item.title}</h4>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                                <Clock className="w-3.5 h-3.5 text-greyed-blue flex-shrink-0" />
                                <span>{item.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                                <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                                <BookOpen className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                <span>{item.teacher}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'exams' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-greyed-navy">Upcoming Exams & Assessments</h2>
                <button
                  onClick={() => setSubjectFilter(enabled => !enabled)}
                  className="text-sm text-greyed-navy/60 font-semibold flex items-center gap-1 hover:text-greyed-navy"
                >
                  <Filter className="w-4 h-4" /> {subjectFilter ? 'Showing Biology' : 'Filter by Subject'}
                </button>
              </div>

              {exams.map((exam) => (
                <div key={exam.id} className="bg-white border border-greyed-navy/10 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold uppercase">{exam.date.split(' ')[0]}</span>
                      <span className="text-lg font-black leading-none">{exam.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-greyed-blue bg-greyed-blue/10 px-2 py-0.5 rounded-full mb-1 inline-block">
                        {exam.subject}
                      </span>
                      <h3 className="font-bold text-lg text-greyed-navy">{exam.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-greyed-navy/60">
                          <Clock className="w-4 h-4" /> {exam.time} ({exam.duration})
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-greyed-navy/60">
                          <MapPin className="w-4 h-4" /> {exam.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`${exam.title} added to calendar in this preview.`)}
                    className="w-full md:w-auto px-4 py-2 border border-greyed-navy/20 text-greyed-navy font-semibold rounded-xl hover:bg-greyed-navy/5 transition-colors"
                  >
                    Add to Calendar
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeView === 'events' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-greyed-navy">School Events</h2>
              </div>

              {events.map((event) => (
                <div key={event.id} className="bg-white border border-greyed-navy/10 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-greyed-navy">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-greyed-navy/60">
                          <Clock className="w-4 h-4" /> {event.date} • {event.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-greyed-navy/60">
                          <MapPin className="w-4 h-4" /> {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`${event.title} added to calendar in this preview.`)}
                    className="w-full md:w-auto px-4 py-2 border border-greyed-navy/20 text-greyed-navy font-semibold rounded-xl hover:bg-greyed-navy/5 transition-colors"
                  >
                    Add to Calendar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentTimetablePage;
