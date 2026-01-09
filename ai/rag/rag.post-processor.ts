import { RagChunk, RagContentType } from "./chunker";

/**
 * Priority order for human-readable answers.
 * Lower number = appears earlier in the answer.
 */
const CONTENT_TYPE_PRIORITY: Record<RagContentType, number> = {
  conceptual: 1,
  diagnostic: 2,
  "anti-pattern": 3,
  procedural: 4,
  checklist: 5,
};

/**
 * Produces a human-readable answer from retrieved RAG chunks,
 * without using an LLM.
 */
export class RagPostProcessor {
  static process(chunks: RagChunk[]): string {
    if (!chunks || chunks.length === 0) {
      return "No relevant knowledge found.";
    }

    // 1) Sort chunks by semantic priority and original order
    const ordered = this.sortChunks(chunks);

    // 2) Merge chunks of the same semantic type
    const grouped = this.groupByContentType(ordered);

    // 3) Render into a readable answer
    return this.render(grouped);
  }

  /* ------------------------------------------------------------------ */
  /* Sorting                                                            */
  /* ------------------------------------------------------------------ */

  private static sortChunks(chunks: RagChunk[]): RagChunk[] {
    return [...chunks].sort((a, b) => {
      const typeDiff =
        CONTENT_TYPE_PRIORITY[a.contentType] -
        CONTENT_TYPE_PRIORITY[b.contentType];

      if (typeDiff !== 0) {
        return typeDiff;
      }

      return a.index - b.index;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Grouping                                                           */
  /* ------------------------------------------------------------------ */

  private static groupByContentType(
    chunks: RagChunk[]
  ): Record<RagContentType, RagChunk[]> {
    return chunks.reduce((acc, chunk) => {
      if (!acc[chunk.contentType]) {
        acc[chunk.contentType] = [];
      }
      acc[chunk.contentType].push(chunk);
      return acc;
    }, {} as Record<RagContentType, RagChunk[]>);
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */

  private static render(
    grouped: Record<RagContentType, RagChunk[]>
  ): string {
    const sections: string[] = [];

    // Conceptual context (foundation)
    if (grouped.conceptual) {
      sections.push(
        this.renderSection(
          "Context",
          grouped.conceptual
        )
      );
    }

    // Diagnostic reasoning (why things fail)
    if (grouped.diagnostic) {
      sections.push(
        this.renderSection(
          "Diagnosis",
          grouped.diagnostic
        )
      );
    }

    // Anti-patterns (what NOT to do)
    if (grouped["anti-pattern"]) {
      sections.push(
        this.renderSection(
          "Common mistakes",
          grouped["anti-pattern"]
        )
      );
    }

    // Procedures (how to act)
    if (grouped.procedural) {
      sections.push(
        this.renderSection(
          "Recommended approach",
          grouped.procedural
        )
      );
    }

    // Checklists (actionable bullets)
    if (grouped.checklist) {
      sections.push(
        this.renderSection(
          "Checklist",
          grouped.checklist
        )
      );
    }

    return sections.join("\n\n---\n\n");
  }

  private static renderSection(
    title: string,
    chunks: RagChunk[]
  ): string {
    const body = chunks
      .map(chunk => chunk.content.trim())
      .join("\n\n");

    return `${title}\n\n${body}`;
  }
}