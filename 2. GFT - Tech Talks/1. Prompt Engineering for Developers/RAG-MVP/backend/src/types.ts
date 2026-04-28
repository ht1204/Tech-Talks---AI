// Types for the RAG system

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  chunkIndex: number;
  embedding: number[];
}

export interface Document {
  id: string;
  name: string;
  content: string;
  chunksCount: number;
  uploadedAt: string;
}

export interface QueryResult {
  answer: string;
  sources: {
    documentName: string;
    chunkContent: string;
    similarity: number;
  }[];
}

export interface OllamaEmbeddingResponse {
  embedding: number[];
}

export interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}
