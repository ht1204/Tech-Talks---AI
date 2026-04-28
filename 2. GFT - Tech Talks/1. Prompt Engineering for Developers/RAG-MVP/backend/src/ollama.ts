// Ollama API client for embeddings and text generation

import type { OllamaEmbeddingResponse } from './types.js';

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';
const GENERATION_MODEL = process.env.GENERATION_MODEL || 'llama3.2';

/**
 * Generate an embedding vector for a given text using Ollama.
 * Uses nomic-embed-text by default (768-dimensional vectors).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      prompt: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ollama embedding failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as OllamaEmbeddingResponse;
  return data.embedding;
}

/**
 * Generate a text response using Ollama's LLM.
 * Streams the response internally but returns the full text.
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GENERATION_MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ollama generation failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}

/**
 * Check if Ollama is running and the required models are available.
 */
export async function checkOllamaHealth(): Promise<{
  healthy: boolean;
  models: string[];
  error?: string;
}> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      return { healthy: false, models: [], error: 'Ollama not responding' };
    }
    const data = (await response.json()) as {
      models: { name: string }[];
    };
    const models = data.models.map((m) => m.name);
    return { healthy: true, models };
  } catch {
    return {
      healthy: false,
      models: [],
      error: 'Cannot connect to Ollama. Is it running?',
    };
  }
}
