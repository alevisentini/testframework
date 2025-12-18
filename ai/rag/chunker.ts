// ai/rag/chunker.ts

export interface Chunk {
  id: string;
  content: string;
  index: number;
  metadata: {
    file: string;
    section: string;
    chunkIndex: number;
    type: "conceptual";
  };
}

/**
 * Aproximación simple:
 * 1 token ≈ 4 caracteres
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

interface ChunkOptions {
  maxTokens?: number;
}

/**
 * Chunker conceptual basado en secciones Markdown
 */
export function chunkDocumentConceptual(
  fileName: string,
  rawText: string,
  options?: ChunkOptions
): Chunk[] {
  const maxTokens = options?.maxTokens ?? 350;

  const lines = rawText.split("\n");
  const chunks: Chunk[] = [];

  let currentSection = "Introduction";
  let buffer: string[] = [];
  let chunkIndex = 0;

  function flushBuffer() {
    if (buffer.length === 0) return;

    const content = buffer.join("\n").trim();
    if (!content) return;

    chunks.push({
      id: `${fileName}::${currentSection}::${chunkIndex}`,
      index: chunkIndex,
      content: `# ${fileName}\n## ${currentSection}\n\n${content}`,
      metadata: {
        file: fileName,
        section: currentSection,
        chunkIndex,
        type: "conceptual",
      },
    });

    chunkIndex++;
    buffer = [];
  }

  for (const line of lines) {
    const sectionMatch = line.match(/^##+\s+(.*)/);

    if (sectionMatch) {
      flushBuffer();
      currentSection = sectionMatch[1].trim();
      continue;
    }

    buffer.push(line);

    const tokenCount = estimateTokens(buffer.join("\n"));
    if (tokenCount >= maxTokens) {
      flushBuffer();
    }
  }

  flushBuffer();

  return chunks;
}
