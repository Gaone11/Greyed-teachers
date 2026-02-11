import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, FileImage, File as FilePdf, Loader, AlertCircle, CheckCircle, FileUp, Brain, Users, List, Lock, Crown, Wand2 } from 'lucide-react';
import TeacherPageLayout from '../../components/teachers/TeacherPageLayout';
import StorageBucketErrorModal from '../../components/ui/StorageBucketErrorModal';
import { supabase } from '../../lib/supabase';
import { hasActiveSubscription } from '../../lib/api/teacher-api';
import { Link } from 'react-router-dom';

// Mock data for demonstrating student insights
const mockStudents = [
  { id: 1, name: "Emma Smith", grade: "A", strengths: ["Mathematical reasoning", "Problem solving"], weaknesses: ["Time management"], insights: "Shows excellent analytical skills but could benefit from more structured practice." },
  { id: 2, name: "James Wilson", grade: "B+", strengths: ["Creative approaches", "Visual learning"], weaknesses: ["Technical vocabulary"], insights: "Demonstrates creative problem-solving but struggles with precise terminology." },
  { id: 3, name: "Sofia Garcia", grade: "B", strengths: ["Detail-oriented", "Memorization"], weaknesses: ["Applying concepts"], insights: "Great at recalling information but needs support connecting concepts to new situations." },
];

const AssessmentGradingPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for file upload and processing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'scanned' | 'image' | 'pdf' | 'word' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showStorageBucketError, setShowStorageBucketError] = useState(false);

  // Student insights
  const [studentInsights, setStudentInsights] = useState<typeof mockStudents>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'insights'>('upload');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "AI Auto-Grading | GreyEd Teachers";

    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    // Check subscription status
    const checkSubscription = async () => {
      try {
        const subscribed = await hasActiveSubscription(user?.id);
        setIsSubscribed(subscribed);
      } catch {
      }
    };

    if (user) {
      checkSubscription();
    }

    // Load sidebar collapsed state from localStorage
    try {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsed === 'true') {
        setSidebarCollapsed(true);
      }
    } catch { /* private browsing */ }
  }, [user, authLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    try { localStorage.setItem('sidebarCollapsed', String(newState)); } catch { /* private browsing */ }
  };

  // Handle file type selection
  const handleFileTypeSelect = (type: 'scanned' | 'image' | 'pdf' | 'word') => {
    setFileType(type);
    setSelectedFile(null);
    setError(null);

    // Open file dialog with appropriate accept types
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.accept = type === 'image'
        ? 'image/*'
        : type === 'pdf'
        ? '.pdf,application/pdf'
        : type === 'word'
        ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'image/*,.pdf,application/pdf';
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    setError(null);

    // Validate file type
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setSelectedFile(null);
      return;
    }

    if (fileType === 'pdf' && file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      setSelectedFile(null);
      return;
    }

    if (fileType === 'word' &&
        !['application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         ].includes(file.type)) {
      setError('Please select a Word document.');
      setSelectedFile(null);
      return;
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!fileType) {
      setError('Please select a file type first.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Validate file type
      if (fileType === 'image' && !file.type.startsWith('image/')) {
        setError('Please drop an image file.');
        return;
      }

      if (fileType === 'pdf' && file.type !== 'application/pdf') {
        setError('Please drop a PDF file.');
        return;
      }

      if (fileType === 'word' &&
          !['application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
           ].includes(file.type)) {
        setError('Please drop a Word document.');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  // Process the uploaded assessment
  const handleProcessAssessment = async () => {
    // Check subscription
    if (!isSubscribed) {
      setError('AI Auto-Grading is only available with a premium subscription. Please upgrade to access this feature.');
      return;
    }

    if (!selectedFile || !fileType) {
      setError('Please select a file to process.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Upload the file to Supabase storage
      const fileName = `assessments/${user?.id}/${Date.now()}-${selectedFile.name}`;

      // Check if the uploads bucket exists with case-insensitive search
      const { data: buckets } = await supabase.storage.listBuckets();
      const uploadsBucket = buckets?.find(bucket =>
        bucket.name.toLowerCase() === 'uploads'
      );

      if (!uploadsBucket) {
        setShowStorageBucketError(true);
        setIsProcessing(false);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, selectedFile);

      if (uploadError) {
        // Check if this is a bucket not found error
        if (uploadError.message && uploadError.message.includes('Bucket not found')) {
          setShowStorageBucketError(true);
          setIsProcessing(false);
          return;
        }

        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      // Get the file URL
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      if (!data.publicUrl) {
        throw new Error('Failed to get file URL');
      }

      // Simulate AI processing with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful grading
      setProcessingComplete(true);
      setSuccess('Assessment successfully processed and graded!');
      setStudentInsights(mockStudents); // Set mock student insights
      setActiveTab('insights'); // Switch to insights tab

    } catch (error: any) {
      setError(error.message || 'An error occurred while processing the assessment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFileType(null);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
    setProcessingComplete(false);
    setActiveTab('upload');
  };

  // Get the appropriate icon for the file type
  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'image':
        return <FileImage className="w-12 h-12 text-primary" />;
      case 'pdf':
        return <FilePdf className="w-12 h-12 text-red-500" />;
      case 'word':
        return <FileText className="w-12 h-12 text-primary" />;
      case 'scanned':
        return <FileImage className="w-12 h-12 text-primary/70" />;
      default:
        return <FileUp className="w-12 h-12 text-primary/50" />;
    }
  };

  // Get the appropriate file type label
  const getFileTypeLabel = () => {
    switch (fileType) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF Document';
      case 'word':
        return 'Word Document';
      case 'scanned':
        return 'Scanned Document';
      default:
        return '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <TeacherPageLayout
      activePage="assessments"
      onLogout={handleLogout}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      loading={authLoading}
      loadingMessage="Loading..."
    >
          {error && (
            <div className="bg-accent/20 border border-premium-neutral-200 text-text px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Subscription warning for free tier */}
          {!isSubscribed && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-start">
                <Lock className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Premium Feature</p>
                  <p className="mt-1">AI Auto-Grading is only available with a premium subscription.</p>
                  <Link
                    to="/teachers/settings#subscription"
                    className="mt-2 inline-block bg-primary text-white px-4 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Crown size={14} className="inline mr-1" />
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 text-sm font-medium relative ${
                  activeTab === 'upload' ? 'text-primary' : 'text-text hover:text-primary/70'
                }`}
              >
                <div className="flex items-center">
                  <Upload size={16} className="mr-2" />
                  Upload Assessment
                </div>
                {activeTab === 'upload' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                disabled={!processingComplete}
                className={`px-6 py-3 text-sm font-medium relative ${
                  activeTab === 'insights' ? 'text-primary' : processingComplete ? 'text-text hover:text-primary/70' : 'text-text/40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center">
                  <Brain size={16} className="mr-2" />
                  Student Insights
                </div>
                {activeTab === 'insights' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {/* Upload Assessment Tab */}
              {activeTab === 'upload' && (
                <>
                  {/* Premium badge for feature */}
                  {!isSubscribed && (
                    <div className="mb-6 border border-amber-200 bg-amber-50 rounded-lg p-4 text-amber-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <Crown className="w-6 h-6 mr-3 text-amber-500" />
                        <div>
                          <h3 className="font-medium">Premium Feature</h3>
                          <p className="text-sm">You can still explore the interface, but processing requires a subscription.</p>
                        </div>
                      </div>
                      <Link
                        to="/teachers/settings#subscription"
                        className="bg-primary text-white px-4 py-1.5 rounded text-sm hover:bg-primary/90 whitespace-nowrap"
                      >
                        Upgrade
                      </Link>
                    </div>
                  )}

                  {/* Step 1: Select Assessment Type */}
                  {!fileType && (
                    <div>
                      <h3 className="text-lg font-medium text-text mb-4">Select Assessment Type</h3>
                      <p className="text-text-muted mb-6">
                        Choose the type of assessment you want to upload for AI grading.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                          onClick={() => handleFileTypeSelect('scanned')}
                          className="flex flex-col items-center p-6 border border-gray-300 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          <FileImage className="w-10 h-10 text-primary/70 mb-4" />
                          <h4 className="font-medium text-primary">Scanned Document</h4>
                          <p className="text-xs text-center text-primary/70 mt-2">
                            Scanned handwritten or printed assessments
                          </p>
                        </button>

                        <button
                          onClick={() => handleFileTypeSelect('image')}
                          className="flex flex-col items-center p-6 border border-gray-300 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          <FileImage className="w-10 h-10 text-primary mb-4" />
                          <h4 className="font-medium text-primary">Photo/Image</h4>
                          <p className="text-xs text-center text-primary/70 mt-2">
                            Photos of handwritten or printed pages
                          </p>
                        </button>

                        <button
                          onClick={() => handleFileTypeSelect('pdf')}
                          className="flex flex-col items-center p-6 border border-gray-300 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          <FilePdf className="w-10 h-10 text-red-500 mb-4" />
                          <h4 className="font-medium text-primary">PDF Document</h4>
                          <p className="text-xs text-center text-primary/70 mt-2">
                            Digital PDF assessments with text content
                          </p>
                        </button>

                        <button
                          onClick={() => handleFileTypeSelect('word')}
                          className="flex flex-col items-center p-6 border border-gray-300 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          <FileText className="w-10 h-10 text-primary mb-4" />
                          <h4 className="font-medium text-primary">Word Document</h4>
                          <p className="text-xs text-center text-primary/70 mt-2">
                            Microsoft Word documents (.doc, .docx)
                          </p>
                        </button>
                      </div>

                      <div className="mt-8 bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-medium text-primary mb-2 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-primary" />
                          How AI Auto-Grading Works
                        </h3>
                        <p className="text-sm text-primary/80 mb-4">
                          El AI uses advanced OCR and language processing to grade assessments and provide insights:
                        </p>
                        <ul className="space-y-2 text-sm text-primary/80 list-disc pl-5">
                          <li>For <strong>scanned documents</strong> and <strong>images</strong>, El AI uses OrionX's advanced vision processing to interpret handwriting and images</li>
                          <li>For <strong>PDFs</strong> and <strong>Word documents</strong>, text is extracted directly for more accurate grading</li>
                          <li>Multiple-choice, short answer, and essay questions are all supported</li>
                          <li>El AI builds a profile of each student based on their answers, identifying strengths and weaknesses</li>
                          <li>You'll receive detailed feedback for each student and the class as a whole</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Step 2: File Upload */}
                  {fileType && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-text">Upload {getFileTypeLabel()}</h3>
                        <button
                          onClick={() => setFileType(null)}
                          className="text-sm text-primary hover:text-primary transition-colors"
                        >
                          Change Type
                        </button>
                      </div>

                      {/* File drop area */}
                      <div
                        className={`border-2 ${
                          selectedFile
                            ? 'border-primary bg-primary/5'
                            : 'border-dashed border-gray-300 hover:border-primary/50 hover:bg-primary/5'
                        } rounded-lg p-6 text-center transition-colors mb-6`}
                        onDragOver={handleDrag}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        {selectedFile ? (
                          <div className="flex flex-col items-center">
                            {getFileTypeIcon()}

                            <h4 className="font-medium text-primary mt-4">
                              {selectedFile.name}
                            </h4>

                            <p className="text-sm text-primary/70 mt-2">
                              {formatFileSize(selectedFile.size)}
                            </p>

                            <div className="flex mt-4 space-x-2">
                              <button
                                onClick={() => setSelectedFile(null)}
                                className="px-3 py-1 bg-accent/20 text-text rounded hover:bg-red-100 transition-colors text-sm"
                              >
                                Remove
                              </button>

                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-sm"
                              >
                                Change File
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="flex justify-center mb-4">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-primary/60" />
                              </div>
                            </div>

                            <p className="text-primary mb-2">
                              Drag and drop your {getFileTypeLabel().toLowerCase()} here
                            </p>

                            <p className="text-primary/60 text-sm mb-4">
                              or
                            </p>

                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 inline-flex items-center"
                            >
                              <FileUp size={16} className="mr-2" />
                              Browse Files
                            </button>

                            <p className="text-xs text-primary/60 mt-4">
                              Supported formats: {fileType === 'image'
                                ? 'JPG, PNG, GIF, BMP'
                                : fileType === 'pdf'
                                ? 'PDF documents'
                                : fileType === 'word'
                                ? 'DOC, DOCX'
                                : 'JPG, PNG, PDF'
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {/* AI Processing Options */}
                      {selectedFile && (
                        <div className="bg-surface/10 rounded-lg p-5 mb-6 border border-premium-neutral-200">
                          <h3 className="font-medium text-primary mb-4 flex items-center">
                            <Brain className="w-5 h-5 mr-2 text-primary" />
                            AI Processing Options
                          </h3>

                          <div className="space-y-3 mb-6">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={true}
                                disabled={!isSubscribed}
                                className="mr-2"
                              />
                              <div>
                                <span className="text-primary">Auto-grade answers</span>
                                <p className="text-xs text-primary/60">El AI will grade answers according to the answer key</p>
                              </div>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={true}
                                disabled={!isSubscribed}
                                className="mr-2"
                              />
                              <div>
                                <span className="text-primary">Provide personalized feedback</span>
                                <p className="text-xs text-primary/60">Generate custom feedback for each student</p>
                              </div>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={true}
                                disabled={!isSubscribed}
                                className="mr-2"
                              />
                              <div>
                                <span className="text-primary">Build student profiles</span>
                                <p className="text-xs text-primary/60">Track strengths and areas for improvement over time</p>
                              </div>
                            </label>
                          </div>

                          {/* Submit button */}
                          <div className="flex justify-end">
                            <button
                              onClick={handleReset}
                              className="px-4 py-2 border border-gray-300 text-primary rounded-lg hover:bg-gray-50 transition-colors mr-2"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={handleProcessAssessment}
                              disabled={isProcessing || !isSubscribed}
                              className={`px-4 py-2 bg-primary text-white rounded-lg transition-colors flex items-center ${
                                isProcessing || !isSubscribed ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
                              }`}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader size={16} className="animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : !isSubscribed ? (
                                <>
                                  <Lock size={16} className="mr-2" />
                                  Premium Feature
                                </>
                              ) : (
                                <>
                                  <Brain size={16} className="mr-2" />
                                  Process with AI
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Help Section */}
                      <div className="bg-primary/10 p-5 rounded-lg border-l-4 border-primary mt-6">
                        <h3 className="font-medium text-primary mb-2">Tips for Best Results</h3>
                        <ul className="space-y-1 text-sm text-primary/80">
                          <li>- For handwritten assessments, ensure the writing is clear and the image is well-lit</li>
                          <li>- PDFs with embedded text will yield more accurate results than scanned PDFs</li>
                          <li>- Include an answer key in your assessment for more accurate grading</li>
                          <li>- El AI builds student profiles over time, so regular use improves insights</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Student Insights Tab */}
              {activeTab === 'insights' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-text flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Student Insights
                    </h3>
                    <button
                      onClick={handleReset}
                      className="text-sm text-primary hover:text-primary transition-colors"
                    >
                      Process New Assessment
                    </button>
                  </div>

                  {studentInsights.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-premium-neutral-200 rounded-lg">
                      <Brain className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-text mb-2">No insights available</h3>
                      <p className="text-text-muted max-w-md mx-auto">
                        Process an assessment to generate AI insights for your students.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Class Overview */}
                      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                        <h4 className="font-medium text-text mb-4">Class Overview</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-primary/70">Average Grade</p>
                            <p className="text-2xl font-semibold text-primary">B+</p>
                          </div>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-primary/70">Completion Rate</p>
                            <p className="text-2xl font-semibold text-primary">100%</p>
                          </div>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-primary/70">Common Challenges</p>
                            <p className="text-sm font-medium text-primary mt-1">Applying Concepts</p>
                          </div>
                        </div>
                      </div>

                      {/* Student List */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-primary/5 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <h4 className="font-medium text-text flex items-center">
                            <List className="w-4 h-4 mr-2" />
                            Student Results
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {studentInsights.map((student) => (
                            <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                <h5 className="font-medium text-text">{student.name}</h5>
                                <div className="mt-2 sm:mt-0">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    student.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                                    student.grade.startsWith('B') ? 'bg-primary/10 text-primary' :
                                    student.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    Grade: {student.grade}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h6 className="font-medium text-primary mb-1">Strengths:</h6>
                                  <ul className="list-disc pl-4 text-primary/80">
                                    {student.strengths.map((strength, index) => (
                                      <li key={index}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-primary mb-1">Areas for Improvement:</h6>
                                  <ul className="list-disc pl-4 text-primary/80">
                                    {student.weaknesses.map((weakness, index) => (
                                      <li key={index}>{weakness}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h6 className="font-medium text-primary mb-1">El AI Insights:</h6>
                                <p className="text-primary/80 text-sm">{student.insights}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mt-6 bg-surface/10 p-5 rounded-lg border-l-4 border-primary">
                        <h3 className="font-medium text-primary mb-2">Teaching Recommendations</h3>
                        <p className="text-sm text-primary/80 mb-4">
                          Based on the assessment results, El AI recommends:
                        </p>
                        <ul className="space-y-2 text-sm text-primary/80">
                          <li className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 flex-shrink-0 mt-0.5">1</div>
                            <span>Focus on practical applications of concepts to help students bridge the gap between theory and practice</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 flex-shrink-0 mt-0.5">2</div>
                            <span>Provide more structured guidance on technical vocabulary and terminology</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 flex-shrink-0 mt-0.5">3</div>
                            <span>Consider pairing students with complementary strengths for group activities</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

      {/* Storage Bucket Error Modal */}
      <StorageBucketErrorModal
        isOpen={showStorageBucketError}
        onClose={() => setShowStorageBucketError(false)}
        bucketName="uploads"
      />
    </TeacherPageLayout>
  );
};

export default AssessmentGradingPage;
