import fs from "fs";
import path from "path";

/**
 * Internal semantic chunk.
 */
interface RagChunk {
  content: string;
  metadata: {
    file: string;
    docTitle: string;
    section: string;
    chunkIndex: number;
    type: "conceptual";
  };
}

/**
 * Chunk shape expected by seed-docs.ts
 */
export interface SeedableChunk {
  id: string;
  content: string;
  index: number;
  metadata: {
    file: string;
    docTitle: string;
    section: string;
    type: "conceptual";
  };
}

/**
 * Configuration for chunking behavior.
 */
export interface ChunkerOptions {
  maxTokensPerChunk?: number;
  overlapRatio?: number;
}

const DEFAULT_OPTIONS: Required<ChunkerOptions> = {
  maxTokensPerChunk: 400,
  overlapRatio: 0.12,
};

/**
 * Chunker v2 – semantic, heading-aware, token-guarded
 */
class Chunker {
  private options: Required<ChunkerOptions>;

  constructor(options?: ChunkerOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  chunkMarkdown(raw: string, fileName: string): RagChunk[] {
    const { title, sections } = this.parseMarkdown(raw);

    const chunks: RagChunk[] = [];

    sections.forEach((section, sectionIndex) => {
      chunks.push(
        ...this.chunkSection(
          title,
          section.heading,
          section.content,
          fileName,
          sectionIndex
        )
      );
    });

    return chunks;
  }

  private parseMarkdown(markdown: string) {
    const lines = markdown.split("\n");

    let title = "Untitled Document";
    const sections: { heading: string; content: string[] }[] = [];

    let current: { heading: string; content: string[] } | null = null;

    for (const line of lines) {
      if (line.startsWith("# ")) {
        title = line.replace(/^# /, "").trim();
        continue;
      }

      if (line.startsWith("## ")) {
        if (current) sections.push(current);
        current = {
          heading: line.replace(/^## /, "").trim(),
          content: [],
        };
        continue;
      }

      if (current) current.content.push(line);
    }

    if (current) sections.push(current);

    return {
      title,
      sections: sections.map(s => ({
        heading: s.heading,
        content: s.content.join("\n").trim(),
      })),
    };
  }

  private chunkSection(
    docTitle: string,
    sectionHeading: string,
    sectionContent: string,
    fileName: string,
    sectionIndex: number
  ): RagChunk[] {
    const paragraphs = sectionContent
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(Boolean);

    const chunks: RagChunk[] = [];
    let buffer: string[] = [];
    let tokenCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const tokens = this.estimateTokens(paragraph);

      if (
        tokenCount + tokens > this.options.maxTokensPerChunk &&
        buffer.length > 0
      ) {
        chunks.push(
          this.buildChunk(
            docTitle,
            sectionHeading,
            buffer.join("\n\n"),
            fileName,
            chunkIndex++
          )
        );

        const overlap = Math.floor(
          buffer.length * this.options.overlapRatio
        );
        buffer = overlap > 0 ? buffer.slice(-overlap) : [];
        tokenCount = this.estimateTokens(buffer.join(" "));
      }

      buffer.push(paragraph);
      tokenCount += tokens;
    }

    if (buffer.length > 0) {
      chunks.push(
        this.buildChunk(
          docTitle,
          sectionHeading,
          buffer.join("\n\n"),
          fileName,
          chunkIndex
        )
      );
    }

    return chunks;
  }

  private buildChunk(
    docTitle: string,
    sectionHeading: string,
    body: string,
    fileName: string,
    chunkIndex: number
  ): RagChunk {
    return {
      content: `${docTitle}\n${sectionHeading}\n\n${body}`.trim(),
      metadata: {
        file: fileName,
        docTitle,
        section: sectionHeading,
        chunkIndex,
        type: "conceptual",
      },
    };
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 0.75);
  }
}

/**
 * Legacy-compatible adapter used by seed-docs.ts
 */
export function chunkDocument(
  fileName: string,
  text: string
): SeedableChunk[] {
  const chunker = new Chunker();
  const chunks = chunker.chunkMarkdown(text, fileName);

  return chunks.map(chunk => ({
    id: `${fileName}::chunk-${chunk.metadata.chunkIndex}`,
    index: chunk.metadata.chunkIndex,
    content: chunk.content,
    metadata: {
      file: fileName,
      docTitle: chunk.metadata.docTitle,
      section: chunk.metadata.section,
      type: "conceptual",
    },
  }));
}
