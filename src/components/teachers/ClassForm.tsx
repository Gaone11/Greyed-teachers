import React, { useState } from 'react';
import { X, AlertCircle, Upload, Users, Trash2 } from 'lucide-react';
import { capsCurriculum, saGrades } from '../../data/capsCurriculum';

interface ClassFormStudent {
  name: string;
}

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
    syllabus: string;
    classSize?: number;
    duration?: number;
    students?: ClassFormStudent[];
  }) => Promise<void>;
  initialData?: {
    name?: string;
    subject?: string;
    grade?: string;
    description?: string;
    syllabus?: string;
    classSize?: number;
    duration?: number;
  };
  isEditing?: boolean;
}

const cleanStudentLine = (line: string) => {
  return line
    .replace(/^\s*(\d+[\).:-]?|[-*•])\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const parseStudentList = (text: string): ClassFormStudent[] => {
  const rows = text
    .split(/\r?\n/)
    .map(cleanStudentLine)
    .filter(Boolean)
    .filter(line => !/^(name|student|students|class list|s\/n|sn|no\.?)\b/i.test(line));

  const students = rows.map(row => {
    const csvParts = row.split(',').map(part => part.trim()).filter(Boolean);
    return { name: csvParts.length > 1 ? csvParts.join(' - ') : row };
  });

  const seen = new Set<string>();
  return students.filter(student => {
    const key = student.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const extractTextFromFile = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'pdf') {
    const pdfjsLib = await import('pdfjs-dist');
    // @ts-ignore - Vite resolves the worker URL at build time.
    const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      pageTexts.push(textContent.items.map((item: any) => item.str).join(' '));
    }

    return pageTexts.join('\n');
  }

  return file.text();
};

const ClassForm: React.FC<ClassFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    subject: initialData.subject || '',
    grade: initialData.grade || '',
    description: initialData.description || '',
    syllabus: initialData.syllabus || 'NERDC',
    classSize: initialData.classSize?.toString() || '',
    duration: initialData.duration?.toString() || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<ClassFormStudent[]>([]);
  const [studentName, setStudentName] = useState('');
  const [studentListText, setStudentListText] = useState('');
  const [studentImportMessage, setStudentImportMessage] = useState<string | null>(null);
  const [isReadingStudentFile, setIsReadingStudentFile] = useState(false);
  
  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({
        name: formData.name,
        subject: formData.subject,
        grade: formData.grade,
        description: formData.description,
        syllabus: formData.syllabus,
        classSize: formData.classSize ? parseInt(formData.classSize, 10) : undefined,
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
        students,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to save class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStudents = (incoming: ClassFormStudent[], source: string) => {
    const cleanIncoming = incoming
      .map(student => ({ name: cleanStudentLine(student.name) }))
      .filter(student => student.name);

    if (!cleanIncoming.length) {
      setStudentImportMessage(`No student names found from ${source}.`);
      return;
    }

    setStudents(current => {
      const existing = new Set(current.map(student => student.name.toLowerCase()));
      const additions = cleanIncoming.filter(student => {
        const key = student.name.toLowerCase();
        if (existing.has(key)) return false;
        existing.add(key);
        return true;
      });
      setStudentImportMessage(`Added ${additions.length} student${additions.length === 1 ? '' : 's'} from ${source}.`);
      return [...current, ...additions];
    });
  };

  const handleAddSingleStudent = () => {
    addStudents([{ name: studentName }], 'manual entry');
    setStudentName('');
  };

  const handleImportPastedStudents = () => {
    addStudents(parseStudentList(studentListText), 'pasted list');
    setStudentListText('');
  };

  const handleStudentFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReadingStudentFile(true);
    setStudentImportMessage(null);

    try {
      const text = await extractTextFromFile(file);
      addStudents(parseStudentList(text), file.name);
    } catch (err: any) {
      setStudentImportMessage(err.message || 'Could not read that file. Try a PDF, DOCX, TXT, or CSV class list.');
    } finally {
      setIsReadingStudentFile(false);
      event.target.value = '';
    }
  };

  const removeStudent = (index: number) => {
    setStudents(current => current.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold text-gray-900">{isEditing ? 'Edit Class' : 'Create New Class'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 touch-target"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              placeholder="e.g. SSS 1 Physics"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              name="subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
              value={formData.subject}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a subject...</option>
              {capsCurriculum.map(subject => (
                <option key={subject.key} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formData.subject && (
              <p className="mt-1.5 text-xs text-greyed-beige">
                NERDC topics:{' '}
                <span className="text-greyed-navy font-medium">
                  {capsCurriculum.find(subject => subject.name === formData.subject)?.topics.slice(0, 3).map(topic => topic.name).join(' · ') || 'Select a NERDC subject'}
                </span>
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
            <select
              name="syllabus"
              title="Syllabus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
              value={formData.syllabus}
              onChange={handleInputChange}
            >
              <option value="NERDC">NERDC (Nigeria)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Level</label>
           <select
             name="grade"
             className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none"
             value={formData.grade}
             onChange={handleInputChange}
             required
           >
             <option value="">Select a grade...</option>
             {saGrades.map(grade => (
               <option key={grade.value} value={grade.value}>{grade.label}</option>
             ))}
           </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Size (Optional)</label>
            <input
              type="number"
              name="classSize"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              placeholder="e.g. 25"
              value={formData.classSize}
              onChange={handleInputChange}
              min="1"
              max="999"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Typical Lesson Duration (Optional, in minutes)</label>
            <input
              type="number"
              name="duration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              placeholder="e.g. 45"
              value={formData.duration}
              onChange={handleInputChange}
              min="5"
              max="300"
              step="5"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              placeholder="Briefly describe this class..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            ></textarea>
          </div>

          {!isEditing && (
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} className="text-greyed-navy" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Students</h4>
                  <p className="text-xs text-gray-500">Add students manually or import a class list before creating the class.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddSingleStudent();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                  placeholder="Student full name"
                />
                <button
                  type="button"
                  onClick={handleAddSingleStudent}
                  disabled={!studentName.trim()}
                  className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Paste class list</label>
                  <textarea
                    value={studentListText}
                    onChange={(event) => setStudentListText(event.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue resize-none"
                    placeholder={"One student per line:\nAmina Bello\nChinedu Okafor\nMaryam Musa"}
                  />
                  <button
                    type="button"
                    onClick={handleImportPastedStudents}
                    disabled={!studentListText.trim()}
                    className="mt-2 w-full px-3 py-2 border border-greyed-navy text-greyed-navy rounded-md hover:bg-greyed-navy/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Import Pasted List
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Scan/import document list</label>
                  <label className="flex min-h-[122px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-3 py-4 text-center hover:border-greyed-navy/50">
                    <Upload size={22} className="mb-2 text-greyed-navy" />
                    <span className="text-sm font-semibold text-gray-800">
                      {isReadingStudentFile ? 'Reading file...' : 'Upload PDF, DOCX, TXT, or CSV'}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">Names are extracted one line at a time.</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.csv"
                      onChange={handleStudentFileUpload}
                      disabled={isReadingStudentFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {studentImportMessage && (
                <p className="mt-3 text-xs font-medium text-greyed-navy">{studentImportMessage}</p>
              )}

              {students.length > 0 && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {students.length} student{students.length === 1 ? '' : 's'} ready to save
                    </span>
                    <button
                      type="button"
                      onClick={() => setStudents([])}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                    {students.map((student, index) => (
                      <div key={`${student.name}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2">
                        <span className="text-sm text-gray-900">{student.name}</span>
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remove student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-greyed-white hover:bg-greyed-navy"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
