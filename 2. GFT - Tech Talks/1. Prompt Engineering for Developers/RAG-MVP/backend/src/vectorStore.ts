// In-memory vector store with cosine similarity search
// For an MVP this is perfect — no external dependencies needed.
// In production you'd swap this for ChromaDB, Pinecone, pgvector, etc.

import type { DocumentChunk, Document } from './types.js';

/** All document metadata */
const documents: Map<string, Document> = new Map();

/** All chunks with their embeddings */
const chunks: DocumentChunk[] = [];

/**
 * Store a document and its embedded chunks.
 */
export function addDocument(doc: Document, docChunks: DocumentChunk[]): void {
  documents.set(doc.id, doc);
  chunks.push(...docChunks);
}

/**
 * Get all stored documents (without chunks).
 */
export function getDocuments(): Document[] {
  return Array.from(documents.values());
}

/**
 * Delete a document and all its chunks.
 */
export function deleteDocument(documentId: string): boolean {
  const doc = documents.get(documentId);
  if (!doc) return false;

  documents.delete(documentId);

  // Remove chunks belonging to this document (in-place)
  let i = chunks.length;
  while (i--) {
    if (chunks[i].documentId === documentId) {
      chunks.splice(i, 1);
    }
  }

  return true;
}

/**
 * Search for the top-K most similar chunks to a query embedding.
 * Uses cosine similarity.
 */
export function searchSimilar(
  queryEmbedding: number[],
  topK: number = 3
): { chunk: DocumentChunk; similarity: number }[] {
  if (chunks.length === 0) return [];

  const scored = chunks.map((chunk) => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort descending by similarity
  scored.sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, topK);
}

/**
 * Get total number of chunks stored.
 */
export function getChunkCount(): number {
  return chunks.length;
}

/**
 * Clear all data (useful for testing).
 */
export function clearAll(): void {
  documents.clear();
  chunks.length = 0;
}

// ------ Math utilities ------

/**
 * Cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 *
 * Formula: cos(θ) = (A · B) / (||A|| * ||B||)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimension mismatch: ${a.length} vs ${b.length}`
    );
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}
