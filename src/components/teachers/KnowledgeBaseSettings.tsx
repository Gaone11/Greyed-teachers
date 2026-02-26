import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Database,
  X,
} from 'lucide-react';
import {
  CAPS_SUBJECTS,
  CAPS_GRADES,
  CAPS_TERMS,
  getSubjectsByGrade,
} from '../../data/capsSubjectsData';
import {
  uploadTeacherDocument,
  listTeacherDocuments,
  deleteTeacherDocument,
  extractTextFromPdf,
  type TeacherKbDocument,
} from '../../lib/api/teacher-kb-api';

export default function KnowledgeBaseSettings() {
  const [documents, setDocuments] = useState<TeacherKbDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const availableSubjects = selectedGrade
    ? getSubjectsByGrade(selectedGrade)
    : CAPS_SUBJECTS;

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await listTeacherDocuments();
      setDocuments(docs);
    } catch {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }
    if (!selectedSubject) {
      setError('Please select a subject before uploading');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      setUploadProgress('Extracting text from PDF...');
      const text = await extractTextFromPdf(file);

      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract enough text from the PDF. The file may be image-based or empty.');
      }

      setUploadProgress('Chunking and indexing content...');
      const result = await uploadTeacherDocument(
        text,
        file.name,
        file.size,
        selectedSubject,
        selectedGrade,
        selectedTerm
      );

      setSuccess(
        `Uploaded successfully! Created ${result.chunk_count} knowledge chunks across ${result.topics.length} topics.`
      );
      setSelectedSubject('');
      setSelectedGrade('');
      setSelectedTerm('');
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Delete this document and all its chunks?')) return;
    try {
      await deleteTeacherDocument(docId);
      setSuccess('Document deleted');
      await loadDocuments();
    } catch {
      setError('Failed to delete document');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Database className="w-5 h-5 text-teal-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          CAPS Syllabus Knowledge Base
        </h3>
      </div>
      <p className="text-sm text-gray-500">
        Upload CAPS syllabus PDFs to power your lesson plan generator. Documents are
        automatically chunked by topic so only relevant content is used -- saving
        tokens and speeding up generation.
      </p>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Upload New Syllabus Document</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                setSelectedSubject('');
              }}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">All grades</option>
              {CAPS_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">Select subject</option>
              {availableSubjects.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">All terms</option>
              {CAPS_TERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragOver
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm font-medium text-teal-700">{uploadProgress}</p>
              <p className="text-xs text-gray-500">This may take a moment for large files</p>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop a PDF here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CAPS syllabus documents only -- PDF format
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Uploaded Documents
          </h4>
          <span className="text-xs text-gray-500">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs mt-1">
              Upload a CAPS syllabus PDF to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <FileText className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.filename}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                      {doc.subject}
                    </span>
                    {doc.grade && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {doc.grade}
                      </span>
                    )}
                    {doc.term && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {doc.term}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {doc.chunk_count} chunks
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatSize(doc.file_size)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : doc.status === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
