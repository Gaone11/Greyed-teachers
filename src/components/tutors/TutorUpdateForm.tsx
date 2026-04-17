import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Loader } from 'lucide-react';

interface TutorUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    classId: string;
    weekStart: string;
    includeProgressReport: boolean;
    includeUpcomingContent: boolean;
    includeHomework: boolean;
    includeResourceLinks: boolean;
    additionalNotes: string;
  }) => Promise<void>;
  classes: any[];
}

const TutorUpdateForm: React.FC<TutorUpdateFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classes
}) => {
  // Get the current Monday for the default week start
  const getThisMonday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  const [formData, setFormData] = useState({
    classId: classes.length > 0 ? classes[0].id : '',
    weekStart: getThisMonday(),
    includeProgressReport: true,
    includeUpcomingContent: true,
    includeHomework: true,
    includeResourceLinks: true,
    additionalNotes: '',
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId) {
      setError('Please select a class');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to generate tutor update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold">Compose Tutor Update</h3>
          <button 
            onClick={onClose}
            className="text-greyed-beige hover:text-greyed-beige"
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
            <label className="block text-sm font-medium text-greyed-white mb-1">Class</label>
            <select
              name="classId"
              className="w-full px-3 py-3 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
              value={formData.classId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.subject})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-greyed-white mb-1">Week Starting</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-greyed-beige" />
              </div>
              <input
                type="date"
                name="weekStart"
                className="pl-10 w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                value={formData.weekStart}
                onChange={handleInputChange}
                required
              />
            </div>
            <p className="text-xs text-greyed-beige mt-1">
              Usually a Monday. The update will cover the whole week.
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-greyed-white mb-2">Include in Update:</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="includeProgressReport"
                  checked={formData.includeProgressReport}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-greyed-white">Progress Report</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="includeUpcomingContent"
                  checked={formData.includeUpcomingContent}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-greyed-white">Upcoming Learning Content</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="includeHomework"
                  checked={formData.includeHomework}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-greyed-white">Homework Assignments</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="includeResourceLinks"
                  checked={formData.includeResourceLinks}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-greyed-white">Resource Links</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-greyed-white mb-1">Additional Notes (Optional)</label>
            <textarea
              name="additionalNotes"
              className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              rows={3}
              placeholder="Add any specific information you'd like to include in this update..."
              value={formData.additionalNotes}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 rounded-md text-greyed-white hover:bg-greyed-navy"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorUpdateForm;