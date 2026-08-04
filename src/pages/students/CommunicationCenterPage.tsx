import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  MessageSquare, 
  Users, 
  UserCircle, 
  Info
} from 'lucide-react';
import ConnectedMessageThread from '../../components/messages/ConnectedMessageThread';

const CommunicationCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'parent' | 'group'>('teacher');

  const groupMessages = [
    { id: 1, sender: 'admin', name: 'School Admin', text: '📢 Reminder: The Science Fair registration closes this Friday.', time: 'Monday' },
    { id: 2, sender: 'student_other', name: 'Sarah J.', text: 'Is anyone working on the Biology project this weekend?', time: '10:00 AM' },
    { id: 3, sender: 'student', name: 'You', text: 'I am! We can meet at the library on Saturday if you want.', time: '10:15 AM' },
  ];

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
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-greyed-white/30 space-y-6 flex flex-col">
              {groupMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${
                    msg.sender === 'student' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] font-bold text-greyed-navy/50 mb-1 px-1">{msg.name} • {msg.time}</span>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%] text-sm ${
                      msg.sender === 'student' 
                        ? 'bg-[#2a2f6e] text-white rounded-tr-sm' 
                        : msg.sender === 'admin'
                          ? 'bg-[#bbd7eb]/40 text-greyed-navy rounded-tl-sm font-medium border border-[#bbd7eb]/50'
                          : 'bg-white text-greyed-navy rounded-tl-sm shadow-sm border border-greyed-navy/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-greyed-navy/10 bg-white">
              <div className="bg-yellow-50 text-yellow-800 text-xs font-semibold px-4 py-2 rounded-xl border border-yellow-200/50 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                Group announcements are read-only in this preview.
              </div>
            </div>
          </>
        )}

      </div>
    </StudentLayout>
  );
};

export default CommunicationCenterPage;
