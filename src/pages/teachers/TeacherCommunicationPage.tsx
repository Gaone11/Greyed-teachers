import React, { useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  MessageSquare, 
  Users, 
  Megaphone,
  Send,
  Search,
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react';

const TeacherCommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'announcements'>('students');

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
        
        {activeTab === 'announcements' && (
          <button className="bg-greyed-navy hover:bg-greyed-navy/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
            <Megaphone className="w-5 h-5" />
            New Announcement
          </button>
        )}
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
                {/* Mock Contact Item */}
                <div className="p-4 border-b border-greyed-navy/5 hover:bg-greyed-navy/5 cursor-pointer flex gap-3 bg-greyed-blue/5">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex flex-shrink-0 items-center justify-center text-greyed-navy font-bold">
                    E
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-greyed-navy truncate text-sm">Emma Thompson</h4>
                      <span className="text-xs text-greyed-navy/50">10:42 AM</span>
                    </div>
                    <p className="text-xs text-greyed-navy/60 truncate">Can you clarify the homework assignment?</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-greyed-blue mt-1"></div>
                </div>
                
                <div className="p-4 border-b border-greyed-navy/5 hover:bg-greyed-navy/5 cursor-pointer flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-greyed-navy/10 flex flex-shrink-0 items-center justify-center text-greyed-navy/60 font-bold">
                    L
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-greyed-navy truncate text-sm">Liam Johnson</h4>
                      <span className="text-xs text-greyed-navy/50">Yesterday</span>
                    </div>
                    <p className="text-xs text-greyed-navy/60 truncate">Thank you for the feedback!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-greyed-navy/10 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy font-bold">
                    E
                  </div>
                  <div>
                    <h3 className="font-bold text-greyed-navy">Emma Thompson</h3>
                    <p className="text-xs text-green-500 font-medium">Online</p>
                  </div>
                </div>
                <button className="text-greyed-navy/40 hover:text-greyed-navy">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-greyed-navy/5">
                {/* Messages */}
                <div className="flex flex-col gap-1 items-end">
                  <div className="bg-greyed-blue text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                    Hi Emma, I noticed you were struggling with the last assignment. Do you need any help?
                  </div>
                  <span className="text-[10px] text-greyed-navy/40">Yesterday, 2:30 PM</span>
                </div>
                
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-white border border-greyed-navy/10 text-greyed-navy px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] text-sm shadow-sm">
                    Yes please! Can you clarify the homework assignment? I'm not sure which chapters to read.
                  </div>
                  <span className="text-[10px] text-greyed-navy/40">Today, 10:42 AM</span>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-greyed-navy/10">
                <div className="flex items-end gap-2 bg-greyed-navy/5 p-2 rounded-2xl border border-greyed-navy/10">
                  <button className="p-2 text-greyed-navy/40 hover:text-greyed-blue transition-colors rounded-full hover:bg-greyed-blue/10 flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea 
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-transparent focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[40px] text-sm py-2 text-greyed-navy placeholder:text-greyed-navy/40"
                    rows={1}
                  ></textarea>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-greyed-navy/40 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50 flex-shrink-0">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-greyed-navy text-white hover:bg-greyed-blue transition-colors rounded-full shadow-sm flex-shrink-0">
                      <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 bg-greyed-navy/5 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-greyed-navy/10 p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-greyed-blue"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-greyed-navy text-lg group-hover:text-greyed-blue transition-colors">Midterm Exam Schedule Change</h3>
                    <p className="text-xs text-greyed-navy/50 mt-1">Sent to: All Classes • Oct 12, 2023</p>
                  </div>
                  <span className="bg-greyed-blue/10 text-greyed-blue px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Sent
                  </span>
                </div>
                <p className="text-sm text-greyed-navy/70 line-clamp-2">
                  Dear Students, Please note that the midterm exam scheduled for next Tuesday has been moved to Thursday due to the assembly. Make sure you update your calendars. Let me know if you have any questions!
                </p>
                <div className="mt-4 flex gap-4 text-sm font-semibold text-greyed-navy/60">
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 145 Recipients</div>
                  <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> 120 Read</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-greyed-navy/10 p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-greyed-navy/20"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-greyed-navy text-lg group-hover:text-greyed-blue transition-colors">Science Fair Projects Due</h3>
                    <p className="text-xs text-greyed-navy/50 mt-1">Sent to: Biology 101 • Oct 5, 2023</p>
                  </div>
                  <span className="bg-greyed-navy/10 text-greyed-navy/60 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Sent
                  </span>
                </div>
                <p className="text-sm text-greyed-navy/70 line-clamp-2">
                  A reminder that your final Science Fair project proposals are due this Friday. Please ensure you submit them via the assignments tab.
                </p>
                <div className="mt-4 flex gap-4 text-sm font-semibold text-greyed-navy/60">
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 30 Recipients</div>
                  <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> 28 Read</div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherCommunicationPage;
