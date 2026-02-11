import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchTeacherClasses, generateLessonPlan, hasActiveSubscription, getTeacherLimits } from '../../lib/api/teacher-api';
import Loader from '../../components/ui/Loader';
import { Wand2, AlertCircle, CheckCircle, PlusCircle, X, Download, BookOpen, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Packer, Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
}

interface FormData {
  classId: string;
  selectedSubject: string;
  selectedTopic: string;
  syllabus: string;
  date: string;
  duration: string;
  focusAreas: string[];
  includeAssessment: boolean;
  includeDifferentiation: boolean;
  includeResources: boolean;
}

// Curriculum data structure
const primaryCurriculum = {
  Mathematics: [
    'Numbers and Counting - Intro',
    'Numbers and Counting - Main',
    'Addition and Subtraction - Intro',
    'Addition and Subtraction - Main',
    'Multiplication and Division - Intro',
    'Multiplication and Division - Main',
    'Fractions - Intro',
    'Fractions - Main',
    'Geometry and Shapes - Intro',
    'Geometry and Shapes - Main',
    'Measurement - Intro',
    'Measurement - Main',
    'Data Handling - Intro',
    'Data Handling - Main'
  ],
  English: [
    'Reading Comprehension - Intro',
    'Reading Comprehension - Main',
    'Phonics and Spelling - Intro',
    'Phonics and Spelling - Main',
    'Grammar and Punctuation - Intro',
    'Grammar and Punctuation - Main',
    'Creative Writing - Intro',
    'Creative Writing - Main',
    'Poetry and Rhyme - Intro',
    'Poetry and Rhyme - Main',
    'Speaking and Listening - Intro',
    'Speaking and Listening - Main'
  ],
  Science: [
    'Living Things - Intro',
    'Living Things - Main',
    'Materials and Properties - Intro',
    'Materials and Properties - Main',
    'Forces and Motion - Intro',
    'Forces and Motion - Main',
    'Earth and Space - Intro',
    'Earth and Space - Main',
    'Light and Sound - Intro',
    'Light and Sound - Main',
    'Environmental Science - Intro',
    'Environmental Science - Main'
  ],
  History: [
    'Ancient Civilizations - Intro',
    'Ancient Civilizations - Main',
    'Local History - Intro',
    'Local History - Main',
    'Timeline Activities - Intro',
    'Timeline Activities - Main',
    'Historical Figures - Intro',
    'Historical Figures - Main'
  ],
  Geography: [
    'Maps and Directions - Intro',
    'Maps and Directions - Main',
    'Weather and Climate - Intro',
    'Weather and Climate - Main',
    'Countries and Continents - Intro',
    'Countries and Continents - Main',
    'Rivers and Mountains - Intro',
    'Rivers and Mountains - Main'
  ],
  Art: [
    'Drawing and Sketching - Intro',
    'Drawing and Sketching - Main',
    'Painting Techniques - Intro',
    'Painting Techniques - Main',
    'Sculpture and Modeling - Intro',
    'Sculpture and Modeling - Main',
    'Art History - Intro',
    'Art History - Main'
  ],
  Music: [
    'Rhythm and Beat - Intro',
    'Rhythm and Beat - Main',
    'Melody and Pitch - Intro',
    'Melody and Pitch - Main',
    'Musical Instruments - Intro',
    'Musical Instruments - Main',
    'Singing and Voice - Intro',
    'Singing and Voice - Main'
  ],
  'Physical Education': [
    'Basic Movement Skills - Intro',
    'Basic Movement Skills - Main',
    'Team Sports - Intro',
    'Team Sports - Main',
    'Individual Activities - Intro',
    'Individual Activities - Main',
    'Health and Fitness - Intro',
    'Health and Fitness - Main'
  ]
};

export default function TeacherLessonPlanGeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [limits, setLimits] = useState({ lessonPlans: 0, used: 0 });
  
  const [formData, setFormData] = useState<FormData>({
    classId: '',
    selectedSubject: 'Mathematics',
    selectedTopic: primaryCurriculum.Mathematics[0] || '',
    syllabus: 'PSLA',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: '45',
    focusAreas: [],
    includeAssessment: true,
    includeDifferentiation: true,
    includeResources: true
  });

  const [availableTopics, setAvailableTopics] = useState<string[]>(primaryCurriculum.Mathematics);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const [classesData, subscription, teacherLimits] = await Promise.all([
          fetchTeacherClasses(user.id),
          hasActiveSubscription(user.id),
          getTeacherLimits(user.id)
        ]);
        
        setClasses(classesData);
        setHasAccess(subscription);
        setLimits(teacherLimits);
        
        if (classesData.length > 0) {
          setFormData(prev => ({ ...prev, classId: classesData[0].id }));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'selectedSubject') {
      const topics = primaryCurriculum[value as keyof typeof primaryCurriculum] || [];
      setAvailableTopics(topics);
      setFormData(prev => ({
        ...prev,
        selectedSubject: value,
        selectedTopic: topics[0] || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddFocusArea = () => {
    setFormData(prev => ({ 
      ...prev, 
      focusAreas: [...prev.focusAreas, ''] 
    }));
  };

  const handleRemoveFocusArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index)
    }));
  };

  const handleFocusAreaChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.map((area, i) => i === index ? value : area)
    }));
  };

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError(null);

    if (!formData.classId || !formData.selectedSubject || !formData.selectedTopic) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!hasAccess && limits.used >= limits.lessonPlans) {
      setFormError('You have reached your lesson plan limit. Please upgrade to continue.');
      return;
    }

    try {
      setIsGenerating(true);
      
      const selectedClass = classes.find(c => c.id === formData.classId);
      if (!selectedClass) return;

      const plan = await generateLessonPlan({
        classId: formData.classId,
        subject: formData.selectedSubject,
        topic: formData.selectedTopic,
        syllabus: formData.syllabus,
        date: formData.date,
        duration: formData.duration,
        focusAreas: formData.focusAreas,
        includeAssessment: formData.includeAssessment,
        includeDifferentiation: formData.includeDifferentiation,
        includeResources: formData.includeResources,
        className: selectedClass.name,
        grade: selectedClass.grade
      });

      setGeneratedPlan(plan.markdown || plan);
      
      // Reset form
      setFormData({
        classId: classes[0]?.id || '',
        selectedSubject: 'Mathematics',
        selectedTopic: 'Numbers and Counting - Intro',
        syllabus: 'PSLA',
        date: format(new Date(), 'yyyy-MM-dd'),
        duration: '45',
        focusAreas: [],
        includeAssessment: true,
        includeDifferentiation: true,
        includeResources: true
      });
      setAvailableTopics(primaryCurriculum.Mathematics);
      
    } catch {
      setFormError('Failed to generate lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseMarkdownToTextRuns = (text: string): TextRun[] => {
    return [new TextRun({ text: text.replace(/\*\*/g, ''), bold: false })];
  };

  const handleDownloadPlan = () => {
    if (!generatedPlan) return;

    const lines = generatedPlan.split('\n');
    const children: Paragraph[] = [];

    // Helper to parse markdown to plain text for DOCX
    const parseMarkdownToPlain = (text: string): TextRun[] => {
      return [new TextRun({ text: text.replace(/\*\*/g, ''), bold: false })];
    };

    lines.forEach(line => {
      if (line.trim() === '') {
        children.push(new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: {
            after: 80,
          },
        }));
      } else if (line.startsWith('### ')) {
        children.push(new Paragraph({
          children: parseMarkdownToTextRuns(line.substring(4)),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 }
        }));
      } else if (line.startsWith('## ')) {
        children.push(new Paragraph({
          children: parseMarkdownToPlain(line.substring(3)),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 320, after: 160 }
        }));
      } else if (line.startsWith('# ')) {
        children.push(new Paragraph({
          children: parseMarkdownToPlain(line.substring(2)),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }));
      } else if (line.startsWith('- ')) {
        children.push(new Paragraph({
          children: parseMarkdownToTextRuns(line.substring(2)),
          bullet: { level: 0 },
          spacing: { after: 40 }
        }));
      } else {
        children.push(new Paragraph({
          children: parseMarkdownToPlain(line),
          spacing: { after: 60 }
        }));
      }
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const filename = `${formData.selectedSubject} - ${formData.selectedTopic} - ${formData.date}.docx`;
      saveAs(blob, filename);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/teachers/lesson-planner')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
              title="Back to Lesson Plans"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Generate Lesson Plan</h1>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleGenerateLessonPlan} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" role="alert">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{formError}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade} ({cls.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="selectedSubject"
                  value={formData.selectedSubject}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {Object.keys(primaryCurriculum).map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  name="selectedTopic"
                  value={formData.selectedTopic}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {availableTopics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus
                </label>
                <select
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="PSLE">PSLE</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Focus Areas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFocusArea}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Focus Area
                  </button>
                </div>
                {formData.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => handleFocusAreaChange(index, e.target.value)}
                      placeholder="e.g., Vocabulary building, Problem solving"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFocusArea(index)}
                      className="text-primary hover:text-primary/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Include Sections</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeAssessment"
                      checked={formData.includeAssessment}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Assessment Activities</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeDifferentiation"
                      checked={formData.includeDifferentiation}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Differentiation Strategies</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeResources"
                      checked={formData.includeResources}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Required Resources</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || (!hasAccess && limits.used >= limits.lessonPlans)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </button>

              {!hasAccess && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">
                        Free Plan Limit
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">
                        You've used {limits.used} of {limits.lessonPlans} free lesson plans.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Preview/Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            {generatedPlan ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Lesson Plan Generated
                  </h2>
                  <button
                    onClick={handleDownloadPlan}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg max-h-96 overflow-y-auto">
                  <FileText className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">Lesson Plan Ready!</h3>
                  <p className="text-primary/70 text-center mb-6">
                    Your AI-generated lesson plan is ready for download.
                  </p>
                  <button
                    onClick={handleDownloadPlan}
                    className="flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 text-lg font-medium"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download & Edit DOCX
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600">
                  Fill out the form and click "Generate Lesson Plan" to create a detailed, 
                  curriculum-aligned lesson plan for your class.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}