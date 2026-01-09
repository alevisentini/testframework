import { RagEngine } from "./rag/rag.engine";
import { RagFallbackResponse } from "./rag/rag.types";
import { RagPostProcessor } from "./rag/rag.post-processor";
import { RagChunk } from "./rag/chunker";

const LLM_AVAILABLE = false;

function isRagFallback(result: any): result is RagFallbackResponse {
  return result?.insufficientContext === true;
}

export class QaAssistantService {
  constructor(private readonly rag: RagEngine) { }

  private toRagChunks(ragResult: any): RagChunk[] {
    const documents = ragResult.documents?.[0] ?? [];
    const metadatas = ragResult.metadatas?.[0] ?? [];

    return documents
      .map((content: string, i: number) => {
        const meta = metadatas[i] ?? {};

        return {
          id: meta.id ?? `unknown::chunk-${i}`,
          index: meta.chunkIndex ?? i,
          content,
          contentType: meta.contentType ?? "conceptual",
        };
      });
  }

  private toChunks(result: any): RagChunk[] {
    const documents = result.documents?.[0] ?? [];

    return documents.map((content: string, i: number) => ({
      id: `retrieved::${i}`,
      index: i,
      content,
      contentType: "conceptual",
    }));
  }

  async answer(question: string): Promise<string> {
    const ragResult = await this.rag.query(question);

    if (isRagFallback(ragResult)) {
      return ragResult.answer;
    }

    const chunks = this.toRagChunks(ragResult);

    return (
      "LLM disabled. Showing retrieved knowledge only:\n\n" +
      RagPostProcessor.process(chunks)
    );
  }
}