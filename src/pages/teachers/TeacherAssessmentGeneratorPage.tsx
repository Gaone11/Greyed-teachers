import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { fetchTeacherClasses, generateAssessment } from '../../lib/api/teacher-api';
import { Wand2, CheckCircle, Download, FileText, Database, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadMarkdownAsDocx } from '../../lib/markdown-to-docx';
import { capsCurriculum, saGrades, getSubjectsByPhase, getPhaseFromGrade } from '../../data/capsCurriculum';
import { findMatchingChunks, buildChunkContext, type KnowledgeChunk, type ChunkedDocument } from '../../lib/knowledgebase/pdf-chunker';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kbChunkCount, setKbChunkCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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
        includeAnswerKey: formData.includeAnswerKey,
        topic: topicName,
        subject: subjectName,
        grade: formData.selectedGrade,
        className: selectedClass.name,
        requiredTest: formData.requiredTest || undefined,
        kbContext,
      });

      setGeneratedMarkdown(assessmentData.markdown);
      setCurrentPage(0);
    } catch (error: any) {
      setError(error.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAssessment = () => {
    if (!generatedMarkdown) return;
    const subjectName = selectedSubject?.name || formData.selectedSubjectKey;
    const topicName = availableTopics.find(t => t.key === formData.selectedTopicKey)?.name || formData.selectedTopicKey;
    downloadMarkdownAsDocx(generatedMarkdown, `${subjectName}_${topicName}_Assessment.docx`, `${subjectName} — ${topicName} Assessment`);
  };

  // Split markdown into pages by top-level sections (## headings)
  const assessmentPages = React.useMemo(() => {
    if (!generatedMarkdown) return [];
    const lines = generatedMarkdown.split('\n');
    const pages: string[][] = [];
    let current: string[] = [];

    for (const line of lines) {
      if (line.startsWith('## ') && current.length > 0) {
        pages.push(current);
        current = [line];
      } else {
        current.push(line);
      }
    }
    if (current.length > 0) pages.push(current);
    return pages;
  }, [generatedMarkdown]);

  // Markdown component overrides
  const mdComponents = {
    h1: ({ children }: any) => <h1 className="text-xl font-bold text-[#1B4332] mb-3 pb-2 border-b border-gray-200">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-semibold text-[#1B4332] mt-4 mb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-semibold text-[#2D1B0E]/80 mt-3 mb-1">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-sm font-medium text-[#2D1B0E]/70 mt-2 mb-1">{children}</h4>,
    p: ({ children }: any) => <p className="text-sm text-[#2D1B0E]/80 leading-relaxed mb-2">{children}</p>,
    strong: ({ children }: any) => <strong className="font-semibold text-[#2D1B0E]/90">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-[#2D1B0E]/70">{children}</em>,
    ul: ({ children }: any) => <ul className="space-y-1 mb-3 pl-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="space-y-1 mb-3 pl-1 list-decimal list-inside">{children}</ol>,
    li: ({ children }: any) => (
      <li className="flex items-start gap-2 text-sm text-[#2D1B0E]/80">
        <span className="text-[#1B4332]/40 mt-1.5 text-[6px] shrink-0">●</span>
        <span className="leading-relaxed">{children}</span>
      </li>
    ),
    table: ({ children }: any) => (
      <div className="my-3 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-[#1B4332]/5">{children}</thead>,
    tbody: ({ children }: any) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
    tr: ({ children }: any) => <tr className="divide-x divide-gray-100">{children}</tr>,
    th: ({ children }: any) => <th className="px-3 py-2 text-left font-semibold text-[#2D1B0E]/80 text-xs uppercase tracking-wide">{children}</th>,
    td: ({ children }: any) => <td className="px-3 py-2 text-[#2D1B0E]/80">{children}</td>,
    hr: () => <hr className="my-4 border-gray-200" />,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-3 border-[#1B4332]/20 pl-4 my-3 text-sm text-[#2D1B0E]/60 italic">{children}</blockquote>
    ),
    code: ({ children, className }: any) => {
      const isBlock = className?.includes('language-');
      if (isBlock) {
        return <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-3 text-xs overflow-x-auto"><code>{children}</code></pre>;
      }
      return <code className="bg-gray-100 text-[#1B4332] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
    },
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

          {/* Document Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col"
          >
            {generatedMarkdown && assessmentPages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-headline font-semibold text-[#1B4332] flex items-center text-[15px]">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Assessment
                  </h2>
                  <button
                    type="button"
                    onClick={handleDownloadAssessment}
                    className="flex items-center bg-[#1B4332] text-white px-3 py-1.5 rounded-lg hover:bg-[#1B4332]/90 text-xs font-medium transition-colors shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download DOCX
                  </button>
                </div>

                {/* Document Page */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                  {/* Page content */}
                  <div className="p-8 min-h-[560px] max-h-[560px] overflow-y-auto">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {assessmentPages[currentPage]?.join('\n') || ''}
                      </ReactMarkdown>
                    </motion.div>
                  </div>

                  {/* Page Navigation */}
                  <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332] disabled:text-gray-300 disabled:cursor-not-allowed hover:text-[#D4A843] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {assessmentPages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPage(i)}
                          title={`Go to page ${i + 1}`}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentPage
                              ? 'bg-[#1B4332] scale-125'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(assessmentPages.length - 1, p + 1))}
                      disabled={currentPage === assessmentPages.length - 1}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332] disabled:text-gray-300 disabled:cursor-not-allowed hover:text-[#D4A843] transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Page indicator */}
                <p className="text-center text-xs text-[#2D1B0E]/40 mt-2">
                  Page {currentPage + 1} of {assessmentPages.length}
                </p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8E6E0]/60 shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 bg-[#E8D5B7]/20 rounded-2xl flex items-center justify-center mb-5">
                    <FileText className="h-6 w-6 text-[#1B4332]/40" />
                  </div>
                  <h3 className="font-headline font-semibold text-[#1B4332] mb-2">Ready to Generate</h3>
                  <p className="text-[#2D1B0E]/45 text-center max-w-xs text-sm leading-relaxed">
                    Fill out the form and click "Generate Assessment" to create a detailed, CAPS-aligned assessment.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
