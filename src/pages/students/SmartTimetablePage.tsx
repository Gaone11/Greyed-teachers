import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Video,
  FileText,
  AlertCircle,
  Bell
} from 'lucide-react';

const SmartTimetablePage: React.FC = () => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [periodOffset, setPeriodOffset] = useState(0);
  const [remindersOn, setRemindersOn] = useState(true);

  const classes = [
    {
      id: 1,
      subject: 'Mathematics',
      type: 'math',
      time: '09:00 AM - 10:30 AM',
      location: 'Room 302',
      teacherNotes: 'Bring your graphing calculator.',
      homework: 'Calculus Worksheet 4',
      isOnline: false,
      examDate: 'Oct 15',
      day: 'Monday'
    },
    {
      id: 2,
      subject: 'Physics',
      type: 'science',
      time: '11:00 AM - 12:30 PM',
      location: 'Lab 1',
      teacherNotes: 'Lab safety goggles required.',
      homework: null,
      isOnline: false,
      examDate: null,
      day: 'Monday'
    },
    {
      id: 3,
      subject: 'Literature',
      type: 'literature',
      time: '01:30 PM - 03:00 PM',
      location: 'https://zoom.us/j/123456',
      teacherNotes: 'Read Chapter 4 before class.',
      homework: 'Essay Draft',
      isOnline: true,
      examDate: null,
      day: 'Tuesday'
    },
    {
      id: 4,
      subject: 'World History',
      type: 'history',
      time: '10:00 AM - 11:30 AM',
      location: 'Room 105',
      teacherNotes: null,
      homework: 'Read pages 100-115',
      isOnline: false,
      examDate: 'Oct 20',
      day: 'Wednesday'
    },
    {
      id: 5,
      subject: 'Art Studio',
      type: 'art',
      time: '01:00 PM - 03:00 PM',
      location: 'Art Room 2',
      teacherNotes: 'Bring water colors.',
      homework: null,
      isOnline: false,
      examDate: null,
      day: 'Thursday'
    }
  ];

  const baseDate = new Date(2026, 9, 19);
  const visibleDate = new Date(baseDate);
  visibleDate.setDate(baseDate.getDate() + (view === 'daily' ? periodOffset : periodOffset * 7));
  if (view === 'monthly') {
    visibleDate.setMonth(baseDate.getMonth() + periodOffset);
  }

  const visibleMonth = visibleDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const visibleDay = visibleDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const weekEnd = new Date(visibleDate);
  weekEnd.setDate(visibleDate.getDate() + 4);
  const visibleWeek = `${visibleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const visibleTitle = view === 'daily' ? visibleDay : view === 'weekly' ? visibleWeek : visibleMonth;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dailyDay = days[((periodOffset % days.length) + days.length) % days.length];
  const dailyClasses = classes.filter(c => c.day === dailyDay);
  const monthlyWeeks = [
    ['Mathematics', 'Physics'],
    ['Literature'],
    ['World History'],
    ['Art Studio'],
  ];

  const movePeriod = (direction: -1 | 1) => {
    setPeriodOffset(offset => offset + direction);
  };

  // Baby matte colors for subjects
  const colors = {
    math: 'bg-[#ffb3ba] text-[#8a3a41] border-[#ffb3ba]', // Pastel pink
    science: 'bg-[#baffc9] text-[#2e6b3c] border-[#baffc9]', // Pastel green
    literature: 'bg-[#bae1ff] text-[#2e528a] border-[#bae1ff]', // Pastel blue
    history: 'bg-[#ffffba] text-[#8a8a2e] border-[#ffffba]', // Pastel yellow
    art: 'bg-[#e5ccff] text-[#5c3a8a] border-[#e5ccff]', // Pastel purple
  };

  return (
    <StudentLayout activePage="timetable">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-greyed-blue" />
            Smart Timetable
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">Manage your schedule, classes, and deadlines.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-greyed-navy/5">
          {['daily', 'weekly', 'monthly'].map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v as 'daily' | 'weekly' | 'monthly');
                setPeriodOffset(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                view === v 
                  ? 'bg-greyed-navy text-white shadow-sm' 
                  : 'text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-greyed-navy/5 bg-greyed-white/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => movePeriod(-1)}
              className="p-2 hover:bg-greyed-navy/10 rounded-lg transition-colors"
              title={`Previous ${view}`}
            >
              <ChevronLeft className="w-5 h-5 text-greyed-navy" />
            </button>
            <h2 className="text-lg font-bold text-greyed-navy">{visibleTitle}</h2>
            <button
              onClick={() => movePeriod(1)}
              className="p-2 hover:bg-greyed-navy/10 rounded-lg transition-colors"
              title={`Next ${view}`}
            >
              <ChevronRight className="w-5 h-5 text-greyed-navy" />
            </button>
          </div>
          
          <button
            onClick={() => setRemindersOn(enabled => !enabled)}
            className="flex items-center gap-2 text-sm font-semibold text-greyed-blue bg-[#bbd7eb]/20 px-3 py-1.5 rounded-lg hover:bg-[#bbd7eb]/40 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Reminders {remindersOn ? 'On' : 'Off'}
          </button>
        </div>

        {view === 'daily' && (
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-greyed-navy">{dailyDay}'s Classes</h3>
              <span className="rounded-full bg-greyed-navy/5 px-3 py-1 text-sm font-semibold text-greyed-navy/70">
                {dailyClasses.length} scheduled
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyClasses.length > 0 ? dailyClasses.map(cls => (
                <ClassCard key={cls.id} cls={cls} colors={colors} size="large" />
              )) : (
                <div className="md:col-span-2 min-h-[180px] rounded-2xl border-2 border-dashed border-greyed-navy/10 flex items-center justify-center text-greyed-navy/40 font-semibold">
                  No classes for {dailyDay}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'weekly' && (
          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-4 mb-4">
                <div className="text-center font-semibold text-sm text-greyed-navy/50">Time</div>
                {days.map((day) => (
                  <div key={day} className="text-center font-bold text-greyed-navy pb-2 border-b-2 border-greyed-navy/10">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 gap-4">
                <div className="space-y-4 text-center text-xs font-semibold text-greyed-navy/40 pt-4">
                  <div className="h-32">09:00 AM</div>
                  <div className="h-32">11:00 AM</div>
                  <div className="h-32">01:00 PM</div>
                </div>

                {days.map(day => (
                  <div key={day} className="space-y-4">
                    {classes.filter(c => c.day === day).map(cls => (
                      <ClassCard key={cls.id} cls={cls} colors={colors} />
                    ))}
                    {classes.filter(c => c.day === day).length === 0 && (
                      <div className="h-32 border-2 border-dashed border-greyed-navy/10 rounded-xl flex items-center justify-center text-greyed-navy/30 text-sm font-semibold">
                        No Classes
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'monthly' && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs font-bold uppercase tracking-wide text-greyed-navy/50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => {
                const dayNumber = index + 1;
                const weekIndex = Math.floor(index / 7);
                const subject = index < 28 ? monthlyWeeks[weekIndex]?.[index % 2] : undefined;

                return (
                  <button
                    key={dayNumber}
                    onClick={() => setView('daily')}
                    className="min-h-[110px] rounded-xl border border-greyed-navy/10 bg-white p-2 text-left hover:border-greyed-blue hover:bg-[#bbd7eb]/10 transition-colors"
                  >
                    <span className="text-xs font-bold text-greyed-navy/50">{dayNumber}</span>
                    {subject && (
                      <div className="mt-3 rounded-lg bg-greyed-navy/5 px-2 py-1 text-[11px] font-semibold text-greyed-navy">
                        {subject}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

// Helper Component for Class Card
const ClassCard = ({ cls, colors, size = 'default' }: { cls: any, colors: any, size?: 'default' | 'large' }) => {
  return (
    <div className={`${colors[cls.type as keyof typeof colors]} p-3 rounded-xl shadow-sm border ${size === 'large' ? 'min-h-[180px]' : 'h-32'} flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform`}>
      <div>
        <h3 className="font-bold text-sm leading-tight">{cls.subject}</h3>
        <p className="text-[10px] opacity-80 mt-1 flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3" /> {cls.time}
        </p>
      </div>

      <div className="space-y-1 mt-2">
        {cls.isOnline ? (
          <p className="text-[10px] font-semibold flex items-center gap-1">
            <Video className="w-3 h-3" /> Online Meeting
          </p>
        ) : (
          <p className="text-[10px] font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {cls.location}
          </p>
        )}
        
        {(cls.homework || cls.examDate) && (
          <div className="flex gap-1 flex-wrap">
            {cls.homework && (
               <span className="text-[9px] bg-black/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 truncate max-w-full">
                 <FileText className="w-2.5 h-2.5" /> HW Attached
               </span>
            )}
            {cls.examDate && (
               <span className="text-[9px] bg-red-500/20 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 text-red-900">
                 <AlertCircle className="w-2.5 h-2.5" /> Exam: {cls.examDate}
               </span>
            )}
          </div>
        )}
      </div>

      {/* Hidden Tooltip / Hover state for teacher notes */}
      {cls.teacherNotes && (
        <div className="absolute inset-0 bg-black/80 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center text-xs z-10">
          <span className="font-bold mb-1 text-[#bbd7eb]">Teacher Note:</span>
          {cls.teacherNotes}
        </div>
      )}
    </div>
  );
}

export default SmartTimetablePage;
