import { supabase } from '../supabase';

export interface TeacherKbDocument {
  id: string;
  teacher_id: string;
  filename: string;
  file_size: number;
  subject: string;
  grade: string;
  term: string;
  status: string;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeacherKbChunk {
  content: string;
  topic: string;
  grade: string;
  term: string;
  metadata: Record<string, string>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

function getEdgeFunctionUrl(action: string): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kb-teacher-upload?action=${action}`;
}

export async function uploadTeacherDocument(
  text: string,
  filename: string,
  fileSize: number,
  subject: string,
  grade: string,
  term: string
): Promise<{ document_id: string; chunk_count: number; topics: string[] }> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('upload'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, filename, fileSize, subject, grade, term }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Upload failed');
  }

  return response.json();
}

export async function listTeacherDocuments(): Promise<TeacherKbDocument[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('list'), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to list documents');
  }

  const data = await response.json();
  return data.documents || [];
}

export async function deleteTeacherDocument(documentId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('delete'), {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ document_id: documentId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete document');
  }
}

export async function searchTeacherChunks(
  subject: string,
  topic?: string,
  grade?: string
): Promise<TeacherKbChunk[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('search'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ subject, topic, grade }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Search failed');
  }

  const data = await response.json();
  return data.chunks || [];
}

export async function getTopicsFromKb(
  subject: string,
  grade?: string
): Promise<string[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(getEdgeFunctionUrl('topics'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ subject, grade }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch topics');
  }

  const data = await response.json();
  return data.topics || [];
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: { str?: string }) => item.str || '')
      .join(' ');
    pages.push(pageText);
  }

  return pages.join('\n\n');
}
