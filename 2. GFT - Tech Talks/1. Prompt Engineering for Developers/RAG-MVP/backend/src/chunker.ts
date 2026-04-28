// Text chunking utilities for splitting documents into smaller pieces
// This is a critical step in RAG — chunks should be small enough to be
// semantically focused, but large enough to carry meaningful context.

export interface ChunkOptions {
  /** Maximum number of characters per chunk */
  chunkSize: number;
  /** Number of overlapping characters between consecutive chunks */
  chunkOverlap: number;
}

const DEFAULT_OPTIONS: ChunkOptions = {
  chunkSize: 500,
  chunkOverlap: 50,
};

/**
 * Split text into overlapping chunks.
 *
 * Strategy: split by paragraphs first, then merge paragraphs into chunks
 * that respect the chunkSize limit. This preserves paragraph boundaries
 * when possible, which leads to better semantic coherence.
 */
export function chunkText(
  text: string,
  options: Partial<ChunkOptions> = {}
): string[] {
  const { chunkSize, chunkOverlap } = { ...DEFAULT_OPTIONS, ...options };

  // Normalize whitespace and split into paragraphs
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return [];

  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If a single paragraph exceeds chunkSize, split it by sentences
    if (paragraph.length > chunkSize) {
      // Flush current chunk first
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        // Keep overlap from end of current chunk
        currentChunk = currentChunk.slice(-chunkOverlap);
      }

      const sentences = splitIntoSentences(paragraph);
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length + 1 > chunkSize) {
          if (currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = currentChunk.slice(-chunkOverlap);
          }
        }
        currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
      }
    } else if (currentChunk.length + paragraph.length + 2 > chunkSize) {
      // Current chunk is full, start a new one
      chunks.push(currentChunk.trim());
      // Keep overlap from end of current chunk
      currentChunk =
        currentChunk.slice(-chunkOverlap) +
        (chunkOverlap > 0 ? '\n\n' : '') +
        paragraph;
    } else {
      // Append paragraph to current chunk
      currentChunk +=
        (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Naive sentence splitter — splits on period, exclamation, or question mark
 * followed by a space or end of string.
 */
function splitIntoSentences(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
  return sentences ? sentences.map((s) => s.trim()).filter((s) => s.length > 0) : [text];
}
