import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  MessageSquare, 
  Users, 
  Megaphone,
  Search,
  XCircle,
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
import {
  ConnectedMeetingRequest,
  CONNECTED_MEETINGS_UPDATED_EVENT,
  loadConnectedMeetingRequests,
  updateConnectedMeetingRequestStatus,
} from '../../lib/connected-meetings';

const formatMeetingDate = (date: string, time: string) => {
  const dateValue = new Date(`${date}T${time || '00:00'}`);

  return dateValue.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const TeacherCommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'announcements'>('students');
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [meetingRequests, setMeetingRequests] = useState<ConnectedMeetingRequest[]>([]);
  const [updatingRequestId, setUpdatingRequestId] = useState('');
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

  const refreshMeetingRequests = useCallback(async () => {
    if (!isConnectionCircleReady(circle)) {
      setMeetingRequests([]);
      return;
    }

    const requests = await loadConnectedMeetingRequests(circle);
    setMeetingRequests(requests);
  }, [circle]);

  useEffect(() => {
    refreshMeetingRequests();
  }, [refreshMeetingRequests]);

  useEffect(() => {
    const interval = window.setInterval(refreshMeetingRequests, 5000);
    window.addEventListener(CONNECTED_MEETINGS_UPDATED_EVENT, refreshMeetingRequests);
    window.addEventListener('storage', refreshMeetingRequests);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(CONNECTED_MEETINGS_UPDATED_EVENT, refreshMeetingRequests);
      window.removeEventListener('storage', refreshMeetingRequests);
    };
  }, [refreshMeetingRequests]);

  const pendingMeetingRequests = useMemo(
    () => meetingRequests.filter(request => request.status === 'pending'),
    [meetingRequests]
  );

  const handleMeetingStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    setUpdatingRequestId(requestId);
    const updated = await updateConnectedMeetingRequestStatus(circle, requestId, status);
    if (updated) {
      setMeetingRequests(current => current.map(request => request.id === updated.id ? updated : request));
    }
    setUpdatingRequestId('');
  };

  const activeContact = activeTab === 'students' ? circle.members.student : circle.members.parent;
  const contactSubtitle = activeTab === 'students'
    ? `Parent: ${circle.members.parent.name}`
    : `Student: ${circle.members.student.name}`;

  return (
    <TeacherLayout activePage="messages">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-greyed-blue" />
            Communication Center
          </h1>
          <p className="text-greyed-navy/70 mt-1">Message students, parents, and send class-wide announcements.</p>
        </div>
      </div>

      {pendingMeetingRequests.length > 0 && (
        <div className="mb-5 bg-white border border-greyed-blue/30 rounded-2xl shadow-sm p-4 animate-slide-up">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-greyed-blue/15 text-greyed-navy flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-greyed-navy">Meeting Requests</h2>
                <p className="text-xs text-greyed-navy/55">
                  {pendingMeetingRequests.length} pending request{pendingMeetingRequests.length === 1 ? '' : 's'} from connected parents.
                </p>
              </div>
            </div>
            <span className="bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-3 py-1 text-xs font-bold">
              New
            </span>
          </div>

          <div className="space-y-3">
            {pendingMeetingRequests.map(request => (
              <div key={request.id} className="rounded-xl border border-greyed-navy/10 bg-greyed-navy/5 p-3">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-greyed-navy text-sm">
                      {request.parent_name} wants to meet about {request.student_name}
                    </p>
                    <p className="text-xs text-greyed-navy/60 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatMeetingDate(request.requested_date, request.requested_time)}
                    </p>
                    <p className="text-sm text-greyed-navy/70 mt-2">{request.reason}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMeetingStatus(request.id, 'accepted')}
                      disabled={updatingRequestId === request.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMeetingStatus(request.id, 'declined')}
                      disabled={updatingRequestId === request.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-greyed-navy/10 text-greyed-navy text-xs font-bold hover:bg-greyed-navy/5 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up flex flex-col h-[600px]" style={{ animationDelay: '50ms' }}>
        <div className="flex border-b border-greyed-navy/10 bg-greyed-navy/5">
          <button 
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'students' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('students')}
          >
            <Users className="w-4 h-4" /> Students
            {activeTab === 'students' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
          <button 
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'parents' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('parents')}
          >
            <Users className="w-4 h-4" /> Parents
            {activeTab === 'parents' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
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
                    placeholder={`Search ${activeTab}...`}
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
                    <p className="text-xs text-greyed-navy/60 truncate">{contactSubtitle}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-greyed-blue mt-1"></div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            {activeTab === 'students' ? (
              <ConnectedMessageThread
                currentRole="teacher"
                roles={['student', 'teacher']}
                placeholder={`Message ${circle.members.student.name}...`}
              />
            ) : (
              <ConnectedMessageThread
                currentRole="teacher"
                roles={['teacher', 'parent']}
                placeholder={`Message ${circle.members.parent.name}...`}
              />
            )}
          </div>
        ) : (
          <ConnectedAnnouncementsPanel currentRole="teacher" canCompose />
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherCommunicationPage;
