import React, { useEffect, useMemo, useState } from 'react';
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
  RefreshCw,
  X
} from 'lucide-react';
import { CONNECTION_UPDATED_EVENT, loadConnectionCircle } from '../../lib/connection-circle';
import {
  CONNECTED_TIMETABLE_UPDATED_EVENT,
  ConnectedTimetableInput,
  ConnectedTimetableItem,
  TimetableItemType,
  formatTimetableTimeRange,
  loadConnectedTimetableItems,
  saveConnectedTimetableItem,
} from '../../lib/connected-timetable';
import { sendConnectedMessage } from '../../lib/connected-messages';
import { useAuth } from '../../context/AuthContext';
import { fetchTeacherClasses } from '../../lib/api/teacher-api';
import { Class } from '../../types/teacher';

interface TeacherScheduleItem {
  id: string;
  className?: string | null;
  subject?: string | null;
  grade?: string | null;
  title: string;
  type: TimetableItemType;
  time: string;
  location: string;
  date: string;
  notes?: string | null;
  isConnectedUpdate?: boolean;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const itemTypes: TimetableItemType[] = ['Class', 'Meeting', 'Office Hours', 'Exam', 'Event'];

const defaultForm: ConnectedTimetableInput = {
  class_id: null,
  class_name: '',
  subject: '',
  grade: '',
  title: '',
  item_type: 'Class',
  day_label: 'Monday',
  item_date: null,
  start_time: '09:00',
  end_time: '10:00',
  location: '',
  notes: '',
};

const getWeekdayDate = (currentWeek: Date, day: string) => {
  const monday = new Date(currentWeek);
  const dayOfWeek = monday.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(monday.getDate() + diffToMonday);

  const target = new Date(monday);
  target.setDate(monday.getDate() + Math.max(days.indexOf(day), 0));
  return target.toISOString().slice(0, 10);
};

const getItemClasses = (type: TimetableItemType, isConnectedUpdate?: boolean) => {
  if (isConnectedUpdate) return 'bg-green-50/70 border-green-200';
  if (type === 'Class') return 'bg-blue-50/50 border-blue-200';
  if (type === 'Meeting') return 'bg-purple-50/50 border-purple-200';
  if (type === 'Exam') return 'bg-red-50/50 border-red-200';
  return 'bg-orange-50/50 border-orange-200';
};

const getBadgeClasses = (type: TimetableItemType, isConnectedUpdate?: boolean) => {
  if (isConnectedUpdate) return 'bg-green-100 text-green-700';
  if (type === 'Class') return 'bg-blue-100 text-blue-700';
  if (type === 'Meeting') return 'bg-purple-100 text-purple-700';
  if (type === 'Exam') return 'bg-red-100 text-red-700';
  return 'bg-orange-100 text-orange-700';
};

const TeacherTimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [connectedItems, setConnectedItems] = useState<ConnectedTimetableItem[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [form, setForm] = useState<ConnectedTimetableInput>(defaultForm);
  const [statusMessage, setStatusMessage] = useState('Timetable ready.');
  const [isSaving, setIsSaving] = useState(false);

  const weekLabel = currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekEndLabel = new Date(currentWeek.getTime() + 4 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const moveWeek = (direction: -1 | 1) => {
    setCurrentWeek(date => new Date(date.getTime() + direction * 7 * 24 * 60 * 60 * 1000));
  };

  useEffect(() => {
    let mounted = true;

    const loadTeacherClasses = async () => {
      if (!user) return;

      try {
        const classes = await fetchTeacherClasses(user.id);
        if (mounted) setTeacherClasses(classes);
      } catch {
        if (mounted) {
          setTeacherClasses([]);
          setStatusMessage('Classes could not be loaded, but you can still schedule a lesson manually.');
        }
      }
    };

    loadTeacherClasses();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const refreshCircle = () => {
      const nextCircle = loadConnectionCircle();
      setCircle(nextCircle);
      loadConnectedTimetableItems(nextCircle).then(items => {
        if (mounted) setConnectedItems(items);
      });
    };

    refreshCircle();
    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
    window.addEventListener(CONNECTED_TIMETABLE_UPDATED_EVENT, refreshCircle);
    window.addEventListener('storage', refreshCircle);

    return () => {
      mounted = false;
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
      window.removeEventListener(CONNECTED_TIMETABLE_UPDATED_EVENT, refreshCircle);
      window.removeEventListener('storage', refreshCircle);
    };
  }, []);

  const schedule = useMemo<TeacherScheduleItem[]>(() => {
    const previewItems: TeacherScheduleItem[] = [
      { id: 'preview-1', title: 'Biology 101', type: 'Class', time: '09:00 AM - 10:30 AM', location: 'Room 302', date: 'Monday' },
      { id: 'preview-2', title: 'Department Meeting', type: 'Meeting', time: '11:00 AM - 12:00 PM', location: 'Staff Room', date: 'Monday' },
      { id: 'preview-3', title: 'Chemistry Adv', type: 'Class', time: '01:00 PM - 02:30 PM', location: 'Lab 4', date: 'Tuesday' },
      { id: 'preview-4', title: 'Student Consultation', type: 'Office Hours', time: '03:00 PM - 04:00 PM', location: 'Office 12', date: 'Wednesday' },
    ];

    const sharedItems = connectedItems.map<TeacherScheduleItem>(item => ({
      id: item.id,
      className: item.class_name,
      subject: item.subject,
      grade: item.grade,
      title: item.title,
      type: item.item_type,
      time: formatTimetableTimeRange(item),
      location: item.location,
      date: item.day_label,
      notes: item.notes,
      isConnectedUpdate: true,
    }));

    return [...previewItems, ...sharedItems];
  }, [connectedItems]);

  const openScheduleForm = (day = 'Monday') => {
    const firstClass = teacherClasses[0];
    setForm({
      ...defaultForm,
      class_id: firstClass?.id || null,
      class_name: firstClass?.name || '',
      subject: firstClass?.subject || '',
      grade: firstClass?.grade || '',
      title: firstClass ? `${firstClass.subject} lesson` : '',
      day_label: day,
      item_date: getWeekdayDate(currentWeek, day),
    });
    setShowScheduleForm(true);
    setStatusMessage(`Scheduling for ${day}.`);
  };

  const notifyConnectedFamily = async (savedItem: ConnectedTimetableItem) => {
    if (circle.status !== 'connected') return;

    const message = [
      `Timetable update: ${savedItem.title}`,
      savedItem.class_name ? `Class: ${savedItem.class_name}` : '',
      savedItem.subject ? `Subject: ${savedItem.subject}${savedItem.grade ? ` (${savedItem.grade})` : ''}` : '',
      `${savedItem.day_label}, ${formatTimetableTimeRange(savedItem)}`,
      savedItem.location ? `Location: ${savedItem.location}` : '',
      savedItem.notes ? `Note: ${savedItem.notes}` : '',
    ].filter(Boolean).join('\n');

    await Promise.all([
      sendConnectedMessage(circle, ['student', 'teacher'], 'teacher', message),
      sendConnectedMessage(circle, ['teacher', 'parent'], 'teacher', message),
    ]);
  };

  const handleSubmitSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim()) {
      setStatusMessage('Add a lesson title and location before saving.');
      return;
    }

    setIsSaving(true);
    const itemToSave = {
      ...form,
      item_date: form.item_date || getWeekdayDate(currentWeek, form.day_label),
    };
    const savedItem = await saveConnectedTimetableItem(circle, 'teacher', itemToSave);
    setConnectedItems(await loadConnectedTimetableItems(circle));
    await notifyConnectedFamily(savedItem);
    setShowScheduleForm(false);
    setIsSaving(false);
    setStatusMessage(
      circle.status === 'connected'
        ? 'Timetable saved and shared with the connected student and parent.'
        : 'Timetable saved. Connect the student and parent to share updates across hubs.'
    );
  };

