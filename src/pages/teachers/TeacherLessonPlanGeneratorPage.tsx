import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchTeacherClasses, hasActiveSubscription, getTeacherLimits } from '../../lib/api/teacher-api';
import { generateCAPSLessonPlan } from '../../lib/api/caps-lesson-plan';
import { getTopicsFromKb } from '../../lib/api/teacher-kb-api';
import {
  CAPS_SUBJECTS,
  CAPS_GRADES,
  CAPS_TERMS,
  getSubjectsByGrade,
  getTopicsForSubject,
} from '../../data/capsSubjectsData';
import Loader from '../../components/ui/Loader';
import {
  Wand2,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  X,
  Download,
  BookOpen,
  FileText,
  Database,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
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
  selectedGrade: string;
  selectedSubject: string;
  selectedTopic: string;
  selectedTerm: string;
  date: string;
  duration: string;
  focusAreas: string[];
  includeAssessment: boolean;
  includeDifferentiation: boolean;
  includeResources: boolean;
}

export default function TeacherLessonPlanGeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [limits, setLimits] = useState({ lessonPlans: 0, used: 0 });
  const [kbTopics, setKbTopics] = useState<string[]>([]);
  const [loadingKbTopics, setLoadingKbTopics] = useState(false);
  const [hasKbContent, setHasKbContent] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    classId: '',
    selectedGrade: 'Grade 4',
    selectedSubject: '',
    selectedTopic: '',
    selectedTerm: 'Term 1',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: '45',
    focusAreas: [],
    includeAssessment: true,
    includeDifferentiation: true,
    includeResources: true,
  });

  const availableSubjects = getSubjectsByGrade(formData.selectedGrade);
  const capsTopics = formData.selectedSubject
    ? getTopicsForSubject(formData.selectedSubject).map((t) => t.name)
    : [];
  const allTopics = [...new Set([...capsTopics, ...kbTopics])];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [classesData, subscription, teacherLimits] = await Promise.all([
          fetchTeacherClasses(user.id),
          hasActiveSubscription(user.id),
          getTeacherLimits(user.id),
        ]);
        setClasses(classesData);
        setHasAccess(subscription);
        setLimits(teacherLimits);
        if (classesData.length > 0) {
          setFormData((prev) => ({ ...prev, classId: classesData[0].id }));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (!formData.selectedSubject) return;
    const fetchKbTopics = async () => {
      setLoadingKbTopics(true);
      try {
        const topics = await getTopicsFromKb(formData.selectedSubject, formData.selectedGrade);
        setKbTopics(topics);
        setHasKbContent(topics.length > 0);
      } catch {
        setKbTopics([]);
        setHasKbContent(false);
      } finally {
        setLoadingKbTopics(false);
      }
    };
    fetchKbTopics();
  }, [formData.selectedSubject, formData.selectedGrade]);

  const handleGradeChange = (grade: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGrade: grade,
      selectedSubject: '',
      selectedTopic: '',
    }));
    setKbTopics([]);
    setHasKbContent(false);
  };

  const handleSubjectChange = (subject: string) => {
    const topics = getTopicsForSubject(subject).map((t) => t.name);
    setFormData((prev) => ({
      ...prev,
      selectedSubject: subject,
      selectedTopic: topics[0] || '',
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedGrade') {
      handleGradeChange(value);
    } else if (name === 'selectedSubject') {
      handleSubjectChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddFocusArea = () => {
    setFormData((prev) => ({ ...prev, focusAreas: [...prev.focusAreas, ''] }));
  };

  const handleRemoveFocusArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index),
    }));
  };

  const handleFocusAreaChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.map((area, i) => (i === index ? value : area)),
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.selectedSubject || !formData.selectedTopic) {
      alert('Please fill in all required fields');
      return;
    }
    if (!hasAccess && limits.used >= limits.lessonPlans) {
      alert('You have reached your lesson plan limit. Please upgrade to continue.');
      return;
    }

    try {
      setIsGenerating(true);
      const selectedClass = classes.find((c) => c.id === formData.classId);
      if (!selectedClass) return;

      const plan = await generateCAPSLessonPlan({
        classId: formData.classId,
        subject: formData.selectedSubject,
        topic: formData.selectedTopic,
        grade: formData.selectedGrade,
        term: formData.selectedTerm,
        date: formData.date,
        duration: formData.duration,
        className: selectedClass.name,
        focusAreas: formData.focusAreas.filter(Boolean),
        includeAssessment: formData.includeAssessment,
        includeDifferentiation: formData.includeDifferentiation,
        includeResources: formData.includeResources,
      });

      setGeneratedPlan(plan.markdown || plan);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!generatedPlan) return;
    const lines = generatedPlan.split('\n');
    const children: Paragraph[] = [];

    const parseBoldText = (text: string): TextRun[] => {
      const runs: TextRun[] = [];
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
        } else {
          runs.push(new TextRun({ text: part }));
        }
      }
      return runs;
    };

    lines.forEach((line) => {
      if (line.trim() === '' || line.trim() === '---') {
        children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 80 } }));
      } else if (line.startsWith('### ')) {
        children.push(
          new Paragraph({
            children: parseBoldText(line.substring(4)),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith('## ')) {
        children.push(
          new Paragraph({
            children: parseBoldText(line.substring(3)),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 320, after: 160 },
          })
        );
      } else if (line.startsWith('# ')) {
        children.push(
          new Paragraph({
            children: parseBoldText(line.substring(2)),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );
      } else if (line.startsWith('- ')) {
        children.push(
          new Paragraph({
            children: parseBoldText(line.substring(2)),
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      } else if (/^\d+\.\s/.test(line)) {
        children.push(
          new Paragraph({
            children: parseBoldText(line.replace(/^\d+\.\s/, '')),
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      } else {
        children.push(new Paragraph({ children: parseBoldText(line), spacing: { after: 60 } }));
      }
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    Packer.toBlob(doc).then((blob) => {
      const filename = `CAPS_${formData.selectedSubject}_${formData.selectedTopic}_${formData.selectedGrade}_${formData.date}.docx`;
      saveAs(blob, filename.replace(/\s+/g, '_'));
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
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/teachers/lesson-planner')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              &larr; Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Generate CAPS Lesson Plan
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade} ({cls.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    name="selectedGrade"
                    value={formData.selectedGrade}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {CAPS_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                  <select
                    name="selectedTerm"
                    value={formData.selectedTerm}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {CAPS_TERMS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CAPS Subject
                </label>
                <select
                  name="selectedSubject"
                  value={formData.selectedSubject}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select subject</option>
                  {availableSubjects.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  {loadingKbTopics && (
                    <span className="flex items-center text-xs text-teal-600">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Loading KB topics...
                    </span>
                  )}
                  {hasKbContent && !loadingKbTopics && (
                    <span className="flex items-center text-xs text-teal-600">
                      <Database className="w-3 h-3 mr-1" />
                      KB content available
                    </span>
                  )}
                </div>
                <select
                  name="selectedTopic"
                  value={formData.selectedTopic}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select topic</option>
                  {allTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                      {kbTopics.includes(topic) && !capsTopics.includes(topic) ? ' (from KB)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Focus Areas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFocusArea}
                    className="flex items-center text-sm text-teal-600 hover:text-teal-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                {formData.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => handleFocusAreaChange(index, e.target.value)}
                      placeholder="e.g., Vocabulary building"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFocusArea(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 text-sm">Include Sections</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeAssessment"
                    checked={formData.includeAssessment}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Assessment (Formal & Informal)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeDifferentiation"
                    checked={formData.includeDifferentiation}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Differentiation & Accommodation</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeResources"
                    checked={formData.includeResources}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Resources / LTSM</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isGenerating || (!hasAccess && limits.used >= limits.lessonPlans)}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating CAPS Lesson Plan...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate CAPS Lesson Plan
                  </>
                )}
              </button>

              {!hasAccess && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-700">
                        {limits.used} of {limits.lessonPlans} free lesson plans used.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {generatedPlan ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
                    CAPS Lesson Plan Ready
                  </h2>
                  <button
                    onClick={handleDownloadPlan}
                    className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </button>
                </div>
                <div className="prose prose-sm max-w-none max-h-[600px] overflow-y-auto border border-gray-100 rounded-lg p-4 bg-gray-50">
                  {generatedPlan.split('\n').map((line, i) => {
                    if (line.startsWith('# '))
                      return <h1 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h1>;
                    if (line.startsWith('## '))
                      return <h2 key={i} className="text-lg font-semibold text-gray-800 mt-3 mb-1.5">{line.slice(3)}</h2>;
                    if (line.startsWith('### '))
                      return <h3 key={i} className="text-base font-medium text-gray-700 mt-2 mb-1">{line.slice(4)}</h3>;
                    if (line.startsWith('- '))
                      return (
                        <div key={i} className="flex items-start gap-2 ml-4 text-sm text-gray-600">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                          <span>{line.slice(2)}</span>
                        </div>
                      );
                    if (line.trim() === '---')
                      return <hr key={i} className="my-3 border-gray-200" />;
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-gray-600">{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  CAPS Lesson Plan Generator
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4">
                  Select your grade, CAPS subject, and topic. If you have uploaded
                  syllabus documents in Settings, the relevant content will
                  automatically be used to generate a more accurate plan.
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                  <Database className="w-3.5 h-3.5" />
                  Upload syllabi in Settings &gt; Knowledge Base
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
