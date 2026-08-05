import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  MessageSquare, 
  Users, 
  UserCircle
} from 'lucide-react';
import ConnectedMessageThread from '../../components/messages/ConnectedMessageThread';
import ConnectedAnnouncementsPanel from '../../components/messages/ConnectedAnnouncementsPanel';

const CommunicationCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'parent' | 'group'>('teacher');

  return (
    <StudentLayout activePage="messages">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-greyed-blue" />
            Communication Center
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">Connect with your teachers, parents, and peers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden flex flex-col h-[600px] animate-slide-up" style={{ animationDelay: '50ms' }}>
        
        {/* Tabs */}
        <div className="flex border-b border-greyed-navy/10 bg-greyed-white/50 px-2 sm:px-6">
          <button 
            onClick={() => setActiveTab('teacher')}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'teacher' ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
            }`}
          >
            <UserCircle className="w-4 h-4" />
            Teachers
          </button>
          <button 
            onClick={() => setActiveTab('parent')}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'parent' ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Parents
          </button>
          <button 
            onClick={() => setActiveTab('group')}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'group' ? 'border-[#2a2f6e] text-[#2a2f6e]' : 'border-transparent text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Groups & Announcements
          </button>
        </div>

        {activeTab === 'teacher' && (
          <ConnectedMessageThread
            currentRole="student"
            roles={['student', 'teacher']}
            placeholder="Ask your teacher a question..."
          />
        )}

        {activeTab === 'parent' && (
          <ConnectedMessageThread
            currentRole="student"
            roles={['student', 'parent']}
            placeholder="Message your parent..."
          />
        )}

        {activeTab === 'group' && (
          <ConnectedAnnouncementsPanel currentRole="student" />
        )}

      </div>
    </StudentLayout>
  );
};

export default CommunicationCenterPage;
