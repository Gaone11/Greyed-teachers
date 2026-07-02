import React, { useState } from 'react';
import ParentLayout from '../../layouts/ParentLayout';
import { useWorkflowDemo } from '../../context/WorkflowDemoContext';
import { 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  UserMinus, 
  MessageSquare,
  Calendar,
  Settings,
  FileText,
  CheckCircle
} from 'lucide-react';

const ParentNotificationsPage: React.FC = () => {
  const { parentNotifications, assignmentStatus, assignmentGrade, clearNotifications } = useWorkflowDemo();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);

  const notifications = [
    {
      id: 1,
      type: 'absence',
      title: 'Absence Alert',
      message: 'Emma was marked absent for Physical Education today.',
      time: '10 mins ago',
      icon: UserMinus,
      color: 'bg-red-50 text-red-600 border-red-200',
      unread: true
    },
    {
      id: 2,
      type: 'grade',
      title: 'New Grade Posted',
      message: 'Mr. Davis posted a new grade for the History Midterm: 92% (A).',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600 border-green-200',
      unread: true
    },
    {
      id: 3,
      type: 'message',
      title: 'New Teacher Message',
      message: 'You have a new message from Ms. Smith regarding the upcoming Science Fair.',
      time: 'Yesterday at 3:45 PM',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      unread: false
    },
    {
      id: 4,
      type: 'homework',
      title: 'Missed Homework',
      message: 'Emma did not submit the Literature essay due yesterday.',
      time: 'Yesterday at 8:00 PM',
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      unread: false
    },
    {
      id: 5,
      type: 'exam',
      title: 'Upcoming Exam Reminder',
      message: 'Midterm Exam for Biology 101 is scheduled for tomorrow at 9:00 AM.',
      time: 'Oct 23, 2023',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      unread: false
    }
  ];

  return (
    <ParentLayout activePage="notifications">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Bell className="w-8 h-8 text-greyed-blue" />
            Notifications & Alerts
          </h1>
          <p className="text-greyed-navy/70 mt-1">Stay updated on Emma's academic progress and school activities.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => clearNotifications('parent')}
            className="bg-white border border-greyed-navy/20 hover:bg-greyed-navy/5 text-greyed-navy px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Mark All as Read
          </button>
          <button
            onClick={() => setSettingsOpen(open => !open)}
            className="bg-greyed-navy/5 text-greyed-navy p-2.5 rounded-xl hover:bg-greyed-navy/10 transition-colors"
            title="Notification Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className="mb-4 rounded-xl border border-greyed-navy/10 bg-white p-4 text-sm font-medium text-greyed-navy shadow-sm">
          Notification settings are enabled for grades, attendance, messages, and exams in this preview.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Demo Context Notifications */}
          {assignmentStatus === 'assigned' && parentNotifications > 0 && (
            <div className="p-4 rounded-xl border flex items-start gap-4 transition-colors cursor-pointer bg-blue-50/30 border-greyed-blue/30 hover:bg-blue-50/50">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border bg-blue-50 text-blue-600 border-blue-200">
                <FileText className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                  <h3 className="font-bold text-base truncate text-greyed-navy">
                    New Assignment Posted
                  </h3>
                  <span className="text-xs font-semibold text-greyed-navy/50 whitespace-nowrap">
                    Just now
                  </span>
                </div>
                <p className="text-sm text-greyed-navy/80 font-medium">
                  A new assignment "History Midterm Essay" was assigned to Emma by the Teacher.
                </p>
                <button onClick={() => alert('Assignment details opened in this preview.')} className="mt-3 text-sm font-semibold text-greyed-blue hover:underline">
                  View Details
                </button>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-greyed-blue mt-2 flex-shrink-0 animate-pulse"></div>
            </div>
          )}

          {assignmentStatus === 'graded' && parentNotifications > 0 && (
            <div className="p-4 rounded-xl border flex items-start gap-4 transition-colors cursor-pointer bg-green-50/30 border-green-300 hover:bg-green-50/50">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                  <h3 className="font-bold text-base truncate text-greyed-navy">
                    Homework Graded
                  </h3>
                  <span className="text-xs font-semibold text-greyed-navy/50 whitespace-nowrap">
                    Just now
                  </span>
                </div>
                <p className="text-sm text-greyed-navy/80 font-medium">
                  The Teacher graded "History Midterm Essay". Emma received {assignmentGrade}%.
                </p>
                <button onClick={() => alert(`Grade details opened. Score: ${assignmentGrade}%.`)} className="mt-3 text-sm font-semibold text-green-600 hover:underline">
                  View Grade Details
                </button>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-2 flex-shrink-0 animate-pulse"></div>
            </div>
          )}

          {notifications.map((notification) => {
            const Icon = notification.icon;
            // If there's a demo notification, these static ones are visually "pushed down" and look older
            const isUnread = acknowledgedIds.includes(notification.id)
              ? false
              : parentNotifications > 0 ? false : notification.unread;
            return (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border flex items-start gap-4 transition-colors cursor-pointer ${
                  isUnread 
                    ? 'bg-blue-50/30 border-greyed-blue/30 hover:bg-blue-50/50' 
                    : 'bg-white border-greyed-navy/10 hover:bg-greyed-navy/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${notification.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                    <h3 className={`font-bold text-base truncate ${isUnread ? 'text-greyed-navy' : 'text-greyed-navy/80'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-semibold text-greyed-navy/50 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm ${isUnread ? 'text-greyed-navy/80 font-medium' : 'text-greyed-navy/60'}`}>
                    {notification.message}
                  </p>
                  
                  {notification.type === 'message' && (
                    <button onClick={() => alert('Message thread opened in this preview.')} className="mt-3 text-sm font-semibold text-greyed-blue hover:underline">
                      View Message
                    </button>
                  )}
                  {notification.type === 'grade' && (
                    <button onClick={() => alert('Grade details opened in this preview.')} className="mt-3 text-sm font-semibold text-greyed-blue hover:underline">
                      View Grade Details
                    </button>
                  )}
                  {notification.type === 'absence' && (
                    <button onClick={() => setAcknowledgedIds(prev => Array.from(new Set([...prev, notification.id])))} className="mt-3 text-sm font-semibold text-red-600 hover:underline">
                      {acknowledgedIds.includes(notification.id) ? 'Acknowledged' : 'Acknowledge Absence'}
                    </button>
                  )}
                </div>
                
                {isUnread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-greyed-blue mt-2 flex-shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentNotificationsPage;
