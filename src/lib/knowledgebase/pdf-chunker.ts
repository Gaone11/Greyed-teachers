/**
 * PDF Knowledgebase Chunker
 *
 * Fast client-side PDF text extraction and intelligent chunking with
 * CAPS-aligned metadata so only the relevant chunk is injected into the
 * system prompt — saving tokens and speeding up responses.
 */

import { capsCurriculum, type CAPSSubject } from '../../data/capsCurriculum';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChunkMetadata {
  /** Subject key matching CAPSSubject.key (e.g. "setswana-hl") */
  subjectKey: string;
  /** Human-readable subject name */
  subjectName: string;
  /** Topic key matching CAPSTopic.key (e.g. "listening-speaking") */
  topicKey: string;
  /** Human-readable topic name */
  topicName: string;
  /** Grade label (e.g. "Grade 4") */
  grade: string;
  /** Document source filename */
  sourceFile: string;
  /** Page range within the original PDF */
  pageRange: string;
  /** Chunk sequential index within the document */
  chunkIndex: number;
  /** Total chunks in this document */
  totalChunks: number;
  /** Estimated token count (chars / 4) */
  estimatedTokens: number;
}

export interface KnowledgeChunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
  createdAt: string;
}

export interface ChunkedDocument {
  documentId: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  chunks: KnowledgeChunk[];
  processedAt: string;
}

// ─── Configuration ───────────────────────────────────────────────────────────

/** Target chunk size in characters (~500 tokens at 4 chars/token) */
const TARGET_CHUNK_SIZE = 2000;
/** Overlap between consecutive chunks to preserve context */
const CHUNK_OVERLAP = 200;
/** Minimum chunk size — discard fragments smaller than this */
const MIN_CHUNK_SIZE = 100;

// ─── PDF Text Extraction ─────────────────────────────────────────────────────

interface PageText {
  pageNumber: number;
  text: string;
}

/**
 * Extract text from a PDF file, returning per-page text.
 * Uses PDF.js for fast client-side extraction.
 */
export async function extractPdfPages(file: File): Promise<PageText[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');

  // @ts-ignore — Vite resolves the ?url suffix at build time
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default;

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: PageText[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    pages.push({ pageNumber: i, text });
  }

  return pages;
}

/**
 * Extract text from a generic file (pdf, docx, txt).
 */
