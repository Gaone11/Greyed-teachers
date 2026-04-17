import React, { useState, useEffect } from 'react';
import { X, Download, Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface TutorUpdatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  updateId?: string;
  updateData?: {
    className: string;
    weekStart: string;
    weekEnd: string;
    status: 'draft' | 'sent';
  };
}

const TutorUpdatePreview: React.FC<TutorUpdatePreviewProps> = ({
  isOpen,
  onClose,
  updateId,
  updateData
}) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Use the id from params if provided, otherwise use the prop
  const currentUpdateId = id || updateId;
  
  useEffect(() => {
    if (!isOpen && !id) return;
    
    const fetchUpdateContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, fetch the actual content from your API
        // For this demo, we'll simulate an API call
        
        setTimeout(() => {
          // Mock content
          const mockContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Weekly Class Update</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #212754; }
              h2 { color: #212754; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .section { margin-bottom: 30px; }
              .highlight { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #bbd7eb; }
              .footer { margin-top: 40px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Weekly Class Update - ${updateData?.className || 'Physics Class'}</h1>
            <p>Week of ${new Date().toLocaleDateString('en-GB', { 
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} to ${new Date(Date.now() + 6*24*60*60*1000).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</p>
            
            <div class="section">
              <h2>This Week's Progress</h2>
              <p>Dear Parents and Guardians,</p>
              <p>I hope this update finds you well. Here's a summary of what we've covered this week in class:</p>
              <ul>
                <li>Completed our unit on forces and motion</li>
                <li>Students conducted lab experiments measuring acceleration</li>
                <li>Reviewed key concepts from Newton's laws of motion</li>
              </ul>
              <p>Most students are showing good progress, with particular strength in understanding force diagrams.</p>
            </div>
            
            <div class="section">
              <h2>Coming Up Next Week</h2>
              <p>Next week, we will be focusing on:</p>
              <ul>
                <li>Introduction to energy conservation</li>
                <li>Potential and kinetic energy calculations</li>
                <li>Real-world applications of energy transfer</li>
              </ul>
              <p class="highlight">Note: We will have a quiz on Thursday covering these topics. Students should review their notes and practice problems.</p>
            </div>
            
            <div class="section">
              <h2>Homework &amp; Assignments</h2>
              <ul>
                <li><strong>Due Monday:</strong> Worksheet on Newton's Laws (handed out Friday)</li>
                <li><strong>Due Wednesday:</strong> Online practice problems (links sent via email)</li>
                <li><strong>Due Friday:</strong> Energy conservation concept map</li>
              </ul>
            </div>
            
            <div class="section">
              <h2>Helpful Resources</h2>
              <ul>
                <li><a href="#">Khan Academy - Energy Conservation</a></li>
                <li><a href="#">Physics Classroom - Work and Energy</a></li>
                <li><a href="#">Class Resource Portal - Practice Problems</a></li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Thank you for your continued support. If you have any questions or concerns, please don't hesitate to contact me.</p>
              <p>Best regards,<br>Your Teacher</p>
            </div>
          </body>
          </html>
          `;
          
          setContent(mockContent);
          setLoading(false);
        }, 1000);
        
      } catch (error: any) {
        setError(error.message || 'Failed to load update content');
        setLoading(false);
      }
    };
    
    fetchUpdateContent();
  }, [isOpen, currentUpdateId, id, updateData]);
  
  // Handle sending the update
  const handleSendUpdate = async () => {
    if (!currentUpdateId) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      // In a real app, call your API to send the update
      // For this demo, we'll simulate an API call
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      setSendSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSendSuccess(false);
        if (!id) { // Only close if in modal mode, not standalone page
          onClose();
        }
      }, 3000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to send update');
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle download as PDF
  const handleDownload = () => {
    // In a real app, generate and download a PDF
    // For this demo, we'll just show an alert
    
    alert('In a production environment, this would download a PDF version of the tutor update.');
  };
  
  // If rendered as a standalone page
  if (id) {
    return (
      <div className="min-h-screen bg-greyed-card py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-greyed-navy/70 hover:text-greyed-navy transition-colors"
            >
              <img src="/logo.png" alt="GreyEd" className="h-5 w-auto opacity-70" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-greyed-navy/10 text-greyed-navy rounded-lg hover:bg-greyed-navy/20 transition-colors flex items-center"
              >
                <Download size={16} className="mr-1" />
                Download PDF
              </button>
              
              {updateData?.status === 'draft' && (
                <button
                  onClick={handleSendUpdate}
                  disabled={isSending || sendSuccess}
                  className={`px-3 py-1.5 bg-greyed-navy text-white rounded-lg transition-colors flex items-center ${
                    isSending || sendSuccess ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader size={16} className="animate-spin mr-1" />
                      Sending...
                    </>
                  ) : sendSuccess ? (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Mail size={16} className="mr-1" />
                      Send Update
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200 text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <Loader className="w-10 h-10 text-greyed-blue animate-spin" />
              </div>
            ) : (
              <iframe 
                srcDoc={content || ''}
                className="w-full h-[800px] border-0"
                title="Tutor Update Preview"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Modal version
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-greyed-navy text-white">
          <h3 className="text-lg font-headline font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Tutor Update Preview
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Download as PDF"
            >
              <Download size={18} />
            </button>
            
            {updateData?.status === 'draft' && (
              <button
                onClick={handleSendUpdate}
                disabled={isSending || sendSuccess}
                className={`p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors ${
                  isSending || sendSuccess ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                title="Send update"
              >
                {isSending ? (
                  <Loader size={18} className="animate-spin" />
                ) : sendSuccess ? (
                  <CheckCircle size={18} />
                ) : (
                  <Mail size={18} />
                )}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {sendSuccess && (
            <div className="mb-4 bg-slate-800 border border-slate-600 text-cyan-400 px-4 py-3 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>Tutor update sent successfully!</span>
            </div>
          )}
          
          <div className="mb-4 bg-greyed-beige/10 p-3 rounded-lg">
            <h4 className="font-medium">{updateData?.className || 'Class Update'}</h4>
            <p className="text-sm text-black/60">
              Week of {updateData?.weekStart ? new Date(updateData.weekStart).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-16 border border-white/10 rounded-lg">
              <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px]">
              <iframe 
                srcDoc={content || ''}
                className="w-full h-full border-0"
                title="Tutor Update Preview"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorUpdatePreview;