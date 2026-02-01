import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchTeacherClasses, generateAssessment, hasActiveSubscription, getTeacherLimits } from '../../lib/api/teacher-api';
import Loader from '../../components/ui/Loader';
import { ArrowLeft, Wand2, AlertCircle, CheckCircle, X, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
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
  difficulty: string;
  assessmentType: string;
  questionCount: number;
  includeAnswerKey: boolean;
  requiredTest: string;
}

// Curriculum data structure
const primaryCurriculum = {
  Mathematics: [
    'Numbers and Place Value',
    'Addition and Subtraction',
    'Multiplication and Division',
    'Fractions and Decimals',
    'Geometry and Shapes',
    'Measurement',
    'Statistics and Probability',
    'Algebra and Functions',
    'Problem Solving'
  ],
  English: [
    'Reading Comprehension',
    'Phonics and Word Recognition',
    'Grammar and Punctuation',
    'Vocabulary Development',
    'Writing Composition',
    'Speaking and Listening',
    'Literature Analysis',
    'Poetry and Rhyme',
    'Persuasive Writing'
  ],
  Science: [
    'Living Things and Habitats',
    'Materials and Properties',
    'Forces and Motion',
    'Earth and Space',
    'Light and Sound',
    'Electricity and Magnetism',
    'Human Body and Health',
    'Environmental Science',
    'Scientific Method'
  ],
  History: [
    'Ancient Civilizations',
    'World History',
    'Local History',
    'Historical Figures',
    'Historical Events',
    'Timeline Studies',
    'Cultural History',
    'Social History',
    'Political History'
  ],
  Geography: [
    'Map Skills and Location',
    'Physical Geography',
    'Human Geography',
    'Environmental Geography',
    'Countries and Continents',
    'Weather and Climate',
    'Natural Resources',
    'Population and Settlement',
    'Economic Geography'
  ]
};

export default function TeacherAssessmentGeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [limits, setLimits] = useState({ assessments: 0, used: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    classId: '', // Will be set after classes are loaded
    selectedSubject: 'Mathematics',
    selectedTopic: 'Numbers and Place Value',
    difficulty: 'medium',
    assessmentType: 'quiz',
    questionCount: 10,
    includeAnswerKey: true,
    requiredTest: ''
  });

  const [availableTopics, setAvailableTopics] = useState<string[]>(primaryCurriculum.Mathematics);
  const [requiredTests, setRequiredTests] = useState<string[]>([]);

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
          setFormData(prev => ({ 
            ...prev, 
            classId: classesData[0].id,
          }));
          
          // Get required tests based on class syllabus
          const firstClass = classesData[0];
          if (firstClass.syllabus) {
            // This would be populated based on syllabus in a real app
            const testsList = ['End of Unit Test', 'Mid-Term Assessment', 'Final Exam'];
            setRequiredTests(testsList);
          }
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
    } else if (name === 'classId') {
      const selectedClass = classes.find(c => c.id === value);
      if (selectedClass && selectedClass.syllabus) {
        // This would be populated based on syllabus in a real app
        const testsList = ['End of Unit Test', 'Mid-Term Assessment', 'Final Exam'];
        setRequiredTests(testsList);
      } else {
        setRequiredTests([]);
      }
      
      setFormData(prev => ({ ...prev, [name]: value, requiredTest: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleGenerateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.selectedSubject || !formData.selectedTopic) {
      alert('Please fill in all required fields');
      return;
    }

    if (!hasAccess && limits.used >= limits.assessments) {
      alert('You have reached your assessment limit. Please upgrade to continue.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const selectedClass = classes.find(c => c.id === formData.classId);
      if (!selectedClass) return;

      const assessmentData = await generateAssessment({
        title: `${formData.selectedSubject} - ${formData.selectedTopic} Assessment`,
        classId: formData.classId,
        assessmentType: formData.assessmentType,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        topic: formData.selectedTopic,
        requiredTest: formData.requiredTest || undefined
      });

      setGeneratedAssessment(assessmentData.assessment);
      setQuestions(assessmentData.questions);
      
    } catch (error: any) {
      setError(error.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAssessment = () => {
    if (!generatedAssessment || !questions || questions.length === 0) return;

    const children: Paragraph[] = [];

    // Title
    children.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: `${formData.selectedSubject} - ${formData.selectedTopic} Assessment`,
            size: 32
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    // Add metadata
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Type: ${formData.assessmentType}` })
        ],
        spacing: { after: 100 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Class: ${classes.find(c => c.id === formData.classId)?.name}` })
        ],
        spacing: { after: 100 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Difficulty: ${formData.difficulty}` })
        ],
        spacing: { after: 200 }
      })
    );

    // Add questions
    questions.forEach((question, i) => {
      // Question
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Question ${i + 1}: ${question.question}` })
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        })
      );

      // Multiple choice options
      if (question.type === 'multiple-choice' && question.options && question.options.length > 0) {
        question.options.forEach((option: string, j: number) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${String.fromCharCode(65 + j)}. ${option}` })
              ],
              bullet: { level: 0 },
              spacing: { after: 60 }
            })
          );
        });
      }

      // Answer key (if enabled)
      if (formData.includeAnswerKey) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Answer: ${question.answer}` })
            ],
            spacing: { before: 100, after: 80 }
          })
        );

        if (question.explanation) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `Explanation: ${question.explanation}` })
              ],
              spacing: { after: 160 }
            })
          );
        }
      }
    });

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    // Generate and save document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${formData.selectedSubject}_${formData.selectedTopic}_Assessment.docx`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/teachers/assessments')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Assessments
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Generate Assessment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleGenerateAssessment} className="space-y-6">
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

              {requiredTests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Test (from syllabus)
                  </label>
                  <select
                    name="requiredTest"
                    value={formData.requiredTest}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a required test (optional)</option>
                    {requiredTests.map(test => (
                      <option key={test} value={test}>{test}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type
                  </label>
                  <select
                    name="assessmentType"
                    value={formData.assessmentType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="homework">Homework</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleNumberChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={25}>25 questions</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Include in Assessment</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeAnswerKey"
                      checked={formData.includeAnswerKey}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include answer key and explanations</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || (!hasAccess && limits.used >= limits.assessments)}
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
                    Generate Assessment
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
                        You've used {limits.used} of {limits.assessments} free assessments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Preview/Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            {generatedAssessment ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 text-greyed-navy mr-2" />
                    Assessment Generated
                  </h2>
                  <button
                    onClick={handleDownloadAssessment}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg max-h-96 overflow-y-auto">
                  <FileText className="h-16 w-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Assessment Ready!</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Your AI-generated assessment is ready for download.
                  </p>
                  <button
                    onClick={handleDownloadAssessment}
                    className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 text-lg font-medium"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download & Edit DOCX
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600">
                  Fill out the form and click "Generate Assessment" to create a detailed, 
                  curriculum-aligned assessment for your class.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}