import React, { useEffect, useState } from 'react';
import ParentLayout from '../../layouts/ParentLayout';
import { 
  MessageSquare, 
  Users, 
  Megaphone,
  Search,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import ConnectedMessageThread from '../../components/messages/ConnectedMessageThread';
import ConnectedAnnouncementsPanel from '../../components/messages/ConnectedAnnouncementsPanel';
import {
  CONNECTION_UPDATED_EVENT,
  isConnectionCircleReady,
  loadConnectionCircle,
  loadRemoteConnectionCircle,
} from '../../lib/connection-circle';
import { useAuth } from '../../context/AuthContext';
import { publishConnectedMeetingRequest } from '../../lib/connected-meetings';

const ParentCommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'teachers' | 'child' | 'announcements'>('teachers');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingReason, setMeetingReason] = useState('');
  const [meetingNotice, setMeetingNotice] = useState('');
  const [submittingMeeting, setSubmittingMeeting] = useState(false);
  const connected = isConnectionCircleReady(circle);

  useEffect(() => {
    const refreshCircle = () => setCircle(loadConnectionCircle());
    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
    window.addEventListener('storage', refreshCircle);

    return () => {
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
      window.removeEventListener('storage', refreshCircle);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const syncRemoteCircle = async () => {
      if (!user?.email || isConnectionCircleReady(loadConnectionCircle())) return;
      const remoteCircle = await loadRemoteConnectionCircle(user.email);
      if (active && remoteCircle) setCircle(remoteCircle);
    };

    syncRemoteCircle();

    return () => {
      active = false;
    };
  }, [user?.email]);

  const activeContact = activeTab === 'child' ? circle.members.student : circle.members.teacher;
  const connectedTeachers = connected ? [circle.members.teacher] : [];

  const handleSubmitMeetingRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!connected || !meetingDate || !meetingTime || !meetingReason.trim() || submittingMeeting) return;

    setSubmittingMeeting(true);
    await publishConnectedMeetingRequest(circle, {
      requested_date: meetingDate,
      requested_time: meetingTime,
      reason: meetingReason,
    });
    setMeetingDate('');
    setMeetingTime('');
    setMeetingReason('');
    setShowScheduleModal(false);
    setMeetingNotice(`Meeting request sent to ${circle.members.teacher.name}.`);
    setSubmittingMeeting(false);
  };

  return (
    <ParentLayout activePage="communication">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-greyed-blue" />
            Communication Center
          </h1>
          <p className="text-greyed-navy/70 mt-1">Chat with teachers, receive announcements, and schedule meetings.</p>
        </div>
        
        {activeTab === 'teachers' && (
          <button 
            className="bg-greyed-navy hover:bg-greyed-navy/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            onClick={() => setShowScheduleModal(true)}
          >
            <CalendarIcon className="w-5 h-5" />
            Schedule Meeting
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up flex flex-col h-[600px]" style={{ animationDelay: '50ms' }}>
        <div className="flex border-b border-greyed-navy/10 bg-greyed-navy/5">
          <button 
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'teachers' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('teachers')}
          >
            <Users className="w-4 h-4" /> Teachers
            {activeTab === 'teachers' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
          <button
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'child' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('child')}
          >
            <Users className="w-4 h-4" /> Child
            {activeTab === 'child' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
          <button 
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'announcements' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone className="w-4 h-4" /> Announcements
            {activeTab === 'announcements' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
        </div>

        {activeTab !== 'announcements' ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-greyed-navy/10 bg-white flex flex-col">
              <div className="p-4 border-b border-greyed-navy/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                  <input 
                    type="text"
                    placeholder={activeTab === 'teachers' ? 'Search teachers...' : 'Search child...'}
                    className="w-full pl-9 pr-4 py-2 bg-greyed-navy/5 rounded-lg border-transparent focus:bg-white focus:border-greyed-navy/20 focus:outline-none focus:ring-2 focus:ring-greyed-blue/50 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-greyed-navy/5 hover:bg-greyed-navy/5 cursor-pointer flex gap-3 bg-greyed-blue/5">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex flex-shrink-0 items-center justify-center text-greyed-navy font-bold">
                    {activeContact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-greyed-navy truncate text-sm">{activeContact.name}</h4>
                      <span className={`text-xs ${connected ? 'text-green-600' : 'text-amber-600'}`}>
                        {connected ? 'Connected' : 'Needs link'}
                      </span>
                    </div>
                    <p className="text-xs text-greyed-navy/60 truncate">
                      {activeTab === 'teachers' ? `Student: ${circle.members.student.name}` : `Teacher: ${circle.members.teacher.name}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            {activeTab === 'teachers' ? (
              <ConnectedMessageThread
                currentRole="parent"
                roles={['teacher', 'parent']}
                placeholder={`Message ${circle.members.teacher.name}...`}
              />
            ) : (
              <ConnectedMessageThread
                currentRole="parent"
                roles={['student', 'parent']}
                placeholder={`Message ${circle.members.student.name}...`}
              />
            )}
          </div>
        ) : (
          <ConnectedAnnouncementsPanel currentRole="parent" />
        )}
      </div>

      {meetingNotice && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-sm font-bold">
          {meetingNotice}
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-greyed-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSubmitMeetingRequest} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-greyed-navy/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-greyed-navy font-headline">Schedule Meeting</h2>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-greyed-navy/40 hover:text-greyed-navy"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-greyed-navy mb-2">Select Teacher</label>
                <select
                  className="w-full p-3 rounded-xl border border-greyed-navy/20 focus:ring-2 focus:ring-greyed-blue/50 outline-none bg-white"
                  disabled={!connectedTeachers.length}
                  value={circle.members.teacher.email || circle.members.teacher.name}
                  title="Connected teacher"
                >
                  {connectedTeachers.length ? (
                    connectedTeachers.map(teacher => (
                      <option key={teacher.email || teacher.name} value={teacher.email || teacher.name}>
                        {teacher.name}{teacher.email ? ` (${teacher.email})` : ''}
                      </option>
                    ))
                  ) : (
                    <option>Connect a teacher first</option>
                  )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-greyed-navy mb-2">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={event => setMeetingDate(event.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-greyed-navy/20 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-greyed-navy mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={event => setMeetingTime(event.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-greyed-navy/20 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-greyed-navy mb-2">Reason for Meeting</label>
                <textarea 
                  value={meetingReason}
                  onChange={event => setMeetingReason(event.target.value)}
                  className="w-full p-3 rounded-xl border border-greyed-navy/20 outline-none resize-none h-24"
                  placeholder="Briefly describe what you'd like to discuss..."
                  required
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-greyed-navy/10 bg-greyed-navy/5 flex justify-end gap-3">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2.5 text-greyed-navy font-semibold hover:bg-greyed-navy/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!connected || !meetingDate || !meetingTime || !meetingReason.trim() || submittingMeeting}
                className="px-5 py-2.5 bg-greyed-navy text-white font-semibold rounded-xl hover:bg-greyed-navy/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingMeeting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </ParentLayout>
  );
};

export default ParentCommunicationPage;