export async function extractFilePages(file: File): Promise<PageText[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return extractPdfPages(file);
  }

  if (ext === 'txt') {
    const text = await file.text();
    return [{ pageNumber: 1, text }];
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return [{ pageNumber: 1, text: result.value }];
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

// ─── Chunking Logic ──────────────────────────────────────────────────────────

/**
 * Split pages into overlapping chunks of ~TARGET_CHUNK_SIZE characters.
 * Each chunk records which pages it spans.
 */
function splitIntoRawChunks(
  pages: PageText[]
): Array<{ text: string; startPage: number; endPage: number }> {
  // Combine all page text with page markers
  const fullText = pages.map(p => p.text).join('\n\n');
  const chunks: Array<{ text: string; startPage: number; endPage: number }> = [];

  if (fullText.length <= TARGET_CHUNK_SIZE) {
    chunks.push({
      text: fullText.trim(),
      startPage: pages[0]?.pageNumber ?? 1,
      endPage: pages[pages.length - 1]?.pageNumber ?? 1,
    });
    return chunks;
  }

  // Build a char-offset → page-number map
  const pageOffsets: Array<{ start: number; page: number }> = [];
  let offset = 0;
  for (const p of pages) {
    pageOffsets.push({ start: offset, page: p.pageNumber });
    offset += p.text.length + 2; // +2 for '\n\n'
  }

  function pageAtOffset(off: number): number {
    for (let i = pageOffsets.length - 1; i >= 0; i--) {
      if (off >= pageOffsets[i].start) return pageOffsets[i].page;
    }
    return 1;
  }

  // Sliding window with paragraph-boundary preference
  let pos = 0;
  while (pos < fullText.length) {
    let end = Math.min(pos + TARGET_CHUNK_SIZE, fullText.length);

    // Try to break at a paragraph boundary (double newline)
    if (end < fullText.length) {
      const paragraphBreak = fullText.lastIndexOf('\n\n', end);
      if (paragraphBreak > pos + MIN_CHUNK_SIZE) {
        end = paragraphBreak;
      } else {
        // Fallback: break at sentence boundary
        const sentenceBreak = fullText.lastIndexOf('. ', end);
        if (sentenceBreak > pos + MIN_CHUNK_SIZE) {
          end = sentenceBreak + 1;
        }
      }
    }

    const chunkText = fullText.slice(pos, end).trim();
    if (chunkText.length >= MIN_CHUNK_SIZE) {
      chunks.push({
        text: chunkText,
        startPage: pageAtOffset(pos),
        endPage: pageAtOffset(end - 1),
      });
    }

    pos = end - CHUNK_OVERLAP;
    if (pos < 0) pos = 0;
    // Avoid infinite loop
    if (pos >= fullText.length) break;
    if (end >= fullText.length) break;
  }

  return chunks;
}

// ─── Metadata Assignment ─────────────────────────────────────────────────────

/**
 * Assign CAPS-aligned metadata to each chunk.
 *
 * The caller provides the subject, topic, and grade chosen from the
 * settings UI dropdowns — these are stamped onto every chunk from that
 * document so retrieval can filter by exact match.
 */
export function chunkDocument(
  pages: PageText[],
  options: {
    fileName: string;
    fileSize: number;
    subjectKey: string;
    topicKey: string;
    grade: string;
  }
): ChunkedDocument {
  const subject = capsCurriculum.find(s => s.key === options.subjectKey);
  const topic = subject?.topics.find(t => t.key === options.topicKey);

  const rawChunks = splitIntoRawChunks(pages);
  const documentId = crypto.randomUUID();
  const now = new Date().toISOString();

  const chunks: KnowledgeChunk[] = rawChunks.map((raw, index) => ({
    id: crypto.randomUUID(),
    content: raw.text,
    metadata: {
      subjectKey: options.subjectKey,
      subjectName: subject?.name ?? options.subjectKey,
      topicKey: options.topicKey,
      topicName: topic?.name ?? options.topicKey,
      grade: options.grade,
      sourceFile: options.fileName,
      pageRange: raw.startPage === raw.endPage
        ? `p.${raw.startPage}`
        : `p.${raw.startPage}-${raw.endPage}`,
      chunkIndex: index,
      totalChunks: rawChunks.length,
      estimatedTokens: Math.ceil(raw.text.length / 4),
    },
    createdAt: now,
  }));

  return {
    documentId,
    fileName: options.fileName,
    fileSize: options.fileSize,
    totalPages: pages.length,
    chunks,
    processedAt: now,
  };
}

// ─── Chunk Retrieval ─────────────────────────────────────────────────────────

/**
 * Retrieve chunks matching the given subject + topic + grade.
 * Returns only the relevant chunks instead of the entire syllabus.
 */
export function findMatchingChunks(
  allChunks: KnowledgeChunk[],
  subjectKey: string,
  topicKey: string,
  grade: string
): KnowledgeChunk[] {
  return allChunks.filter(
    c =>
      c.metadata.subjectKey === subjectKey &&
      c.metadata.topicKey === topicKey &&
      c.metadata.grade === grade
  );
}

/**
 * Build a context string from matching chunks for injection into the
 * system prompt. Keeps total tokens under the budget.
 */
export function buildChunkContext(
  chunks: KnowledgeChunk[],
  maxTokens = 1500
): string {
  if (chunks.length === 0) return '';

  const header = `[CAPS Knowledgebase — ${chunks[0].metadata.subjectName} / ${chunks[0].metadata.topicName} / ${chunks[0].metadata.grade}]\n\n`;
  let context = header;
  let tokens = Math.ceil(header.length / 4);

  for (const chunk of chunks) {
    const chunkTokens = chunk.metadata.estimatedTokens;
    if (tokens + chunkTokens > maxTokens) break;
    context += chunk.content + '\n\n';
    tokens += chunkTokens;
  }

  return context.trim();
}
