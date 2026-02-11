import React from 'react';
import { X, Database, ExternalLink } from 'lucide-react';

interface StorageBucketErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bucketName: string;
}

const StorageBucketErrorModal: React.FC<StorageBucketErrorModalProps> = ({ 
  isOpen, 
  onClose,
  bucketName 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-4 py-3 flex justify-between items-center border-b border-primary/10">
          <h2 className="font-headline font-bold text-lg text-red-600">
            Storage Bucket Not Found
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-primary/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-black" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-red-50 p-4 rounded-lg flex mb-4">
            <Database className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Missing Storage Bucket</h3>
              <p className="text-red-700 text-sm">
                The <code className="bg-red-100 px-1 py-0.5 rounded">{bucketName}</code> storage bucket does not exist in your Supabase project.
              </p>
            </div>
          </div>
          
          <h3 className="font-medium text-black mb-3">How to fix this:</h3>
          
          <ol className="list-decimal pl-5 space-y-3 mb-6 text-sm">
            <li>
              <span className="text-black">Go to your <strong>Supabase Dashboard</strong></span>
            </li>
            <li>
              <span className="text-black">Navigate to <strong>Storage</strong> in the left sidebar</span>
            </li>
            <li>
              <span className="text-black">Click <strong>New Bucket</strong></span>
            </li>
            <li>
              <span className="text-black">Create a bucket named <code className="bg-primary/10 px-1 py-0.5 rounded">{bucketName}</code></span>
            </li>
            <li>
              <span className="text-black">Set the appropriate permissions (public or private) based on your needs</span>
            </li>
            <li>
              <span className="text-black">Return to this application and try again</span>
            </li>
          </ol>
          
          <div className="flex justify-end mt-4">
            <a 
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mr-3 flex items-center"
            >
              <ExternalLink size={16} className="mr-2" />
              Open Supabase Dashboard
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 text-black rounded-lg hover:bg-primary/5 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageBucketErrorModal;