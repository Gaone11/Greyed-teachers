import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { fetchTeacherClasses, generateAssessment } from '../../lib/api/teacher-api';
import { Wand2, CheckCircle, Download, FileText, Database, ArrowLeft } from 'lucide-react';
import { Packer, Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { capsCurriculum, saGrades, getSubjectsByPhase, getPhaseFromGrade } from '../../data/capsCurriculum';
import { findMatchingChunks, buildChunkContext, type KnowledgeChunk, type ChunkedDocument } from '../../lib/knowledgebase/pdf-chunker';

const KB_STORAGE_KEY = 'greyed-kb-chunks';

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  syllabus?: string;
}

interface FormData {
  classId: string;
  selectedGrade: string;
  selectedSubjectKey: string;
  selectedTopicKey: string;
  difficulty: string;
  assessmentType: string;
  questionCount: number;
  includeAnswerKey: boolean;
  requiredTest: string;
}

function loadAllChunks(): KnowledgeChunk[] {
  try {
    const raw = localStorage.getItem(KB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 1 && Array.isArray(parsed.documents)) {
        return parsed.documents.flatMap((d: ChunkedDocument) => d.chunks);
      }
    }
  } catch { /* ignore */ }
  return [];
}

const inputClass = "w-full p-3 border border-gray-200 rounded-xl text-sm text-[#2D1B0E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/15 focus:border-[#1B4332]/30 transition-all bg-white";
const labelClass = "block text-sm font-medium text-[#2D1B0E]/70 mb-1.5";

