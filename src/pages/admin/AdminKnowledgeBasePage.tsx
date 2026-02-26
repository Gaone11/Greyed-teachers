import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Upload,
  FileText,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  Eye,
  EyeOff,
  Tag,
  Clock,
  Database,
  Shield,
  ChevronDown,
  BookOpen,
  FileType,
  ArrowLeft,
} from 'lucide-react';
import {
  isKbAdmin,
  listKbDocuments,
  uploadKbDocument,
  deleteKbDocument,
  toggleKbDocument,
  getKbUploadLogs,
  extractTextFromFile,
} from '../../lib/api/kb-api';

const DOCUMENT_TYPES = ['Syllabus', 'Policy', 'Guide', 'FAQ', 'General Reference', 'Other'] as const;
type DocumentType = typeof DOCUMENT_TYPES[number];

const TYPE_COLORS: Record<DocumentType, string> = {
  'Syllabus': 'bg-red-100 text-red-800 border-red-200',
  'Policy': 'bg-blue-100 text-blue-800 border-blue-200',
  'Guide': 'bg-green-100 text-green-800 border-green-200',
  'FAQ': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'General Reference': 'bg-purple-100 text-purple-800 border-purple-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200',
};

const AdminKnowledgeBasePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State
  const [documents, setDocuments] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'documents' | 'upload' | 'logs'>('documents');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUploadDetails, setShowUploadDetails] = useState(false);

  // Upload form state
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState<DocumentType>('General Reference');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadPriority, setUploadPriority] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || !isKbAdmin(user.email))) {
      navigate('/teachers/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Load data
  useEffect(() => {
    if (user && isKbAdmin(user.email)) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [docs, uploadLogs] = await Promise.all([
        listKbDocuments(),
        getKbUploadLogs(),
      ]);
      setDocuments(docs);
      setLogs(uploadLogs);
    } catch (err: any) {
      setError(err.message || 'Failed to load knowledge base data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      return;
    }

    setUploadFile(file);
    setError(null);

    // Auto-fill name from filename if empty
    if (!uploadName) {
      setUploadName(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Extract text client-side
    try {
      setExtracting(true);
      const text = await extractTextFromFile(file);
      setExtractedText(text);
      setShowUploadDetails(true);
    } catch (err: any) {
      setError(`Failed to extract text: ${err.message}`);
      setExtractedText('');
    } finally {
      setExtracting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !extractedText.trim()) {
      setError('Please select a file with valid text content');
      return;
    }
    if (!uploadName.trim()) {
      setError('Please enter a document name');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const ext = uploadFile.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'txt';
      const tags = uploadTags.split(',').map(t => t.trim()).filter(Boolean);

      const result = await uploadKbDocument({
        name: uploadName.trim(),
        originalFilename: uploadFile.name,
        fileType: ext,
        documentType: uploadType,
        tags,
        priorityLevel: uploadType === 'Syllabus' ? 5 : uploadPriority,
        textContent: extractedText,
      });

      setSuccess(
        `Document "${result.document.name}" uploaded successfully! ` +
        `${result.chunks} chunks created, ${result.embeddings || 0} embeddings generated.`
      );

      // Reset form
      resetUploadForm();
      setActiveTab('documents');
      loadData();

      setTimeout(() => setSuccess(null), 6000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadName('');
    setUploadType('General Reference');
    setUploadTags('');
    setUploadPriority(1);
    setUploadFile(null);
    setExtractedText('');
    setShowUploadDetails(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (docId: string) => {
    try {
      setError(null);
      await deleteKbDocument(docId);
      setSuccess('Document deleted successfully');
      setDeleteConfirm(null);
      loadData();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
    }
  };

  const handleToggle = async (docId: string, currentActive: boolean) => {
    try {
      setError(null);
      await toggleKbDocument(docId, !currentActive);
      setDocuments(prev =>
        prev.map(d => (d.id === docId ? { ...d, is_active: !currentActive } : d))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to toggle document status');
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.document_type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6]">
        <div className="text-center">
          <Loader className="w-10 h-10 text-greyed-navy animate-spin mx-auto mb-4" />
          <p className="text-greyed-navy font-medium">Loading Knowledge Base...</p>
        </div>
      </div>
    );
  }

  if (!user || !isKbAdmin(user.email)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/teachers/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-greyed-navy" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-navy/80 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-greyed-navy">AI Knowledge Base</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin Only — {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-greyed-navy/10 text-greyed-navy px-3 py-1.5 rounded-full font-medium">
                {documents.length} documents · {documents.reduce((sum, d) => sum + d.chunk_count, 0)} chunks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-start animate-slide-down">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto pl-3">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-start animate-slide-down">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto pl-3">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-md">
          {([
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'logs', label: 'Activity Log', icon: Clock },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-greyed-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ===== DOCUMENTS TAB ===== */}
        {activeTab === 'documents' && (
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy"
                />
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 bg-white"
                >
                  <option value="">All Types</option>
                  {DOCUMENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No documents yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload training documents to enhance the AI's knowledge base.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Upload First Document
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                      doc.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileType className="w-5 h-5 text-greyed-navy flex-shrink-0" />
                            <h3 className="font-semibold text-greyed-navy truncate">{doc.name}</h3>
                            {!doc.is_active && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            {doc.original_filename} · {formatFileSize(doc.file_size_bytes)} · Uploaded by {doc.uploaded_by}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TYPE_COLORS[doc.document_type as DocumentType] || TYPE_COLORS.Other}`}>
                              {doc.document_type}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                              {doc.chunk_count} chunks
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                              Priority: {doc.priority_level}/5
                            </span>
                            {doc.tags?.map((tag: string) => (
                              <span key={tag} className="text-xs bg-greyed-navy/5 text-greyed-navy px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Tag className="w-3 h-3" />{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleToggle(doc.id, doc.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              doc.is_active
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                            title={doc.is_active ? 'Disable document' : 'Enable document'}
                          >
                            {doc.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {deleteConfirm === doc.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(doc.id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Uploaded {formatDate(doc.upload_date || doc.created_at)}
                        </span>
                        <span className="text-xs text-gray-400 uppercase">
                          .{doc.file_type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== UPLOAD TAB ===== */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-greyed-navy mb-1">Upload Training Document</h2>
              <p className="text-sm text-gray-500 mb-6">
                Upload a PDF, DOCX, or TXT file. The document will be parsed, chunked, and embedded for AI retrieval.
              </p>

              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  uploadFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-greyed-navy/40 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {extracting ? (
                  <div>
                    <Loader className="w-10 h-10 text-greyed-navy animate-spin mx-auto mb-3" />
                    <p className="text-sm text-greyed-navy font-medium">Extracting text from document...</p>
                  </div>
                ) : uploadFile ? (
                  <div>
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-green-700">{uploadFile.name}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {formatFileSize(uploadFile.size)} · {extractedText.length.toLocaleString()} characters extracted
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); resetUploadForm(); }}
                      className="mt-3 text-xs text-gray-500 hover:text-red-500 underline"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT (max 50MB)</p>
                  </div>
                )}
              </div>

              {/* Upload Details Form */}
              {showUploadDetails && extractedText && (
                <div className="mt-6 space-y-4 animate-slide-down">
                  {/* Document Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Document Name *
                    </label>
                    <input
                      type="text"
                      value={uploadName}
                      onChange={e => setUploadName(e.target.value)}
                      placeholder="e.g., CAPS Mathematics Grade 4 Syllabus"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy"
                    />
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Document Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DOCUMENT_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => setUploadType(type)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                            uploadType === type
                              ? TYPE_COLORS[type] + ' ring-2 ring-offset-1 ring-greyed-navy/20'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {uploadType === 'Syllabus' && (
                      <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Syllabus documents are always included in AI context with highest priority.
                      </p>
                    )}
                  </div>

                  {/* Priority Level */}
                  {uploadType !== 'Syllabus' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Priority Level: {uploadPriority}/5
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={uploadPriority}
                        onChange={e => setUploadPriority(Number(e.target.value))}
                        className="w-full accent-greyed-navy"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={uploadTags}
                      onChange={e => setUploadTags(e.target.value)}
                      placeholder="e.g., mathematics, grade-4, CAPS, term-1"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy"
                    />
                  </div>

                  {/* Text Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Extracted Text Preview
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                        {extractedText.substring(0, 2000)}
                        {extractedText.length > 2000 && '\n\n... (truncated)'}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ~{Math.ceil(extractedText.length / 4).toLocaleString()} estimated tokens
                    </p>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !uploadName.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-greyed-navy text-white rounded-xl hover:bg-greyed-navy/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing & Embedding...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload, Chunk & Embed Document
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== LOGS TAB ===== */}
        {activeTab === 'logs' && (
          <div>
            <h2 className="text-lg font-bold text-greyed-navy mb-4">Activity Log</h2>
            {logs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No activity yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {logs.map(log => (
                    <div key={log.id} className="px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        log.action === 'upload'
                          ? 'bg-green-100 text-green-600'
                          : log.action === 'delete'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {log.action === 'upload' && <Upload className="w-4 h-4" />}
                        {log.action === 'delete' && <Trash2 className="w-4 h-4" />}
                        {log.action === 'update' && <FileText className="w-4 h-4" />}
                        {log.action === 'reprocess' && <BookOpen className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          <span className="capitalize">{log.action}</span>
                          {log.document_name && (
                            <> — <span className="text-greyed-navy">{log.document_name}</span></>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {log.admin_email} · {formatDate(log.created_at)}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKnowledgeBasePage;
