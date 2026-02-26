import { supabase } from '../supabase';

// Authorized admin emails — enforced both here and on the backend
const ADMIN_EMAILS = ['monti@orionx.xyz', 'gaone@orionx.xyz'];

export function isKbAdmin(email?: string | null): boolean {
  return ADMIN_EMAILS.includes(email || '');
}

interface KbDocument {
  id: string;
  name: string;
  original_filename: string;
  file_type: string;
  document_type: string;
  storage_path: string;
  file_size_bytes: number;
  chunk_count: number;
  tags: string[];
  priority_level: number;
  uploaded_by: string;
  upload_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface KbUploadLog {
  id: string;
  admin_email: string;
  action: string;
  document_id: string | null;
  document_name: string | null;
  details: Record<string, any>;
  created_at: string;
}

interface KbUploadResult {
  success: boolean;
  document: KbDocument;
  chunks: number;
  embeddings: number | false;
  message?: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

function getEdgeFunctionUrl(name: string): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return `${url}/functions/v1/${name}`;
}

/**
 * List all documents in the knowledge base (admin only)
 */
export async function listKbDocuments(): Promise<KbDocument[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'list' }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to list documents');
  }

  const data = await response.json();
  return data.documents;
}

/**
 * Upload and process a document (admin only)
 */
export async function uploadKbDocument(params: {
  name: string;
  originalFilename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  documentType: 'Syllabus' | 'Policy' | 'Guide' | 'FAQ' | 'General Reference' | 'Other';
  tags: string[];
  priorityLevel: number;
  textContent: string;
}): Promise<KbUploadResult> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'upload',
      ...params,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to upload document');
  }

  return response.json();
}

/**
 * Delete a document and all its chunks (admin only)
 */
export async function deleteKbDocument(documentId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'delete', documentId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete document');
  }
}

/**
 * Toggle document active status (admin only)
 */
export async function toggleKbDocument(documentId: string, isActive: boolean): Promise<KbDocument> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'toggle', documentId, isActive }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to toggle document');
  }

  const data = await response.json();
  return data.document;
}

/**
 * Get upload logs (admin only)
 */
export async function getKbUploadLogs(): Promise<KbUploadLog[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'logs' }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch logs');
  }

  const data = await response.json();
  return data.logs;
}

/**
 * Search the knowledge base using RAG (any authenticated user via AI)
 */
export async function searchKnowledgeBase(query: string): Promise<{
  chunks: Array<{
    content: string;
    similarity: number;
    source: string;
    type: string;
    priority: number;
  }>;
  contextString: string;
  totalChunks: number;
}> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('kb-search'), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      matchThreshold: 0.7,
      matchCount: 6,
      includeSyllabus: true,
    }),
  });

  if (!response.ok) {
    // Return empty result on error to allow AI to still function
    console.warn('KB search failed, proceeding without knowledge base context');
    return { chunks: [], contextString: '', totalChunks: 0 };
  }

  return response.json();
}

/**
 * Extract text from a File object (client-side extraction)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'txt') {
    return file.text();
  }

  if (fileType === 'pdf') {
    // Use PDF.js for client-side PDF text extraction
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    
    // Use the bundled worker via Vite's ?url import to get a stable URL
    // @ts-ignore — Vite handles the ?url suffix at build time
    const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default;
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      textParts.push(pageText);
    }
    
    return textParts.join('\n\n');
  }

  if (fileType === 'docx') {
    // Use mammoth for client-side DOCX text extraction
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}