export default function TeacherAssessmentGeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [kbChunkCount, setKbChunkCount] = useState(0);

  const defaultGrade = saGrades[0].value;
  const defaultPhase = getPhaseFromGrade(saGrades[0].num);
  const defaultSubjects = getSubjectsByPhase(defaultPhase);
  const defaultSubjectKey = defaultSubjects[0]?.key || '';
  const defaultTopicKey = defaultSubjects[0]?.topics[0]?.key || '';

  const [formData, setFormData] = useState<FormData>({
    classId: '',
    selectedGrade: defaultGrade,
    selectedSubjectKey: defaultSubjectKey,
    selectedTopicKey: defaultTopicKey,
    difficulty: 'medium',
    assessmentType: 'quiz',
    questionCount: 10,
    includeAnswerKey: true,
    requiredTest: ''
  });

  const [requiredTests, setRequiredTests] = useState<string[]>([]);

  const gradeNum = saGrades.find(g => g.value === formData.selectedGrade)?.num ?? 0;
  const phase = getPhaseFromGrade(gradeNum);
  const availableSubjects = getSubjectsByPhase(phase);
  const selectedSubject = capsCurriculum.find(s => s.key === formData.selectedSubjectKey);
  const availableTopics = selectedSubject?.topics ?? [];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const classesData = await fetchTeacherClasses(user.id);
        setClasses(classesData);

        const preselectedClassId = searchParams.get('classId');
        const selectedIdx = preselectedClassId
          ? classesData.findIndex((c: Class) => c.id === preselectedClassId)
          : 0;
        const idx = selectedIdx >= 0 ? selectedIdx : 0;

        if (classesData.length > 0) {
          setFormData(prev => ({ ...prev, classId: classesData[idx].id }));
          const firstClass = classesData[idx];
          if (firstClass.syllabus) {
            setRequiredTests(['End of Unit Test', 'Mid-Term Assessment', 'Final Exam']);
          }
        }

        const chunks = loadAllChunks();
        setKbChunkCount(chunks.length);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.find(s => s.key === formData.selectedSubjectKey)) {
      setFormData(prev => ({
        ...prev,
        selectedSubjectKey: availableSubjects[0].key,
        selectedTopicKey: availableSubjects[0].topics[0]?.key || '',
      }));
    }
  }, [phase]);

  useEffect(() => {
    if (availableTopics.length > 0 && !availableTopics.find(t => t.key === formData.selectedTopicKey)) {
      setFormData(prev => ({ ...prev, selectedTopicKey: availableTopics[0]?.key || '' }));
    }
  }, [formData.selectedSubjectKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedSubjectKey') {
      const subject = capsCurriculum.find(s => s.key === value);
      setFormData(prev => ({ ...prev, selectedSubjectKey: value, selectedTopicKey: subject?.topics[0]?.key || '' }));
    } else if (name === 'classId') {
      const selectedClass = classes.find(c => c.id === value);
      if (selectedClass && selectedClass.syllabus) {
        setRequiredTests(['End of Unit Test', 'Mid-Term Assessment', 'Final Exam']);
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
    if (!formData.classId || !formData.selectedSubjectKey || !formData.selectedTopicKey) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const selectedClass = classes.find(c => c.id === formData.classId);
      if (!selectedClass) return;

      const allChunks = loadAllChunks();
      const matchingChunks = findMatchingChunks(allChunks, formData.selectedSubjectKey, formData.selectedTopicKey, formData.selectedGrade);
      const kbContext = buildChunkContext(matchingChunks, 1500);

      const subjectName = selectedSubject?.name || formData.selectedSubjectKey;
      const topicName = availableTopics.find(t => t.key === formData.selectedTopicKey)?.name || formData.selectedTopicKey;

      const assessmentData = await generateAssessment({
        title: `${subjectName} - ${topicName} Assessment`,
        classId: formData.classId,
        assessmentType: formData.assessmentType,
        difficulty: formData.difficulty,
        questionCount: formData.questionCount,
        topic: topicName,
        requiredTest: formData.requiredTest || undefined,
        kbContext,
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
    const subjectName = selectedSubject?.name || formData.selectedSubjectKey;
    const topicName = availableTopics.find(t => t.key === formData.selectedTopicKey)?.name || formData.selectedTopicKey;

    children.push(new Paragraph({ children: [new TextRun({ text: `${subjectName} - ${topicName} Assessment`, size: 32 })], heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Type: ${formData.assessmentType}` })], spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Class: ${classes.find(c => c.id === formData.classId)?.name}` })], spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Difficulty: ${formData.difficulty}` })], spacing: { after: 200 } }));

    questions.forEach((question, i) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `Question ${i + 1}: ${question.question}` })], heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }));
      if (question.type === 'multiple-choice' && question.options?.length > 0) {
        question.options.forEach((option: string, j: number) => {
          children.push(new Paragraph({ children: [new TextRun({ text: `${String.fromCharCode(65 + j)}. ${option}` })], bullet: { level: 0 }, spacing: { after: 60 } }));
        });
      }
      if (formData.includeAnswerKey) {
        children.push(new Paragraph({ children: [new TextRun({ text: `Answer: ${question.answer}` })], spacing: { before: 100, after: 80 } }));
        if (question.explanation) {
          children.push(new Paragraph({ children: [new TextRun({ text: `Explanation: ${question.explanation}` })], spacing: { after: 160 } }));
        }
      }
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${subjectName}_${topicName}_Assessment.docx`);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1B4332]/20 border-t-[#1B4332] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E6E0]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              onClick={() => navigate('/teachers/assessments')}
              className="flex items-center gap-2 text-[#2D1B0E]/60 hover:text-[#1B4332] text-sm font-medium transition-colors"
              title="Back to Assessments"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="font-headline font-semibold text-[#1B4332] text-lg">Generate Assessment</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#E8D5B7]/20 border border-[#1B4332]/15 text-[#2D1B0E] px-4 py-3 rounded-xl mb-6 flex items-center text-sm"
          >
            <span>{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-2xl border border-[#E8E6E0]/60 shadow-sm p-6"
          >
            <form onSubmit={handleGenerateAssessment} className="space-y-5">
              <div>
                <label className={labelClass}>Class</label>
                <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass} required title="Select class">
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} - {cls.grade} ({cls.subject})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Grade</label>
                <select name="selectedGrade" value={formData.selectedGrade} onChange={handleInputChange} className={inputClass} title="Select grade">
                  {saGrades.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div className="border-b border-gray-100" />

              <div>
                <label className={labelClass}>Subject (CAPS)</label>
                <select name="selectedSubjectKey" value={formData.selectedSubjectKey} onChange={handleInputChange} className={inputClass} required title="Select subject">
                  {availableSubjects.map(subject => (
                    <option key={subject.key} value={subject.key}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Topic</label>
                <select name="selectedTopicKey" value={formData.selectedTopicKey} onChange={handleInputChange} className={inputClass} required title="Select topic">
                  {availableTopics.map(topic => (
                    <option key={topic.key} value={topic.key}>{topic.name}</option>
                  ))}
                </select>
              </div>

              {requiredTests.length > 0 && (
                <div>
                  <label className={labelClass}>Required Test (from syllabus)</label>
                  <select name="requiredTest" value={formData.requiredTest} onChange={handleInputChange} className={inputClass} title="Select required test">
                    <option value="">Select a required test (optional)</option>
                    {requiredTests.map(test => (
                      <option key={test} value={test}>{test}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="border-b border-gray-100" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Assessment Type</label>
                  <select name="assessmentType" value={formData.assessmentType} onChange={handleInputChange} className={inputClass} title="Select assessment type">
                    <option value="quiz">Quiz</option>
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="homework">Homework</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className={inputClass} title="Select difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Number of Questions</label>
                <select name="questionCount" value={formData.questionCount} onChange={handleNumberChange} className={inputClass} title="Select question count">
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={25}>25 questions</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#2D1B0E]/70 mb-3">Include in Assessment</h3>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="includeAnswerKey"
                    checked={formData.includeAnswerKey}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/30 transition-colors"
                  />
                  <span className="ml-2.5 text-sm text-[#2D1B0E]/60 group-hover:text-[#2D1B0E]/80 transition-colors">Include answer key and explanations</span>
                </label>
              </div>

              {kbChunkCount > 0 && (
                <div className="bg-[#D4A843]/8 border border-[#D4A843]/20 rounded-xl p-3.5 flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-[#D4A843] flex-shrink-0" />
                  <p className="text-sm text-[#1B4332]/70">
                    {kbChunkCount} knowledgebase chunks available. Matching chunks will inform the assessment.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#1B4332] text-white py-3 px-4 rounded-xl hover:bg-[#1B4332]/90 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium transition-all shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 text-[#D4A843]" />
                    Generate Assessment
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Preview/Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-2xl border border-[#E8E6E0]/60 shadow-sm p-6"
          >
            {generatedAssessment ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline font-semibold text-[#1B4332] flex items-center text-[15px]">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                    Assessment Generated
                  </h2>
                  <button
                    type="button"
                    onClick={handleDownloadAssessment}
                    className="flex items-center bg-[#1B4332] text-white px-4 py-2 rounded-xl hover:bg-[#1B4332]/90 text-sm font-medium transition-colors shadow-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 bg-[#D4A843]/10 rounded-2xl flex items-center justify-center mb-5">
                    <FileText className="h-7 w-7 text-[#D4A843]" />
                  </div>
                  <h3 className="font-headline font-semibold text-[#1B4332] text-lg mb-2">Assessment Ready!</h3>
                  <p className="text-[#2D1B0E]/50 text-center mb-8 text-sm max-w-xs leading-relaxed">
                    Your CAPS-aligned assessment is ready for download and editing.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadAssessment}
                    className="flex items-center bg-[#1B4332] text-white px-6 py-3 rounded-xl hover:bg-[#1B4332]/90 text-base font-medium transition-colors shadow-sm"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download &amp; Edit DOCX
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 bg-[#E8D5B7]/20 rounded-2xl flex items-center justify-center mb-5">
                  <FileText className="h-6 w-6 text-[#1B4332]/40" />
                </div>
                <h3 className="font-headline font-semibold text-[#1B4332] mb-2">Ready to Generate</h3>
                <p className="text-[#2D1B0E]/45 text-center max-w-xs text-sm leading-relaxed">
                  Fill out the form and click "Generate Assessment" to create a detailed, CAPS-aligned assessment.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
