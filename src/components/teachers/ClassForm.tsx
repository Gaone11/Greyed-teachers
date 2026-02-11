import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
    syllabus: string;
    classSize?: number;
    duration?: number;
  }) => Promise<void>;
  initialData?: {
    name?: string;
    subject?: string;
    grade?: string;
    description?: string;
    syllabus?: string;
    classSize?: number;
    duration?: number;
  };
  isEditing?: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    subject: initialData.subject || '',
    grade: initialData.grade || '',
    description: initialData.description || '',
    syllabus: initialData.syllabus || 'PSLA',
    classSize: initialData.classSize?.toString() || '',
    duration: initialData.duration?.toString() || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      await onSubmit({
        name: formData.name,
        subject: formData.subject,
        grade: formData.grade,
        description: formData.description,
        syllabus: formData.syllabus,
        classSize: formData.classSize ? parseInt(formData.classSize, 10) : undefined,
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to save class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">{isEditing ? 'Edit Class' : 'Create New Class'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 touch-target"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
              value={formData.syllabus}
              onChange={handleInputChange}
            >
              <option value="">Select a syllabus...</option>
              <option value="PSLE">PSLE</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Level</label>
           <select
             name="grade"
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
             value={formData.grade}
             onChange={handleInputChange}
             required
           >
             <option value="">Select a grade...</option>
             <option value="Reception">Reception</option>
             <option value="Standard 1">Standard 1</option>
             <option value="Standard 2">Standard 2</option>
             <option value="Standard 3">Standard 3</option>
             <option value="Standard 4">Standard 4</option>
             <option value="Standard 5">Standard 5</option>
             <option value="Standard 6">Standard 6</option>
             <option value="Standard 7">Standard 7</option>
           </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Size (Optional)</label>
            <input
              type="number"
              name="classSize"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 25"
              value={formData.classSize}
              onChange={handleInputChange}
              min="1"
              max="999"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Typical Lesson Duration (Optional, in minutes)</label>
            <input
              type="number"
              name="duration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 45"
              value={formData.duration}
              onChange={handleInputChange}
              min="5"
              max="300"
              step="5"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Briefly describe this class..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;