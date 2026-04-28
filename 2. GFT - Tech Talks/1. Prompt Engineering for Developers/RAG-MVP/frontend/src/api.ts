// API service layer for the RAG frontend

export interface DocumentInfo {
  id: string;
  name: string;
  chunksCount: number;
  uploadedAt: string;
}

export interface StatsResponse {
  documentsCount: number;
  chunksCount: number;
  documents: DocumentInfo[];
}

export interface QueryResponse {
  answer: string;
  sources: {
    documentName: string;
    chunkContent: string;
    similarity: number;
  }[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  ollama: {
    healthy: boolean;
    models: string[];
    error?: string;
  };
  store: {
    documents: number;
    chunks: number;
  };
}

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error((error as { error: string }).error || `HTTP ${response.status}`);
  }
  // Handle 204 No Content
  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

export const api = {
  /** Check system health and Ollama status */
  health: () => fetchJSON<HealthResponse>(`${BASE_URL}/health`),

  /** List all documents */
  getDocuments: () => fetchJSON<StatsResponse>(`${BASE_URL}/documents`),

  /** Upload a file */
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchJSON<{ message: string; document: DocumentInfo }>(
      `${BASE_URL}/documents`,
      { method: 'POST', body: formData }
    );
  },

  /** Upload raw text */
  uploadText: (name: string, text: string) =>
    fetchJSON<{ message: string; document: DocumentInfo }>(
      `${BASE_URL}/documents`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      }
    ),

  /** Delete a document */
  deleteDocument: (id: string) =>
    fetchJSON<void>(`${BASE_URL}/documents/${id}`, { method: 'DELETE' }),

  /** Ask a question */
  query: (question: string) =>
    fetchJSON<QueryResponse>(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    }),
};
