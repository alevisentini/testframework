import { RagEngine, RagFallbackResponse } from "./rag/rag.engine";
import { PromptBuilder } from "./prompts/prompt.builder";
import { ClaudeClient } from "./llm/claude.client";

/**
 * Controls whether the LLM is used.
 * - If false, the system behaves as RAG-only.
 * - If true, RAG is used as context provider for the LLM.
 */
const LLM_AVAILABLE =
  Boolean(process.env.CLAUDE_API_KEY) &&
  process.env.LLM_ENABLED !== "false";

/**
 * Type guard for RagFallbackResponse
 */
function isRagFallback(
  result: unknown
): result is RagFallbackResponse {
  return (
    typeof result === "object" &&
    result !== null &&
    "insufficientContext" in result &&
    (result as RagFallbackResponse).insufficientContext === true
  );
}

export class QaAssistantService {
  constructor(
    private readonly rag: RagEngine,
    private readonly llm?: ClaudeClient
  ) {}

  /**
   * Answers a question using:
   * 1) RAG retrieval with threshold
   * 2) Optional LLM reasoning on top of retrieved context
   */
  async answer(question: string): Promise<string> {
    const ragResult = await this.rag.query(question);

    /**
     * Case 1 — RAG fallback
     * No relevant context found or similarity below threshold.
     */
    if (isRagFallback(ragResult)) {
      return ragResult.answer;
    }

    /**
     * Extract retrieved documents (safe normalization).
     */
    const documents =
      ragResult.documents?.[0]?.filter(
        (d): d is string => typeof d === "string"
      ) ?? [];

    /**
     * Case 2 — LLM disabled or unavailable
     * Return retrieved knowledge only (transparent behavior).
     */
    if (!LLM_AVAILABLE || !this.llm) {
      return (
        "LLM disabled. Showing retrieved knowledge only:\n\n" +
        documents.join("\n\n---\n\n")
      );
    }

    /**
     * Case 3 — RAG + LLM
     * Build a defensive prompt and ask the LLM.
     */
    const prompt = PromptBuilder.build({
      question,
      documents,
    });

    return await this.llm.ask(prompt);
  }
}
