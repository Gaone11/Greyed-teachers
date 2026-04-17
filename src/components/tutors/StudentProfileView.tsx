import React, { useState } from 'react';
import { X, CircleUser as UserCircle, Mail, Phone, MessageSquare, Users, Loader } from 'lucide-react';
import StudentUpdateCard from './StudentUpdateCard';

interface StudentUpdate {
  id: string;
  student_id: string;
  content: string;
  created_at: string;
  sent: boolean;
  sent_via?: 'email' | 'whatsapp' | null;
}

interface Student {
  id: string;
  name: string;
  profile_picture?: string;
  grade?: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  lastUpdate?: string;
  updates?: StudentUpdate[];
}

interface StudentProfileViewProps {
  student: Student;
  onClose: () => void;
  onSaveUpdate: (content: string) => void;
  onSendUpdate: (updateId: string, method: 'email' | 'whatsapp') => void;
  isSending: boolean;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onClose,
  onSaveUpdate,
  onSendUpdate,
  isSending
}) => {
  const [updateText, setUpdateText] = useState('');

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handler to use quick templates
  const useTemplate = (type: 'positive' | 'needs-improvement') => {
    if (type === 'positive') {
      setUpdateText(`${student.name} is showing good progress in class. They are engaged and completing all assigned work.`);
    } else {
      setUpdateText(`${student.name} needs some improvement in their class participation. They have missed several homework assignments recently.`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-greyed-navy text-white">
        <h3 className="text-lg font-headline font-bold flex items-center">
          <UserCircle className="w-5 h-5 mr-2" />
          Student Profile
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-5 overflow-auto">
        {/* Student info */}
        <div className="flex items-start mb-6">
          <div className="mr-6">
            {student.profile_picture ? (
              <img 
                src={student.profile_picture} 
                alt={student.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-greyed-blue/20"
              />
            ) : (
              <div className="w-24 h-24 bg-greyed-blue/20 rounded-full flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-greyed-navy/50" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-medium text-black mb-2">{student.name}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="text-sm">
                <span className="text-black/60">Current Grade:</span>{' '}
                <span className="font-medium text-black">{student.grade || 'N/A'}</span>
              </div>
              <div className="text-sm">
                <span className="text-black/60">Last Update:</span>{' '}
                <span className="font-medium text-black">{formatDate(student.lastUpdate || null)}</span>
              </div>
            </div>
            
            <div className="bg-greyed-beige/10 p-3 rounded-lg">
              <h5 className="font-medium text-black mb-2 flex items-center">
                <Users size={16} className="mr-2" />
                Parent/Guardian Information
              </h5>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-black/60">Name:</span>{' '}
                  <span className="font-medium text-black">{student.parent_name || 'N/A'}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail size={14} className="text-greyed-blue mr-2" />
                  <a href={`mailto:${student.parent_email}`} className="text-greyed-blue hover:underline">
                    {student.parent_email || 'No email available'}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Phone size={14} className="text-greyed-blue mr-2" />
                  <a href={`tel:${student.parent_phone}`} className="text-greyed-blue hover:underline">
                    {student.parent_phone || 'No phone available'}
                  </a>
                  {student.parent_phone && (
                    <a 
                      href={`https://wa.me/${student.parent_phone.replace(/\+/g, '').replace(/\s/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-cyan-400 hover:text-slate-200"
                    >
                      <MessageSquare size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Previous updates */}
        <div className="mb-6">
          <h5 className="font-medium text-black mb-3">Previous Updates</h5>
          
          {student.updates?.length ? (
            <div className="space-y-4">
              {student.updates.map((update) => (
                <StudentUpdateCard
                  key={update.id}
                  update={update}
                  onSend={onSendUpdate}
                  isSending={isSending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-greyed-navy/10 rounded-lg">
              <p className="text-black/60">No previous updates for this student</p>
            </div>
          )}
        </div>
        
        {/* New update form */}
        <div>
          <h5 className="font-medium text-black mb-3">New Update for {student.name}</h5>
          
          <div className="space-y-4">
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder={`Write an update about ${student.name}...`}
              className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              rows={4}
            ></textarea>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => useTemplate('positive')}
                  className="text-xs bg-greyed-navy/10 text-greyed-navy px-2 py-1 rounded hover:bg-greyed-navy/20 transition-colors"
                >
                  + Positive Template
                </button>
                <button
                  onClick={() => useTemplate('needs-improvement')}
                  className="text-xs bg-greyed-navy/10 text-greyed-navy px-2 py-1 rounded hover:bg-greyed-navy/20 transition-colors"
                >
                  + Improvement Template
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 border border-white/20 text-black rounded hover:bg-greyed-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSaveUpdate(updateText);
                    setUpdateText('');
                  }}
                  disabled={isSending || !updateText.trim()}
                  className={`px-3 py-1.5 bg-greyed-navy text-white rounded hover:bg-greyed-navy/90 transition-colors flex items-center ${
                    isSending || !updateText.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader size={14} className="animate-spin mr-1" />
                      Saving...
                    </>
                  ) : (
                    'Save Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;