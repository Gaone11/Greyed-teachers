import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Save, Trash2, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClassSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (classData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
    syllabus: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
  classData: {
    id?: string;
    name: string;
    subject: string;
    grade: string;
    description?: string;
    syllabus?: string;
  };
}

const ClassSettingsModal: React.FC<ClassSettingsModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  classData
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: classData.name || '',
    subject: classData.subject || '',
    grade: classData.grade || '',
    description: classData.description || '',
    syllabus: classData.syllabus || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Update form data when classData changes
  useEffect(() => {
    setFormData({
      name: classData.name || '',
      subject: classData.subject || '',
      grade: classData.grade || '',
      description: classData.description || '',
      syllabus: classData.syllabus || '',
    });
  }, [classData]);
  
  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onUpdate(formData);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to update class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await onDelete();
      onClose();
      // Navigate back to classes page
      navigate('/teachers/classes');
    } catch (error: any) {
      setError(error.message || 'Failed to delete class. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">Class Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 touch-target"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
              placeholder="e.g. Year 11 Physics"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
              placeholder="e.g. Physics"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
            <select
              name="syllabus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 appearance-none"
              value={formData.syllabus}
              onChange={handleInputChange}
            >
              <option value="">Select a syllabus...</option>
              <optgroup label="Cambridge">
                <option value="Cambridge IGCSE">IGCSE</option>
                <option value="Cambridge A Level">A Level</option>
              </optgroup>
              <optgroup label="Botswana National">
                <option value="Botswana JSE">JSE</option>
                <option value="Botswana BGCSE">BGCSE</option>
              </optgroup>              
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Level</label>
            <input
              type="text"
              name="grade"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
              placeholder="e.g. GCSE, A-Level"
              value={formData.grade}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
              placeholder="Briefly describe this class..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Class
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Confirm delete?</span>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader size={12} className="mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 flex items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
        </form>
      </div>
    </div>
  );
};

export default ClassSettingsModal;