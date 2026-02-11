import React, { useState, useEffect, useRef } from 'react';
import { 
  File, 
  FileText, 
  FileImage, 
  FilePlus, 
  Trash2, 
  Download, 
  Tag, 
  Search,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface ClassroomDocumentsProps {
  classId: string;
  className: string;
}

interface Document {
  id: string;
  path: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  tags?: string[];
  uploaded_at: string;
}

const ClassroomDocuments: React.FC<ClassroomDocumentsProps> = ({ classId, className }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string; path: string } | null>(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [classId]);

  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('class_id', classId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (err: any) {
      setError(`Failed to load documents: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Add a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setCurrentTags([...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    setCurrentTags(currentTags.filter(t => t !== tag));
  };

  // Handle tag input key press (Enter)
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Upload file to Supabase
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${classId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Create resource record in database
      const { data: resourceData, error: resourceError } = await supabase
        .from('resources')
        .insert([
          {
            class_id: classId,
            path: publicUrlData.publicUrl,
            file_name: selectedFile.name,
            file_type: selectedFile.type,
            file_size: selectedFile.size,
            tags: currentTags.length > 0 ? currentTags : null
          }
        ])
        .select();

      if (resourceError) {
        throw resourceError;
      }

      // Add the new document to state
      if (resourceData && resourceData.length > 0) {
        setDocuments([resourceData[0], ...documents]);
      }

      // Reset form
      setSelectedFile(null);
      setCurrentTags([]);
      setShowUploadModal(false);
      
      // Refresh documents list
      fetchDocuments();

    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete a document
  const handleDeleteClick = (documentId: string, documentPath: string) => {
    setDocToDelete({ id: documentId, path: documentPath });
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    const { id: documentId, path: documentPath } = docToDelete;
    setDocToDelete(null);

    try {
      setError(null);

      // Extract the file path from the full URL
      const pathParts = documentPath.split('/');
      const storagePath = `${classId}/${pathParts[pathParts.length - 1]}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([storagePath]);

      if (storageError) {
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw dbError;
      }

      // Update state
      setDocuments(documents.filter(doc => doc.id !== documentId));

    } catch (err: any) {
      setError(`Delete failed: ${err.message}`);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get icon based on file type
  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <File className="w-6 h-6 text-gray-400" />;
    
    if (fileType.includes('image')) {
      return <FileImage className="w-6 h-6 text-greyed-blue" />;
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    
    return <File className="w-6 h-6 text-gray-400" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (doc.file_name?.toLowerCase().includes(searchLower) || false) ||
      (doc.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-black">Classroom Documents</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-3 py-1.5 bg-greyed-navy text-white rounded hover:bg-greyed-navy/90 text-sm transition-colors flex items-center"
        >
          <FilePlus size={16} className="mr-1" />
          Upload Document
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
            placeholder="Search documents by name or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Documents list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-greyed-navy/10 rounded-lg">
          <FileText className="w-12 h-12 text-greyed-navy/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">
            {searchTerm ? 'No matching documents found' : 'No documents uploaded yet'}
          </h3>
          <p className="text-black/70 max-w-md mx-auto mb-4">
            {searchTerm 
              ? "Try adjusting your search term or upload new documents."
              : `Upload teaching resources like worksheets, slides, or study guides for ${className}.`
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors inline-flex items-center"
            >
              <FilePlus size={16} className="mr-2" />
              Upload First Document
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-greyed-navy/5">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Uploaded</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tags</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-greyed-navy/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div>
                        <a 
                          href={doc.path} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-greyed-blue hover:text-greyed-navy cursor-pointer"
                        >
                          {doc.file_name || doc.path.split('/').pop()}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {doc.file_type ? doc.file_type.split('/')[1]?.toUpperCase() : 'Document'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {formatFileSize(doc.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {formatDate(doc.uploaded_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-greyed-navy/10 text-greyed-navy rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <a 
                        href={doc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-greyed-navy hover:bg-greyed-navy/10 rounded transition-colors"
                        title="Download"
                      >
                        <Download size={16} />
                      </a>
                      <button 
                        onClick={() => handleDeleteClick(doc.id, doc.path)}
                        className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-headline font-bold">Upload Document</h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setCurrentTags([]);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              {/* File upload area */}
              <div 
                className={`border-2 ${dragActive ? 'border-greyed-blue bg-greyed-blue/5' : 'border-dashed border-gray-300'} rounded-lg p-6 text-center mb-4`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  id="document-file-input"
                />
                
                {selectedFile ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {selectedFile.type.includes('image') ? (
                        <FileImage className="w-8 h-8 text-greyed-blue" />
                      ) : selectedFile.type.includes('pdf') ? (
                        <FileText className="w-8 h-8 text-red-500" />
                      ) : (
                        <File className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <p className="text-black font-medium mb-1">{selectedFile.name}</p>
                    <p className="text-black/60 text-sm mb-4">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-1 text-sm bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                      <label
                        htmlFor="document-file-input"
                        className="px-3 py-1 text-sm bg-greyed-navy/5 text-black hover:bg-greyed-navy/10 rounded cursor-pointer transition-colors"
                      >
                        Change File
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FilePlus className="w-8 h-8 text-greyed-navy/50 mx-auto mb-4" />
                    <p className="text-black mb-2">Drag and drop your file here</p>
                    <p className="text-black/60 text-sm mb-4">or</p>
                    <label
                      htmlFor="document-file-input"
                      className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors cursor-pointer inline-block"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-black/70 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-greyed-blue h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Tags (Optional)
                </label>
                <div className="flex mb-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                      placeholder="e.g., homework, notes"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-greyed-navy text-white px-3 py-2 rounded-r-md hover:bg-greyed-navy/90"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="bg-greyed-blue/20 text-greyed-navy px-2 py-1 rounded-lg text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-greyed-navy/70 hover:text-greyed-navy"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setCurrentTags([]);
                  }}
                  className="mx-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className={`px-4 py-2 text-sm bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 flex items-center ${
                    isUploading || !selectedFile ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isUploading || !selectedFile}
                >
                  {isUploading ? (
                    <>
                      <Loader size={14} className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={!!docToDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};

export default ClassroomDocuments;