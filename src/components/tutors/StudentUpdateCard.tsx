import React from 'react';
import { Mail, MessageSquare, Loader, CheckCircle } from 'lucide-react';

interface StudentUpdate {
  id: string;
  content: string;
  created_at: string;
  sent: boolean;
  sent_via?: 'email' | 'whatsapp' | null;
}

interface StudentUpdateCardProps {
  update: StudentUpdate;
  onSend: (updateId: string, method: 'email' | 'whatsapp') => void;
  isSending: boolean;
}

const StudentUpdateCard: React.FC<StudentUpdateCardProps> = ({
  update,
  onSend,
  isSending
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-greyed-navy/10 rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start">
        <p className="text-sm text-black">{update.content}</p>
        
        <div className="flex flex-col items-end ml-4">
          <div className="text-xs text-black/60 mb-2">
            {formatDate(update.created_at)}
          </div>
          
          {update.sent ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle size={12} className="mr-1" />
              Sent via {update.sent_via}
            </span>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => onSend(update.id, 'email')}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/20"
                disabled={isSending}
              >
                <Mail size={12} className="mr-1" />
                Email
              </button>
              <button
                onClick={() => onSend(update.id, 'whatsapp')}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                disabled={isSending}
              >
                <MessageSquare size={12} className="mr-1" />
                WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentUpdateCard;