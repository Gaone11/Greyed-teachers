import React, { useState, useRef, useEffect } from 'react';
import { Save, X, Loader, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface TutorUpdateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  initialContent: string;
  className: string;
  weekStart: string;
  weekEnd: string;
}

const TutorUpdateEditor: React.FC<TutorUpdateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent,
  className,
  weekStart,
  weekEnd
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'code' | 'preview'>('code');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  useEffect(() => {
    // Update content when initialContent changes
    setContent(initialContent);
  }, [initialContent]);
  
  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      await onSave(content);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save update. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Toggle tabs
  const toggleTab = (tab: 'code' | 'preview') => {
    setCurrentTab(tab);
  };
  
  // Add section to the update
  const addSection = (sectionName: string) => {
    const sectionTemplate = `
    <div class="section">
      <h2>${sectionName}</h2>
      <p>Add your content here...</p>
    </div>
    `;
    
    // If we have a textarea reference, insert at cursor position
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      setContent(
        content.substring(0, start) +
        sectionTemplate +
        content.substring(end)
      );
      
      // After React updates the DOM
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + sectionTemplate.length;
        textarea.selectionEnd = start + sectionTemplate.length;
      }, 0);
    } else {
      // Fallback to appending at the end
      const insertPoint = content.lastIndexOf('</body>');
      if (insertPoint !== -1) {
        setContent(
          content.substring(0, insertPoint) +
          sectionTemplate +
          content.substring(insertPoint)
        );
      } else {
        setContent(content + sectionTemplate);
      }
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 bg-greyed-navy text-white flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">Edit Tutor Update</h3>
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div>
            <h4 className="font-medium">{className}</h4>
            <p className="text-sm text-black/60">Week of {formatDate(weekStart)} to {formatDate(weekEnd)}</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="bg-greyed-navy/5 rounded-lg p-1 flex">
              <button
                onClick={() => toggleTab('code')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentTab === 'code' 
                    ? 'bg-greyed-navy text-white' 
                    : 'text-greyed-navy hover:bg-greyed-navy/10'
                }`}
              >
                HTML Editor
              </button>
              <button
                onClick={() => toggleTab('preview')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentTab === 'preview' 
                    ? 'bg-greyed-navy text-white' 
                    : 'text-greyed-navy hover:bg-greyed-navy/10'
                }`}
              >
                Preview
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-greyed-navy text-white rounded-lg transition-colors flex items-center ${
                isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="m-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {currentTab === 'code' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor toolbar */}
            <div className="p-2 bg-greyed-navy/5 border-b border-white/10 flex flex-wrap gap-1">
              <button 
                className="px-3 py-1.5 text-sm rounded hover:bg-greyed-navy/10 text-greyed-navy"
                onClick={() => addSection('This Week\'s Progress')}
              >
                Add Progress Section
              </button>
              <button 
                className="px-3 py-1.5 text-sm rounded hover:bg-greyed-navy/10 text-greyed-navy"
                onClick={() => addSection('Coming Up Next Week')}
              >
                Add Upcoming Section
              </button>
              <button 
                className="px-3 py-1.5 text-sm rounded hover:bg-greyed-navy/10 text-greyed-navy"
                onClick={() => addSection('Homework & Assignments')}
              >
                Add Homework Section
              </button>
              <button 
                className="px-3 py-1.5 text-sm rounded hover:bg-greyed-navy/10 text-greyed-navy"
                onClick={() => addSection('Helpful Resources')}
              >
                Add Resources Section
              </button>
            </div>
            
            {/* Code editor */}
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 font-mono text-sm text-gray-900 bg-white resize-none focus:outline-none border-0"
              spellCheck={false}
            ></textarea>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-greyed-navy p-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
              <iframe 
                srcDoc={content}
                className="w-full h-full border-0"
                title="Tutor Update Preview"
              ></iframe>
            </div>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {currentTab === 'code' ? (
            <button
              onClick={() => toggleTab('preview')}
              className="px-4 py-2 bg-greyed-navy/10 text-greyed-navy rounded-md hover:bg-greyed-navy/20 flex items-center"
            >
              Preview
              <ArrowRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={() => toggleTab('code')}
              className="px-4 py-2 bg-greyed-navy/10 text-greyed-navy rounded-md hover:bg-greyed-navy/20 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Editor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorUpdateEditor;