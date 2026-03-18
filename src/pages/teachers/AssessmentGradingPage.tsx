import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileImage, File as FilePdf, AlertCircle, CheckCircle, X, FileUp, Brain, Users, List } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import StorageBucketErrorModal from '../../components/ui/StorageBucketErrorModal';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { supabase } from '../../lib/supabase';

const mockStudents = [
  { id: 1, name: "Emma Smith", grade: "A", strengths: ["Mathematical reasoning", "Problem solving"], weaknesses: ["Time management"], insights: "Shows excellent analytical skills but could benefit from more structured practice." },
  { id: 2, name: "James Wilson", grade: "B+", strengths: ["Creative approaches", "Visual learning"], weaknesses: ["Technical vocabulary"], insights: "Demonstrates creative problem-solving but struggles with precise terminology." },
  { id: 3, name: "Sofia Garcia", grade: "B", strengths: ["Detail-oriented", "Memorization"], weaknesses: ["Applying concepts"], insights: "Great at recalling information but needs support connecting concepts to new situations." },
];

const AssessmentGradingPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'scanned' | 'image' | 'pdf' | 'word' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showStorageBucketError, setShowStorageBucketError] = useState(false);
  const [studentInsights, setStudentInsights] = useState<typeof mockStudents>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'insights'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "AI Auto-Grading | GreyEd Teachers";
    if (!authLoading && !user) { navigate('/auth/login'); }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => { await signOut(); navigate('/'); };

  const handleFileTypeSelect = (type: 'scanned' | 'image' | 'pdf' | 'word') => {
    setFileType(type);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'pdf' ? '.pdf,application/pdf' : type === 'word' ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'image/*,.pdf,application/pdf';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    if (fileType === 'image' && !file.type.startsWith('image/')) { setError('Please select an image file.'); setSelectedFile(null); return; }
    if (fileType === 'pdf' && file.type !== 'application/pdf') { setError('Please select a PDF file.'); setSelectedFile(null); return; }
    if (fileType === 'word' && !['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) { setError('Please select a Word document.'); setSelectedFile(null); return; }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileType) { setError('Please select a file type first.'); return; }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (fileType === 'image' && !file.type.startsWith('image/')) { setError('Please drop an image file.'); return; }
      if (fileType === 'pdf' && file.type !== 'application/pdf') { setError('Please drop a PDF file.'); return; }
      if (fileType === 'word' && !['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) { setError('Please drop a Word document.'); return; }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleProcessAssessment = async () => {
    if (!selectedFile || !fileType) { setError('Please select a file to process.'); return; }
    try {
      setIsProcessing(true);
      setError(null);
      const fileName = `assessments/${user?.id}/${Date.now()}-${selectedFile.name}`;
      const { data: buckets } = await supabase.storage.listBuckets();
      const uploadsBucket = buckets?.find(bucket => bucket.name.toLowerCase() === 'uploads');
      if (!uploadsBucket) { setShowStorageBucketError(true); setIsProcessing(false); return; }
      const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, selectedFile);
      if (uploadError) {
        if (uploadError.message?.includes('Bucket not found')) { setShowStorageBucketError(true); setIsProcessing(false); return; }
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
      if (!data.publicUrl) throw new Error('Failed to get file URL');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProcessingComplete(true);
      setSuccess('Assessment successfully processed and graded!');
      setStudentInsights(mockStudents);
      setActiveTab('insights');
    } catch (error: any) {
      setError(error.message || 'An error occurred while processing the assessment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileType(null);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
    setProcessingComplete(false);
    setActiveTab('upload');
  };

  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'image': return <FileImage className="w-10 h-10 text-[#D4A843]" />;
      case 'pdf': return <FilePdf className="w-10 h-10 text-[#C4572A]" />;
      case 'word': return <FileText className="w-10 h-10 text-[#1B4332]" />;
      case 'scanned': return <FileImage className="w-10 h-10 text-[#1B4332]/70" />;
      default: return <FileUp className="w-10 h-10 text-[#1B4332]/40" />;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileType) {
      case 'image': return 'Image';
      case 'pdf': return 'PDF Document';
      case 'word': return 'Word Document';
      case 'scanned': return 'Scanned Document';
      default: return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (authLoading) {
    return (
      <>
        <NavBar sidebarCollapsed={sidebarCollapsed} />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-[#FAFAF8]">
          <div className="w-6 h-6 border-2 border-[#1B4332]/20 border-t-[#1B4332] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const fileTypeCards = [
    { type: 'scanned' as const, icon: FileImage, label: 'Scanned', desc: 'Scanned handwritten or printed assessments', color: 'text-[#1B4332]/70' },
    { type: 'image' as const, icon: FileImage, label: 'Photo', desc: 'Photos of handwritten or printed pages', color: 'text-[#D4A843]' },
    { type: 'pdf' as const, icon: FilePdf, label: 'PDF', desc: 'Digital PDF assessments with text', color: 'text-[#C4572A]' },
    { type: 'word' as const, icon: FileText, label: 'Word', desc: 'Microsoft Word documents', color: 'text-[#1B4332]' },
  ];

  return (
    <>
      <NavBar sidebarCollapsed={sidebarCollapsed} />

      <div className="min-h-screen pt-16 bg-[#FAFAF8] flex overflow-x-hidden">
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        <div className={`bg-white border-r border-gray-100 shadow-sm ${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="assessments"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              const newState = !sidebarCollapsed;
              setSidebarCollapsed(newState);
              localStorage.setItem('teacherSidebarCollapsed', String(newState));
            }}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
          {showMobileMenu && isMobile && (
            <button onClick={() => setShowMobileMenu(false)} className="absolute top-4 right-4 p-2 text-white bg-[#1B4332]/50 rounded-full" title="Close menu">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 pt-4 pb-16 md:pb-0 transition-[margin] duration-300 overflow-x-hidden"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8 max-w-5xl">

            {/* Notifications */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-[#E8D5B7]/20 border border-[#1B4332]/15 text-[#2D1B0E] px-4 py-3 rounded-xl mb-6 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-[#E8E6E0]/60 shadow-sm overflow-hidden"
            >
              <div className="flex border-b border-[#E8E6E0]/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-6 py-3.5 text-sm font-medium relative transition-colors ${activeTab === 'upload' ? 'text-[#1B4332]' : 'text-[#2D1B0E]/50 hover:text-[#2D1B0E]/70'}`}
                >
                  <div className="flex items-center gap-2">
                    <Upload size={15} />
                    Upload Assessment
                  </div>
                  {activeTab === 'upload' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  disabled={!processingComplete}
                  className={`px-6 py-3.5 text-sm font-medium relative transition-colors ${activeTab === 'insights' ? 'text-[#1B4332]' : processingComplete ? 'text-[#2D1B0E]/50 hover:text-[#2D1B0E]/70' : 'text-[#2D1B0E]/25 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-2">
                    <Brain size={15} />
                    Student Insights
                  </div>
                  {activeTab === 'insights' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332]" />
                  )}
                </button>
              </div>

              <div className="p-6">
                {/* Upload Tab */}
                {activeTab === 'upload' && (
                  <AnimatePresence mode="wait">
                    {!fileType ? (
                      <motion.div key="type-select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="font-headline font-semibold text-[#1B4332] text-[15px] mb-1.5">Select Assessment Type</h3>
                        <p className="text-[#2D1B0E]/50 text-sm mb-6">Choose the format of the assessment you want to grade with AI.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {fileTypeCards.map(({ type, icon: Icon, label, desc, color }) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleFileTypeSelect(type)}
                              className="flex flex-col items-center p-5 rounded-xl border border-[#E8E6E0]/60 hover:border-[#1B4332]/25 hover:bg-[#1B4332]/3 transition-all group"
                            >
                              <Icon className={`w-8 h-8 ${color} mb-3 group-hover:scale-110 transition-transform`} />
                              <h4 className="font-medium text-[#1B4332] text-sm">{label}</h4>
                              <p className="text-[10px] text-center text-[#2D1B0E]/40 mt-1.5 leading-tight">{desc}</p>
                            </button>
                          ))}
                        </div>

                        <div className="mt-8 bg-[#D4A843]/6 rounded-xl p-5 border border-[#D4A843]/15">
                          <h3 className="font-headline font-semibold text-[#1B4332] text-[15px] mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-[#D4A843]" />
                            How AI Grading Works
                          </h3>
                          <ul className="space-y-2 text-sm text-[#2D1B0E]/60">
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-2 flex-shrink-0" />Advanced vision processing for handwritten and scanned documents</li>
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-2 flex-shrink-0" />Direct text extraction from PDFs and Word files for accurate grading</li>
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-2 flex-shrink-0" />Builds student profiles identifying strengths and areas for growth</li>
                          </ul>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="file-upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex justify-between items-center mb-5">
                          <h3 className="font-headline font-semibold text-[#1B4332] text-[15px]">Upload {getFileTypeLabel()}</h3>
                          <button type="button" onClick={() => setFileType(null)} className="text-sm text-[#1B4332]/60 hover:text-[#1B4332] font-medium transition-colors">Change Type</button>
                        </div>

                        <div
                          className={`border-2 rounded-xl p-8 text-center transition-all ${selectedFile ? 'border-[#1B4332]/30 bg-[#1B4332]/3' : 'border-dashed border-[#E8E6E0] hover:border-[#1B4332]/20 hover:bg-[#1B4332]/2'}`}
                          onDragOver={handleDrag}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                        >
                          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                          {selectedFile ? (
                            <div className="flex flex-col items-center">
                              {getFileTypeIcon()}
                              <h4 className="font-medium text-[#1B4332] mt-3 text-sm">{selectedFile.name}</h4>
                              <p className="text-xs text-[#2D1B0E]/40 mt-1">{formatFileSize(selectedFile.size)}</p>
                              <div className="flex mt-4 gap-2">
                                <button type="button" onClick={() => setSelectedFile(null)} className="px-3 py-1.5 text-xs font-medium text-[#2D1B0E]/60 hover:text-[#C4572A] hover:bg-[#C4572A]/5 rounded-lg transition-colors">Remove</button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs font-medium text-[#1B4332]/70 hover:text-[#1B4332] hover:bg-[#1B4332]/5 rounded-lg transition-colors">Change File</button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="w-14 h-14 bg-[#1B4332]/6 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-6 h-6 text-[#1B4332]/40" />
                              </div>
                              <p className="text-sm text-[#1B4332]/70 mb-1">Drag and drop your {getFileTypeLabel().toLowerCase()} here</p>
                              <p className="text-xs text-[#2D1B0E]/30 mb-4">or</p>
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-[#1B4332] text-white rounded-xl hover:bg-[#1B4332]/90 text-sm font-medium inline-flex items-center transition-colors shadow-sm">
                                <FileUp size={15} className="mr-2" />
                                Browse Files
                              </button>
                              <p className="text-[10px] text-[#2D1B0E]/30 mt-4">
                                {fileType === 'image' ? 'JPG, PNG, GIF, BMP' : fileType === 'pdf' ? 'PDF documents' : fileType === 'word' ? 'DOC, DOCX' : 'JPG, PNG, PDF'}
                              </p>
                            </div>
                          )}
                        </div>

                        {selectedFile && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1B4332]/3 rounded-xl p-5 mt-5 border border-[#1B4332]/8"
                          >
                            <h3 className="font-medium text-[#1B4332] text-sm mb-4 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-[#D4A843]" />
                              AI Processing Options
                            </h3>
                            <div className="space-y-3 mb-5">
                              {[
                                { label: 'Auto-grade answers', desc: 'Grade answers according to the answer key' },
                                { label: 'Personalized feedback', desc: 'Generate custom feedback for each student' },
                                { label: 'Build student profiles', desc: 'Track strengths and improvements over time' },
                              ].map(opt => (
                                <label key={opt.label} className="flex items-start gap-2.5 cursor-pointer group">
                                  <input type="checkbox" checked={true} readOnly title={opt.label} className="mt-0.5 rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]/30" />
                                  <div>
                                    <span className="text-sm text-[#1B4332] font-medium">{opt.label}</span>
                                    <p className="text-xs text-[#2D1B0E]/40">{opt.desc}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={handleReset} className="px-4 py-2 border border-gray-200 text-[#2D1B0E]/60 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors">Cancel</button>
                              <button
                                type="button"
                                onClick={handleProcessAssessment}
                                disabled={isProcessing}
                                className={`px-5 py-2 bg-[#1B4332] text-white rounded-xl text-sm font-medium flex items-center transition-colors shadow-sm ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1B4332]/90'}`}
                              >
                                {isProcessing ? (
                                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Processing...</>
                                ) : (
                                  <><Brain size={15} className="mr-2" />Process with AI</>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-[#D4A843]/6 rounded-xl p-5 mt-5 border-l-4 border-l-[#D4A843]/40">
                          <h3 className="font-medium text-[#1B4332] text-sm mb-2">Tips for Best Results</h3>
                          <ul className="space-y-1.5 text-xs text-[#2D1B0E]/50">
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-1.5 flex-shrink-0" />For handwritten assessments, ensure clear writing and good lighting</li>
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-1.5 flex-shrink-0" />PDFs with embedded text yield more accurate results</li>
                            <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#D4A843] mt-1.5 flex-shrink-0" />Include an answer key for more accurate grading</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-headline font-semibold text-[#1B4332] text-[15px] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#D4A843]" />
                        Student Insights
                      </h3>
                      <button type="button" onClick={handleReset} className="text-sm text-[#1B4332]/60 hover:text-[#1B4332] font-medium transition-colors">
                        Process New Assessment
                      </button>
                    </div>

                    {studentInsights.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-[#E8E6E0] rounded-xl">
                        <Brain className="w-10 h-10 text-[#1B4332]/20 mx-auto mb-4" />
                        <h3 className="font-headline font-semibold text-[#1B4332] mb-2">No insights available</h3>
                        <p className="text-[#2D1B0E]/45 text-sm">Process an assessment to generate AI insights.</p>
                      </div>
                    ) : (
                      <>
                        {/* Class Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {[
                            { label: 'Average Grade', value: 'B+' },
                            { label: 'Completion', value: '100%' },
                            { label: 'Top Challenge', value: 'Applying Concepts' },
                          ].map(stat => (
                            <div key={stat.label} className="bg-[#1B4332]/4 rounded-xl p-4">
                              <p className="text-xs text-[#2D1B0E]/45 mb-1">{stat.label}</p>
                              <p className="text-lg font-bold text-[#1B4332]">{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Students */}
                        <div className="rounded-xl border border-[#E8E6E0]/60 overflow-hidden">
                          <div className="bg-[#1B4332]/4 px-5 py-3 border-b border-[#E8E6E0]/60">
                            <h4 className="font-medium text-[#1B4332] text-sm flex items-center gap-2">
                              <List className="w-4 h-4" />
                              Student Results
                            </h4>
                          </div>
                          <div className="divide-y divide-[#E8E6E0]/60">
                            {studentInsights.map((student) => (
                              <div key={student.id} className="p-5 hover:bg-[#1B4332]/2 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium text-[#1B4332] text-sm">{student.name}</h5>
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                    student.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-700' :
                                    student.grade.startsWith('B') ? 'bg-[#D4A843]/12 text-[#1B4332]' :
                                    'bg-amber-50 text-amber-700'
                                  }`}>
                                    {student.grade}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <h6 className="font-medium text-[#1B4332]/80 mb-1.5">Strengths</h6>
                                    <div className="flex flex-wrap gap-1.5">
                                      {student.strengths.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">{s}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="font-medium text-[#1B4332]/80 mb-1.5">Areas for Growth</h6>
                                    <div className="flex flex-wrap gap-1.5">
                                      {student.weaknesses.map((w, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">{w}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-[#E8E6E0]/40">
                                  <p className="text-xs text-[#2D1B0E]/55 italic leading-relaxed">{student.insights}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="mt-6 bg-[#D4A843]/6 rounded-xl p-5 border-l-4 border-l-[#D4A843]/40">
                          <h3 className="font-headline font-semibold text-[#1B4332] text-sm mb-3">Teaching Recommendations</h3>
                          <div className="space-y-2.5">
                            {[
                              'Focus on practical applications to bridge theory and practice',
                              'Provide structured guidance on technical vocabulary',
                              'Pair students with complementary strengths for group work',
                            ].map((rec, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm text-[#2D1B0E]/60">
                                <span className="w-5 h-5 rounded-full bg-[#D4A843]/15 flex items-center justify-center text-[#1B4332] text-xs font-medium flex-shrink-0 mt-0.5">{i + 1}</span>
                                <span className="leading-relaxed">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      <StorageBucketErrorModal isOpen={showStorageBucketError} onClose={() => setShowStorageBucketError(false)} bucketName="uploads" />

      <div className="transition-[margin] duration-300" style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
        <Footer />
      </div>
    </>
  );
};

export default AssessmentGradingPage;
