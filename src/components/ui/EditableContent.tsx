import React, { useState } from 'react';
import { CreditCard as Edit, Save, X } from 'lucide-react';

interface EditableContentProps {
  content: string;
  onSave: (newContent: string) => void;
  className?: string;
  textareaClassName?: string;
  viewClassName?: string;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  onSave,
  className = '',
  textareaClassName = '',
  viewClassName = '',
  placeholder = 'Enter content here...',
  minHeight = '200px',
  maxHeight = '600px',
  showToolbar = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      onSave(editedContent);
      setIsEditing(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to format markdown for display
  const formatMarkdown = (text: string) => {
    // Heading 1
    text = text.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold my-3 border-b pb-2 border-gray-200">$1</h1>');
    
    // Heading 2
    text = text.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold my-3 text-gray-800">$1</h2>');
    
    // Heading 3
    text = text.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold my-2 text-gray-700">$1</h3>');
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    text = text.replace(/^- (.*?)$/gm, '<li class="ml-5">• $1</li>');
    
    // Newlines
    text = text.replace(/\n\n/g, '<br><br>');
    
    return text;
  };

  return (
    <div className={`relative border border-gray-200 rounded-lg ${className}`}>
      {showToolbar && (
        <div className="flex justify-end p-2 border-b border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md mr-2 flex items-center"
                aria-label="Cancel editing"
              >
                <X size={16} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-sm bg-greyed-navy text-white rounded-md flex items-center"
                aria-label="Save changes"
              >
                <Save size={16} className="mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center"
              aria-label="Edit content"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          )}
        </div>
      )}

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className={`w-full p-4 focus:outline-none focus:ring-2 focus:ring-greyed-blue rounded-lg font-mono text-sm md:text-base ${textareaClassName}`}
          style={{ minHeight, maxHeight, resize: 'vertical' }}
          placeholder={placeholder}
          autoFocus
        />
      ) : (
        <div 
          className={`prose max-w-none ${viewClassName}`} 
          style={{ minHeight, maxHeight, overflowY: 'auto' }}
          onClick={showToolbar ? handleEdit : undefined}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) || placeholder }}
        ></div>
      )}
      
      {!showToolbar && isEditing && (
        <div className="flex justify-end p-2 bg-white border-t border-gray-200 sticky bottom-0">
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md mr-2"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-1 text-sm bg-greyed-navy text-white rounded-md"
            aria-label="Save changes"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableContent;