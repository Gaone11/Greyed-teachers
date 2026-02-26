import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Database, Upload, Trash2, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { capsCurriculum, saGrades, getSubjectsByPhase, getPhaseFromGrade } from '../../data/capsCurriculum';
import {
  extractFilePages,
  chunkDocument,
  type ChunkedDocument,
  type KnowledgeChunk,
} from '../../lib/knowledgebase/pdf-chunker';

const KB_STORAGE_KEY = 'greyed-kb-chunks';
const KB_EMAILS = ['pax@greyed.org', 'gaone@orionx.xyz'];

interface StoredKB {
  documents: ChunkedDocument[];
  version: number;
}

function loadKB(): StoredKB {
  try {
    const raw = localStorage.getItem(KB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredKB;
      if (parsed.version === 1 && Array.isArray(parsed.documents)) return parsed;
    }
  } catch { /* ignore corrupt data */ }
  return { documents: [], version: 1 };
}

function saveKB(kb: StoredKB) {
  localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(kb));
}

export default function TeacherKnowledgeBasePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Access control
  const hasAccess = KB_EMAILS.includes(user?.email || '');

  const [documents, setDocuments] = useState<ChunkedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGrade, setSelectedGrade] = useState(saGrades[0].value);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('');
  const [selectedTopicKey, setSelectedTopicKey] = useState('');
  const [filePreview, setFilePreview] = useState<{ pages: number; chars: number } | null>(null);

  // Derived state
  const gradeNum = saGrades.find(g => g.value === selectedGrade)?.num ?? 0;
  const phase = getPhaseFromGrade(gradeNum);
  const availableSubjects = getSubjectsByPhase(phase);
  const selectedSubject = capsCurriculum.find(s => s.key === selectedSubjectKey);
  const availableTopics = selectedSubject?.topics ?? [];

  // Load documents on mount
  useEffect(() => {
    const kb = loadKB();
    setDocuments(kb.documents);
  }, []);

  // Reset subject when grade changes
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.find(s => s.key === selectedSubjectKey)) {
      setSelectedSubjectKey(availableSubjects[0].key);
    }
  }, [phase, availableSubjects, selectedSubjectKey]);

  // Reset topic when subject changes
  useEffect(() => {
    if (availableTopics.length > 0 && !availableTopics.find(t => t.key === selectedTopicKey)) {
      setSelectedTopicKey(availableTopics[0].key);
    }
  }, [selectedSubjectKey, availableTopics, selectedTopicKey]);

  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setSuccess(null);
    setFilePreview(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      setSelectedFile(null);
      return;
    }

    try {
      setProgress('Extracting text...');
      const pages = await extractFilePages(file);
      const totalChars = pages.reduce((sum, p) => sum + p.text.length, 0);
      setFilePreview({ pages: pages.length, chars: totalChars });
      setProgress('');
    } catch (err: any) {
      setError(`Failed to read file: ${err.message}`);
      setSelectedFile(null);
      setProgress('');
    }
  }, []);

  // Process and save
  const handleProcessAndSave = useCallback(async () => {
    if (!selectedFile || !selectedSubjectKey || !selectedTopicKey) {
      setError('Please select a file, subject, and topic.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      setProgress('Extracting text from document...');
      const pages = await extractFilePages(selectedFile);

      setProgress('Chunking document with CAPS metadata...');
      const chunkedDoc = chunkDocument(pages, {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        subjectKey: selectedSubjectKey,
        topicKey: selectedTopicKey,
        grade: selectedGrade,
      });

      // Save to localStorage
      const kb = loadKB();
      kb.documents.push(chunkedDoc);
      saveKB(kb);

      setDocuments(kb.documents);
      setSuccess(`Processed "${selectedFile.name}" into ${chunkedDoc.chunks.length} chunks (${chunkedDoc.totalPages} pages).`);
      setSelectedFile(null);
      setFilePreview(null);
      setProgress('');

      // Reset file input
      const fileInput = document.getElementById('kb-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(`Processing failed: ${err.message}`);
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, selectedSubjectKey, selectedTopicKey, selectedGrade]);

  // Delete a document
  const handleDelete = useCallback((documentId: string) => {
    const kb = loadKB();
    kb.documents = kb.documents.filter(d => d.documentId !== documentId);
    saveKB(kb);
    setDocuments(kb.documents);
  }, []);

  // Redirect if no access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">This feature is not available for your account.</p>
        </div>
      </div>
    );
  }

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks.length, 0);
  const estimatedTokens = documents.reduce(
    (sum, d) => sum + d.chunks.reduce((s, c) => s + c.metadata.estimatedTokens, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/teachers/settings')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Settings
            </button>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Database className="h-5 w-5" />
              CAPS Knowledgebase
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-greyed-navy">{documents.length}</p>
            <p className="text-sm text-gray-500">Documents</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-greyed-navy">{totalChunks}</p>
            <p className="text-sm text-gray-500">Chunks</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-greyed-navy">{(estimatedTokens / 1000).toFixed(1)}k</p>
            <p className="text-sm text-gray-500">Est. Tokens</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Syllabus Document
          </h2>

          {/* File Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF, DOCX, or TXT file
            </label>
            <input
              id="kb-file-input"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100"
            />
            {filePreview && (
              <p className="mt-2 text-sm text-gray-500">
                {filePreview.pages} pages, {filePreview.chars.toLocaleString()} characters
              </p>
            )}
          </div>

          {/* CAPS Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {saGrades.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={selectedSubjectKey}
                onChange={e => setSelectedSubjectKey(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {availableSubjects.map(s => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                value={selectedTopicKey}
                onChange={e => setSelectedTopicKey(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {availableTopics.map(t => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcessAndSave}
            disabled={isProcessing || !selectedFile}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Process & Save
              </>
            )}
          </button>

          {/* Messages */}
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
        </div>

        {/* Document List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Uploaded Documents</h2>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents uploaded yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload CAPS syllabus PDFs above to enable knowledgebase-enhanced lesson plans and assessments.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map(doc => {
                const firstChunk = doc.chunks[0];
                const meta = firstChunk?.metadata;
                return (
                  <div key={doc.documentId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meta && (
                          <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                              {meta.grade}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                              {meta.subjectName}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                              {meta.topicName}
                            </span>
                          </>
                        )}
                        <span className="text-xs text-gray-400">
                          {doc.chunks.length} chunks &middot; {doc.totalPages} pages
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Processed {new Date(doc.processedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.documentId)}
                      className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