  const handleShareUpdates = async () => {
    if (circle.status !== 'connected') {
      setStatusMessage('Connect the student and parent first, then timetable updates can be shared.');
      return;
    }

    if (connectedItems.length === 0) {
      setStatusMessage('No saved timetable updates to share yet.');
      return;
    }

    const latestItems = connectedItems.slice(-5);
    const message = [
      'Timetable updates:',
      ...latestItems.map(item => `${item.day_label}: ${item.title} (${formatTimetableTimeRange(item)})`),
    ].join('\n');

    await Promise.all([
      sendConnectedMessage(circle, ['student', 'teacher'], 'teacher', message),
      sendConnectedMessage(circle, ['teacher', 'parent'], 'teacher', message),
    ]);
    setStatusMessage('Latest timetable updates shared with the connected student and parent.');
  };

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
            onClick={handleShareUpdates}
            className="bg-white border border-greyed-navy/20 hover:bg-greyed-navy/5 text-greyed-navy px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            Share Updates
          </button>
          <button
            onClick={() => openScheduleForm()}
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

        <div className="border-b border-greyed-navy/10 bg-greyed-white/60 px-4 py-3 text-sm font-semibold text-greyed-navy/70" role="status">
          {statusMessage}
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
                      className={`p-3 rounded-xl border relative group cursor-pointer hover:shadow-md transition-all ${getItemClasses(item.type, item.isConnectedUpdate)}`}
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setStatusMessage(`${item.title} selected.`)} className="p-1 hover:bg-white/50 rounded" title="Options">
                          <MoreVertical className="w-4 h-4 text-greyed-navy/60" />
                        </button>
                      </div>
                      
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex w-max mb-2 ${getBadgeClasses(item.type, item.isConnectedUpdate)}`}>
                        {item.isConnectedUpdate ? 'Shared' : item.type}
                      </span>
                      
                      <h4 className="font-bold text-greyed-navy text-sm mb-1 pr-6">{item.title}</h4>
                      {(item.className || item.subject) && (
                        <p className="mb-2 text-[11px] font-semibold text-greyed-navy/60">
                          {[item.className, item.subject, item.grade].filter(Boolean).join(' • ')}
                        </p>
                      )}
                      
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-greyed-navy/70">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-greyed-navy/60 line-clamp-2">{item.notes}</p>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <button
                          onClick={() => openScheduleForm(item.date)}
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
                    onClick={() => openScheduleForm(day)}
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

      {showScheduleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-greyed-navy/40 p-4">
          <form
            onSubmit={handleSubmitSchedule}
            className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl border border-greyed-navy/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-greyed-navy">Schedule Lesson</h2>
                <p className="mt-1 text-sm font-semibold text-greyed-navy/60">
                  Connected learners and parents receive the update.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="rounded-lg p-2 text-greyed-navy/60 hover:bg-greyed-navy/10 hover:text-greyed-navy"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Class
                <select
                  value={form.class_id || ''}
                  onChange={event => {
                    const selectedClass = teacherClasses.find(cls => cls.id === event.target.value);
                    setForm(current => ({
                      ...current,
                      class_id: selectedClass?.id || null,
                      class_name: selectedClass?.name || '',
                      subject: selectedClass?.subject || current.subject || '',
                      grade: selectedClass?.grade || current.grade || '',
                      title: selectedClass && !current.title.trim() ? `${selectedClass.subject} lesson` : current.title,
                    }));
                  }}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                >
                  <option value="">Manual lesson</option>
                  {teacherClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade} ({cls.subject})
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Lesson title
                <input
                  value={form.title}
                  onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Mathematics revision"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Subject
                <input
                  value={form.subject || ''}
                  onChange={event => setForm(current => ({ ...current, subject: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Mathematics"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Grade
                <input
                  value={form.grade || ''}
                  onChange={event => setForm(current => ({ ...current, grade: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="JSS 3"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Type
                <select
                  value={form.item_type}
                  onChange={event => setForm(current => ({ ...current, item_type: event.target.value as TimetableItemType }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                >
                  {itemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Day
                <select
                  value={form.day_label}
                  onChange={event => {
                    const day = event.target.value;
                    setForm(current => ({ ...current, day_label: day, item_date: getWeekdayDate(currentWeek, day) }));
                  }}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                Start
                <input
                  type="time"
                  value={form.start_time}
                  onChange={event => setForm(current => ({ ...current, start_time: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                />
              </label>

              <label className="text-sm font-bold text-greyed-navy">
                End
                <input
                  type="time"
                  value={form.end_time}
                  onChange={event => setForm(current => ({ ...current, end_time: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                />
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Location
                <input
                  value={form.location}
                  onChange={event => setForm(current => ({ ...current, location: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Room 302 or online link"
                />
              </label>

              <label className="sm:col-span-2 text-sm font-bold text-greyed-navy">
                Notes
                <textarea
                  value={form.notes || ''}
                  onChange={event => setForm(current => ({ ...current, notes: event.target.value }))}
                  className="mt-1 min-h-[90px] w-full rounded-xl border border-greyed-navy/20 px-3 py-2.5 font-semibold outline-none focus:border-greyed-blue"
                  placeholder="Bring exercise books"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="rounded-xl border border-greyed-navy/20 px-4 py-2.5 font-bold text-greyed-navy hover:bg-greyed-navy/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-greyed-navy px-4 py-2.5 font-bold text-white hover:bg-greyed-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save & Share'}
              </button>
            </div>
          </form>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherTimetablePage;
