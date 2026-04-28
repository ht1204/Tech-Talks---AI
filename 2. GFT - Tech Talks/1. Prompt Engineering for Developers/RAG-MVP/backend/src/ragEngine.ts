// RAG Engine — orchestrates the full Retrieval-Augmented Generation pipeline
//
// Pipeline steps:
// 1. INGEST: Document → Chunks → Embeddings → Vector Store
// 2. QUERY:  Question → Embed → Retrieve top-K → Build prompt → Generate answer

import { getEmbedding, generateText } from './ollama.js';
import { chunkText } from './chunker.js';
import { addDocument, searchSimilar, getDocuments, deleteDocument, getChunkCount } from './vectorStore.js';
import type { Document, DocumentChunk, QueryResult } from './types.js';

/**
 * STEP 1: Ingest a document into the RAG system.
 *
 * This is the "indexing" phase:
 * - Split text into overlapping chunks
 * - Generate embeddings for each chunk via Ollama
 * - Store chunks + embeddings in the vector store
 */
export async function ingestDocument(
  name: string,
  content: string
): Promise<Document> {
  console.log(`[RAG] Ingesting document: "${name}" (${content.length} chars)`);

  // 1. Chunk the text
  const textChunks = chunkText(content, {
    chunkSize: 500,
    chunkOverlap: 50,
  });

  console.log(`[RAG] Split into ${textChunks.length} chunks`);

  // 2. Generate embeddings for each chunk
  const documentId = generateId();
  const docChunks: DocumentChunk[] = [];

  for (let i = 0; i < textChunks.length; i++) {
    console.log(`[RAG] Embedding chunk ${i + 1}/${textChunks.length}...`);
    const embedding = await getEmbedding(textChunks[i]);

    docChunks.push({
      id: `${documentId}-chunk-${i}`,
      documentId,
      documentName: name,
      content: textChunks[i],
      chunkIndex: i,
      embedding,
    });
  }

  // 3. Store in vector store
  const doc: Document = {
    id: documentId,
    name,
    content,
    chunksCount: textChunks.length,
    uploadedAt: new Date().toISOString(),
  };

  addDocument(doc, docChunks);

  console.log(
    `[RAG] Document "${name}" ingested successfully (${textChunks.length} chunks, ${getChunkCount()} total in store)`
  );

  return doc;
}

/**
 * STEP 2: Query the RAG system.
 *
 * This is the "retrieval + generation" phase:
 * - Embed the user's question
 * - Find the top-K most similar chunks from the vector store
 * - Build a prompt with the retrieved context
 * - Send to the LLM for answer generation
 */
export async function queryRAG(
  question: string,
  topK: number = 3
): Promise<QueryResult> {
  console.log(`[RAG] Query: "${question}"`);

  // 1. Embed the question
  const queryEmbedding = await getEmbedding(question);

  // 2. Retrieve similar chunks
  const results = searchSimilar(queryEmbedding, topK);

  if (results.length === 0) {
    return {
      answer:
        'No documents have been uploaded yet. Please upload some documents first, then ask your question.',
      sources: [],
    };
  }

  console.log(
    `[RAG] Found ${results.length} relevant chunks (top similarity: ${results[0].similarity.toFixed(3)})`
  );

  // 3. Build the augmented prompt
  const context = results
    .map(
      (r, i) =>
        `[Source ${i + 1}: "${r.chunk.documentName}"]\n${r.chunk.content}`
    )
    .join('\n\n---\n\n');

  const prompt = `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain enough information to answer, say so clearly. Do not make up information.

CONTEXT:
${context}

QUESTION: ${question}

ANSWER:`;

  // 4. Generate the answer
  console.log(`[RAG] Generating answer...`);
  const answer = await generateText(prompt);

  return {
    answer,
    sources: results.map((r) => ({
      documentName: r.chunk.documentName,
      chunkContent: r.chunk.content,
      similarity: Math.round(r.similarity * 1000) / 1000,
    })),
  };
}

/**
 * Get system stats.
 */
export function getStats() {
  const docs = getDocuments();
  return {
    documentsCount: docs.length,
    chunksCount: getChunkCount(),
    documents: docs.map((d) => ({
      id: d.id,
      name: d.name,
      chunksCount: d.chunksCount,
      uploadedAt: d.uploadedAt,
    })),
  };
}

export { deleteDocument };

function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
