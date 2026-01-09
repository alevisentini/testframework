/**
 * Supported semantic content types.
 */
export type RagContentType =
  | "conceptual"
  | "diagnostic"
  | "procedural"
  | "checklist"
  | "anti-pattern";

/**
 * Chunk unit used across the system.
 */
export interface RagChunk {
  id: string;
  index: number;
  content: string;
  contentType: RagContentType;
}

export class Chunker {
  chunkDocument(file: string, raw: string): RagChunk[] {
    const sections = this.parseSections(raw);
    const chunks: RagChunk[] = [];
    let index = 0;

    for (const section of sections) {
      const type = this.detectContentType(section.heading, section.body);

      chunks.push({
        id: `${file}::chunk-${index}`,
        index,
        content: `${section.heading}\n\n${section.body}`.trim(),
        contentType: type,
      });

      index++;
    }

    return chunks;
  }

  private parseSections(markdown: string) {
    const lines = markdown.split("\n");
    const sections: { heading: string; body: string[] }[] = [];
    let current: { heading: string; body: string[] } | null = null;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (current) sections.push(current);
        current = { heading: line.replace(/^## /, ""), body: [] };
        continue;
      }
      if (current) current.body.push(line);
    }

    if (current) sections.push(current);

    return sections.map(s => ({
      heading: s.heading,
      body: s.body.join("\n").trim(),
    }));
  }

  private detectContentType(
    heading: string,
    body: string
  ): RagContentType {
    const h = heading.toLowerCase();

    if (h.includes("mistake")) return "anti-pattern";
    if (h.includes("diagnos") || h.includes("why")) return "diagnostic";
    if (h.includes("how") || h.includes("recommend")) return "procedural";
    if (body.split("\n").filter(l => l.trim().startsWith("-")).length >= 3) {
      return "checklist";
    }

    return "conceptual";
  }
}

export function chunkDocument(file: string, content: string): RagChunk[] {
  return new Chunker().chunkDocument(file, content);
}