// ai/rag/chunker.ts

export interface Chunk {
  id: string;
  content: string;
  index: number;
}

/**
 * Aproximación simple de tokens:
 * 1 token ≈ 4 caracteres (suficiente para embeddings)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Divide un documento en chunks semánticos
 */
export function chunkDocument(
  docId: string,
  text: string,
  options?: {
    maxTokens?: number;
    overlapTokens?: number;
  }
): Chunk[] {
  const maxTokens = options?.maxTokens ?? 400;
  const overlapTokens = options?.overlapTokens ?? 60;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];
  let currentChunk = "";
  let currentTokens = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const pTokens = estimateTokens(paragraph);

    if (currentTokens + pTokens > maxTokens) {
      chunks.push({
        id: `${docId}::chunk-${chunkIndex}`,
        content: currentChunk.trim(),
        index: chunkIndex
      });

      chunkIndex++;

      // overlap
      const overlapChars = overlapTokens * 4;
      currentChunk = currentChunk.slice(-overlapChars);
      currentTokens = estimateTokens(currentChunk);
    }

    //currentChunk += "\n\n" + paragraph;
    currentChunk = currentChunk ? currentChunk + "\n\n" + paragraph : paragraph;
    currentTokens += pTokens;
  }

  if (currentChunk.trim()) {
    chunks.push({
      id: `${docId}::chunk-${chunkIndex}`,
      content: currentChunk.trim(),
      index: chunkIndex
    });
  }

  return chunks;
}
