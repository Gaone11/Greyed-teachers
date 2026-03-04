import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { fetchTeacherClasses, generateLessonPlan } from '../../lib/api/teacher-api';
import { Wand2, CheckCircle, PlusCircle, X, Download, BookOpen, FileText, Database, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { Packer, Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { capsCurriculum, saGrades, getSubjectsByPhase, getPhaseFromGrade } from '../../data/capsCurriculum';
import { findMatchingChunks, buildChunkContext, type KnowledgeChunk, type ChunkedDocument } from '../../lib/knowledgebase/pdf-chunker';
import { supabase } from '../../lib/supabase';

const KB_STORAGE_KEY = 'greyed-kb-chunks';

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
}

interface FormData {
  classId: string;
  selectedGrade: string;
  selectedSubjectKey: string;
  selectedTopicKey: string;
  syllabus: string;
  term: string;
  week: string;
  date: string;
  duration: string;
  focusAreas: string[];
  includeAssessment: boolean;
  includeDifferentiation: boolean;
  includeResources: boolean;
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

// Get current SA school term based on month
function getCurrentTerm(): string {
  const month = new Date().getMonth(); // 0-indexed
  if (month <= 2) return '1';  // Jan-Mar = Term 1
  if (month <= 5) return '2';  // Apr-Jun = Term 2
  if (month <= 8) return '3';  // Jul-Sep = Term 3
  return '4';                   // Oct-Dec = Term 4
}

// Match grade from class grade string to saGrades value
function matchGradeFromClass(classGrade: string): string {
  const exact = saGrades.find(g => g.value.toLowerCase() === classGrade.toLowerCase());
  if (exact) return exact.value;
  const numMatch = classGrade.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0]);
    const grade = saGrades.find(g => g.num === num);
    if (grade) return grade.value;
  }
  if (/\bR\b/i.test(classGrade)) return 'Grade R';
  return saGrades[0].value;
}

// Guess next week from last lesson plan for the class
async function guessNextWeek(classId: string): Promise<string> {
  try {
    const { data } = await supabase
      .from('lesson_plans')
      .select('meta')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0 && data[0].meta?.week) {
      const lastWeek = parseInt(data[0].meta.week);
      if (!isNaN(lastWeek) && lastWeek < 12) return String(lastWeek + 1);
    }
  } catch { /* ignore */ }
  return '1';
}

// Shared input class for consistency
const inputClass = "w-full p-3 border border-gray-200 rounded-xl text-sm text-[#2D1B0E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/15 focus:border-[#1B4332]/30 transition-all bg-white";
const labelClass = "block text-sm font-medium text-[#2D1B0E]/70 mb-1.5";

export default function TeacherLessonPlanGeneratorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
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
    syllabus: 'CAPS',
    term: getCurrentTerm(),
    week: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: '45',
    focusAreas: [],
    includeAssessment: true,
    includeDifferentiation: true,
    includeResources: true
  });

  // Derived CAPS data
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
        if (preselectedClassId && classesData.some((c: Class) => c.id === preselectedClassId)) {
          setFormData(prev => ({ ...prev, classId: preselectedClassId }));
        } else if (classesData.length > 0) {
          setFormData(prev => ({ ...prev, classId: classesData[0].id }));
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

  // Auto-fill grade from class and guess next week when class changes
  useEffect(() => {
    if (!formData.classId) return;
    const selectedClass = classes.find(c => c.id === formData.classId);
    if (selectedClass) {
      const autoGrade = matchGradeFromClass(selectedClass.grade);
      setFormData(prev => ({ ...prev, selectedGrade: autoGrade }));
      guessNextWeek(formData.classId).then(week => {
        setFormData(prev => ({ ...prev, week }));
      });
    }
  }, [formData.classId, classes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddFocusArea = () => {
    setFormData(prev => ({ ...prev, focusAreas: [...prev.focusAreas, ''] }));
  };

  const handleRemoveFocusArea = (index: number) => {
    setFormData(prev => ({ ...prev, focusAreas: prev.focusAreas.filter((_, i) => i !== index) }));
  };

  const handleFocusAreaChange = (index: number, value: string) => {
    setFormData(prev => ({ ...prev, focusAreas: prev.focusAreas.map((area, i) => i === index ? value : area) }));
  };

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.selectedSubjectKey || !formData.selectedTopicKey) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsGenerating(true);
      const selectedClass = classes.find(c => c.id === formData.classId);
      if (!selectedClass) return;

      const allChunks = loadAllChunks();
      const matchingChunks = findMatchingChunks(allChunks, formData.selectedSubjectKey, formData.selectedTopicKey, formData.selectedGrade);
      const kbContext = buildChunkContext(matchingChunks, 1500);

      const subjectName = selectedSubject?.name || formData.selectedSubjectKey;
      const topicName = availableTopics.find(t => t.key === formData.selectedTopicKey)?.name || formData.selectedTopicKey;

      const plan = await generateLessonPlan({
        classId: formData.classId,
        subject: subjectName,
        topic: topicName,
        syllabus: formData.syllabus,
        date: formData.date,
        duration: formData.duration,
        focusAreas: formData.focusAreas,
        includeAssessment: formData.includeAssessment,
        includeDifferentiation: formData.includeDifferentiation,
        includeResources: formData.includeResources,
        className: selectedClass.name,
        grade: formData.selectedGrade,
        term: formData.term,
        week: formData.week,
        kbContext,
      });

      setGeneratedPlan(plan.markdown || plan);
      setCurrentPage(0);
    } catch {
      alert('Failed to generate lesson plan. Please try again.');
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

    const parseMarkdownToPlain = (text: string): TextRun[] => {
      return [new TextRun({ text: text.replace(/\*\*/g, ''), bold: false })];
    };

    lines.forEach(line => {
      if (line.trim() === '') {
        children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 80 } }));
      } else if (line.startsWith('### ')) {
        children.push(new Paragraph({ children: parseMarkdownToTextRuns(line.substring(4)), heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 120 } }));
      } else if (line.startsWith('## ')) {
        children.push(new Paragraph({ children: parseMarkdownToPlain(line.substring(3)), heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 160 } }));
      } else if (line.startsWith('# ')) {
        children.push(new Paragraph({ children: parseMarkdownToPlain(line.substring(2)), heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }));
      } else if (line.startsWith('- ')) {
        children.push(new Paragraph({ children: parseMarkdownToTextRuns(line.substring(2)), bullet: { level: 0 }, spacing: { after: 40 } }));
      } else {
        children.push(new Paragraph({ children: parseMarkdownToPlain(line), spacing: { after: 60 } }));
      }
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    Packer.toBlob(doc).then(blob => {
      const subjectName = selectedSubject?.name || formData.selectedSubjectKey;
      const topicName = availableTopics.find(t => t.key === formData.selectedTopicKey)?.name || formData.selectedTopicKey;
      const filename = `${subjectName} - ${topicName} - ${formData.date}.docx`;
      saveAs(blob, filename);
    });
  };

  // Split markdown into pages by top-level sections (## headings)
  const planPages = React.useMemo(() => {
    if (!generatedPlan) return [];
    const lines = generatedPlan.split('\n');
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
  }, [generatedPlan]);

  // Markdown component overrides for styled rendering
  const mdComponents = {
    h1: ({ children }: any) => <h1 className="text-xl font-bold text-[#2D1B0E] mb-3 pb-2 border-b border-gray-200">{children}</h1>,
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
        <div className="w-6 h-6 border-2 border-[#1B4332]/20 border-t-greyed-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              onClick={() => navigate('/teachers/lesson-planner')}
              className="flex items-center gap-2 text-[#2D1B0E]/60 hover:text-[#2D1B0E] text-sm font-medium transition-colors"
              title="Back to Lesson Plans"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="font-headline font-semibold text-[#2D1B0E] text-lg">Generate Lesson Plan</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
          >
            <form onSubmit={handleGenerateLessonPlan} className="space-y-5">
              {/* Class */}
              <div>
                <label className={labelClass}>Class</label>
                <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass} required title="Select class">
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} - {cls.grade} ({cls.subject})</option>
                  ))}
                </select>
              </div>

              {/* Grade (auto-filled from class) */}
              <div>
                <label className={labelClass}>Grade <span className="text-[#2D1B0E]/40 font-normal">(from class)</span></label>
                <div className="w-full p-3 rounded-xl text-sm text-[#2D1B0E] bg-[#E8D5B7]/20 font-medium">
                  {formData.selectedGrade || 'Select a class first'}
                </div>
              </div>

              <div className="border-b border-gray-100" />

              {/* Subject */}
              <div>
                <label className={labelClass}>Subject (CAPS)</label>
                <select name="selectedSubjectKey" value={formData.selectedSubjectKey} onChange={handleInputChange} className={inputClass} required title="Select subject">
                  {availableSubjects.map(subject => (
                    <option key={subject.key} value={subject.key}>{subject.name}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className={labelClass}>Topic</label>
                <select name="selectedTopicKey" value={formData.selectedTopicKey} onChange={handleInputChange} className={inputClass} required title="Select topic">
                  {availableTopics.map(topic => (
                    <option key={topic.key} value={topic.key}>{topic.name}</option>
                  ))}
                </select>
              </div>

              {/* Syllabus (locked to CAPS) */}
              <div>
                <label className={labelClass}>Syllabus</label>
                <div className="w-full p-3 rounded-xl text-sm text-[#2D1B0E] bg-[#E8D5B7]/20 font-medium">
                  CAPS (South Africa)
                </div>
              </div>

              <div className="border-b border-gray-100" />

              {/* Term + Week */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Term <span className="text-[#2D1B0E]/40 font-normal">(current)</span></label>
                  <div className="w-full p-3 rounded-xl text-sm text-[#2D1B0E] bg-transparent font-medium">
                    Term {formData.term}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Week <span className="text-[#2D1B0E]/40 font-normal">(auto-guessed)</span></label>
                  <input type="number" name="week" value={formData.week} onChange={handleInputChange} min="1" max="12" className={inputClass} title="Week number" />
                </div>
              </div>

              {/* Date + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputClass} required title="Lesson date" />
                </div>
                <div>
                  <label className={labelClass}>Duration (min)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} min="15" max="180" className={inputClass} required title="Lesson duration in minutes" />
                </div>
              </div>

              <div className="border-b border-gray-100" />

              {/* Focus Areas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Additional Focus Areas</label>
                  <button type="button" onClick={handleAddFocusArea} className="flex items-center text-sm text-[#1B4332]/70 hover:text-[#1B4332] font-medium transition-colors">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                {formData.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => handleFocusAreaChange(index, e.target.value)}
                      placeholder="e.g., Vocabulary building, Problem solving"
                      className={inputClass}
                    />
                    <button type="button" onClick={() => handleRemoveFocusArea(index)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Include Sections */}
              <div>
                <h3 className="text-sm font-medium text-[#2D1B0E]/70 mb-3">Include Sections</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="includeAssessment" checked={formData.includeAssessment} onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/30 transition-colors" />
                    <span className="ml-2.5 text-sm text-[#2D1B0E]/60 group-hover:text-[#2D1B0E]/80 transition-colors">Assessment Activities</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="includeDifferentiation" checked={formData.includeDifferentiation} onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/30 transition-colors" />
                    <span className="ml-2.5 text-sm text-[#2D1B0E]/60 group-hover:text-[#2D1B0E]/80 transition-colors">Differentiation Strategies</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="includeResources" checked={formData.includeResources} onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/30 transition-colors" />
                    <span className="ml-2.5 text-sm text-[#2D1B0E]/60 group-hover:text-[#2D1B0E]/80 transition-colors">Required Resources</span>
                  </label>
                </div>
              </div>

              {/* KB Indicator */}
              {kbChunkCount > 0 && (
                <div className="bg-[#D4A843]/8 border border-greyed-blue/20 rounded-xl p-3.5 flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-[#D4A843] flex-shrink-0" />
                  <p className="text-sm text-[#1B4332]/70">
                    {kbChunkCount} knowledgebase chunks available. Matching chunks will be injected into the lesson plan.
                  </p>
                </div>
              )}

              {/* Generate Button */}
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
                    Generate CAPS Lesson Plan
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
            {generatedPlan && planPages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-headline font-semibold text-[#2D1B0E] flex items-center text-[15px]">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Lesson Plan
                  </h2>
                  <button
                    type="button"
                    onClick={handleDownloadPlan}
                    className="flex items-center bg-[#1B4332] text-white px-3 py-1.5 rounded-lg hover:bg-[#1B4332]/90 text-xs font-medium transition-colors shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download DOCX
                  </button>
                </div>

                {/* Document Page */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                  {/* Page content — A4-like proportions */}
                  <div className="p-8 min-h-[560px] max-h-[560px] overflow-y-auto">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {planPages[currentPage]?.join('\n') || ''}
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
                      {planPages.map((_, i) => (
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
                      onClick={() => setCurrentPage(p => Math.min(planPages.length - 1, p + 1))}
                      disabled={currentPage === planPages.length - 1}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332] disabled:text-gray-300 disabled:cursor-not-allowed hover:text-[#D4A843] transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Page indicator */}
                <p className="text-center text-xs text-[#2D1B0E]/40 mt-2">
                  Page {currentPage + 1} of {planPages.length}
                </p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 bg-[#E8D5B7]/30 rounded-2xl flex items-center justify-center mb-5">
                    <BookOpen className="h-6 w-6 text-[#1B4332]/40" />
                  </div>
                  <h3 className="font-headline font-semibold text-[#2D1B0E] mb-2">Ready to Generate</h3>
                  <p className="text-[#2D1B0E]/45 text-center max-w-xs text-sm leading-relaxed">
                    Fill out the form and click "Generate Lesson Plan" to create a detailed, curriculum-aligned lesson plan.
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
