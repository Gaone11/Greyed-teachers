import React from 'react';
import { CreditCard as Edit2, Eye, Mail, CheckCircle, Calendar, Trash2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface TutorUpdateListItemProps {
  update: {
    id: string;
    className: string;
    weekStart: string;
    weekEnd: string;
    status: 'draft' | 'sent';
    sentDate: string | null;
    openRate: string;
    openPercentage: number;
  };
  onView: (updateId: string) => void;
  onEdit: (updateId: string) => void;
  onSend: (updateId: string) => void;
  onDelete: (updateId: string) => void;
  isSending: boolean;
  isDeleting: boolean;
}

const TutorUpdateListItem: React.FC<TutorUpdateListItemProps> = ({
  update,
  onView,
  onEdit,
  onSend,
  onDelete,
  isSending,
  isDeleting
}) => {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not sent';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format week range
  const formatWeekRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return `${startDate.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    })} - ${endDate.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-white/5 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-greyed-navy">{update.className}</h3>
          <div className="flex items-center text-greyed-navy/60 text-sm">
            <Calendar size={14} className="mr-1" />
            {formatWeekRange(update.weekStart, update.weekEnd)}
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          update.status === 'draft' 
            ? 'bg-slate-700 text-slate-200' 
            : 'bg-slate-700 text-slate-200'
        }`}>
          {update.status === 'draft' && <Edit2 size={12} className="mr-1" />}
          {update.status === 'sent' && <CheckCircle size={12} className="mr-1" />}
          {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
        </span>
      </div>
      
      <div className="flex flex-wrap justify-between items-center border-t border-white/5 pt-3">
        <div className="flex items-center text-sm text-greyed-navy/70">
          <div className="mr-2">Sent: {formatDate(update.sentDate)}</div>
          <div className="flex items-center">
            <span className="mr-1">Opens: {update.openRate}</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <motion.div 
                className="h-full bg-greyed-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${update.openPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <button
            onClick={() => onView(update.id)}
            className="p-1.5 text-greyed-blue hover:text-greyed-navy hover:bg-greyed-navy/10 rounded transition-colors"
            title="View update"
          >
            <Eye size={16} />
          </button>
          
          {update.status === 'draft' && (
            <>
              <button
                onClick={() => onEdit(update.id)}
                className="p-1.5 text-greyed-blue hover:text-greyed-navy hover:bg-greyed-navy/10 rounded transition-colors"
                title="Edit update"
              >
                <Edit2 size={16} />
              </button>
              
              <button
                onClick={() => onSend(update.id)}
                disabled={isSending}
                className={`p-1.5 text-cyan-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ${
                  isSending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Send update"
              >
                {isSending ? <Loader size={16} className="animate-spin" /> : <Mail size={16} />}
              </button>
            </>
          )}
          
          <button
            onClick={() => onDelete(update.id)}
            disabled={isDeleting}
            className={`p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Delete update"
          >
            {isDeleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorUpdateListItem;