import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { capsCurriculum, saGrades } from '../../data/capsCurriculum';

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
    syllabus: initialData.syllabus || 'NERDC',
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
          <h3 className="text-lg font-headline font-bold text-gray-900">{isEditing ? 'Edit Class' : 'Create New Class'}</h3>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              placeholder="e.g. SSS 1 Physics"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              name="subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
              value={formData.subject}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a subject...</option>
              {capsCurriculum.map(subject => (
                <option key={subject.key} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formData.subject && (
              <p className="mt-1.5 text-xs text-greyed-beige">
                NERDC topics:{' '}
                <span className="text-greyed-navy font-medium">
                  {capsCurriculum.find(subject => subject.name === formData.subject)?.topics.slice(0, 3).map(topic => topic.name).join(' · ') || 'Select a NERDC subject'}
                </span>
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
            <select
              name="syllabus"
              title="Syllabus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
              value={formData.syllabus}
              onChange={handleInputChange}
            >
              <option value="NERDC">NERDC (Nigeria)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Level</label>
           <select
             name="grade"
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
             value={formData.grade}
             onChange={handleInputChange}
             required
           >
             <option value="">Select a grade...</option>
             {saGrades.map(grade => (
               <option key={grade.value} value={grade.value}>{grade.label}</option>
             ))}
           </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Size (Optional)</label>
            <input
              type="number"
              name="classSize"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
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
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-greyed-white hover:bg-greyed-navy"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 ${
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
