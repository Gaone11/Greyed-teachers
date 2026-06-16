import React, { useState } from 'react';
import ParentLayout from '../../layouts/ParentLayout';
import { 
  MessageSquare, 
  Users, 
  Megaphone,
  Send,
  Search,
  Paperclip,
  Smile,
  MoreVertical,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';

const ParentCommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'announcements'>('teachers');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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
            className={`flex-1 py-4 font-semibold text-sm transition-colors relative flex justify-center items-center gap-2 ${activeTab === 'announcements' ? 'text-greyed-navy bg-white rounded-t-xl' : 'text-greyed-navy/50 hover:text-greyed-navy/80'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone className="w-4 h-4" /> Announcements
            {activeTab === 'announcements' && <div className="absolute top-0 left-0 right-0 h-1 bg-greyed-navy rounded-t-xl"></div>}
          </button>
        </div>

        {activeTab === 'teachers' ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-greyed-navy/10 bg-white flex flex-col">
              <div className="p-4 border-b border-greyed-navy/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                  <input 
                    type="text"
                    placeholder="Search teachers..."
                    className="w-full pl-9 pr-4 py-2 bg-greyed-navy/5 rounded-lg border-transparent focus:bg-white focus:border-greyed-navy/20 focus:outline-none focus:ring-2 focus:ring-greyed-blue/50 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-greyed-navy/5 hover:bg-greyed-navy/5 cursor-pointer flex gap-3 bg-greyed-blue/5">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex flex-shrink-0 items-center justify-center text-greyed-navy font-bold">
                    D
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-greyed-navy truncate text-sm">Mr. Davis (History)</h4>
                      <span className="text-xs text-greyed-navy/50">10:42 AM</span>
                    </div>
                    <p className="text-xs text-greyed-navy/60 truncate">Thank you! We'll see you at 3PM.</p>
                  </div>
                </div>
                
                <div className="p-4 border-b border-greyed-navy/5 hover:bg-greyed-navy/5 cursor-pointer flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-greyed-navy/10 flex flex-shrink-0 items-center justify-center text-greyed-navy/60 font-bold">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-greyed-navy truncate text-sm">Ms. Smith (Science)</h4>
                      <span className="text-xs text-greyed-navy/50">Yesterday</span>
                    </div>
                    <p className="text-xs text-greyed-navy/60 truncate">Emma did great in the lab today.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-greyed-navy/10 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy font-bold">
                    D
                  </div>
                  <div>
                    <h3 className="font-bold text-greyed-navy">Mr. Davis</h3>
                    <p className="text-xs text-greyed-navy/60 font-medium">History Teacher</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-greyed-navy/5 text-greyed-navy hover:bg-greyed-navy/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> Book
                  </button>
                  <button className="text-greyed-navy/40 hover:text-greyed-navy">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-greyed-navy/5">
                <div className="flex flex-col gap-1 items-end">
                  <div className="bg-greyed-blue text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                    Hi Mr. Davis, I would like to schedule a quick meeting to discuss Emma's recent history project.
                  </div>
                  <span className="text-[10px] text-greyed-navy/40">Today, 9:00 AM</span>
                </div>
                
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-white border border-greyed-navy/10 text-greyed-navy px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] text-sm shadow-sm">
                    Hello! Yes, absolutely. I'm available tomorrow at 3:00 PM. Does that work for you?
                  </div>
                  <span className="text-[10px] text-greyed-navy/40">Today, 10:15 AM</span>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <div className="bg-greyed-blue text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                    Yes, that's perfect. Thank you! We'll see you at 3PM.
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
              
              <div className="bg-white rounded-xl shadow-sm border border-greyed-navy/10 p-5 relative overflow-hidden group hover:border-greyed-blue/30 transition-colors cursor-pointer">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-greyed-blue"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-greyed-navy text-lg group-hover:text-greyed-blue transition-colors">Parent-Teacher Conferences</h3>
                    <p className="text-xs text-greyed-navy/50 mt-1">From: School Administration • Oct 12, 2023</p>
                  </div>
                  <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    New
                  </span>
                </div>
                <p className="text-sm text-greyed-navy/70 mb-4">
                  Dear Parents, our annual Parent-Teacher conferences will be held next week on Thursday and Friday. Please ensure you use the scheduling tool to book a slot with your child's teachers.
                </p>
                <button className="text-sm font-semibold text-greyed-blue hover:underline">Read Full Announcement</button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-greyed-navy/10 p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-greyed-navy/20"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-greyed-navy text-lg">School Closed for Public Holiday</h3>
                    <p className="text-xs text-greyed-navy/50 mt-1">From: School Administration • Oct 5, 2023</p>
                  </div>
                </div>
                <p className="text-sm text-greyed-navy/70">
                  Just a reminder that the school will be closed this coming Monday for the public holiday. Classes will resume as normal on Tuesday.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal Mock */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-greyed-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
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
                <select className="w-full p-3 rounded-xl border border-greyed-navy/20 focus:ring-2 focus:ring-greyed-blue/50 outline-none bg-white">
                  <option>Mr. Davis (History)</option>
                  <option>Ms. Smith (Science)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-greyed-navy mb-2">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                    <input type="date" className="w-full pl-9 pr-3 py-3 rounded-xl border border-greyed-navy/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-greyed-navy mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                    <input type="time" className="w-full pl-9 pr-3 py-3 rounded-xl border border-greyed-navy/20 outline-none text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-greyed-navy mb-2">Reason for Meeting</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-greyed-navy/20 outline-none resize-none h-24"
                  placeholder="Briefly describe what you'd like to discuss..."
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
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2.5 bg-greyed-navy text-white font-semibold rounded-xl hover:bg-greyed-navy/90 transition-colors shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </ParentLayout>
  );
};

export default ParentCommunicationPage;
