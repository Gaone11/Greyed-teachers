import React, { useEffect, useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  MessageSquare, 
  Users, 
  Megaphone,
  Search,
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

const TeacherCommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'announcements'>('students');
  const [circle, setCircle] = useState(() => loadConnectionCircle());
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
