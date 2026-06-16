import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  MessageSquare, 
  Users, 
  UserCircle, 
  Send,
  Paperclip,
  Smile,
  Info
} from 'lucide-react';

const CommunicationCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'parent' | 'group'>('teacher');
  const [messageInput, setMessageInput] = useState('');

  // Mock Conversations
  const teacherMessages = [
    { id: 1, sender: 'teacher', name: 'Mr. Anderson (Math)', text: 'Don\'t forget your calculus worksheet is due tomorrow. Let me know if you need help with problem #4.', time: '10:30 AM' },
    { id: 2, sender: 'student', name: 'You', text: 'Thank you Mr. Anderson. I was actually stuck on #4, could we go over it during office hours?', time: '10:45 AM' },
    { id: 3, sender: 'teacher', name: 'Mr. Anderson (Math)', text: 'Absolutely. Drop by the lab at 3:15 PM.', time: '11:00 AM' },
  ];

  const parentMessages = [
    { id: 1, sender: 'student', name: 'You', text: 'Hey mom, I just got a 92% on my physics midterm!', time: 'Yesterday' },
    { id: 2, sender: 'parent', name: 'Mom', text: 'That is amazing honey! I am so proud of you. 🌟 Keep up the great work!', time: 'Yesterday' },
    { id: 3, sender: 'system', name: 'System', text: 'Mr. Anderson (Math) shared an update regarding your behavior in class: "Excellent participation today!"', time: 'Today, 9:00 AM', isSystem: true },
  ];

  const groupMessages = [
    { id: 1, sender: 'admin', name: 'School Admin', text: '📢 Reminder: The Science Fair registration closes this Friday.', time: 'Monday' },
    { id: 2, sender: 'student_other', name: 'Sarah J.', text: 'Is anyone working on the Biology project this weekend?', time: '10:00 AM' },
    { id: 3, sender: 'student', name: 'You', text: 'I am! We can meet at the library on Saturday if you want.', time: '10:15 AM' },
  ];

  const getActiveMessages = () => {
    switch(activeTab) {
      case 'teacher': return teacherMessages;
      case 'parent': return parentMessages;
      case 'group': return groupMessages;
      default: return teacherMessages;
    }
  };

  const activeMessages = getActiveMessages();

  return (
    <StudentLayout activePage="messages">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-greyed-blue" />
            Communication Center
          </h1>
          <p className="text-greyed-beige/70 mt-1">Connect with your teachers, parents, and peers.</p>
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

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-greyed-white/30 space-y-6 flex flex-col">
          {activeTab === 'teacher' && (
            <div className="text-center pb-4">
              <span className="bg-[#bbd7eb]/20 text-greyed-navy/70 text-xs font-semibold px-3 py-1 rounded-full border border-[#bbd7eb]/30">
                You can ask questions, request help, or discuss assignments here.
              </span>
            </div>
          )}

          {activeMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${
                msg.isSystem ? 'items-center' : msg.sender === 'student' ? 'items-end' : 'items-start'
              }`}
            >
              {!msg.isSystem && (
                 <span className="text-[10px] font-bold text-greyed-navy/50 mb-1 px-1">{msg.name} • {msg.time}</span>
              )}

              {msg.isSystem ? (
                <div className="bg-yellow-50 text-yellow-800 text-xs font-semibold px-4 py-2 rounded-xl border border-yellow-200/50 flex items-center gap-2 my-2 max-w-[80%] text-center">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  {msg.text}
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-greyed-navy/10 bg-white">
          <div className="flex items-center gap-2">
            <button className="p-2 text-greyed-navy/40 hover:text-greyed-navy hover:bg-greyed-navy/5 rounded-full transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-greyed-white rounded-full border border-greyed-navy/10 flex items-center px-4 py-2 focus-within:border-greyed-blue transition-colors">
              <input 
                type="text"
                placeholder={
                  activeTab === 'teacher' ? "Ask a question or request help..." :
                  activeTab === 'parent' ? "Share an achievement or update..." :
                  "Message the group..."
                }
                className="w-full bg-transparent border-none focus:outline-none text-sm text-greyed-navy"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className="p-1 text-greyed-navy/40 hover:text-greyed-navy transition-colors ml-2">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${
              messageInput.trim() ? 'bg-[#2a2f6e] text-white hover:bg-[#212754] shadow-sm' : 'bg-greyed-navy/10 text-greyed-navy/40 cursor-not-allowed'
            }`}>
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default CommunicationCenterPage;
