import React, { useState, useEffect } from 'react';
import { X, CreditCard as Edit2, Download, Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, PenTool, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';

interface AssessmentQuestion {
  id?: string | number;
  question: string;
  type: string;
  answer: string;
  options?: string[];
  explanation?: string;
}

interface AssessmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: any;
  questions: AssessmentQuestion[];
  onSave?: (assessment: any, questions: AssessmentQuestion[]) => Promise<boolean>;
  readOnly?: boolean;
}

const AssessmentViewModal: React.FC<AssessmentViewModalProps> = ({
  isOpen,
  onClose,
  assessment,
  questions: initialQuestions,
  onSave,
  readOnly = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState(assessment);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions || []);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    // Reset the state when the modal is opened with a new assessment
    setAssessmentData(assessment);
    setQuestions(initialQuestions || []);
    setEditMode(false);
    setError(null);
    setSuccess(null);
    setActiveQuestionIndex(null);
  }, [assessment, initialQuestions, isOpen]);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    if (readOnly) return;
    setEditMode(!editMode);
  };

  const handleAssessmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssessmentData({
      ...assessmentData,
      [name]: value
    });
  };

  const handleQuestionChange = (index: number, field: string, value: string | string[]) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[index] as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (!question.options) {
      question.options = [];
    }
    
    const options = [...(question.options || [])];
    options[optionIndex] = value;
    question.options = options;
    
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (!question.options) {
      question.options = [];
    }
    
    question.options = [...question.options, `Option ${question.options.length + 1}`];
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      question.options = question.options.filter((_, i) => i !== optionIndex);
      setQuestions(updatedQuestions);
    }
  };

  const addQuestion = () => {
    const newQuestion: AssessmentQuestion = {
      question: "New question",
      type: "multiple-choice",
      answer: "",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      explanation: "Explanation for the correct answer"
    };
    
    setQuestions([...questions, newQuestion]);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
      setActiveQuestionIndex(null);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const saved = await onSave(assessmentData, questions);
      
      if (saved) {
        setSuccess('Assessment saved successfully!');
        setEditMode(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save assessment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadAsDocx = async () => {
    try {
      // Create a new Document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: assessmentData.title,
              heading: HeadingLevel.HEADING_1,
              spacing: {
                after: 200,
              },
            }),
            
            // Assessment details
            new Paragraph({
              text: `Type: ${assessmentData.assessment_type || assessmentData.assessmentType || 'Assessment'}`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `Subject: ${assessmentData.subject || 'N/A'}`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `Difficulty: ${assessmentData.difficulty || 'Standard'}`,
              spacing: { after: 200 }
            }),
            
            // Questions
            ...questions.flatMap((question, index) => {
              const elements = [
                new Paragraph({
                  text: `${index + 1}. ${question.question}`,
                  heading: HeadingLevel.HEADING_3,
                  spacing: { after: 100 },
                }),
              ];
              
              // Add options if multiple choice
              if (question.type === 'multiple-choice' && question.options) {
                question.options.forEach((option, optIndex) => {
                  elements.push(
                    new Paragraph({
                      text: `${String.fromCharCode(65 + optIndex)}. ${option}`,
                      bullet: { level: 0 },
                      spacing: { after: 80 },
                    })
                  );
                });
              }
              
              // Add answer key (if not student version)
              elements.push(
                new Paragraph({
                  text: `Answer: ${question.answer}`,
                  spacing: { after: 100 },
                })
              );
              
              // Add explanation if available
              if (question.explanation) {
                elements.push(
                  new Paragraph({
                    text: `Explanation: ${question.explanation}`,
                    spacing: { after: 200 },
                  })
                );
              }
              
              return elements;
            }),
          ]
        }]
      });
      
      // Generate and save the Word document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${assessmentData.title.replace(/\s+/g, '_')}.docx`);
    } catch {
      setError('Failed to download as Word document. Please try again.');
    }
  };
  
  const downloadAsPDF = () => {
    // In a real implementation, this would convert to PDF
    // For this demo, we'll just alert that this would be a PDF
    alert('In a production environment, this would generate a PDF version of the assessment.');
  };

  const downloadAsText = () => {
    try {
      let textContent = `${assessmentData.title}\n\n`;
      textContent += `Type: ${assessmentData.assessment_type || assessmentData.assessmentType || 'Assessment'}\n`;
      textContent += `Subject: ${assessmentData.subject || 'N/A'}\n`;
      textContent += `Difficulty: ${assessmentData.difficulty || 'Standard'}\n\n`;
      
      // Questions
      questions.forEach((question, index) => {
        textContent += `${index + 1}. ${question.question}\n`;
        
        // Add options if multiple choice
        if (question.type === 'multiple-choice' && question.options) {
          question.options.forEach((option, optIndex) => {
            textContent += `   ${String.fromCharCode(65 + optIndex)}. ${option}\n`;
          });
        }
        
        textContent += `\nAnswer: ${question.answer}\n`;
        
        if (question.explanation) {
          textContent += `Explanation: ${question.explanation}\n`;
        }
        
        textContent += '\n\n';
      });
      
      // Create and download the text file
      const blob = new Blob([textContent], { type: 'text/plain' });
      saveAs(blob, `${assessmentData.title.replace(/\s+/g, '_')}.txt`);
    } catch {
      setError('Failed to download as text. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-greyed-navy text-white">
          <h3 className="text-xl font-headline font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {editMode ? 'Edit Assessment' : 'View Assessment'}
          </h3>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <button
                onClick={handleEditToggle}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={editMode ? 'Cancel editing' : 'Edit assessment'}
              >
                <Edit2 size={18} />
              </button>
            )}
            <div className="relative group">
              <button
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Download assessment"
              >
                <Download size={18} />
              </button>
              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden hidden group-hover:block z-10 w-48">
                <button 
                  onClick={downloadAsDocx}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-greyed-navy/10 transition-colors"
                >
                  Download as Word (.docx)
                </button>
                <button 
                  onClick={downloadAsPDF}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-greyed-navy/10 transition-colors"
                >
                  Download as PDF
                </button>
                <button 
                  onClick={downloadAsText}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-greyed-navy/10 transition-colors"
                >
                  Download as Text (.txt)
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Error/Success Messages */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mx-4 mt-4 bg-slate-800 border border-slate-600 text-cyan-400 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            {/* Assessment Details Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h4 className="text-lg font-medium text-black mb-4 flex items-center">
                <PenTool size={18} className="mr-2 text-greyed-blue" />
                Assessment Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={assessmentData.title}
                    onChange={handleAssessmentChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editMode 
                        ? 'bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue' 
                        : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                    }`}
                    readOnly={!editMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="assessment_type"
                    value={assessmentData.assessment_type || ''}
                    onChange={handleAssessmentChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editMode 
                        ? 'bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue' 
                        : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                    }`}
                    disabled={!editMode}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="homework">Homework</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={assessmentData.difficulty || ''}
                    onChange={handleAssessmentChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editMode 
                        ? 'bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue' 
                        : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                    }`}
                    disabled={!editMode}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed Levels</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    name="topic"
                    value={assessmentData.topic || ''}
                    onChange={handleAssessmentChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editMode 
                        ? 'bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue' 
                        : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                    }`}
                    readOnly={!editMode}
                  />
                </div>
                
                <div className="col-span-full">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Questions</label>
                    <span className="text-xs bg-greyed-blue/20 text-greyed-navy px-2 py-1 rounded">
                      {questions.length} question{questions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {editMode && (
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full py-2 border border-dashed border-greyed-navy/30 rounded-md text-greyed-navy/70 hover:bg-greyed-navy/5 hover:border-greyed-navy/50 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Question
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Question List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="text-lg font-medium text-black mb-4">Questions</h4>
              
              {questions.length === 0 ? (
                <div className="text-center py-8 text-greyed-beige">
                  No questions available
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg overflow-hidden ${
                        activeQuestionIndex === index 
                          ? 'border-greyed-blue' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Question Header */}
                      <div 
                        className={`flex justify-between items-center p-3 cursor-pointer ${
                          activeQuestionIndex === index 
                            ? 'bg-greyed-blue/10' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex === index ? null : index)}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-greyed-navy text-white flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div className="text-sm font-medium truncate pr-4">
                            {question.question.length > 100 
                              ? `${question.question.substring(0, 100)}...` 
                              : question.question
                            }
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mr-2">
                            {question.type}
                          </span>
                          {editMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(index);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Delete question"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Question Details (expanded view) */}
                      {activeQuestionIndex === index && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <textarea
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                  editMode 
                                    ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                    : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                }`}
                                rows={2}
                                readOnly={!editMode}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                              <select
                                value={question.type}
                                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                  editMode 
                                    ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                    : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                }`}
                                disabled={!editMode}
                              >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="short-answer">Short Answer</option>
                                <option value="true-false">True/False</option>
                                <option value="essay">Essay</option>
                              </select>
                            </div>
                            
                            {/* Options for multiple choice questions */}
                            {question.type === 'multiple-choice' && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-sm font-medium text-gray-700">Options</label>
                                  {editMode && (
                                    <button
                                      type="button"
                                      onClick={() => addOption(index)}
                                      className="text-xs text-greyed-blue hover:text-greyed-navy transition-colors"
                                    >
                                      + Add Option
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  {(question.options || []).map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mr-2">
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-md ${
                                          editMode 
                                            ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                            : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                        }`}
                                        readOnly={!editMode}
                                      />
                                      {editMode && (
                                        <button
                                          type="button"
                                          onClick={() => removeOption(index, optIndex)}
                                          className="p-1 ml-2 text-red-500 hover:bg-red-50 rounded"
                                          title="Remove option"
                                        >
                                          <X size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                              {question.type === 'multiple-choice' && question.options?.length ? (
                                <select
                                  value={question.answer}
                                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                    editMode 
                                      ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                      : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                  }`}
                                  disabled={!editMode}
                                >
                                  <option value="">Select correct answer</option>
                                  {question.options.map((option, optIndex) => (
                                    <option key={optIndex} value={option}>
                                      {String.fromCharCode(65 + optIndex)}. {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <textarea
                                  value={question.answer}
                                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                    editMode 
                                      ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                      : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                  }`}
                                  rows={2}
                                  readOnly={!editMode}
                                />
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                              <textarea
                                value={question.explanation || ''}
                                onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                  editMode 
                                    ? 'focus:outline-none focus:ring-2 focus:ring-greyed-blue bg-white' 
                                    : 'bg-gray-100 text-gray-900 cursor-not-allowed'
                                }`}
                                rows={2}
                                readOnly={!editMode}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
          >
            {editMode ? 'Cancel' : 'Close'}
          </button>
          
          {editMode && onSave && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 flex items-center"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentViewModal;