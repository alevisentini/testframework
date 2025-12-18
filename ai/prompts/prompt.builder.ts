export interface PromptBuildInput {
  question: string;
  documents: string[];
}

export class PromptBuilder {
  static build(input: PromptBuildInput): string {
    const { question, documents } = input;

    const context = documents
      .map((doc, i) => `Source ${i + 1}:\n${doc}`)
      .join("\n\n");

    return `
You are a senior QA engineer specialized in Playwright and test architecture.

Answer the user's question using ONLY the information from the provided sources.
If the sources do not contain enough information, explicitly say so.

Do NOT invent details.
Do NOT use external knowledge.

--------------------
SOURCES:
${context}
--------------------

QUESTION:
${question}

ANSWER:
`.trim();
  }
}
