const fs = require('fs');
const path = require('path');
const { encode } = require('gpt-3-encoder');

// Simple cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

// Dummy embedding function (replace with real model or API)
function embed(text: string): number[] {
  // For demo: use token count as a simple embedding
  const tokens = encode(text);
  return [tokens.length];
}

// Split document into chunks
function chunkText(text: string, maxTokens = 200): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (encode(current + sentence).length > maxTokens) {
      if (current) chunks.push(current);
      current = sentence;
    } else {
      current += (current ? ' ' : '') + sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Index all markdown files in docsDir
function indexDocuments(docsDir) {
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
  let index: { chunk: string, embedding: number[], file: string }[] = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(docsDir, file), 'utf-8');
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      index.push({ chunk, embedding: embed(chunk), file });
    }
  }
  fs.writeFileSync(path.join(docsDir, 'rag_index.json'), JSON.stringify(index, null, 2));
}

function retrieveRelevant(query, docsDir, topN = 3) {
  const index = JSON.parse(fs.readFileSync(path.join(docsDir, 'rag_index.json'), 'utf-8'));
  const queryEmbedding = embed(query);
  return index
    .map((item) => ({ ...item, score: cosineSimilarity(item.embedding, queryEmbedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

module.exports = { indexDocuments, retrieveRelevant };
